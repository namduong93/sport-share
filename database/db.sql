DROP DATABASE IF EXISTS capstone_db;
CREATE DATABASE capstone_db;

\c capstone_db;

-- sql schema goes here:

CREATE TABLE universities (
  id SERIAL PRIMARY KEY,
  
  name TEXT NOT NULL
);

CREATE TYPE course_category_enum AS ENUM (
  'Introduction',
  'Data Structures',
  'Algorithm Design',
  'Programming Challenges'
);

CREATE TYPE user_type_enum AS ENUM ('student', 'staff', 'system_admin');
CREATE TYPE user_access_enum AS ENUM ('Accepted', 'Pending', 'Rejected');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  name TEXT NOT NULL,
  preferred_name TEXT,
  
  email VARCHAR(320) NOT NULL UNIQUE,

  hashed_password CHAR(60) NOT NULL,

  gender TEXT,
  pronouns TEXT,
  tshirt_size TEXT NOT NULL,

  allergies TEXT,
  dietary_reqs TEXT,
  accessibility_reqs TEXT,

  user_type user_type_enum NOT NULL,
  

  university_id INT REFERENCES universities (id),
  user_access user_access_enum,

  -- student info
  student_id TEXT, --- NULL if not a student

  -- staff info
  

  -- system admin info

  CHECK (
    ((user_type = 'student' AND student_id IS NOT NULL) OR
      (user_type in ('staff', 'system_admin') AND student_id IS NULL))
  )
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,

  session_id CHAR(36) NOT NULL,
  
  -- Foreign Key id of the user that is logged in
  user_id INT NOT NULL REFERENCES users (id),

  -- The time the session was created
  created_date TIMESTAMP NOT NULL
);

CREATE TABLE competitions (
  id SERIAL PRIMARY KEY,
  
  name TEXT NOT NULL,
  team_size INT NOT NULL,
  created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  early_reg_deadline TIMESTAMPTZ,
  general_reg_deadline TIMESTAMPTZ NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  code VARCHAR(8) NOT NULL,

  region TEXT NOT NULL,

  information TEXT
);

CREATE TABLE competition_registration_toggles (
  id SERIAL PRIMARY KEY,

  competition_id INT NOT NULL REFERENCES competitions (id),
  university_id INT NOT NULL REFERENCES universities (id),

  enable_codeforces_field BOOLEAN DEFAULT TRUE,
  enable_national_prizes_field BOOLEAN DEFAULT TRUE,
  enable_international_prizes_field BOOLEAN DEFAULT TRUE,
  enable_regional_participation_field BOOLEAN DEFAULT TRUE,

  CONSTRAINT unique_competition_uni_toggle UNIQUE (competition_id, university_id)
);

CREATE TABLE competition_sites (
  id SERIAL PRIMARY KEY,

  competition_id INT NOT NULL REFERENCES competitions (id),
  university_id INT NOT NULL REFERENCES universities (id),

  name TEXT NOT NULL,

  capacity INT,

  CONSTRAINT unique_site_competition UNIQUE (competition_id, university_id)
);

CREATE TYPE competition_role_enum AS ENUM ('Participant', 'Coach', 'Admin', 'Site-Coordinator');
CREATE TYPE competition_level_enum AS ENUM ('Level A', 'Level B', 'No Preference');
CREATE TYPE competition_access_enum AS ENUM ('Accepted', 'Pending', 'Rejected');

CREATE TABLE competition_users (
  id SERIAL PRIMARY KEY,

  user_id INT NOT NULL REFERENCES users (id),
  competition_id INT NOT NULL REFERENCES competitions (id),

  competition_roles competition_role_enum[] NOT NULL,

  bio TEXT NOT NULL DEFAULT '',

  -- participant info
  icpc_eligible BOOLEAN,
  boersen_eligible BOOLEAN,
  competition_level competition_level_enum DEFAULT 'Level B',
  degree_year INT,
  degree TEXT,
  is_remote BOOLEAN,
  is_official BOOLEAN,

  preferred_contact TEXT,

  national_prizes TEXT,
  international_prizes TEXT,
  codeforces_rating INT,
  university_courses TEXT[],
  past_regional BOOLEAN,
  access_level competition_access_enum,
  
  competition_coach_id INT REFERENCES competition_users (id),
  
  -- coach info

  -- admin info

  -- site-coordinator info
  site_id INT REFERENCES competition_sites (id),

  CONSTRAINT unique_competition_user UNIQUE (user_id, competition_id, competition_roles)
);

CREATE TYPE competition_team_status AS ENUM ('Registered', 'Unregistered', 'Pending');

CREATE TABLE competition_teams (
  id SERIAL PRIMARY KEY,

  competition_coach_id INT REFERENCES competition_users (id), --- id is the id of the coach in the competition, not the user_id

  name TEXT NOT NULL,
  pending_name TEXT,

  team_status competition_team_status NOT NULL,
  team_size INT NOT NULL,

  site_attending_id INT REFERENCES competition_sites (id),
  pending_site_attending_id INT REFERENCES competition_sites (id) NULL,

  team_seat TEXT,

  participants INT[], --- array of user_id's
  
  university_id INT NOT NULL REFERENCES universities (id),
  competition_id INT NOT NULL REFERENCES competitions (id)
);

CREATE TABLE competition_announcements (
  id SERIAL PRIMARY KEY,
  
  competition_id INT NOT NULL REFERENCES competitions (id),
  user_id INT NOT NULL REFERENCES users (id),
  university_id INT NOT NULL REFERENCES universities (id),
  message TEXT NOT NULL,
  created_date TIMESTAMP NOT NULL
);

