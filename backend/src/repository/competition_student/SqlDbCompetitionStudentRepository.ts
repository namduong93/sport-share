import { Pool } from 'pg';
import { CompetitionStudentRepository } from '../CompetitionStudentRepository';
import { StudentInfo } from '../../../shared_types/Competition/student/StudentInfo';
import { ParticipantTeamDetails } from '../../../shared_types/Competition/team/TeamDetails';
import { CompetitionTeamNameObject, CompetitionWithdrawalReturnObject } from '../../models/competition/competition';
import { CompetitionUser } from '../../models/competition/competitionUser';
import { University } from '../../models/university/university';
import { DbError } from '../../errors/DbError.js';
import { CompetitionRepository } from '../CompetitionRepository';
import { TeamStatus } from '../../models/team/team';
import pokemon from 'pokemon';

export class SqlDbCompetitionStudentRepository implements CompetitionStudentRepository {
  private readonly pool: Pool;
  private competitionRepository: CompetitionRepository;
  

  constructor(pool: Pool, competitionRepository: CompetitionRepository) {
    this.pool = pool;
    this.competitionRepository = competitionRepository;
  }

  /**
   * Retrieves the competition relevant fields enabled for a student registration in a competition.
   *
   * @param userId The ID of the user whose toggles are being retrieved.
   * @param code The code of the competition.
   * @returns A promise that resolves to an object containing the toggles for the student
   */
  competitionStudentsRegoToggles = async (userId: number, code: string) => {
    const dbResult = await this.pool.query(
      `SELECT 
        enable_codeforces_field,
        enable_national_prizes_field,
        enable_international_prizes_field,
        enable_regional_participation_field
      FROM competition_registration_toggles AS crt
      JOIN competitions AS c ON c.id = crt.competition_id
      JOIN competition_users AS cu ON cu.competition_id = crt.competition_id
      WHERE cu.user_id = ${userId} AND c.code = $1
      `
    , [code]);

    return dbResult.rows[0];
  };

  /**
   * Retrieves the details of a competition team for a specific student and competition.
   *
   * @param userId The ID of the user whose team details are being retrieved.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the details of the participant's team.
   * @throws {DbError} If the current user is not found in their own team.
   */
  competitionTeamDetails = async (userId: number, compId: number): Promise<ParticipantTeamDetails> => {
    const dbResult = await this.pool.query(
      `SELECT "compName", "teamName", "teamSite", "teamSeat",
        "teamLevel", "startDate", students, coach, src_competition_id
      FROM competition_team_details AS ctd
      WHERE ctd.src_user_id = $1 AND ctd.src_competition_id = $2
      LIMIT 1;
      `
    , [userId, compId]);

    const teamDetails: ParticipantTeamDetails = dbResult.rows[0];
    const students = teamDetails.students;
    const currentStudentIndex = students.findIndex((student) => student.userId === userId);
    if (currentStudentIndex < 0) {
      throw new DbError(DbError.Query, 'Could not find the current user in their own team [VERY WEIRD BEHAVIOUR]');
    }
    const currentStudent = students.splice(currentStudentIndex, 1)[0];
    students.unshift(currentStudent);
    return { ...teamDetails, students };
  };

  /**
   * Generates an encrypted invite code for a team in a competition that the user is a participant of.
   *
   * @param userId The ID of the user.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to the encrypted invite code for the team.
   * @throws {DbError} If the user is not a participant in any team in the specified competition.
   */
  competitionTeamInviteCode = async (userId: number, compId: number): Promise<string> => {
    const teamQuery = `
      SELECT id FROM competition_teams
      WHERE $1 = ANY(participants) AND competition_id = $2
    `;
    const teamResult = await this.pool.query(teamQuery, [userId, compId]);
    if (teamResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User is not a participant in any team in this competition.');
    }
    const encryptedTeamId = this.competitionRepository.encrypt(teamResult.rows[0].id);
    return encryptedTeamId;
  };

