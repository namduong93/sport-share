import { Pool } from 'pg';
import { CompetitionStaffRepository } from '../CompetitionStaffRepository.js';
import { EditCourse, EditRego } from '../../../shared_types/Competition/staff/Edit.js';
import { DbError } from '../../errors/DbError.js';
import { StaffInfo } from '../../../shared_types/Competition/staff/StaffInfo.js';
import { StudentInfo } from '../../../shared_types/Competition/student/StudentInfo.js';
import { TeamDetails } from '../../../shared_types/Competition/team/TeamDetails.js';
import { AttendeesDetails } from '../../../shared_types/Competition/staff/AttendeesDetails.js';
import { CompetitionRepository } from '../CompetitionRepository.js';
import { AlgoConversion, CompetitionAlgoStudentDetails, CompetitionAlgoTeamDetails, CompetitionStaff, CompetitionUserRole } from '../../models/competition/competitionUser.js';
import { parse } from 'postgres-array';
import { DEFAULT_TEAM_SIZE, SeatAssignment } from '../../models/team/team.js';
import { Competition, CompetitionIdObject } from '../../models/competition/competition.js';
import { University } from '../../models/university/university.js';
import { Announcement } from '../../../shared_types/Competition/staff/Announcement.js';
import { CourseCategory } from '../../../shared_types/University/Course.js';

export class SqlDbCompetitionStaffRepository implements CompetitionStaffRepository {
  private readonly pool: Pool;
  private competitionRepository: CompetitionRepository;
  

  constructor(pool: Pool, competitionRepository: CompetitionRepository) {
    this.pool = pool;
    this.competitionRepository = competitionRepository;
  }

  /**
   * Updates the courses for a given competition and university.
   * 
   * @param compId The ID of the competition.
   * @param editCourse An object containing the courses to be edited.
   * @param universityId The ID of the university.
   * 
   * @throws {DbError} If there is an error inserting or updating a course in the database.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  competitionStaffUpdateCourses = async (compId: number, editCourse: EditCourse, universityId: number) => {
    for (const [courseCategory, courseName] of Object.entries(editCourse)) {
      try {
        await this.pool.query(
          `INSERT INTO courses (
              competition_id,
              university_id,
              name,
              category
            )
            VALUES ($1, $2,
              $3, $4
            )
            ON CONFLICT (competition_id, university_id, category)
            DO UPDATE
            SET
              name = $3
            `
        , [compId, universityId, courseName, courseCategory]);
      } catch (error: unknown) {
        throw new DbError(DbError.Insert, 'Error inserting / updating course');
      }
    }

    return;
  };

    
  /**
   * Retrieves detailed information about a competition, including its general details
   * and associated site locations.
   *
   * @param compId The ID of the competition to retrieve information for.
   * @returns {Promise<Object>} A promise that resolves to an object containing the competition's details.
   */
  competitionInformation = async (compId: number) => {
    const dbResult = await this.pool.query(
      `SELECT 
        c.information AS "information",
        c.name AS "name",
        c.region AS "region",
        c.start_date AS "startDate",
        c.early_reg_deadline AS "earlyRegDeadline",
        c.general_reg_deadline AS "generalRegDeadline",
        c.code AS "code",
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'universityId', cs.university_id,
            'universityName', uni.name,
            'siteId', cs.id,
            'defaultSite', cs.name
          )
        ) AS "siteLocations"

      FROM competitions AS c
      JOIN competition_sites AS cs ON cs.competition_id = c.id
      JOIN universities AS uni ON uni.id = cs.university_id
      WHERE c.id = $1
      GROUP BY c.information, c.name,
        c.region, c.start_date, c.early_reg_deadline,
        c.general_reg_deadline, c.code
      `
    , [compId]);


    return dbResult.rows[0];
  };

  /**
   * Retrieves the site ID that a given user (site-coordinator) is coordinating.
   *
   * @param userId The ID of the user whose coordinating site ID is to be retrieved.
   * @returns A promise that resolves to the site ID the user is coordinating.
   * @throws {DbError} If the user is not coordinating any site.
   */
  competitionGetCoordinatingSiteId = async (userId: number): Promise<number> => {
    const dbResult = await this.pool.query(
      `SELECT site_id
      FROM competition_users AS cu
      WHERE cu.user_id = $1
      `
    , [userId]);

    if (!dbResult.rowCount) {
      throw new DbError(DbError.Auth, 'Site Coordinator is not coordinating this site');
    }

    return dbResult.rows[0].site_id;
  };

  /**
   * Updates the capacity of a competition site in the database.
   *
   * @param siteId The ID of the competition site to update.
   * @param capacity The new capacity value to set for the competition site.
   * @throws {DbError} Throws an error if the database update operation fails.
   * @returns {Promise<void>} A promise that resolves when the update operation is complete.
   */
  competitionSiteCapacityUpdate = async (siteId: number, capacity: number) => {
    try {
      await this.pool.query(
        `UPDATE competition_sites
        SET
          capacity = $1
        WHERE id = $2
        `
      , [capacity, siteId]);
    } catch (error: unknown) {
      throw new DbError(DbError.Query, 'Error with database Update competition site');
    }
    return;
  };

  /**
   * Update whether certain competitive programming relevant fields are enabled for registration for a competition site.
   *
   * @param userId The ID of the user performing the update.
   * @param compId The ID of the competition.
   * @param regoFields An object containing the fields to update.
   * @param universityId The ID of the university.
   * @returns {Promise<void>} A promise that resolves when the update operation is complete.
   */
  competitionStaffUpdateRegoToggles = async (userId: number, compId: number, regoFields: EditRego, universityId?: number) => {
    const uniId = universityId || (await this.pool.query(
      `SELECT u.university_id AS "universityId"
      FROM users AS u
      WHERE u.id = $1
      `
    , [userId])).rows[0].universityId;

    await this.pool.query(
      `INSERT INTO competition_registration_toggles (
          competition_id,
          university_id,
          enable_codeforces_field,
          enable_national_prizes_field,
          enable_international_prizes_field,
          enable_regional_participation_field
        )
        VALUES ($1, $2,
          $3, $4,
          $5, $6
        )
        ON CONFLICT (competition_id, university_id)
        DO UPDATE
        SET
          enable_codeforces_field = $3,
          enable_national_prizes_field = $4,
          enable_international_prizes_field = $5,
          enable_regional_participation_field = $6
        `
    , [
        compId,
        uniId,
        regoFields.enableCodeforcesField,
        regoFields.enableNationalPrizesField,
        regoFields.enableInternationalPrizesField,
        regoFields.enableRegionalParticipationField
      ]);
    return;
  };