CREATE TYPE notification_type_enum AS ENUM (
  'welcomeAccount',
  'welcomeCompetition',
  'withdrawal',
  'name',
  'site',
  'deadline',
  'teamStatus',
  'cheer',
  'invite',
  'staffAccount'
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  
  user_id INT NOT NULL REFERENCES users (id),
  team_id INT REFERENCES competition_teams (id),
  competition_id INT REFERENCES competitions (id),
  type notification_type_enum NOT NULL,
  message TEXT NOT NULL,
  created_date TIMESTAMP NOT NULL,
  
  team_name TEXT,
  student_name TEXT,
  competition_name TEXT,
  new_team_name TEXT,
  site_location TEXT
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  
  name TEXT NOT NULL, -- Full Name of course including any course codes

  category course_category_enum,
  
  competition_id INT NOT NULL REFERENCES competitions (id),
  university_id INT NOT NULL REFERENCES universities (id),

  CONSTRAINT unique_course UNIQUE (competition_id, university_id, category)
);


CREATE OR REPLACE FUNCTION competition_list(u_id INT)
RETURNS TABLE(id INT, name TEXT, created_date TIMESTAMP, early_reg_deadline TIMESTAMP, general_reg_deadline TIMESTAMP)
AS $$
  SELECT c.id AS id, c.name AS name, created_date, early_reg_deadline, general_reg_deadline
  FROM competition_users as cu
  JOIN competitions AS c ON c.id = cu.competition_id
  WHERE cu.user_id = u_id AND cu.access_level = 'Accepted' :: competition_access_enum;
$$ LANGUAGE sql;

CREATE OR REPLACE VIEW user_profile_info AS
SELECT u.id AS id, u.name, preferred_name, email, uni.name AS affiliation, gender,
      pronouns, tshirt_size, allergies, dietary_reqs, accessibility_reqs
FROM users AS u
JOIN universities AS uni ON uni.id = u.university_id;

CREATE OR REPLACE VIEW user_dash_info AS
SELECT u.id AS id, 
      COALESCE(u.preferred_name, u.name) AS preferred_name, 
      uni.name AS affiliation
FROM users AS u
JOIN universities AS uni ON uni.id = u.university_id;

CREATE OR REPLACE FUNCTION competition_coach_students(u_id INT, c_id INT)
RETURNS TABLE(
  "userId" INT,
  "universityId" INT, 
  "universityName" TEXT,
  "name" TEXT,
  "preferredName" TEXT,
  "email" TEXT,
  "sex" TEXT,
  "pronouns" TEXT,
  "tshirtSize" TEXT,
  "allergies" TEXT,
  "dietaryReqs" TEXT,
  "accessibilityReqs" TEXT,
  "studentId" TEXT,
  "roles" JSONB,
  "bio" TEXT,
  "ICPCEligible" BOOLEAN,
  "boersenEligible" BOOLEAN,
  "level" JSONB,
  "degreeYear" INT,
  "degree" TEXT,
  "isRemote" BOOLEAN,
  "isOfficial" BOOLEAN,
  "preferredContact" TEXT,
  "nationalPrizes" TEXT,
  "internationalPrizes" TEXT,
  "codeforcesRating" INT,
  "universityCourses" JSONB,
  "pastRegional" BOOLEAN,
  "status" TEXT,
  "teamName" TEXT,
  "siteName" TEXT,
  "siteId" INT
)
AS $$
  SELECT
    u.id AS "userId",
    u.university_id AS "universityId",
    uni.name AS "universityName",
    u.name AS "name",
    u.preferred_name AS "preferredName",
    u.email AS "email",
    u.gender AS "sex",
    u.pronouns AS "pronouns",
    u.tshirt_size AS "tshirtSize",
    u.allergies AS "allergies",
    u.dietary_reqs AS "dietaryReqs",
    u.accessibility_reqs AS "accessibilityReqs",
    u.student_id AS "studentId",
    TO_JSONB(cu.competition_roles) AS "roles",
    cu.bio AS "bio",
    cu.icpc_eligible AS "ICPCEligible",
    cu.boersen_eligible AS "boersenEligible",
    TO_JSONB(cu.competition_level) AS "level",
    cu.degree_year AS "degreeYear",
    cu.degree AS "degree",
    cu.is_remote AS "isRemote",
    cu.is_official AS "isOfficial",
    cu.preferred_contact AS "preferredContact",
    cu.national_prizes AS "nationalPrizes",
    cu.international_prizes AS "internationalPrizes",
    cu.codeforces_rating AS "codeforcesRating",
    TO_JSONB(cu.university_courses) AS "universityCourses",
    cu.past_regional AS "pastRegional",
    'Matched' AS "status",
    (CASE WHEN ct.pending_name IS NULL THEN ct.name ELSE ct.pending_name END) AS "teamName",
    cs.name AS "siteName",
    cs.id AS "siteId"
  FROM competition_users AS cu_coach
  JOIN users AS u_coach ON cu_coach.user_id = u_coach.id
  JOIN competition_users AS cu ON cu.competition_coach_id = cu_coach.id
  JOIN users AS u ON u.id = cu.user_id
  JOIN universities AS uni ON uni.id = u.university_id
  JOIN competition_teams AS ct ON u.id = ANY(ct.participants) AND ct.competition_id = cu.competition_id
  JOIN competition_sites AS cs ON cs.id = ct.site_attending_id
  WHERE cu.competition_id = c_id AND cu_coach.user_id = u_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION competition_admin_students(c_id INT)
