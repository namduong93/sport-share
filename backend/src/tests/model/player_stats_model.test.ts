// import { before } from "node:test";
// import { Position, ScoreRange, validatePlayerStats } from "../../model/player_stats_model";
// import { TeamMember } from "../../model/team_member_model";



// describe("Player Stats Model", () => {
//     it("should create a valid Player Stats object with correct data", () => {
//         const teamMember = {
//             teamId: "teamId",
//             meta: "sortKey",
//             uuid: "uuid",
//             name: "John Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             credit: 100,
//             playerStats: {
//                 preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                 goalkeeping: 80,
//                 defense: 85,
//                 attack: 90,
//                 control: 75,
//                 physique: 80,
//                 speed: 95
//             },
//             createdAt: new Date(),
//             modifiedAt: new Date(),
//         };
//         expect(teamMember).toBeDefined();
//         expect(teamMember.playerStats).toBeDefined();
//         expect(teamMember.playerStats).toHaveProperty("preferredPosition", [Position.GOALKEEPER, Position.MIDFIELDER]);
//         expect(teamMember.playerStats).toHaveProperty("goalkeeping", 80);
//         expect(teamMember.playerStats).toHaveProperty("defense", 85);
//         expect(teamMember.playerStats).toHaveProperty("attack", 90);
//         expect(teamMember.playerStats).toHaveProperty("control", 75);
//         expect(teamMember.playerStats).toHaveProperty("physique", 80);
//         expect(teamMember.playerStats).toHaveProperty("speed", 95);
//         expect (validatePlayerStats(teamMember.playerStats)).toBe("");
//     });

//     it("player preferredPosition can be empty but can not be unknown", () => {
//         const teamMember1 : TeamMember = {
//             teamId: "teamId",
//             meta: "sortKey",
//             uuid: "uuid",
//             firstName: "John",
//             lastName: "Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             credit: 100,
//             role: "role",
//             playerStats: {
//                 preferredPosition: [],
//                 goalkeeping: 80,
//                 defense: 85,
//                 attack: 90,
//                 control: 75,
//                 physique: 80,
//                 speed: 95
//             },
//             createdAt: new Date(),
//             modifiedAt: new Date(),
//         };
//         const teamMember2 : TeamMember = {
//             teamId: "teamId",
//             meta: "sortKey",
//             uuid: "uuid",
//             firstName: "John",
//             lastName: "Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             credit: 100,
//             role: "role",
//             playerStats: {
//                 preferredPosition: [Position.ATTACKER, Position.DEFENDER, Position.GOALKEEPER, Position.MIDFIELDER],
//                 goalkeeping: 80,
//                 defense: 85,
//                 attack: 90,
//                 control: 75,
//                 physique: 80,
//                 speed: 95
//             },
//             createdAt: new Date(),
//             modifiedAt: new Date(),
//         };
//         expect(teamMember1).toBeDefined();
//         expect(teamMember1).toHaveProperty('playerStats');
//         expect(teamMember1.playerStats).toHaveProperty("preferredPosition", []);
//         expect (validatePlayerStats(teamMember1.playerStats)).toBe("");

//         expect(teamMember2).toBeDefined();
//         expect(teamMember2).toHaveProperty('playerStats');
//         expect(teamMember2.playerStats).toHaveProperty("preferredPosition", [Position.ATTACKER, Position.DEFENDER, Position.GOALKEEPER, Position.MIDFIELDER]);
//         teamMember2.playerStats.preferredPosition.forEach(position => {
//             expect(Object.values(Position)).toContain(position);
//         });
//         expect (validatePlayerStats(teamMember2.playerStats)).toBe("");
//     });
//     it("player score have to be in the range of 0, 100", () => {
//         const teamMember1 : TeamMember = {
//             teamId: "teamId",
//             meta: "sortKey",
//             uuid: "uuid",
//             firstName: "John Doe",
//             lastName: "Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             credit: 100,
//             role: "role",
//             playerStats: {
//                 preferredPosition: [Position.ATTACKER, Position.DEFENDER],
//                 goalkeeping: -1,
//                 defense: -1,
//                 attack: -1,
//                 control: -1,
//                 physique: -1,
//                 speed: -1
//             },
//             createdAt: new Date(),
//             modifiedAt: new Date(),
//         };
//         expect(teamMember1).toBeDefined();
//         expect(teamMember1).toHaveProperty('playerStats');
//         expect(teamMember1.playerStats).toHaveProperty("preferredPosition");
//         teamMember1.playerStats.preferredPosition.forEach(position => {
//             expect(Object.values(Position)).toContain(position);
//         });
//         expect(validatePlayerStats(teamMember1.playerStats)).toBe(`Goalkeeping score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember1.playerStats.goalkeeping = 80;
//         expect(validatePlayerStats(teamMember1.playerStats)).toBe(`Defense score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember1.playerStats.defense = 85;
//         expect(validatePlayerStats(teamMember1.playerStats)).toBe(`Attack score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember1.playerStats.attack = 90;
//         expect(validatePlayerStats(teamMember1.playerStats)).toBe(`Control score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember1.playerStats.control = 75;
//         expect(validatePlayerStats(teamMember1.playerStats)).toBe(`Physique score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember1.playerStats.physique = 80;
//         expect(validatePlayerStats(teamMember1.playerStats)).toBe(`Speed score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember1.playerStats.speed = 95;
//         expect(validatePlayerStats(teamMember1.playerStats)).toBe("");

//         const teamMember2 : TeamMember = {
//             teamId: "teamId",
//             meta: "sortKey",
//             uuid: "uuid",
//             firstName: "John",
//             lastName: "Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             credit: 100,
//             role: "role",
//             playerStats: {
//                 preferredPosition: [Position.ATTACKER, Position.DEFENDER],
//                 goalkeeping: 101,
//                 defense: 101,
//                 attack: 101,
//                 control: 101,
//                 physique: 101,
//                 speed: 101
//             },
//             createdAt: new Date(),
//             modifiedAt: new Date(),
//         };
//         expect(teamMember2).toBeDefined();
//         expect(teamMember2).toHaveProperty('playerStats');
//         expect(teamMember2.playerStats).toHaveProperty("preferredPosition");
//         teamMember2.playerStats.preferredPosition.forEach(position => {
//             expect(Object.values(Position)).toContain(position);
//         });
//         expect(validatePlayerStats(teamMember2.playerStats)).toBe(`Goalkeeping score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember2.playerStats.goalkeeping = 80;
//         expect(validatePlayerStats(teamMember2.playerStats)).toBe(`Defense score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember2.playerStats.defense = 85;
//         expect(validatePlayerStats(teamMember2.playerStats)).toBe(`Attack score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember2.playerStats.attack = 90;
//         expect(validatePlayerStats(teamMember2.playerStats)).toBe(`Control score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember2.playerStats.control = 75;
//         expect(validatePlayerStats(teamMember2.playerStats)).toBe(`Physique score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember2.playerStats.physique = 80;
//         expect(validatePlayerStats(teamMember2.playerStats)).toBe(`Speed score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`);
//         teamMember2.playerStats.speed = 95;
//         expect(validatePlayerStats(teamMember2.playerStats)).toBe("");
//     });
// });