  /**
   * Retrieve what competitive programming relevant fields are enabled for registration for a competition site.
   *
   * @param userId The ID of the user.
   * @param compId The ID of the competition.
   * @param universityId The ID of the university.
   * @returns {Promise<void>} A promise that resolves when the update operation is complete.
   */
  competitionStaffRegoToggles = async (userId: number, compId: number, universityId?: number) => {
    if (!universityId) {
      // If user did not provide a uni id assume they are the coach of the competition and find for their uni
      const dbResult = await this.pool.query(
        `SELECT 
          enable_codeforces_field AS "enableCodeforcesField",
          enable_national_prizes_field AS "enableNationalPrizesField",
          enable_international_prizes_field AS "enableInternationalPrizesField",
          enable_regional_participation_field AS "enableRegionalParticipationField"
        FROM competition_registration_toggles AS crt
        JOIN competition_users AS cu ON cu.competition_id = crt.competition_id
        JOIN users AS u ON u.id = cu.user_id
        WHERE u.id = $1 AND u.university_id = crt.university_id AND crt.competition_id = $2;
        `
      , [userId, compId]);

      return dbResult.rows[0];
    }

    // otherwise
    const dbResult = await this.pool.query(
      `SELECT 
        enable_codeforces_field AS "enableCodeforcesField",
        enable_national_prizes_field AS "enableNationalPrizesField",
        enable_international_prizes_field AS "enableInternationalPrizesField",
        enable_regional_participation_field AS "enableRegionalParticipationField"
      FROM competition_registration_toggles AS crt
      WHERE crt.university_id = $1 AND crt.competition_id = $2;
      `
    , [universityId, compId]);
    return dbResult.rows[0];
  };

  /**
   * Checks if a user is a coach for a specific competition.
   *
   * @param userId The ID of the user to check.
   * @param compId The ID of the competition to check.
   * @throws {DbError} If the user is not a coach for the specified competition.
   * @returns {Promise<void>} A promise that resolves if the user is a coach for the competition.
   */
  competitionCoachCheck = async (userId: number, compId: number) => {
    const dbResult = await this.pool.query(
      `SELECT cu.competition_id AS "competitionId"
      FROM competition_users AS cu
      WHERE cu.user_id = $1 AND cu.competition_id = $2
      `
    , [userId, compId]);

    if (!dbResult.rowCount) {
      throw new DbError(DbError.Auth, 'User is not a coach for this competition');
    }

    return;
  };

  /**
   * Updates the competition user details for a list of staff in a specific competition.
   *
   * @param userId The ID of the user performing the update.
   * @param staffList An array of staff information objects to be updated.
   * @param compId The ID of the competition.
   * @returns A promise that resolves when the update is complete.
   * @throws {DbError} If there is an error updating a user in the database.
   */
  competitionStaffUpdate = async (userId: number, staffList: StaffInfo[], compId: number) => {
    const updatedAccessStaff: Array<number> = [];

    for (const staff of staffList) {
      // Find out if this staff is getting accepted into their registering competition
      const oldInfoResult = await this.pool.query(
        `SELECT access_level
        FROM competition_users
        WHERE user_id = $1 AND competition_id = $2;
      `
      , [staff.userId, compId]);

      if (oldInfoResult.rows.length > 0) {
        const oldAccessLevel = oldInfoResult.rows[0].access_level;
        if (oldAccessLevel === 'Pending' && staff.access === 'Accepted') {
          updatedAccessStaff.push(staff.userId);
        }
      }

      // Update the staff details
      try {
        await this.pool.query(
          `UPDATE competition_users
          SET
            bio = $1,
            competition_roles = $2,
            access_level = $3
            WHERE user_id = $4 AND competition_id = $5;
          `
        , [staff.bio, staff.roles, staff.access, staff.userId, compId]);
      } catch (error: unknown) {
        throw new DbError(DbError.Insert, 'Failed to update a user in the db');
      }
    }

    return updatedAccessStaff;
  };