RETURNS TABLE(
  "userId" INT,
  "universityId" INT, 
  "universityName" TEXT,
  "name" TEXT,
  "preferredName" TEXT,
  "email" TEXT,
  "sex" TEXT,
  "pronouns" TEXT,
  "tshirtSize" TEXT,
  "allergies" TEXT,
  "dietaryReqs" TEXT,
  "accessibilityReqs" TEXT,
  "studentId" TEXT,
  "roles" JSONB,
  "bio" TEXT,
  "ICPCEligible" BOOLEAN,
  "boersenEligible" BOOLEAN,
  "level" JSONB,
  "degreeYear" INT,
  "degree" TEXT,
  "isRemote" BOOLEAN,
  "isOfficial" BOOLEAN,
  "preferredContact" TEXT,
  "nationalPrizes" TEXT,
  "internationalPrizes" TEXT,
  "codeforcesRating" INT,
  "universityCourses" JSONB,
  "pastRegional" BOOLEAN,
  "status" TEXT,
  "teamName" TEXT,
  "siteName" TEXT,
  "siteId" INT
)
AS $$
  SELECT
    u.id AS "userId",
    u.university_id AS "universityId",
    uni.name AS "universityName",
    u.name AS "name",
    u.preferred_name AS "preferredName",
    u.email AS "email",
    u.gender AS "sex",
    u.pronouns AS "pronouns",
    u.tshirt_size AS "tshirtSize",
    u.allergies AS "allergies",
    u.dietary_reqs AS "dietaryReqs",
    u.accessibility_reqs AS "accessibilityReqs",
    u.student_id AS "studentId",
    TO_JSONB(cu.competition_roles) AS "roles",
    cu.bio AS "bio",
    cu.icpc_eligible AS "ICPCEligible",
    cu.boersen_eligible AS "boersenEligible",
    TO_JSONB(cu.competition_level) AS "level",
    cu.degree_year AS "degreeYear",
    cu.degree AS "degree",
    cu.is_remote AS "isRemote",
    cu.is_official AS "isOfficial",
    cu.preferred_contact AS "preferredContact",
    cu.national_prizes AS "nationalPrizes",
    cu.international_prizes AS "internationalPrizes",
    cu.codeforces_rating AS "codeforcesRating",
    TO_JSONB(cu.university_courses) AS "universityCourses",
    cu.past_regional AS "pastRegional",
    'Matched' AS "status",
    (CASE WHEN ct.pending_name IS NULL THEN ct.name ELSE ct.pending_name END) AS "teamName",
    cs.name AS "siteName",
    cs.id AS "siteId"
  FROM competition_users AS cu
  JOIN users AS u ON u.id = cu.user_id
  JOIN universities AS uni ON uni.id = u.university_id
  JOIN competition_teams AS ct ON u.id = ANY(ct.participants) AND ct.competition_id = cu.competition_id
  JOIN competition_sites AS cs ON cs.id = ct.site_attending_id
  WHERE cu.competition_id = c_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION competition_staff(c_id INT)
RETURNS TABLE(
  "userId" INT,
  "universityId" INT,
  "universityName" TEXT,
  "name" TEXT,
  "email" TEXT,
  "sex" TEXT,
  "pronouns" TEXT,
  "tshirtSize" TEXT,
  "allergies" TEXT,
  "dietaryReqs" TEXT,
  "accessibilityReqs" TEXT,
  "userAccess" TEXT,
  "bio" TEXT,
  "roles" JSONB,
  "access" competition_access_enum
)
AS $$
  SELECT
    u.id AS "userId",
    u.university_id AS "universityId",
    uni.name AS "universityName",
    u.name AS "name",
    u.email AS "email",
    u.gender AS "sex",
    u.pronouns AS "pronouns",
    u.tshirt_size AS "tshirtSize",
    u.allergies AS "allergies",
    u.dietary_reqs AS "dietaryReqs",
    u.accessibility_reqs AS "accessibilityReqs",
    u.user_access AS "userAccess",
    cu.bio AS "bio",
    TO_JSONB(cu.competition_roles) AS "roles",
    cu.access_level AS "access"
  FROM competition_users AS cu
  JOIN users AS u ON cu.user_id = u.id
  JOIN universities AS uni ON uni.id = u.university_id
  WHERE cu.competition_id = c_id AND cu.competition_roles <> ARRAY['Participant']::competition_role_enum[];
$$ LANGUAGE sql;