  /**
   * Let a user joins a competition team via its code.
   *
   * @param userId The ID of the user joining the team.
   * @param compId The ID of the competition.
   * @param teamCode The encrypted code of the team.
   * @param university The university object containing the university ID.
   * @returns A promise that resolves to an object containing the team name.
   * @throws {DbError} If the team does not exist, the user is already part of the team, the team is full, 
   *                   the user is not under the same coach, or if there is an error joining or leaving a team.
   */
  competitionTeamJoin = async(userId: number, compId: number, teamCode: string, university: University): Promise<CompetitionTeamNameObject> => {

    const teamId = this.competitionRepository.decrypt(teamCode);
    const currentTeamQuery = `
      SELECT id, participants, competition_coach_id FROM competition_teams
      WHERE $1 = ANY(participants) AND competition_id = $2 AND university_id = $3
    `;
    const currentTeamResult = await this.pool.query(currentTeamQuery, [userId, compId, university.id]);

    const teamQuery = `SELECT 
      (CASE WHEN pending_name IS NULL THEN name ELSE pending_name END) AS "teamName",
      participants, competition_coach_id FROM competition_teams
      WHERE id = $1 AND competition_id = $2 AND university_id = $3
    `;
    const teamResult = await this.pool.query(teamQuery, [teamId, compId, university.id]);
    if (teamResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Team does not exist or is not part of this competition.');
    }
    if (teamResult.rows[0].participants.includes(userId)) {
      throw new DbError(DbError.Query, 'User is already part of this team.');
    }
    if (teamResult.rows[0].participants.length >= 3) {
      throw new DbError(DbError.Query, 'Team is already full.');
    }
    if (teamResult.rows[0].competition_coach_id !== currentTeamResult.rows[0].competition_coach_id) {
      throw new DbError(DbError.Query, 'User have to be under the same coach to join the team.');
    }

    // Join the new team
    const newParticipants = [...teamResult.rows[0].participants, userId];
    const updateTeamQuery = `
      UPDATE competition_teams
      SET participants = $1, team_size = ${newParticipants.length}, team_status = 'Pending'::competition_team_status
      WHERE id = $2
    `;

    const updateTeamResult = await this.pool.query(updateTeamQuery, [newParticipants, teamId]);
    if (updateTeamResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Could not join team.');
    }

    // Leave the current team
    if (currentTeamResult.rows[0].participants.length === 1) {
      const deleteNotiQuery = `
        DELETE FROM notifications
        WHERE team_id = $1 AND competition_id = $2
      `;
      const deleteNotiResult = await this.pool.query(deleteNotiQuery, [currentTeamResult.rows[0].id, compId]);

      const leaveTeamQuery = `
      DELETE FROM competition_teams
      WHERE id = $1
      `;
      const leaveTeamResult = await this.pool.query(leaveTeamQuery, [currentTeamResult.rows[0].id]);
      if (leaveTeamResult.rowCount === 0) {
        throw new DbError(DbError.Query, 'Could not leave team.');
      }
    }
    else {
      const leaveTeamQuery = `
      UPDATE competition_teams
      SET participants = $1, team_size = $3, team_status = 'Pending'::competition_team_status
      WHERE id = $2
      `;
      const leaveTeamResult = await this.pool.query(leaveTeamQuery, [
        currentTeamResult.rows[0].participants.filter((id) => id !== userId),
        currentTeamResult.rows[0].id,
        currentTeamResult.rows[0].participants.length - 1]);
      if (leaveTeamResult.rowCount === 0) {
        throw new DbError(DbError.Query, 'Could not leave team.');
      }
    }
    return { teamName: teamResult.rows[0].teamName };
  };