  /**
   * Updates the competition user details for a list of students in a specific competition.
   *
   * @param userId The ID of the user performing the update.
   * @param studentList An array of student information objects to be updated.
   * @param compId The ID of the competition.
   * @returns A promise that resolves when the update operation is complete.
   * @throws {DbError} Throws an error if the update operation fails.
   */
  competitionStudentsUpdate = async (userId: number, studentList: StudentInfo[], compId: number) => {
    for (const student of studentList) {
      try {
        await this.pool.query(
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
            codeforces_rating = $12
          WHERE user_id = $13 AND competition_id = $14;
          `
        , [
            student.bio,
            student.ICPCEligible,
            student.boersenEligible,
            student.level,
            student.degreeYear,
            student.degree,
            student.isRemote,
            student.isOfficial,
            student.preferredContact,
            student.nationalPrizes,
            student.internationalPrizes,
            student.codeforcesRating,
            student.userId,
            compId
          ]);

      } catch (error: unknown) {
        throw new DbError(DbError.Insert, 'Failed to update a user in the db');
      }
    }

    return;
  };

  /**
   * Checks if a coach is coaching all the students (their teams) in the provided list.
   *
   * @param userId The ID of the coach.
   * @param userIds An array of student IDs to check.
   * @param compId The ID of the competition.
   * @throws {DbError} If the coach is not coaching some of the students in the provided list.
   * @returns A promise that resolves if the coach is coaching all the students.
   */
  coachCheckIdsStudent = async (userId: number, userIds: Array<number>, compId: number) => {
    const dbResult = await this.pool.query(
      `SELECT cu.user_id AS "userId"
      FROM competition_users AS cu_coach
      JOIN competition_users AS cu ON cu.competition_coach_id = cu_coach.id
      WHERE cu_coach.user_id = $1 AND cu_coach.competition_id = $2
      `
    , [userId, compId]);

    const resultIds = dbResult.rows.map((row) => row.userId);

    if (!userIds.every((id) => resultIds.includes(id))) {
      throw new DbError(DbError.Auth, 'Coach is not coaching some of the students in the provided list');
    }
  };

  /**
   * Checks if a coach is coaching all the specified teams in a competition.
   *
   * @param userId The ID of the user (coach) to check.
   * @param teamIds An array of team IDs to verify the coach's association with.
   * @param compId The ID of the competition.
   * @throws {DbError} If the coach is not coaching some of the teams in the provided team IDs.
   * @returns {Promise<void>} A promise that resolves if the coach is coaching all specified teams, otherwise it throws an error.
   */
  coachCheckIds = async (userId: number, teamIds: Array<number>, compId: number) => {
    const coachCheckQuery = 
    `SELECT id
      FROM competition_teams
      WHERE id = ANY($1::int[])
      AND competition_id = $2
      AND competition_coach_id = (
        SELECT id FROM competition_users
        WHERE user_id = $3
        AND competition_id = $2
      )
      `;
    const coachCheckResult = await this.pool.query(coachCheckQuery, [teamIds, compId, userId]);
    const resultIds = coachCheckResult.rows.map((row) => row.id);

    if (!teamIds.every((id) => resultIds.includes(id))) {
      throw new DbError(DbError.Auth, 'Coach is not coaching some of the teams in the provided team IDs.');
    }
    return;
  };

  /**
   * Updates the details of competition teams and their participants in the database.
   *
   * @param teamList An array of team details to be updated.
   * @param compId The ID of the competition.
   * @returns A promise that resolves when the update is complete.
   * @throws {DbError} If there is an error updating a user in the database.
   */
  competitionTeamsUpdate = async (teamList: Array<TeamDetails>, compId: number) => {
    if (teamList.some((team) => team.students.length > 3)) {
      throw new DbError(DbError.Insert, 'Too many members in some teams');
    }

    for (const team of teamList) {

      const participantIds = [];

      for (const participant of team.students) {

        try {
          await this.pool.query(
            `UPDATE competition_users
            SET
              bio = $1,
              icpc_eligible = $2,
              boersen_eligible = $3,
              competition_level = $4,
              is_remote = $5,
              national_prizes = $6,
              international_prizes = $7,
              codeforces_rating = $8,
              past_regional = $9
            WHERE user_id = $10 AND competition_id = $11;
            `
          , [
              participant.bio,
              participant.ICPCEligible,
              participant.boersenEligible,
              participant.level,
              participant.isRemote,
              participant.nationalPrizes,
              participant.internationalPrizes,
              participant.codeforcesRating,
              participant.pastRegional,
              participant.userId,
              compId
            ]);
          participantIds.push(participant.userId);

        } catch (error: unknown) {
          throw new DbError(DbError.Insert, 'Failed to update a user in the db');
        }
      }

      await this.pool.query(
        `UPDATE competition_teams
        SET
          name = $1,
          team_seat = $2,
          site_attending_id = $3,
          participants = $4
        WHERE id = $5
        `
      , [team.teamName, team.teamSeat, team.siteId, participantIds, team.teamId]);
    }

    return;
  };

  /**
   * Retrieves the details of competition attendees based on the user's role.
   * 
   * If the user has an ADMIN role, all attendees of the competition are returned.
   * If the user has a SITE_COORDINATOR role, only attendees from the same site as the user are returned.
   * 
   * @param userId The ID of the user requesting the attendee details.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to an array of attendee details.
   */
  competitionAttendees = async (userId: number, compId: number): Promise<Array<AttendeesDetails>> => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);

    if (roles.includes(CompetitionUserRole.ADMIN)) {
      const dbResult = await this.pool.query(
        `SELECT 
          "userId",
          "universityId",
          "universityName",
          "name",
          "preferredName",
          "email",
          "sex",
          "tshirtSize",
          "dietaryNeeds",
          "accessibilityNeeds",
          "allergies",
          "roles",
          "siteId",
          "pendingSiteId",
          "siteName",
          "pendingSiteName",
          "siteCapacity",
          "pendingSiteCapacity",
          "teamSeat"
          FROM competition_attendees AS ca
        WHERE ca.competition_id = $1;`, [compId]
      );
      return dbResult.rows.map((row) => ({ ...row, roles: parse(row.roles) }));
    }

    if (roles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      const dbResult = await this.pool.query(
        `SELECT 
          "userId",
          "universityId",
          "universityName",
          "name",
          "preferredName",
          "email",
          "sex",
          "tshirtSize",
          "dietaryNeeds",
          "accessibilityNeeds",
          "allergies",
          "roles",
          "siteId",
          "pendingSiteId",
          "siteName",
          "pendingSiteName",
          "siteCapacity",
          "pendingSiteCapacity",
          "teamSeat"
        FROM competition_attendees AS ca
        WHERE ca.competition_id = $1 AND ca."siteId" = (SELECT site_id FROM competition_users WHERE user_id = $2 AND competition_id = $1 LIMIT 1);`, [compId, userId]
      );

      return dbResult.rows.map((row) => ({ ...row, roles: parse(row.roles) }));
    }

    return [];
  };

  /**
   * Retrieves the staff information for a given competition if the user has admin roles.
   *
   * @param userId The ID of the user requesting the staff information.
   * @param compId The ID of the competition for which the staff information is requested.
   * @returns A promise that resolves to an array of `StaffInfo` objects if the user has admin roles, otherwise an empty array.
   */
  competitionStaff = async (userId: number, compId: number): Promise<StaffInfo[]> => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);

    if (roles.includes(CompetitionUserRole.ADMIN)) {
      const dbResult = await this.pool.query(
        `SELECT * FROM competition_staff($1)`
      , [compId]);

      return dbResult.rows;
    }


    return [];
  };

  /**
   * Retrieves a list of students associated with a competition based on the user's role.
   *
   * If the user has an ADMIN role in the competition, all students in the competition are returned.
   * If the user has a COACH role in the competition, only the students associated with the coach are returned.
   * If the user has neither role, an empty array is returned.
   * 
   * @param userId The ID of the user requesting the student information.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to an array of `StudentInfo` objects.
   */
  competitionStudents = async (userId: number, compId: number): Promise<Array<StudentInfo>> => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);
    if (roles.includes(CompetitionUserRole.ADMIN)) {
      const dbResult = await this.pool.query(
        `SELECT * FROM competition_admin_students($1)`
      , [compId]);
      return dbResult.rows;
    }

    if (roles.includes(CompetitionUserRole.COACH)) {
      const dbResult = await this.pool.query(
        `SELECT * FROM competition_coach_students($1, $2)`
      , [userId, compId]);
      return dbResult.rows;
    }

    // Should be changed later when we have a comprehensive error system.
    return [];
  };

  /**
   * Retrieves the details of teams participating in a competition based on the user's role.
   * 
   * The function performs different queries based on the user's role in the competition:
   * - If the user is an ADMIN, it retrieves all teams in the competition.
   * - If the user is a COACH, it retrieves teams coached by the user in the competition.
   * - If the user is a SITE_COORDINATOR, it retrieves teams associated with the user's site in the competition.
   *
   * If the user does not have any of the above roles, an empty array is returned.
   * 
   * @param userId The ID of the user requesting the team details.
   * @param compId The ID of the competition.
   * @returns A promise that resolves to an array of team details.
   */
  competitionTeams = async (userId: number, compId: number): Promise<Array<TeamDetails>> => {
    const roles = await this.competitionRepository.competitionRoles(userId, compId);

    if (roles.includes(CompetitionUserRole.ADMIN)) {
      const dbResult = await this.pool.query(
        `SELECT DISTINCT ON ("teamId")
          src_site_attending_id AS "siteId", "teamId", "universityId", "status", "teamNameApproved", "compName", "teamName", "teamSite", "teamSeat",
          "teamLevel", "startDate", students, coach
        FROM competition_team_details AS ctd
        WHERE ctd.src_competition_id = $1;
        `
      , [compId]);
      return dbResult.rows;
    }

    if (roles.includes(CompetitionUserRole.COACH)) {
      const dbResult = await this.pool.query(
        `SELECT DISTINCT ON ("teamId")
          src_site_attending_id AS "siteId", "teamId", "universityId", "status", "teamNameApproved", "compName", "teamName", "teamSite", "teamSeat",
          "teamLevel", "startDate", students, coach
        FROM competition_team_details AS ctd
        WHERE ctd.coach_user_id = $1 AND ctd.src_competition_id = $2;
        `
      , [userId, compId]);

      return dbResult.rows;
    }

    if (roles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      const dbResult = await this.pool.query(
        `SELECT DISTINCT ON ("teamId")
          src_site_attending_id AS "siteId", "teamId", "universityId", "status", "teamNameApproved", "compName", "teamName", "teamSite", "teamSeat",
          "teamLevel", "startDate", students, coach
        FROM competition_team_details AS ctd
        JOIN competition_users AS csu ON csu.site_id = ctd.src_site_attending_id
        WHERE csu.user_id = $1 AND ctd.src_competition_id = $2;
        `
      , [userId, compId]);

      return dbResult.rows;
    }

    throw new DbError(DbError.Auth, 'User is not staff of this competition');
  };

  /**
   * Creates a new competition and assigns the admin role to the user.
   * 
   * @param userId - The ID of the user creating the competition.
   * @param competition - The competition details.
   * @returns A promise that resolves to an object containing the competition ID.
   * @throws {DbError} If the competition code is already in use.
   */
  competitionSystemAdminCreate = async (userId: number, competition: Competition): Promise<CompetitionIdObject> => {
    // Set default team size to 3 if not provided
    const teamSize = competition.teamSize ?? DEFAULT_TEAM_SIZE;

    //Check if the code is already in use
    const codeCheckQuery = `
      SELECT 1
      FROM competitions
      WHERE code = $1
    `;
    const codeCheckResult = await this.pool.query(codeCheckQuery, [competition.code]);
    if (codeCheckResult.rowCount > 0) {
      throw new DbError(DbError.Query, 'Competition code is already in use.');
    }

    // Insert competition into competitions table
    const competitionQuery =
      `INSERT INTO competitions (name, team_size, created_date, early_reg_deadline, general_reg_deadline, code, start_date, region)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, code;
    `;

    const competitionValues = [
      competition.name,
      teamSize,
      new Date(competition.createdDate),
      competition.earlyRegDeadline ? new Date(competition.earlyRegDeadline) : new Date(competition.generalRegDeadline),
      new Date(competition.generalRegDeadline),
      competition.code,
      new Date(competition.startDate),
      competition.region
    ];

    const competitionResult = await this.pool.query(competitionQuery, competitionValues);
    const competitionId = competitionResult.rows[0].id;

    await this.pool.query(
      `INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level)
      VALUES ($1, $2, ARRAY['Admin']::competition_role_enum[], 'Accepted'::competition_access_enum)`
    , [userId, competitionId]);


    // for the normal siteLocations that have university Ids:
    competition.siteLocations.forEach(async ({ universityId, defaultSite: name }) => {
      await this.pool.query(
        `INSERT INTO competition_sites (competition_id, university_id, name, capacity)
        VALUES ($1, $2, $3, 0)`
      , [competitionId, universityId, name]);
    });

    // handle otherSiteLocations with universityName
    competition.otherSiteLocations?.forEach(async ({ universityName, defaultSite: name }) => {
      // Insert new university and get the universityId
      const insertUniversityResult = await this.pool.query(`
        INSERT INTO universities (name)
        VALUES ($1)
        RETURNING id
      `, [universityName]);

      const universityId = insertUniversityResult.rows[0].id;

      // Insert the new site location with the new universityId
      await this.pool.query(`
        INSERT INTO competition_sites (competition_id, university_id, name, capacity)
        VALUES ($1, $2, $3, 0)
      `, [competitionId, universityId, name]);
    });

    return { competitionId: competitionId };
  };

  /**
   * Updates the details of a competition if the user is an admin of the competition.
   *
   * @param userId The ID of the user attempting to update the competition.
   * @param competition The competition object containing updated details.
   * @returns A promise that resolves to an empty object.
   * @throws {DbError} If the user is not an admin for the competition or if the competition does not exist.
   */
  competitionSystemAdminUpdate = async(userId: number, competition: Competition): Promise<{}> => {
    // Verify if userId is an admin of this competition
    const roles = await this.competitionRepository.competitionRoles(userId, competition.id);

    if (!roles.includes(CompetitionUserRole.ADMIN)) {
      throw new DbError(DbError.Query, 'User is not an admin for this competition.');
    }

    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;

    const competitionExistResult = await this.pool.query(competitionExistQuery, [competition.id]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Competition does not exist.');
    }

    // Update competition details
    const competitionUpdateQuery = `
      UPDATE competitions
      SET name = $1, team_size = $2, created_date = $3, early_reg_deadline = $4, general_reg_deadline = $5, code = $6, start_date = $7, region = $8, information = $9
      WHERE id = $10;
    `;

    const competitionUpdateValues = [
      competition.name,
      competition.teamSize,
      new Date(competition.createdDate),
      competition.earlyRegDeadline ? new Date(competition.earlyRegDeadline) : new Date(competition.generalRegDeadline),
      new Date(competition.generalRegDeadline),
      competition.code,
      new Date(competition.startDate),
      competition.region,
      competition.information,
      competition.id
    ];

    await this.pool.query(competitionUpdateQuery, competitionUpdateValues);

    competition.siteLocations.forEach(async ({ universityId, defaultSite: name }) => {
      try {
        await this.pool.query(
          `INSERT INTO competition_sites (competition_id, university_id, name, capacity)
          VALUES ($1, $2, $3, 0)
          ON CONFLICT (competition_id, university_id)
            DO UPDATE
            SET name = $3
          `
        , [competition.id, universityId, name]);
      } catch (error: unknown) {
        
      }
    });

    // handle otherSiteLocations with universityName
    competition.otherSiteLocations?.forEach(async ({ universityName, defaultSite: name }) => {
      // Insert new university and get the universityId
      const insertUniversityResult = await this.pool.query(`
        INSERT INTO universities (name)
        VALUES ($1)
        RETURNING id
      `, [universityName]);

      const universityId = insertUniversityResult.rows[0].id;

      // Insert the new site location with the new universityId
      await this.pool.query(
        `INSERT INTO competition_sites (competition_id, university_id, name, capacity)
        VALUES ($1, $2, $3, 0)
        ON CONFLICT (competition_id, university_id)
          DO UPDATE
          SET name = $3
              
      `, [competition.id, universityId, name]);
    });

    // Skip updating site details if siteLocations is not provided
    if (!competition.siteLocations) {
      return {};
    }

    return {};
  };

  competitionStaffDetails = async(userId: number, compId: number): Promise<StaffInfo> => {
    const dbResult = await this.pool.query(
      `SELECT 
        "userId", 
        "universityId", 
        "universityName", 
        name, 
        email, 
        sex, 
        pronouns, 
        "tshirtSize", 
        allergies, 
        "dietaryReqs", 
        "accessibilityReqs", 
        "userAccess",
        bio, 
        roles, 
        access
       FROM competition_staff($1)
       WHERE "userId" = $2`,
      [compId, userId]
    );
  
    if(dbResult.rows.length === 0) {
      throw new DbError(DbError.Query, 'Staff does not exist or is not a part of this competition.');
    }
    const result = dbResult.rows[0];
    return {
      userId: result.userId,
      universityId: result.universityId,
      universityName: result.universityName,
      name: result.name,
      email: result.email,
      sex: result.sex,
      pronouns: result.pronouns,
      tshirtSize: result.tshirtSize,
      allergies: result.allergies,
      dietaryReqs: result.dietaryReqs,
      accessibilityReqs: result.accessibilityReqs,
      userAccess: result.userAccess,
      bio: result.bio,
      roles: result.roles,
      access: result.access
    };
  };

  /**
   * Updates the details of a staff member in a competition.
   *
   * @param userId The ID of the user performing the update.
   * @param compId The ID of the competition.
   * @param staffInfo The updated staff information.
   * @returns A promise that resolves to an empty object.
   * @throws {DbError} If the staff does not exist
   */
  competitionStaffDetailsUpdate = async (userId: number, compId: number, staffInfo: StaffInfo): Promise<{}> => {
    if (!staffInfo) {
      return {};
    }
    const dbResult = await this.pool.query(
      `UPDATE competition_users
      SET
        bio = $1,
        competition_roles = $2,
        access_level = $3
      WHERE user_id = $4 AND competition_id = $5;
      `
    , [staffInfo.bio, staffInfo.roles, staffInfo.access, staffInfo.userId, compId]);

    if (dbResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Staff does not exist or is not a part of this competition.');
    }
    return {};
  };

  /**
   * Approves team assignments for a competition.
   *
   * @param userId The ID of the user performing the approval.
   * @param compId The ID of the competition.
   * @param approveIds An array of team IDs to be approved.
   * @returns A promise that resolves to an empty object.
   * @throws {DbError} If no teams are provided for approval.
   * @throws {DbError} If the competition does not exist.
   * @throws {DbError} If one or more teams are already registered in the ICPC system.
   * @throws {DbError} If the user is not an admin or a coach for the competition.
   * @throws {DbError} If no matching teams are found for the provided approved IDs in the competition.
   */
  competitionApproveTeamAssignment = async(userId: number, compId: number, approveIds: Array<number>): Promise<{}> => {
    // No team to approve
    if (approveIds.length < 1) {
      throw new DbError(DbError.Query, 'No team to approve.');
    }

    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Competition not found.');
    }

    // Check if any of the ids in approveIds has team_status as 'Registered'
    const registeredTeamsQuery = `
      SELECT id
      FROM competition_teams
      WHERE id = ANY($1::int[]) 
      AND competition_id = $2 
      AND team_status = 'Registered'::competition_team_status
    `;
    const registeredTeamsResult = await this.pool.query(registeredTeamsQuery, [approveIds, compId]);

    if (registeredTeamsResult.rowCount > 0) {
      throw new DbError(DbError.Query, 'One or more teams are already registered into ICPC system.');
    }

    // Check if the user is an admin or a coach of this competition.
    // If the user is a coach, they can only approve teams that they are a coach of.
    const userRoles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!userRoles.includes(CompetitionUserRole.ADMIN) && !userRoles.includes(CompetitionUserRole.COACH)) {
      throw new DbError(DbError.Auth, 'User is not a coach or an admin for this competition.');
    }

    if (userRoles.includes(CompetitionUserRole.COACH)) {
      await this.coachCheckIds(userId, approveIds, compId);
    }

    const approveQuery = `
      UPDATE competition_teams
      SET team_status = 'Unregistered'::competition_team_status
      WHERE id = ANY($1::int[])
      AND competition_id = $2
    `;
    const approveResult = await this.pool.query(approveQuery, [approveIds, compId]);

    // If no rows were updated, it implies that no matching records were found
    if (approveResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'No matching teams found for the provided approved IDs in this competition.');
    }

    return {};
  };

  /**
   * Requests a team name change for a competition.
   *
   * @param userId The ID of the user requesting the team name change.
   * @param compId The ID of the competition.
   * @param newTeamName The new team name being requested.
   * @returns A promise that resolves to the ID of the team whose name change was requested.
   * @throws {DbError} If the user is not a member of the team.
   * @throws {DbError} If the new team name is similar to the old name or an already requested new name.
   * @throws {DbError} If no matching team is found for the provided ID in the competition.
   */
  competitionRequestTeamNameChange = async(userId: number, compId: number, newTeamName: string): Promise<number> => {
    // Check if the user is a valid member of this team
    const teamMemberCheckQuery = `
      SELECT name, pending_name
      FROM competition_teams
      WHERE competition_id = $1 AND $2 = ANY(participants)
    `;
    const teamMemberCheckResult = await this.pool.query(teamMemberCheckQuery, [compId, userId]);

    if (teamMemberCheckResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'User is not a member of this team.');
    }

    if (teamMemberCheckResult.rows[0].name === newTeamName || teamMemberCheckResult.rows[0].pending_name === newTeamName) {
      throw new DbError(DbError.Query, 'New team name is similar to the old name or an already requested new name.');
    }

    // Update the pending name in the competition teams table
    const teamNameUpdateQuery = `
      UPDATE competition_teams
      SET pending_name = $3
      WHERE competition_id = $1 AND $2 = ANY(participants)
      RETURNING id
    `;
    const result = await this.pool.query(teamNameUpdateQuery, [compId, userId, newTeamName]);
    const teamId = result.rows[0].id;

    if (result.rowCount === 0) {
      throw new DbError(DbError.Query, 'No matching team found for the provided ID in this competition.');
    }

    return teamId;
  };

  /**
   * Approves or rejects team name changes for a competition.
   *
   * @param userId The ID of the user performing the action.
   * @param compId The ID of the competition.
   * @param approveIds An array of team IDs whose name changes are approved.
   * @param rejectIds An array of team IDs whose name changes are rejected.
   * @returns A promise that resolves to an empty object.
   * @throws {DbError} If the competition is not found.
   * @throws {DbError} If there are duplicate IDs in the approveIds and rejectIds arrays.
   * @throws {DbError} If the user is not an admin or a coach for the competition.
   * @throws {DbError} If no matching teams are found for the provided approved IDs.
   * @throws {DbError} If no matching teams are found for the provided rejected IDs.
   */
  competitionApproveTeamNameChange = async(userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{}> => {
    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Competition not found.');
    }

    // Verify if there are duplicate IDs in the approveIds and rejectIds arrays
    const duplicateIds = approveIds.filter((id) => rejectIds.includes(id));
    if (duplicateIds.length > 0) {
      throw new DbError(DbError.Query, 'Duplicate team IDs found in team name approve and reject lists.');
    }

    // Check if the user is an admin or a coach of this competition.
    // If the user is a coach, they can only approve teams that they are a coach of.
    const userRoles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!userRoles.includes(CompetitionUserRole.ADMIN) && !userRoles.includes(CompetitionUserRole.COACH)) {
      throw new DbError(DbError.Auth, 'User is not a coach or an admin for this competition.');
    }

    if (userRoles.includes(CompetitionUserRole.COACH)) {
      await this.coachCheckIds(userId, approveIds, compId);
    }

    // Update the team name if the name change is approved
    if (approveIds.length > 0) {
      const approveQuery = `
        UPDATE competition_teams
        SET name = pending_name, pending_name = NULL
        WHERE id = ANY($1::int[])
        AND competition_id = $2
      `;
      const approveResult = await this.pool.query(approveQuery, [approveIds, compId]);

      // If no rows were updated, it implies that no matching records were found
      if (approveResult.rowCount === 0) {
        throw new DbError(DbError.Query, 'No matching teams found for the provided approved IDs in this competition.');
      }
    }

    // If there are rejected team IDs, batch update to clear pending_name only
    if (rejectIds.length > 0) {
      const rejectQuery = `
        UPDATE competition_teams
        SET pending_name = NULL
        WHERE id = ANY($1::int[])
        AND competition_id = $2
      `;
      const rejectResult = await this.pool.query(rejectQuery, [rejectIds, compId]);

      if (rejectResult.rowCount === 0) {
        throw new DbError(DbError.Insert, 'No matching teams found for the provided rejected IDs in this competition.');
      }
    }

    return {};
  };

  /**
   * Approves or rejects site changes for teams in a competition.
   *
   * @param userId The ID of the user performing the action.
   * @param compId The ID of the competition.
   * @param approveIds An array of team IDs to approve the site change.
   * @param rejectIds An array of team IDs to reject the site change.
   * @returns A promise that resolves to an empty object.
   * @throws {DbError} If the competition is not found.
   * @throws {DbError} If there are duplicate team IDs in the approve and reject lists.
   * @throws {DbError} If the user is not an admin or a coach for the competition.
   * @throws {DbError} If no matching teams are found for the provided approved IDs.
   * @throws {DbError} If no matching teams are found for the provided rejected IDs.
   */
  competitionApproveSiteChange = async(userId: number, compId: number, approveIds: Array<number>, rejectIds: Array<number>): Promise<{}> => {
    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Competition not found.');
    }

    // Verify if there are duplicate IDs in the approveIds and rejectIds arrays
    const duplicateIds = approveIds.filter((id) => rejectIds.includes(id));
    if (duplicateIds.length > 0) {
      throw new DbError(DbError.Query, 'Duplicate team IDs found in site ID approve and reject lists.');
    }

    // Check if the user is an admin or a coach of this competition.
    // If the user is a coach, they can only approve teams that they are a coach of.
    const userRoles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!userRoles.includes(CompetitionUserRole.ADMIN) && !userRoles.includes(CompetitionUserRole.COACH)) {
      throw new DbError(DbError.Auth, 'User is not a coach or an admin for this competition.');
    }

    if (userRoles.includes(CompetitionUserRole.COACH)) {
      await this.coachCheckIds(userId, approveIds, compId);
    }

    // Update the site ID if the change is approved
    if (approveIds.length > 0) {
      const approveQuery = `
        UPDATE competition_teams
        SET site_attending_id = pending_site_attending_id, pending_site_attending_id = NULL
        WHERE id = ANY($1::int[])
        AND competition_id = $2
      `;
      const approveResult = await this.pool.query(approveQuery, [approveIds, compId]);

      // If no rows were updated, it implies that no matching records were found
      if (approveResult.rowCount === 0) {
        throw new DbError(DbError.Query, 'No matching teams found for the provided approved IDs in this competition.');
      }
    }

    // If there are rejected team IDs, batch update to clear pending_site_attending_id only
    if (rejectIds.length > 0) {
      const rejectQuery = `
        UPDATE competition_teams
        SET pending_site_attending_id = NULL
        WHERE id = ANY($1::int[])
        AND competition_id = $2
      `;
      const rejectResult = await this.pool.query(rejectQuery, [rejectIds, compId]);

      if (rejectResult.rowCount === 0) {
        throw new DbError(DbError.Insert, 'No matching teams found for the provided rejected IDs in this competition.');
      }
    }

    return {};
  };

  /**
   * Assigns seats to teams in a competition.
   *
   * @param userId The ID of the user making the request.
   * @param compId The ID of the competition.
   * @param seatAssignments An array of seat assignments containing siteId, teamSite, teamSeat, and teamId.
   * @returns A promise that resolves to an empty object.
   * @throws {DbError} If the competition does not exist.
   * @throws {DbError} If the user is not an admin or a site coordinator for the competition.
   * @throws {DbError} If the user is a site coordinator but not for all provided sites.
   * @throws {DbError} If no matching records with the siteId and teamId were found.
   */
  competitionTeamSeatAssignments = async(userId: number, compId: number, seatAssignments: Array<SeatAssignment>): Promise<{}> => {
    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Competition not found.');
    }

    // Check if the user is an admin or a site coordinator of this competition.
    // If the user is a site-coordinator, they can only manage seats in the sites they oversee.
    const userRoles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!userRoles.includes(CompetitionUserRole.ADMIN) && !userRoles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      throw new DbError(DbError.Auth, 'User is not a site coordinator or an admin for this competition.');
    }

    if (userRoles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      const siteIds = seatAssignments.map((assignment) => assignment.siteId);
      const siteCoordinatorCheckQuery = `
        SELECT site_id
        FROM competition_users
        WHERE user_id = $1 AND competition_id = $2 AND site_id = ANY($3::int[]) AND competition_roles @> ARRAY['Site-Coordinator']::competition_role_enum[]
      `;
      const siteCoordinatorCheckResult = await this.pool.query(siteCoordinatorCheckQuery, [userId, compId, siteIds]);

      if (siteCoordinatorCheckResult.rowCount !== siteIds.length) {
        throw new DbError(DbError.Auth, 'User is not a site coordinator for all the provided sites.');
      }
    }

    for (const assignment of seatAssignments) {
      const { siteId, teamSite, teamSeat, teamId } = assignment;

      // Update the team_seat with teamSeat
      const updateSeatQuery = `
        UPDATE competition_teams
        SET team_seat = $1
        WHERE id = $2 AND site_attending_id = $3
        RETURNING id
      `;
      const updateSeatResult = await this.pool.query(updateSeatQuery, [teamSeat, teamId, siteId]);

      // If no rows were updated, it implies that no matching records with the siteId and teamId were found
      if (updateSeatResult.rowCount === 0) {
        throw new DbError(DbError.Query, `No team with id ${teamId} is found, or invalid team site ${teamSite} with siteId ${siteId} for this team.`);
      }
    }

    return {};
  };

  /**
   * Registers teams for a competition to ICPC global (Setting their status to Registered).
   *
   * @param userId The ID of the user performing the registration.
   * @param compId The ID of the competition.
   * @param teamIds An array of team IDs to be registered.
   * @returns A promise that resolves to an empty object.
   * @throws {DbError} If the competition does not exist.
   * @throws {DbError} If the user is not an admin or a coach for the competition.
   * @throws {DbError} If no matching teams are found for the provided team IDs in the competition.
   */
  competitionRegisterTeams = async(userId: number, compId: number, teamIds: Array<number>): Promise<{}> => {
    // Verify if competition exists
    const competitionExistQuery = `
      SELECT 1
      FROM competitions
      WHERE id = $1
    `;
    const competitionExistResult = await this.pool.query(competitionExistQuery, [compId]);

    if (competitionExistResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'Competition not found.');
    }

    // Check if the user is an admin or a coach of this competition.
    // If the user is a coach, they can only approve teams that they are a coach of.
    const userRoles = await this.competitionRepository.competitionRoles(userId, compId);

    if (!userRoles.includes(CompetitionUserRole.ADMIN) && !userRoles.includes(CompetitionUserRole.COACH)) {
      throw new DbError(DbError.Auth, 'User is not a coach or an admin for this competition.');
    }

    if (userRoles.includes(CompetitionUserRole.COACH)) {
      await this.coachCheckIds(userId, teamIds, compId);
    }

    // Update the team status to 'Registered'
    const registerQuery = `
      UPDATE competition_teams
      SET team_status = 'Registered'::competition_team_status
      WHERE id = ANY($1::int[])
      AND competition_id = $2
    `;
    const registerResult = await this.pool.query(registerQuery, [teamIds, compId]);

    // If no rows were updated, it implies that no matching records were found
    if (registerResult.rowCount === 0) {
      throw new DbError(DbError.Query, 'No matching teams found for the provided team IDs in this competition.');
    }

    return {};
  };

  /**
   * Adds a staff member to a competition with specific roles.
   * Access level will be set to 'Pending' for the staff member until an admin approves the request.
   * 
   * @param competitionId The ID of the competition.
   * @param staffCompetitionInfo An object containing the staff member's information and roles.
   * @returns A promise that resolves to an empty object.
   * 
   * @throws {DbError} If the user is already assigned the specified role in the competition.
   */
  competitionStaffJoin = async (competitionId: number, staffCompetitionInfo: CompetitionStaff): Promise<{}> => {
    const userId = staffCompetitionInfo.userId;
    const roles = staffCompetitionInfo.competitionRoles;
    const competitionExistRole = await this.competitionRepository.competitionRoles(userId, competitionId);

    // Admin staff
    if (roles.includes(CompetitionUserRole.ADMIN)) {
      if (competitionExistRole.includes(CompetitionUserRole.ADMIN)) {
        throw new DbError(DbError.Query, 'User is already an admin for this competition.');
      }

      const addAdminQuery = `
        INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level)
        VALUES ($1, $2, $3, 'Pending'::competition_access_enum)
      `;

      try {
        await this.pool.query(addAdminQuery, [userId, competitionId, [CompetitionUserRole.ADMIN]]);
      } catch (error) {
        if (error.constraint === 'unique_competition_user') {
          throw new DbError(DbError.Insert, 'User is already an admin for this competition.');
        }
        throw new DbError(DbError.Insert, 'Failed to insert admin.');
      }
    }

    // Coach staff
    if (roles.includes(CompetitionUserRole.COACH)) {
      const competitionBio = staffCompetitionInfo.competitionBio;
      if (competitionExistRole.includes(CompetitionUserRole.COACH)) {
        throw new DbError(DbError.Query, 'User is already a coach for this competition.');
      }

      const addCoachQuery = `
        INSERT INTO competition_users (user_id, competition_id, competition_roles, bio, access_level)
        VALUES ($1, $2, $3, $4, 'Pending'::competition_access_enum)
      `;
      try {
        await this.pool.query(addCoachQuery, [userId, competitionId, [CompetitionUserRole.COACH], competitionBio]);
      } catch (error) {
        if (error.constraint === 'unique_competition_user') {
          throw new DbError(DbError.Insert, 'User is already a coach for this competition.');
        }
        throw new DbError(DbError.Insert, 'Failed to insert coach.');
      }
    }

    // Site coordinator staff
    if (roles.includes(CompetitionUserRole.SITE_COORDINATOR)) {
      const siteId = staffCompetitionInfo.siteLocation.id;
      if (competitionExistRole.includes(CompetitionUserRole.SITE_COORDINATOR)) {
        throw new DbError(DbError.Query, 'User is already a site coordinator for this competition.');
      }

      const addSiteCoordinatorQuery = `
        INSERT INTO competition_users (user_id, competition_id, competition_roles, site_id, access_level)
        VALUES ($1, $2, $3, $4, 'Pending'::competition_access_enum)
      `;

      try {
        await this.pool.query(addSiteCoordinatorQuery, [userId, competitionId, [CompetitionUserRole.SITE_COORDINATOR], siteId]);
      } catch (error) {
        if (error.constraint === 'unique_competition_user') {
          throw new DbError(DbError.Insert, 'User is already an site coordinator for this competition.');
        }
        throw new DbError(DbError.Insert, 'Failed to insert site coordinator.');
      }    
    }

    return {};
  };

  /**
   * Updates the announcement for a competition.
   *
   * @param compId The ID of the competition.
   * @param university The university object containing the university ID.
   * @param announcement The announcement object containing the message and created date.
   * @returns A promise that resolves to an empty object.
   * @throws {DbError} If the compettion announcement fails to update (the competition most likely does not exist).
   */
  competitionAnnouncementUpdate = async (compId: number, university: University, announcement: Announcement): Promise<void> => {
    const announcementResult = await this.pool.query(`
      SELECT id, message, created_date AS "createdDate", university_id AS "universityId"
      FROM competition_announcements
      WHERE competition_id = $1 AND university_id = $2`,
    [compId, university.id]
    );

    if(announcementResult.rowCount === 0) {
      const announcementInsertResult = await this.pool.query(`
        INSERT INTO competition_announcements (competition_id, user_id, message, university_id, created_date)
        VALUES ($1, $2, $3, $4, $5)`, 
      [compId, announcement.userId, announcement.message, announcement.universityId, new Date(announcement.createdAt).toISOString()]
      );
      if(announcementInsertResult.rowCount === 0) {
        throw new DbError(DbError.Insert, 'Failed to insert announcement.');
      }
    }
    else {
      const announcementUpdateResult = await this.pool.query(`
        UPDATE competition_announcements
        SET message = $1, created_date = $2
        WHERE competition_id = $3 AND university_id = $4`,
      [announcement.message, new Date(announcement.createdAt).toISOString(), compId, university.id]
      );
      if(announcementUpdateResult.rowCount === 0) {
        throw new DbError(DbError.Update, 'Failed to update announcement.');
      }
    }
    return ;
  };

  /**
   * The main algorithm that sorts and forms teams for a competition.
   *
   * @param compId The ID of the competition.
   * @param userId The ID of the user performing the action.
   * @returns A promise that resolves to an empty object.
   */
  competitionAlgorithm = async (compId: number, userId: number): Promise<{} | undefined> => {
    const competitionCoachId = await this.competitionRepository.competitionCoachIdFromCompId(compId, userId);

    const teamsQuery = `
      SELECT id, name, pending_name, team_size, participants, university_id, team_seat, site_attending_id, competition_id, competition_coach_id, team_status
      FROM competition_teams
      WHERE competition_id = $1 AND competition_coach_id = $2 AND team_status = 'Pending'::competition_team_status
    `;
    const teamsResult = await this.pool.query(teamsQuery, [compId, competitionCoachId]);
    if (teamsResult.rowCount === 0) {
      return;
    }
    let userIds = [];
    let convertUserIdToCompUserId = new Map<number, number>();
    for (let team of teamsResult.rows) {
      for (let participant of team.participants) {
        userIds.push(participant);
      }
    }

    const sudentsQuery = `
      SELECT id, user_id, preferred_contact, competition_level, icpc_eligible, boersen_eligible, degree_year, degree, is_remote, national_prizes, international_prizes, codeforces_rating, university_courses, past_regional
      FROM competition_users
      WHERE user_id = ANY($1::int[]) AND competition_id = $2
    `;
    const studentsResult = await this.pool.query(sudentsQuery, [userIds, compId]);
    let studentMap = new Map<number, CompetitionAlgoStudentDetails>();

    for (let student of studentsResult.rows) {
      let algoStudent: CompetitionAlgoStudentDetails = {
        id: student.id,
        userId: student.user_id,
        preferred_contact: student.preferred_contact,
        competitionLevel: student.competition_level,
        ICPCEligible: student.icpc_eligible,
        boersenEligible: student.boersen_eligible,
        degreeYear: student.degree_year,
        degree: student.degree,
        isRemote: student.is_remote,
        nationalPrizes: student.national_prizes,
        internationalPrizes: student.international_prizes,
        codeforcesRating: student.codeforces_rating,
        universityCourses: student.university_courses,
        pastRegional: student.past_regional,
        algoPoint: 0
      };
      convertUserIdToCompUserId.set(algoStudent.userId, algoStudent.id);
      studentMap.set(student.id, algoStudent);
    }
    this.heuristicStudent(studentMap);
    let algoTeams: CompetitionAlgoTeamDetails[] = [];
    for (let team of teamsResult.rows) {
      let teamDetails: CompetitionAlgoTeamDetails = {
        id: team.id,
        name: team.name,
        pendingName: team.pending_name,
        teamSize: team.team_size,
        participants: [],
        universityId: team.university_id,
        teamSeat: team.team_seat,
        siteAttendingId: team.site_attending_id,
        competitionId: team.competition_id,
        competitionCoachId: team.competition_coach_id,
        teamStatus: team.team_status,
      };

      for (let participant of team.participants) {
        teamDetails.participants.push(studentMap.get(convertUserIdToCompUserId.get(participant)));
      }
      algoTeams.push(teamDetails);
    }

    let sortedAlgoTeams = this.sortTeams(algoTeams, studentMap);
    let deletedTeams = new Set<number>();
    this.formTeams(sortedAlgoTeams, deletedTeams);

    const teamUpdateQuery = `
    UPDATE competition_teams
    SET 
        team_size = subquery.team_size,
        participants = subquery.participants
    FROM jsonb_to_recordset($1::jsonb) AS subquery(
        id INT,
        team_size INT,
        participants INT[]
    )
    WHERE competition_teams.id = subquery.id
    AND competition_teams.competition_id = $2
    `;

    // Prepare the data
    const updateData = algoTeams.map((team) => ({
      id: team.id,
      team_size: team.participants.length,
      participants: team.participants.map((p) => p?.userId)
    }));

    await this.pool.query(teamUpdateQuery, [JSON.stringify(updateData), compId]);

    // Delete notifications for the deleted teams
    const deleteNotificationsQuery = `
      DELETE FROM notifications
      WHERE team_id = ANY($1::int[]) 
      AND competition_id = $2
    `;
    const deleteNotiResult = await this.pool.query(deleteNotificationsQuery, [Array.from(deletedTeams), compId]);
    await this.pool.query(deleteNotificationsQuery, [Array.from(deletedTeams), compId]);

    // Delete the deleted teams
    const deleteTeamsQuery = `
    DELETE FROM competition_teams
    WHERE id = ANY($1::int[])
    AND competition_id = $2
    `;
    const deletedTeamsArray = Array.from(deletedTeams);
    await this.pool.query(deleteTeamsQuery, [deletedTeamsArray, compId]);

    // This is for demo only
    return {
      algorithm: {
        teamsParticipating: algoTeams.map((team) => ({
          id: team.id,
          name: team.name,
          participants: team.participants.map((p) => p?.userId),
          algoPoint: Math.max(...team.participants.map((p) => studentMap.get(p?.id)?.algoPoint || 0))
        }))
      }
    };
  };

  /**
   * A heuristic algorithm to calculate the points assigned for each participant.
   *
   * @param students A map of student IDs to their competition details.
   * @returns A promise that resolves to an empty object.
   */
  heuristicStudent = (students: Map<number, CompetitionAlgoStudentDetails>) => {
    for (let student of students.values()) {
      if (student.codeforcesRating) {
        student.algoPoint = Math.max(student.algoPoint, student.codeforcesRating);
      }
      if (student.universityCourses.includes(CourseCategory.Introduction)) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.INTRO_COURSE);
      }
      if (student.universityCourses.includes(CourseCategory.DataStructures)) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.DSA_COURSE);
      }
      if (student.universityCourses.includes(CourseCategory.AlgorithmDesign)) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.ADVANCED_COURSE);
      }
      if (student.universityCourses.includes(CourseCategory.ProgrammingChallenges)) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.CHALLENGE_COURSE);
      }
      if (student.nationalPrizes) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.NATIONAL_PRIZE);
      }
      if (student.pastRegional) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.PAST_REGIONAL);
      }
      if (student.internationalPrizes) {
        student.algoPoint = Math.max(student.algoPoint, AlgoConversion.INTERNATION_PRIZE);
      }
    }
  };

  /**
   * Forms teams based on the sorted list of teams.
   *
   * @param teams The list of teams to be formed.
   * @param deletedTeams A set of team IDs that have been deleted.
   * @returns A promise that resolves to an empty object.
   */
  formTeams = (teams: CompetitionAlgoTeamDetails[], deletedTeams: Set<number>) => {
    for (let i = 0; i < teams.length; i++) {
      if (deletedTeams.has(teams[i].id)) {
        continue;
      }
      if (teams[i].teamSize === 3) {
        continue;
      }
      if (teams[i].teamSize === 2) {
        for (let j = i + 1; j < teams.length; j++) {
          if (deletedTeams.has(teams[j].id)) {
            continue;
          }
          if (teams[j].participants.length === 1) {
            teams[i].participants.push(teams[j].participants[0]);
            teams[i].teamSize += 1;
            deletedTeams.add(teams[j].id);
            break;
          }
        }
      }
      else {
        let singleTeam = 0;
        for (let j = i + 1; j < teams.length; j++) {
          if (deletedTeams.has(teams[j].id)) {
            continue;
          }
          if (teams[j].teamSize === 1) {
            if (singleTeam === 0) {
              singleTeam = j;
            }
            else {
              teams[i].participants.push(teams[singleTeam].participants[0]);
              teams[i].participants.push(teams[j].participants[0]);
              teams[i].teamSize += 2;
              deletedTeams.add(teams[singleTeam].id);
              deletedTeams.add(teams[j].id);
              break;
            }
          }
          else {
            teams[i].participants.push(teams[j].participants[0]);
            teams[i].participants.push(teams[j].participants[1]);
            teams[i].teamSize += 2;
            deletedTeams.add(teams[j].id);
            break;
          }
          if (j === teams.length - 1) {
            teams[i].participants.push(teams[singleTeam].participants[0]);
            teams[i].teamSize += 1;
            deletedTeams.add(teams[singleTeam].id);
          }
        }
      }
    }
  };

  /**
   * Sorts the teams based on the maximum points of the participants.
   *
   * @param teams The list of teams to be sorted.
   * @param studentMap A map of student IDs to their competition details.
   * @returns A promise that resolves to an empty object.
   */
  sortTeams = (teams: CompetitionAlgoTeamDetails[], studentMap: Map<number, CompetitionAlgoStudentDetails>) => {
    teams.sort((teamA, teamB) => {
      const teamAMaxPoint = Math.max(...teamA.participants.map((p) =>
        studentMap.get(p?.id)?.algoPoint || 0
      ));
      const teamBMaxPoint = Math.max(...teamB.participants.map((p) =>
        studentMap.get(p?.id)?.algoPoint || 0
      ));

      // Sort in descending order (higher points first)
      return teamBMaxPoint - teamAMaxPoint;
    });
    return teams;
  };
}