CREATE OR REPLACE VIEW competition_team_details AS
SELECT cu_source.user_id AS src_user_id,
  cu_source.competition_id AS src_competition_id, u_coach.id AS coach_user_id,
  ct.site_attending_id AS src_site_attending_id,
  c.name AS "compName", ct.id AS "teamId", ct.university_id AS "universityId",
  (ct.pending_name IS NULL) AS "teamNameApproved", ct.team_status AS "status",
  (CASE WHEN ct.pending_name IS NULL THEN ct.name ELSE ct.pending_name END) AS "teamName",
  (ct.pending_site_attending_id IS NULL) AS "siteApproved",
  cs.name AS "teamSite", ct.team_seat AS "teamSeat",
  (CASE WHEN
    cu1.competition_level = 'Level A'
    AND cu2.competition_level = 'Level A'
    AND cu3.competition_level = 'Level A'
  THEN 'Level A'
  ELSE 'Level B' END 
  ) AS "teamLevel", c.start_date AS "startDate",
  JSON_BUILD_ARRAY(
    JSON_BUILD_OBJECT(
      'userId', u1.id,
      'name', u1.name,
      'preferredName', u1.preferred_name,
      'sex', u1.gender,
      'email', u1.email,
      'bio', cu1.bio,
      'preferredContact', cu1.preferred_contact,
      'ICPCEligible', cu1.icpc_eligible,
      'level', cu1.competition_level,
      'boersenEligible', cu1.boersen_eligible,
      'isRemote', cu1.is_remote,
      'universityCourses', cu1.university_courses,
      'nationalPrizes', cu1.national_prizes,
      'internationalPrizes', cu1.international_prizes,
      'codeforcesRating', cu1.codeforces_rating,
      'pastRegional', cu1.past_regional
    ),
    JSON_BUILD_OBJECT(
      'userId', u2.id,
      'name', u2.name,
      'preferredName', u2.preferred_name,
      'sex', u2.gender,
      'email', u2.email,
      'bio', cu2.bio,
      'preferredContact', cu2.preferred_contact,
      'ICPCEligible', cu2.icpc_eligible,
      'level', cu2.competition_level,
      'boersenEligible', cu2.boersen_eligible,
      'isRemote', cu2.is_remote,
      'universityCourses', cu2.university_courses,
      'nationalPrizes', cu2.national_prizes,
      'internationalPrizes', cu2.international_prizes,
      'codeforcesRating', cu2.codeforces_rating,
      'pastRegional', cu2.past_regional
    ),
    JSON_BUILD_OBJECT(
      'userId', u3.id,
      'name', u3.name,
      'preferredName', u3.preferred_name,
      'sex', u3.gender,
      'email', u3.email,
      'bio', cu3.bio,
      'preferredContact', cu3.preferred_contact,
      'ICPCEligible', cu3.icpc_eligible,
      'level', cu3.competition_level,
      'boersenEligible', cu3.boersen_eligible,
      'isRemote', cu3.is_remote,
      'universityCourses', cu3.university_courses,
      'nationalPrizes', cu3.national_prizes,
      'internationalPrizes', cu3.international_prizes,
      'codeforcesRating', cu3.codeforces_rating,
      'pastRegional', cu3.past_regional
    )
  ) AS students,
  JSON_BUILD_OBJECT(
    'name', u_coach.name,
    'email', u_coach.email,
    'bio', cu_coach.bio
  ) AS coach

FROM competition_users AS cu_source
JOIN competitions AS c ON c.id = cu_source.competition_id
JOIN competition_teams AS ct ON cu_source.user_id = ANY(ct.participants) AND cu_source.competition_id = ct.competition_id
JOIN competition_sites AS cs ON
  (CASE 
    WHEN ct.pending_site_attending_id IS NULL THEN ct.site_attending_id 
    ELSE ct.pending_site_attending_id 
  END) = cs.id

JOIN competition_users AS cu_coach ON cu_coach.id = ct.competition_coach_id
JOIN users AS u_coach ON u_coach.id = cu_coach.user_id

LEFT JOIN users AS u1 ON u1.id = ct.participants[1]
LEFT JOIN users AS u2 ON u2.id = ct.participants[2]
LEFT JOIN users AS u3 ON u3.id = ct.participants[3]
LEFT JOIN competition_users AS cu1 ON u1.id = cu1.user_id
LEFT JOIN competition_users AS cu2 ON u2.id = cu2.user_id
LEFT JOIN competition_users AS cu3 ON u3.id = cu3.user_id
WHERE (cu1.competition_id = cu_coach.competition_id OR cu1.competition_id IS NULL)
  AND (cu2.competition_id = cu_coach.competition_id OR cu2.competition_id IS NULL)
  AND (cu3.competition_id = cu_coach.competition_id OR cu3.competition_id IS NULL);


CREATE OR REPLACE VIEW competition_attendees AS
SELECT
  ct.competition_id AS competition_id,
  cu.user_id AS "userId",
  uni.id AS "universityId", 
  uni.name AS "universityName",
  u.name AS "name",
  u.preferred_name AS "preferredName",
  u.email AS "email",
  u.gender AS "sex",
  u.pronouns AS "pronouns",
  u.tshirt_size AS "tshirtSize",
  u.dietary_reqs AS "dietaryNeeds",
  u.accessibility_reqs AS "accessibilityNeeds",
  u.allergies AS "allergies",
  u.student_id AS "studentId",
  cu.competition_roles AS "roles",
  cu.bio AS "bio",
  cu.icpc_eligible AS "ICPCEligible",
  cu.boersen_eligible AS "boersenEligible",
  cu.competition_level AS "level",
  cu.degree_year AS "degreeYear",
  cu.degree AS "degree",
  cu.is_remote AS "isRemote",
  cu.is_official AS "isOfficial",
  cu.preferred_contact AS "preferredContact",
  cu.national_prizes AS "nationalPrizes",
  cu.international_prizes AS "internationalPrizes",
  cu.codeforces_rating AS "codeforcesRating",
  cu.university_courses AS "universityCourses",
  cu.past_regional AS "pastRegional",
  cu.access_level AS "status",
  ct.site_attending_id AS "siteId",
  ct.pending_site_attending_id AS "pendingSiteId",
  ct.team_seat AS "teamSeat",
  cs.name AS "siteName",
  cs_pending.name AS "pendingSiteName",
  cs.capacity AS "siteCapacity",
  cs_pending.capacity AS "pendingSiteCapacity"