  /**
   * Retrieves detailed information about a student in a specific competition.
   *
   * @param userId The ID of the user whose details are being retrieved.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to an object containing the student's competition details.
   * @throws {DbError} If the user does not exist or is not a participant in the specified competition.
   */
  competitionStudentDetails = async (userId: number, compId: number): Promise<StudentInfo> => {
    const dbResult = await this.pool.query(
      `SELECT 
        competition_id,
        "userId",
        "universityId",
        "universityName",
        "name",
        "preferredName",
        email,
        sex,
        pronouns,
        "tshirtSize",
        "dietaryNeeds",
        "accessibilityNeeds",
        allergies,
        "studentId",
        roles,
        bio,
        "ICPCEligible",
        "boersenEligible",
        level,
        "degreeYear",
        degree,
        "isRemote",
        "isOfficial",
        "preferredContact",
        "nationalPrizes",
        "internationalPrizes",
        "codeforcesRating",
        "universityCourses",
        "pastRegional",
        status,
        "siteId",
        "pendingSiteId",
        "siteName",
        "pendingSiteName",
        "siteCapacity",
        "pendingSiteCapacity"
      FROM competition_attendees
      WHERE "userId" = $1 AND competition_id = $2`,
      [userId, compId]
    );

    if (dbResult.rows.length === 0) {
      throw new DbError(DbError.Query, 'User does not exist or is not a participant in this competition.');
    }

    const result = dbResult.rows[0];

    const studentDetails: StudentInfo = {
      userId: result.userId,
      universityId: result.universityId,
      universityName: result.universityName,
      name: result.name,
      preferredName: result.preferredName,
      email: result.email,
      sex: result.sex,
      pronouns: result.pronouns,
      tshirtSize: result.tshirtSize,
      dietaryReqs: result.dietaryNeeds,
      accessibilityReqs: result.accessibilityNeeds,
      allergies: result.allergies,
      studentId: result.studentId,
      roles: result.roles,
      bio: result.bio,
      ICPCEligible: result.ICPCEligible,
      boersenEligible: result.boersenEligible,
      level: result.level,
      degreeYear: result.degreeYear,
      degree: result.degree,
      isRemote: result.isRemote,
      isOfficial: result.isOfficial,
      preferredContact: result.preferredContact,
      nationalPrizes: result.nationalPrizes,
      internationalPrizes: result.internationalPrizes,
      codeforcesRating: result.codeforcesRating,
      universityCourses: result.universityCourses,
      pastRegional: result.pastRegional,
      status: result.status
    };

    return studentDetails;
  };

  /**
   * Updates the details of a student in a specific competition.
   *
   * @param userId The ID of the user performing the update.
   * @param compId The ID of the competition.
   * @param updatedStudent An object containing the updated student details.
   * @returns A promise that resolves when the update is complete.
   * @throws {DbError} If there is an error updating the student details.
   */
  competitionStudentDetailsUpdate = async(userId: number, compId: number, studentInfo: StudentInfo): Promise<{}> => {
    if (!studentInfo) {
      return {};
    }

    const dbResult = await this.pool.query(
      `UPDATE competition_users
      SET
        bio = $1,
        icpc_eligible = $2,
        boersen_eligible = $3,
        competition_level = $4,
        degree_year = $5,
        degree = $6,
        is_remote = $7,
        is_official = $8,
        preferred_contact = $9,
        national_prizes = $10,
        international_prizes = $11,
        codeforces_rating = $12,
        past_regional = $13
      WHERE user_id = $14 AND competition_id = $15;
      `
    , [
      studentInfo.bio,
      studentInfo.ICPCEligible,
      studentInfo.boersenEligible,
      studentInfo.level,
      studentInfo.degreeYear,
      studentInfo.degree,
      studentInfo.isRemote,
      studentInfo.isOfficial,
      studentInfo.preferredContact,
      studentInfo.nationalPrizes,
      studentInfo.internationalPrizes,
      studentInfo.codeforcesRating,
      studentInfo.pastRegional,
      studentInfo.userId,
      compId
    ]);

    if (dbResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Student does not exist or is not a part of this competition.');
    }

    return {};
  };