FROM competition_teams AS ct
JOIN universities AS uni ON uni.id = ct.university_id
JOIN users AS u ON u.id = ANY(ct.participants)
JOIN competition_users AS cu ON cu.user_id = u.id AND cu.competition_id = ct.competition_id
LEFT JOIN competition_sites AS cs ON cs.id = ct.site_attending_id
LEFT JOIN competition_sites AS cs_pending ON cs_pending.id = ct.pending_site_attending_id;


INSERT INTO universities (name) 
VALUES 
('University of Melbourne'),
('Monash University'),
('RMIT University'),
('University of Sydney'),
('University of New South Wales');


INSERT INTO users (
  name,
  preferred_name,
  email,
  hashed_password,
  gender,
  pronouns,
  tshirt_size,
  allergies,
  dietary_reqs,
  accessibility_reqs,
  user_type,
  university_id,
  student_id,
  user_access)
VALUES
( -- id: 1
  'System Admin',
  'Admin',
  'admin@example.com',
  '$2a$10$xeAb1BWjYheI6OIcv07RJOmFRvQtV0cTnbrmt2thWO.RWL7OwEbhO',
  'M',
  'he/him',
  'ML',
  'Peanuts',
  '{}',
  'None',
  'system_admin',
  1,
  NULL,
  'Accepted'), -- password is 'admin'
( -- id: 2
  'Coach 1',
  'Coach One',
  'coach@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'MXL',
  'None',
  '{}',
  'Stairs Access',
  'staff',
  2,
  NULL,
  'Accepted'), -- password is 'pleasechange'
( -- id: 3
  'Algorithm Coach',
  'Algorithm',
  'raveen@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'MXL',
  'None',
  '{}',
  'Stairs Access',
  'staff',
  5,
  NULL,
  'Accepted'), -- password is 'pleasechange'
( -- id: 4
  'Site Coordinator 1',
  'Site Coord One',
  'testsitecoor1@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'MXL',
  'None',
  '{}',
  'Stairs Access',
  'staff',
  2,
  NULL,
  'Accepted'), -- password is 'pleasechange'
( -- id: 5
  'New User',
  'New User',
  'student@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'MS',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000001',
  'Accepted'),
( -- id: 6
  'Test Student Account 2',
  'Test Account',
  'teststudent2@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'MS',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000002',
  'Accepted'),
( -- id: 7
  'Test Student Account 3',
  'Test Account',
  'teststudent3@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'MS',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000003',
  'Accepted'),
( -- id: 8
  'Test Student Account 4',
  'Test Account',
  'teststudent4@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'MS',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000004',
  'Accepted'),
( -- id: 9
  'Test Student Account 5',
  'Test Account',
  'teststudent5@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'MS',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000005',
  'Accepted'),
( -- id: 10
  'Test Student Account 6',
  'Test Account',
  'teststudent6@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'MS',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000006',
  'Accepted'),
( -- id: 11
  'Coach 3',
  'Coach Three',
  'testcoach3@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'MXL',
  'None',
  '{}',
  'Stairs Access',
  'staff',
  3,
  NULL,
  'Accepted'), -- password is 'pleasechange'
( -- id: 12
  'Test Student Account 7',
  'Test Account',
  'teststudent7@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'MS',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000007',
  'Accepted'),
( -- id: 13
  'Test Student Account 8',
  'Test Account',
  'teststudent8@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'MS',
  'Nuts and Pumpkin',
  '',
  'Wheelchair Access',
  'student',
  2,
  'z000008',
  'Accepted'),
( -- id: 14
  'Test Student Account 9',
  'Test Account',
  'teststudent9@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'MXL',
  'None',
  '{}',
  'Accepted',
  'student',
  2,
  'z000009',
  'Accepted'); --- password is pleasechange