  /**
   * Registers a student for a competition and creates a new (placeholder) team for them.
   * 
   * @param {CompetitionUser} competitionUserInfo The information of the user joining the competition.
   * @param {University} university The university the user is associated with.
   * @returns {Promise<{}>} A promise that resolves to an empty object upon successful registration.
   * @throws {DbError} If the user's university is not registered for the competition.
   */
  competitionStudentJoin = async (competitionUserInfo: CompetitionUser, university: University): Promise<{}> => {
    // First insert the user into the competition_users table
    let userId = competitionUserInfo.userId;
    let competitionId = competitionUserInfo.competitionId;
    let competitionRoles = competitionUserInfo.competitionRoles;
    let ICPCEligible = competitionUserInfo.ICPCEligible;
    let competitionLevel = competitionUserInfo.competitionLevel;
    let boersenEligible = competitionUserInfo.boersenEligible || false;
    let degreeYear = competitionUserInfo.degreeYear;
    let degree = competitionUserInfo.degree;
    let isRemote = competitionUserInfo.isRemote;
    let nationalPrizes = competitionUserInfo.nationalPrizes || '';
    let internationalPrizes = competitionUserInfo.internationalPrizes || '';
    let codeforcesRating = competitionUserInfo.codeforcesRating || 0;
    let universityCourses = competitionUserInfo.universityCourses || [];
    let pastRegional = competitionUserInfo.pastRegional || false;
    let competitionBio = competitionUserInfo.competitionBio || '';
    let preferredContact = competitionUserInfo.preferredContact || '';

    const coachUserIdResult = await this.pool.query(
      `SELECT "userId" 
       FROM competition_staff($1) 
       WHERE roles::jsonb @> '["Coach"]'::jsonb 
         AND "universityName" = $2`,
      [competitionId, university.name]
    );

    if (coachUserIdResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Your university is not registered for this competition.');
    }
    const competitionCoachIdResult = await this.pool.query(`
      SELECT id FROM competition_users WHERE user_id = $1 AND competition_id = $2
    `, [coachUserIdResult.rows[0].userId, competitionId]);
    const competitionCoachId = competitionCoachIdResult.rows[0].id;

    const competitionJoinQuery = `
      INSERT INTO competition_users (user_id, competition_id, competition_roles, icpc_eligible, competition_level, boersen_eligible, degree_year, degree, is_remote, national_prizes, international_prizes, codeforces_rating, university_courses, past_regional, bio, preferred_contact, competition_coach_id, access_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'Accepted'::competition_access_enum)
      RETURNING id
    `;
    const competitionJoinValues = [
      userId,
      competitionId,
      competitionRoles,
      ICPCEligible,
      competitionLevel,
      boersenEligible,
      degreeYear,
      degree,
      isRemote,
      nationalPrizes,
      internationalPrizes,
      codeforcesRating,
      universityCourses,
      pastRegional,
      competitionBio,
      preferredContact,
      competitionCoachId,
    ];

    // Insert user into competition_users table and get competition_user_id
    const result = await this.pool.query(competitionJoinQuery, competitionJoinValues);
    const competitionUserId = result.rows[0].id;

    // Insert user to competition_teams table
    let numberOfTeamsQuery = `
      SELECT COUNT(*) FROM competition_teams
      WHERE competition_id = $1
    `;
    let numberOfTeamsResult = await this.pool.query(numberOfTeamsQuery, [competitionId]);
    let numberOfTeams = parseInt(numberOfTeamsResult.rows[0].count);
    let teamName = `${pokemon.getName((numberOfTeams + 1) % 1000)}`;
    let teamStatus = TeamStatus.PENDING;
    let teamSize = 1;
    let participants = [userId];
    let siteId = competitionUserInfo.siteLocation.id;

    let teamQuery = `
      INSERT INTO competition_teams (name, team_status, team_size, participants, university_id, competition_id, competition_coach_id, site_attending_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    const teamNameValues = [
      teamName,
      teamStatus,
      teamSize,
      participants,
      university.id,
      competitionId,
      competitionCoachId,
      siteId
    ];

    // Insert the team into competition_teams table
    let checkId = await this.pool.query(teamQuery, teamNameValues);
    return {};
  };

  /**
   * Withdraws a student from a competition. If the student is the only participant in their team,
   * the team and its notifications are deleted. Otherwise, the student is removed from the team
   * and a new team is created for the student.
   *
   * @param userId - The ID of the user withdrawing from the competition.
   * @param compId - The ID of the competition.
   * @returns A promise that resolves to an object containing the competition code, competition name,
   *          team ID, and team name.
   * @throws {DbError} If the competition does not exist, the user is not a participant in any team
   *                   in the competition, or if there is an error leaving the team.
   */
  competitionStudentWithdraw = async (userId: number, compId: number): Promise<CompetitionWithdrawalReturnObject> => {
    // Check if the competition exists
    const competitionExistQuery = `
      SELECT code, name FROM competitions WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);
    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Competition does not exist.');
    }
    const teamCode = await this.competitionTeamInviteCode(userId, compId);
    const competitionName = competitionExistResult.rows[0].name;

    const teamQuery = `
      SELECT * FROM competition_teams
      WHERE $1 = ANY(participants) AND competition_id = $2
    `;
    const teamResult = await this.pool.query(teamQuery, [userId, compId]);
    if (teamResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User is not a participant in any team in this competition.');
    }

    if (teamResult.rows[0].participants.length === 1) {
      //Delete notifications for the team
      const deleteNotificationsQuery = `
        DELETE FROM notifications
        WHERE team_id = $1
      `;
      await this.pool.query(deleteNotificationsQuery, [teamResult.rows[0].id]);
      //Delete the team
      const leaveTeamQuery = `
        DELETE FROM competition_teams
        WHERE id = $1
      `;
      const leaveTeamResult = await this.pool.query(leaveTeamQuery, [teamResult.rows[0].id]);
      if (leaveTeamResult.rowCount === 0) {
        throw new DbError(DbError.Query, 'Could not leave team.');
      }
      //Delete the user from the competition
      const competitionRemoveParticipantQuery = `
        DELETE FROM competition_users
        WHERE user_id = $1
        AND competition_id = $2
      `;
      await this.pool.query(competitionRemoveParticipantQuery, [userId, compId]);
      return { competitionCode: teamCode, competitionName, teamId: teamResult.rows[0].id, teamName: teamResult.rows[0].name };
    }
    else {
      // Leave the team
      const leaveTeamQuery = `
        UPDATE competition_teams
        SET participants = $1, team_size = $3, team_status = 'Pending'::competition_team_status
        WHERE id = $2
        RETURNING id
      `;
      const leaveTeamResult = await this.pool.query(leaveTeamQuery, [
        teamResult.rows[0].participants.filter((id) => id !== userId),
        teamResult.rows[0].id,
        teamResult.rows[0].participants.length - 1
      ]);
      if (leaveTeamResult.rowCount === 0) {
        throw new DbError(DbError.Query, 'Could not leave team.');
      }
      // Join a new team
      const newTeamJoinQuery = `
        INSERT INTO competition_teams (name, team_status, team_size, participants, university_id, competition_id, competition_coach_id, site_attending_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name
      `;
      const newTeamJoinValues = [
        `${pokemon.getName((teamResult.rows[0].id + 1) % 1000)}`,
        TeamStatus.PENDING,
        1,
        [userId],
        teamResult.rows[0].university_id,
        compId,
        teamResult.rows[0].competition_coach_id,
        teamResult.rows[0].site_attending_id
      ];
      const newTeamJoinResult = await this.pool.query(newTeamJoinQuery, newTeamJoinValues);
      return { competitionCode: teamCode, competitionName, teamId: leaveTeamResult.rows[0].id, teamName: newTeamJoinResult.rows[0].name };
    }
  };

  /**
   * Requests a site change for a competition team member.
   *
   * @param userId The ID of the user requesting the site change.
   * @param compId The ID of the competition.
   * @param newSiteId The ID of the new site being requested.
   * @returns A promise that resolves to the ID of the team whose site change was requested.
   * @throws {DbError} If the user is not a member of any team in the competition.
   * @throws {DbError} If the new site ID is the same as the current or pending site ID.
   * @throws {DbError} If no matching team is found for the provided ID in the competition.
   */
  competitionRequestSiteChange = async(userId: number, compId: number, newSiteId: number): Promise<number> => {
    // Check if the user is a valid member of a team in this competition
    const teamMemberCheckQuery = `
      SELECT ct.site_attending_id, ct.pending_site_attending_id
      FROM competition_teams AS ct
      WHERE ct.competition_id = $1 AND $2 = ANY(ct.participants)
    `;
    const teamMemberCheckResult = await this.pool.query(teamMemberCheckQuery, [compId, userId]);

    if (teamMemberCheckResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User is not a member of any team in this competition.');
    }

    const currentSiteId = teamMemberCheckResult.rows[0].site_attending_id;
    const pendingSiteId = teamMemberCheckResult.rows[0].pending_site_attending_id;

    if (currentSiteId === newSiteId || pendingSiteId === newSiteId) {
      throw new DbError(DbError.Query, 'New site ID is similar to the current site ID or an already requested new site ID.');
    }

    // Update the pending site ID in the competition teams table
    const siteIdUpdateQuery = `
      UPDATE competition_teams
      SET pending_site_attending_id = $3
      WHERE competition_id = $1 AND $2 = ANY(participants)
      RETURNING id
    `;
    const result = await this.pool.query(siteIdUpdateQuery, [compId, userId, newSiteId]);

    if (result.rowCount === 0) {
      throw new DbError(DbError.Query, 'No matching team found for the provided ID in this competition.');
    }

    return result.rows[0].id; // Return the team ID
  };
}