-- Competitions
INSERT INTO competitions (name, team_size, created_date, early_reg_deadline, general_reg_deadline, code, start_date, region, information)
VALUES 
('South Pacific Preliminary Contest 2024', 3, '2024-06-30 00:00:00', '2024-08-29 00:00:00', '2024-08-31 00:00:00', 'SPPR2024', '2025-09-30 00:00:00', 'Australia',
  'This form is for registering to participate in the 2024 South Pacific ICPC Preliminary Contest.
  The Preliminary Contest will be held on 31st August 2024, and the top qualifying teams will progress to the Regional Finals,
  to be held in Sydney on 19th and 20th October 2024. The full qualification rules can be found at: [sppcontests.org/regional-qualification-rules](https://sppcontests.org/regional-qualification-rules/).
  A team is official if all three team members meet the ICPC eligibility rules.
  The full eligibility rules can be found at: [icpc.global/regionals/rules](https://icpc.global/regionals/rules/),
  but the most notable criteria are:
  - enrolled in a degree program at the team''s institution (in particular, high school teams are unofficial)
  - taking at least 1/2 load, or co-op, exchange or intern student
  - have not competed in two ICPC World Finals
  - have not competed in ICPC regional contests in five different years
  - commenced post-secondary studies in 2020 or later OR born in 2001 or later
  Official teams will be charged a registration fee of $100, typically paid by the institution.
  Each team member will receive a T-shirt if the team is registered in this form and on [icpc.global](https://icpc.global) by 31st July 2024.
  Unofficial (including high school) teams are not charged any registration fee,
  will not receive T-shirts, and do not need to be registered on icpc.global.
  To help check eligibility, every official competitor must use the email address
  associated with their institution of study, and must also provide the email address that is linked to their icpc.global account.
  Additionally, all teams must choose whether to compete in Level A or Level B.
  - The Level A problem set will be significantly more challenging than the
    Level B problem set and is designed to differentiate between the best teams in the region.
  - The Level B problem set is aimed towards less experienced teams.
  - There will be awards for the top teams in each Level. Only teams competing
    in Level A will be considered for qualification to Regional Finals.
  If you have not previously competed in Regional Finals nor had a top 10 result in the 2024 SPAR contests,
  we strongly advise you to register for Level B.'
),
('South Pacific Regional Contest 2024', 3, '2024-08-31 00:00:00', '2024-10-20 00:00:00', '2024-10-20 00:00:00', 'SPRG2024', '2025-09-30 00:00:00', 'Australia', ''),
('ICPC World Final', 3, '2024-10-10 00:00:00', '2025-09-10 00:00:00', '2025-09-11 00:00:00', 'WF2025', '2025-09-30 00:00:00', 'Earth', '');

-- Competition Sites
INSERT INTO competition_sites (competition_id, university_id, name, capacity)
VALUES 
(1, 1, 'Library', 100),
(2, 2, 'Computer Science Building', 150),
(3, 5, 'K7', 300),
(2, 5, 'K7', 300);

-- Competition Admin(s)
INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level)
VALUES
(1, 1, ARRAY['Admin']::competition_role_enum[], 'Accepted'),
(1, 2, ARRAY['Admin']::competition_role_enum[], 'Accepted'),
(1, 3, ARRAY['Admin']::competition_role_enum[], 'Accepted');

-- Competition Coach(es)
INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level, bio)
VALUES
(2, 1, ARRAY['Coach']::competition_role_enum[], 'Accepted', 'epic bio'),
(2, 2, ARRAY['Coach']::competition_role_enum[], 'Accepted', 'epic bio'),
(2, 3, ARRAY['Coach']::competition_role_enum[], 'Accepted', 'epic bio');

-- Competition Site Coordinator(s)
INSERT INTO competition_users (user_id, competition_id, competition_roles, site_id, access_level)
VALUES
(4, 1, ARRAY['Site-Coordinator']::competition_role_enum[], 1, 'Accepted');


-- Competition Participants
INSERT INTO competition_users (
  user_id, competition_id, competition_roles,
  competition_coach_id,
  icpc_eligible,
  competition_level,
  boersen_eligible,
  degree_year,
  degree,
  is_remote,
  national_prizes,
  international_prizes,
  codeforces_rating,
  university_courses,
  past_regional,
  is_official,
  preferred_contact,
  bio,
  access_level
)
VALUES
    (5, 1, ARRAY['Participant']::competition_role_enum[], 4,  TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Email:example@email.com', 'epic bio', 'Accepted' :: competition_access_enum),
    (6, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Discord:fdc234', 'epic bio', 'Accepted' :: competition_access_enum ),
    (7, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Phone:0413421311', 'epic bio', 'Accepted' :: competition_access_enum),
    (8, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Minecraft:EpicMan123', 'epic bio', 'Accepted' :: competition_access_enum),
    (9, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Roblox: epicerrMan123', 'epic bio', 'Accepted' :: competition_access_enum),
    (10, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'faxMachineNumber:98531234', 'epic bio', 'Accepted' :: competition_access_enum),
    (12, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'faxMachineNumber:98531234', 'epic bio', 'Accepted' :: competition_access_enum),
    (13, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Phone:0402067382', 'epic bio', 'Accepted' :: competition_access_enum),
    (14, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Email:anotherexample@email.com', 'epic bio', 'Accepted' :: competition_access_enum);
  

-- Non-access coaches
INSERT INTO competition_users (user_id, competition_id, competition_roles, site_id, access_level)
VALUES
(3, 1, ARRAY['Coach']::competition_role_enum[], 1, 'Pending'),
(11, 1, ARRAY['Coach']::competition_role_enum[], 1, 'Rejected');

-- Competition Teams
INSERT INTO competition_teams (
  competition_coach_id, name, team_status, pending_name,
  team_size, participants, university_id, competition_id, team_seat, site_attending_id, pending_site_attending_id
)
VALUES
(4, 'Bulbasaur', 'Registered'::competition_team_status, NULL, 3, ARRAY[8, 9, 10], 2, 1, 'Bongo11', 1, NULL),
(4, 'Ivysaur', 'Pending'::competition_team_status, 'Charmander', 3, ARRAY[5, 7], 2, 1, 'Tabla01', 1, NULL),
(4, 'Venusaur', 'Unregistered'::competition_team_status, 'Charmeleon', 3, ARRAY[12, 13, 14], 2, 1, 'Organ20', 1, 4),
(4, 'Super Team', 'Pending'::competition_team_status, 'No', 3, ARRAY[6], 2, 1, 'Tabla02', 1, NULL);

-- Notifications
INSERT INTO notifications (
  user_id, team_id, competition_id, type, message, created_date,
  team_name, student_name, competition_name, new_team_name, site_location
)
VALUES 
(
  5, NULL, NULL, 'welcomeCompetition'::notification_type_enum, 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  5, NULL, NULL, 'welcomeAccount'::notification_type_enum, 'Welcome to TeamUP!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  6, NULL, NULL, 'welcomeCompetition'::notification_type_enum, 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  7, NULL, NULL, 'welcomeCompetition'::notification_type_enum, 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  8, NULL, NULL, 'welcomeCompetition'::notification_type_enum, 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  9, NULL, NULL, 'welcomeCompetition'::notification_type_enum, 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  10, NULL, NULL, 'welcomeCompetition'::notification_type_enum, 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
);


-- Algorithm 
INSERT INTO competitions (name, team_size, created_date, early_reg_deadline, general_reg_deadline, code, start_date, region)
VALUES
('Algorithm Testing', 3, '2024-06-30 00:00:00', '2024-08-29 00:00:00', '2024-08-31 00:00:00', 'ALG2024', '2025-09-30 00:00:00', 'Australia');

INSERT INTO competition_sites (competition_id, university_id, name, capacity)
VALUES 
(4, 5, 'J17 K17 Building UNSW', 100),
(1, 2, 'Ainsworth Building', 100),
(1, 3, 'Krusty Krab', 100),
(1, 4, 'Spooky Manor', 100),
(1, 5, 'Mickey Mouse Clubhouse', 100);
-- (4, 2, 'afternoon chance some', 100),
-- (4, 2, 'charge back finish', 100),
-- (4, 2, 'chemical captured choose', 100),
-- (4, 2, 'J17 K17 Building UNSW', 100);

INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level, bio)
VALUES
(1, 4, ARRAY['Admin']::competition_role_enum[], 'Accepted', 'epic bio'),
(3, 4, ARRAY['Coach']::competition_role_enum[], 'Accepted', 'Hi Im Raveen');

INSERT INTO users (
  name,
  preferred_name,
  email,
  hashed_password,
  gender,
  pronouns,
  tshirt_size,
  allergies,
  dietary_reqs,
  accessibility_reqs,
  user_type,
  university_id,
  student_id,
  user_access)
VALUES
-- Member from Team ID: 2
( 
  'AR',
  'AR',
  'ar@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000002',
  'Accepted'
),

-- Member from Team ID: 3, Member 1
(
  'AK',
  'AK',
  'ak@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000003',
  'Accepted'
),

-- Member from Team ID: 3, Member 2
(
  'YF',
  'YF',
  'yf@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000004',
  'Accepted'
),

-- Member from Team ID: 4
(
  'DY',
  'DY',
  'dy@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000005',
  'Accepted'
),

-- Member from Team ID: 5, Member 1
(
  'Kass',
  'Kass',
  'kass@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000006',
  'Accepted'
),

-- Member from Team ID: 5, Member 2
(
  'JL',
  'JL',
  'jl@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000007',
  'Accepted'
),

-- Member from Team ID: 6
(
  'HT',
  'HT',
  'ht@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000008',
  'Accepted'
),

-- Member from Team ID: 7
(
  'Boersen#1',
  'Boersen#1',
  'boersen1@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000009',
  'Accepted'
),

-- Member from Team ID: 8
(
  'Boersen#1',
  'Boersen#1',
  'boersen1_dup@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000010',
  'Accepted'
),

-- Member from Team ID: 9
(
  'Boersen#2',
  'Boersen#2',
  'boersen2@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000011',
  'Accepted'
),

-- Member from Team ID: 10
(
  'Boersen#3',
  'Boersen#3',
  'boersen3@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000012',
  'Accepted'
),

-- Member from Team ID: 11
(
  'Boersen#4',
  'Boersen#4',
  'boersen4@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000013',
  'Accepted'
),

-- Member from Team ID: 12
(
  'Algo Student 1',
  'AlgoStu',
  'testingaccount@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000014',
  'Accepted'
),

-- Member from Team ID: 13
(
  'Algo Student 2',
  'AlgoStu2',
  'testingaccount3@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000015',
  'Accepted'
),

-- Member from Team ID: 14
(
  'Algo User 3',
  'New Algo User',
  'algostudent@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'ML',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000016',
  'Accepted'
);

INSERT INTO competition_users (
  user_id, competition_id, competition_roles,
  competition_coach_id,
  icpc_eligible,
  competition_level,
  boersen_eligible,
  degree_year,
  degree,
  is_remote,
  national_prizes,
  international_prizes,
  codeforces_rating,
  university_courses,
  past_regional,
  is_official,
  preferred_contact,
  bio,
  access_level
)
VALUES
  (15, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', FALSE, 3, 'CompSci', FALSE, 'AIO', 'IOI', 2537, ARRAY[]::TEXT[], TRUE, FALSE, 'AR', 'bio for AR', 'Accepted' :: competition_access_enum),
  (16, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', FALSE, 3, 'CompSci', FALSE, 'INOI', '', 2113, ARRAY[]::TEXT[], TRUE, FALSE, 'AK', 'bio for AK', 'Accepted' :: competition_access_enum),
  (17, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', FALSE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], TRUE, FALSE, 'YF', 'bio for YF', 'Accepted' :: competition_access_enum),
  (18, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', FALSE, 3, 'CompSci', FALSE, 'AIO', '', 1624, ARRAY['COMP1511', 'COMP2521', 'COMP3121', 'COMP4128'], TRUE, FALSE, 'DY', 'bio for DY', 'Accepted' :: competition_access_enum),
  (19, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, 'NOI', '', 2848, ARRAY['COMP1511', 'COMP2521', 'COMP3821'], TRUE, FALSE, 'Kass', 'bio for Kass', 'Accepted' :: competition_access_enum),
  (20, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', FALSE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP1511', 'COMP2521'], TRUE, FALSE, 'JL', 'bio for JL', 'Accepted' :: competition_access_enum),
  (21, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, 'NOI', '', 1962, ARRAY['COMP1511', 'COMP2521'], TRUE, FALSE, 'HT', 'bio for HT', 'Accepted' :: competition_access_enum),
  (22, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP1511', 'COMP2521', 'COMP3121', 'COMP4128'], TRUE, FALSE, 'Boersen#1', 'bio for Boersen#1', 'Accepted' :: competition_access_enum),
  (23, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP1511', 'COMP2521', 'COMP3121', 'COMP4128'], TRUE, FALSE, 'Boersen#1', 'bio for Boersen#1', 'Accepted' :: competition_access_enum),
  (24, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP3121', 'COMP4128'], TRUE, FALSE, 'Boersen#2', 'bio for Boersen#2', 'Accepted' :: competition_access_enum),
  (25, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP2521'], TRUE, FALSE, 'Boersen#3', 'bio for Boersen#3', 'Accepted' :: competition_access_enum),
  (26, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP1511'], TRUE, FALSE, 'Boersen#4', 'bio for Boersen#4', 'Accepted' :: competition_access_enum),
  (27, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP2521'], TRUE, FALSE, 'Testing Account', 'bio for Testing Account', 'Accepted' :: competition_access_enum),
  (28, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP4128'], TRUE, FALSE, 'Testing Account 3', 'bio for Testing Account 3', 'Accepted' :: competition_access_enum);
  

INSERT INTO competition_teams (
  competition_coach_id, 
  name, 
  team_status, 
  pending_name,
  team_size, 
  participants, 
  university_id, 
  competition_id, 
  team_seat,
  site_attending_id
)
VALUES
  (20, 'Bulbasaur', 'Pending'::competition_team_status, NULL, 1, ARRAY[15], 5, 4, 'bongo11', 2),
  (20, 'Ivysaur', 'Pending'::competition_team_status, NULL, 2, ARRAY[16, 17], 5, 4, 'bongo14', 2),
  (20, 'Venusaur', 'Pending'::competition_team_status, NULL, 1, ARRAY[18], 5, 4, 'bongo17', 2),
  (20, 'Charmander', 'Pending'::competition_team_status, NULL, 2, ARRAY[19, 20], 5, 4, 'bongo20', 2),
  (20, 'Charmeleon', 'Pending'::competition_team_status, NULL, 1, ARRAY[21], 5, 4, 'bongo23', 2),
  (20, 'Charizard', 'Pending'::competition_team_status, NULL, 1, ARRAY[22], 5, 4, 'bongo26', 2),
  (20, 'Squirtle', 'Pending'::competition_team_status, NULL, 1, ARRAY[23], 5, 4, 'bongo29', 2),
  (20, 'Wartortle', 'Pending'::competition_team_status, NULL, 1, ARRAY[24], 5, 4, 'bongo32', 2),
  (20, 'Blastoise', 'Pending'::competition_team_status, NULL, 1, ARRAY[25], 5, 4, 'bongo35', 2),
  (20, 'Caterpie', 'Pending'::competition_team_status, NULL, 1, ARRAY[26], 5, 4, 'bongo38', 2),
  (20, 'Metapod', 'Pending'::competition_team_status, NULL, 1, ARRAY[27], 5, 4, 'bongo41', 2),
  (20, 'Butterfree', 'Pending'::competition_team_status, NULL, 1, ARRAY[28], 5, 4, 'bongo44', 2);

-- Delete after demo
INSERT INTO competition_users (
  user_id, competition_id, competition_roles,
  competition_coach_id,
  icpc_eligible,
  competition_level,
  boersen_eligible,
  degree_year,
  degree,
  is_remote,
  national_prizes,
  international_prizes,
  codeforces_rating,
  university_courses,
  past_regional,
  is_official,
  preferred_contact,
  bio, 
  access_level
)
VALUES
    (15, 1, ARRAY['Participant']::competition_role_enum[], 4,  TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Email:example@email.com', 'epic bio', 'Accepted' :: competition_access_enum),
    (16, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Discord:fdc234', 'epic bio', 'Accepted' :: competition_access_enum),
    (17, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Phone:0413421311', 'epic bio', 'Accepted' :: competition_access_enum),
    (18, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Minecraft:EpicMan123', 'epic bio', 'Accepted' :: competition_access_enum),
    (19, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Roblox: epicerrMan123', 'epic bio', 'Accepted' :: competition_access_enum),
    (20, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'faxMachineNumber:98531234', 'epic bio', 'Accepted' :: competition_access_enum);
  
INSERT INTO competition_teams (
  competition_coach_id, name, team_status, pending_name,
  team_size, participants, university_id, competition_id, team_seat, site_attending_id, pending_site_attending_id
)
VALUES
(4, 'Charizard', 'Unregistered'::competition_team_status, NULL, 3, ARRAY[15, 16, 17], 5, 1, 'Bongo11', 2, NULL),
(4, 'Wimpod', 'Unregistered'::competition_team_status, 'Snorlax', 3, ARRAY[18, 19, 20], 5, 1, 'Organ20', 2, 4);

INSERT INTO competition_registration_toggles (
  competition_id, university_id,
  enable_codeforces_field, enable_national_prizes_field,
  enable_international_prizes_field, enable_regional_participation_field
)
VALUES (4, 5, TRUE, TRUE, FALSE, TRUE);

INSERT INTO courses (name, category, university_id, competition_id)
VALUES
('COMP1511 Programming Fundamentals', 'Introduction' :: course_category_enum, 5, 1),
('COMP2521 Data Structures and Algorithms', 'Data Structures' :: course_category_enum, 5, 1),
('COMP3121 Algorithm Design or COMP 3821 Extended Algorithm Design', 'Algorithm Design' :: course_category_enum, 5, 1),
('COMP4128 Programming Challenges', 'Programming Challenges' :: course_category_enum, 5, 1);
