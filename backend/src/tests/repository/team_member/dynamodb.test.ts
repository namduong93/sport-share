// import { DynamoDBTeamMemberRepository } from '../../../repository/team_member/dynamodb';
// import { TeamMember } from '../../../model/team_member_model';
// import AWS from "aws-sdk";
// import { Position } from '../../../model/player_stats_model';
// import { User, UserType } from '../../../model/user_model';

// describe('DynamoDBTeamMemberRepository - convertDB2Model', () => {
//     // Mock data item from DynamoDB
//     const mockValidItem = {
//         tid: { S: "teamId" },
//         sk: { S: "sortKey" },
//         cr: { N: 100 },
//         uuid: { S: "uuid" },
//         na: { S: "John Doe" },
//         em: { S: "john@example.com" },
//         hp: { S: "1234567890" },
//         img: { S: "image-url" },
//         rl: { S: "member" },
//         ca: { S: "2024-06-09T10:00:00.000Z" },
//         ma: { S: "2024-06-09T11:00:00.000Z" },
//         ps: {
//             M: {
//                 pp: { L: [{ S: Position.GOALKEEPER }, { S: Position.MIDFIELDER }] },
//                 gk: { N: 80 },
//                 df: { N: 85 },
//                 at: { N: 90 },
//                 ct: { N: 75 },
//                 ph: { N: 80 },
//                 sp: { N: 95 }
//             }
//         }
//     };

//     it('should convert DynamoDB item to TeamMember object', async () => {
//         const repository = new DynamoDBTeamMemberRepository(new AWS.DynamoDB()); // Assuming AWS.DynamoDB is mocked appropriately
//         const teamMember: TeamMember = await repository.convertDB2Model(mockValidItem);

//         expect(teamMember).toEqual({
//             teamId: "teamId",
//             meta: "sortKey",
//             credit: 100,
//             uuid: "uuid",
//             name: "John Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             role: "member",
//             playerStats: {
//                 preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                 goalkeeping: 80,
//                 defense: 85,
//                 attack: 90,
//                 control: 75,
//                 physique: 80,
//                 speed: 95
//             },
//             createdAt: new Date("2024-06-09T10:00:00.000Z"),
//             modifiedAt: new Date("2024-06-09T11:00:00.000Z")
//         });
//     });

//     const mockInvalidItem = {};

//     it('should handle missing or invalid properties in DynamoDB item', async () => {
//         const repository = new DynamoDBTeamMemberRepository(new AWS.DynamoDB()); // Assuming AWS.DynamoDB is mocked appropriately
//         const teamMember: TeamMember = await repository.convertDB2Model(mockInvalidItem);

//         // Expect missing properties to be replaced with default values
//         expect(teamMember.firstName).toBe("");
//         expect(teamMember.lastName).toBe("");
//         expect(teamMember.image).toBe("");
//         expect(teamMember.mobile).toBe("");
//         expect(teamMember.email).toBe("");
//         expect(teamMember.credit).toBe(0);
//         expect(teamMember.meta).toBe("");
//         expect(teamMember.uuid).toBe("");
//         expect(teamMember.teamId).toBe("");
//         expect(teamMember.playerStats).toEqual({
//             preferredPosition: [],
//             goalkeeping: 0,
//             defense: 0,
//             attack: 0,
//             control: 0,
//             physique: 0,
//             speed: 0
//         });
//     });
// });

// describe('DynamoDBTeamMemberRepository - generateSortKey', () => {
//     it('should generate a sort key with the correct format', async () => {
//         const repository = new DynamoDBTeamMemberRepository(new AWS.DynamoDB()); // Assuming AWS.DynamoDB is mocked appropriately
//         const uuid = "abc123"; // Sample UUID

//         const sortKey: string = await repository.generateSortKey(uuid);

//         // Check if the sort key has the correct format
//         expect(sortKey).toMatch(/^uuid#[a-f0-9]+$/); // Sort key format: uuid#[UUID]
//     });
// });

// // Mock the AWS DynamoDB client
// jest.mock('aws-sdk', () => {
//     return {
//         DynamoDB: jest.fn(() => ({
//             getItem: jest.fn()
//         }))
//     };
// });

// describe('DynamoDBTeamMemberRepository - find', () => {
//     it('should return a team member when found', async () => {
//         // Mocked item to be returned by DynamoDB
//         const mockedItem = {
//             Item: {
//                 tid: { S: "teamId" },
//                 sk: { S: "sortKey" },
//                 cr: { N: 100 },
//                 uuid: { S: "uuid" },
//                 na: { S: "John Doe" },
//                 em: { S: "john@example.com" },
//                 hp: { S: "1234567890" },
//                 img: { S: "image-url" },
//                 rl: { S: "member" },
//                 ca: { S: "2024-06-09T10:00:00.000Z" },
//                 ma: { S: "2024-06-09T11:00:00.000Z" },
//                 ps: {
//                     M: {
//                         pp: { L: [{ S: Position.GOALKEEPER }, { S: Position.MIDFIELDER }] },
//                         gk: { N: 80 },
//                         df: { N: 85 },
//                         at: { N: 90 },
//                         ct: { N: 75 },
//                         ph: { N: 80 },
//                         sp: { N: 95 }
//                     }
//                 }
//             }
//         };

//         // Mock the getItem method of DynamoDB to return the mocked item
//         const getItemMock = jest.fn().mockImplementation(() => ({
//             promise: jest.fn().mockResolvedValue(mockedItem)
//         }));
//         const DynamoDBMock = require('aws-sdk').DynamoDB;
//         DynamoDBMock.mockImplementation(() => ({
//             getItem: getItemMock
//         }));

//         // Create an instance of the DynamoDBTeamMemberRepository
//         const repository = new DynamoDBTeamMemberRepository(new DynamoDBMock());

//         // Call the find method with sample teamId and UUID
//         const teamMember = await repository.find("teamId", "uuid");

//         // Assert that the returned team member matches the mocked item
//         expect(teamMember).toEqual({
//             teamId: "teamId",
//             meta: "sortKey",
//             credit: 100,
//             uuid: "uuid",
//             name: "John Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             role: "member",
//             playerStats: {
//                 preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                 goalkeeping: 80,
//                 defense: 85,
//                 attack: 90,
//                 control: 75,
//                 physique: 80,
//                 speed: 95
//             },
//             createdAt: new Date("2024-06-09T10:00:00.000Z"),
//             modifiedAt: new Date("2024-06-09T11:00:00.000Z")
//         });
//     });

//     it('should return null when team member not found', async () => {
//         // Mock the getItem method of DynamoDB to return null
//         const getItemMock = jest.fn().mockImplementation(() => ({
//             promise: jest.fn().mockResolvedValue({ Item: null })
//         }));
//         const DynamoDBMock = require('aws-sdk').DynamoDB;
//         DynamoDBMock.mockImplementation(() => ({
//             getItem: getItemMock
//         }));

//         // Create an instance of the DynamoDBTeamMemberRepository
//         const repository = new DynamoDBTeamMemberRepository(new DynamoDBMock());

//         // Call the find method with sample teamId and UUID
//         const teamMember = await repository.find("teamId", "uuid");

//         // Assert that null is returned when team member is not found
//         expect(teamMember).toBeNull();
//     });
// });

// describe('DynamoDBTeamMemberRepository - create', () => {
//     it('should create a team member and return it', async () => {
//         // Mock the putItem method of DynamoDB to succeed
//         const putItemMock = jest.fn().mockImplementation(() => ({
//             promise: jest.fn().mockResolvedValue({})
//         }));
//         const DynamoDBMock = require('aws-sdk').DynamoDB;
//         DynamoDBMock.mockImplementation(() => ({
//             putItem: putItemMock
//         }));

//         // Create an instance of the DynamoDBTeamMemberRepository
//         const repository = new DynamoDBTeamMemberRepository(new DynamoDBMock());

//         // Create a sample team member object
//         const teamMember: TeamMember = {
//             teamId: "teamId",
//             uuid: "uuid",
//             meta: "sortKey",
//             credit: 100,
//             firstName: "John",
//             lastName: "Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             role: "member",
//             playerStats: {
//                 preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                 defense: 85,
//                 attack: 90,
//                 badmintonRanking: 75
//             },
//             createdAt: new Date(),
//             modifiedAt: new Date()
//         };

//         // Create a mock user object
//         const user: User = {
//             email: "",
//             uuid: "uuid",
//             firstName: "John",
//             lastName: "Doe",
//             role: UserType.USER,
//             preferredName: "",
//             password: "",
//             image: "",
//             token: "",
//             createdAt: "",
//             modifiedAt: "",
//             bio: "",
//             referrer: ""
//         }

//         // Call the create method with the sample team member
//         const createdTeamMember = await repository.create(teamMember, user);

//         // Assert that the returned team member matches the input team member
//         expect(createdTeamMember).toEqual(teamMember);
//     });

//     it('should throw an error when item creation fails', async () => {
//         // Mock the putItem method of DynamoDB to fail
//         const putItemMock = jest.fn().mockImplementation(() => ({
//             promise: jest.fn().mockRejectedValue(new Error('Failed to create item'))
//         }));
//         const DynamoDBMock = require('aws-sdk').DynamoDB;
//         DynamoDBMock.mockImplementation(() => ({
//             putItem: putItemMock
//         }));

//         // Create an instance of the DynamoDBTeamMemberRepository
//         const repository = new DynamoDBTeamMemberRepository(new DynamoDBMock());

//         // Create a sample team member object
//         const teamMember: TeamMember = {
//             teamId: "teamId",
//             uuid: "uuid",
//             meta: "sortKey",
//             credit: 100,
//             firstName: "John",
//             lastName: "Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             role: "admin",
//             playerStats: {
//                 preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                 defense: 85,
//                 attack: 90,
//                 badmintonRanking: 75
//             },
//             createdAt: new Date(),
//             modifiedAt: new Date()
//         };

//         // Create a mock user object
//         const user: User = {
//             email: "bukayo.saka@gmail.com",
//             uuid: "uuid",
//             firstName: "John",
//             lastName: "Doe",
//             role: UserType.USER,
//             preferredName: "John",
//             password: "password",
//             image: "image-url",
//             token: "token",
//             createdAt: "1231",
//             modifiedAt: "1231",
//             bio: "bio",
//             referrer: "referrer"
//         }

//         // Assert that calling the create method throws an error
//         await expect(repository.create(teamMember, user)).rejects.toThrowError('Failed to create item');
//     });
// });

// describe('DynamoDBTeamMemberRepository - update', () => {
//     it('should update a team member and return the updated object', async () => {
//         // Mock the updateItem method of DynamoDB to succeed
//         const updateItemMock = jest.fn().mockImplementation(() => ({
//             promise: jest.fn().mockResolvedValue({
//                 Attributes: {
//                     tid: { S: "teamId" },
//                     sk: { S: "sortKey" },
//                     cr: { N: 100 },
//                     uuid: { S: "uuid" },
//                     na: { S: "John Doe" },
//                     em: { S: "john@example.com" },
//                     hp: { S: "1234567890" },
//                     img: { S: "image-url" },
//                     rl: { S: "member" },
//                     ca: { S: "2024-06-09T10:00:00.000Z" },
//                     ma: { S: "2024-06-09T11:00:00.000Z" },
//                     ps: {
//                         M: {
//                             pp: { L: [{ S: Position.GOALKEEPER }, { S: Position.MIDFIELDER }] },
//                             gk: { N: 80 },
//                             df: { N: 85 },
//                             at: { N: 90 },
//                             ct: { N: 75 },
//                             ph: { N: 80 },
//                             sp: { N: 95 }
//                         }
//                     }
//                 }
//             })
//         }));
//         const DynamoDBMock = require('aws-sdk').DynamoDB;
//         DynamoDBMock.mockImplementation(() => ({
//             updateItem: updateItemMock
//         }));

//         // Create an instance of the DynamoDBTeamMemberRepository
//         const repository = new DynamoDBTeamMemberRepository(new DynamoDBMock());

//         // Create a sample team member object
//         const teamMember: TeamMember = {
//             teamId: "teamId",
//             uuid: "uuid",
//             meta: "sortKey",
//             credit: 100,
//             firstName: "John",
//             lastName: "Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             role: "member",
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
//             modifiedAt: new Date()
//         };

//         // Call the update method with the sample team member
//         const updatedTeamMember = await repository.update(teamMember);

//         // Assert that the returned team member matches the input team member
//         expect(updatedTeamMember).toEqual({
//             teamId: "teamId",
//             meta: "sortKey",
//             credit: 100,
//             uuid: "uuid",
//             name: "John Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             role: "member",
//             playerStats: {
//                 preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                 goalkeeping: 80,
//                 defense: 85,
//                 attack: 90,
//                 control: 75,
//                 physique: 80,
//                 speed: 95
//             },
//             createdAt: new Date("2024-06-09T10:00:00.000Z"),
//             modifiedAt: new Date("2024-06-09T11:00:00.000Z")
//         });
//     });

//     it('should throw an error when item update fails', async () => {
//         // Mock the updateItem method of DynamoDB to fail
//         const updateItemMock = jest.fn().mockImplementation(() => ({
//             promise: jest.fn().mockRejectedValue(new Error('Failed to update item'))
//         }));
//         const DynamoDBMock = require('aws-sdk').DynamoDB;
//         DynamoDBMock.mockImplementation(() => ({
//             updateItem: updateItemMock
//         }));

//         // Create an instance of the DynamoDBTeamMemberRepository
//         const repository = new DynamoDBTeamMemberRepository(new DynamoDBMock());

//         // Create a sample team member object
//         const teamMember: TeamMember = {
//             teamId: "teamId",
//             uuid: "uuid",
//             meta: "sortKey",
//             credit: 100,
//             firstName: "John",
//             lastName: "Doe",
//             email: "john@example.com",
//             mobile: "1234567890",
//             image: "image-url",
//             role: "member",
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
//             modifiedAt: new Date()
//         };

//         // Assert that calling the update method throws an error
//         await expect(repository.update(teamMember)).rejects.toThrowError('Failed to update item');
//     });
// });

// describe('DynamoDBTeamMemberRepository - delete', () => {
//     it('should delete a team member and return true', async () => {
//         // Mock the deleteItem method of DynamoDB to succeed
//         const deleteItemMock = jest.fn().mockImplementation(() => ({
//             promise: jest.fn().mockResolvedValue({})
//         }));
//         const DynamoDBMock = require('aws-sdk').DynamoDB;
//         DynamoDBMock.mockImplementation(() => ({
//             deleteItem: deleteItemMock
//         }));

//         // Create an instance of the DynamoDBTeamMemberRepository
//         const repository = new DynamoDBTeamMemberRepository(new DynamoDBMock());

//         // Call the delete method with sample teamId and UUID
//         const isDeleted = await repository.delete("teamId", "uuid");

//         // Assert that the return value is true
//         expect(isDeleted).toBe(true);
//     });

//     it('should throw an error when item deletion fails', async () => {
//         // Mock the deleteItem method of DynamoDB to fail
//         const deleteItemMock = jest.fn().mockImplementation(() => ({
//             promise: jest.fn().mockRejectedValue(new Error('Failed to delete item'))
//         }));
//         const DynamoDBMock = require('aws-sdk').DynamoDB;
//         DynamoDBMock.mockImplementation(() => ({
//             deleteItem: deleteItemMock
//         }));

//         // Create an instance of the DynamoDBTeamMemberRepository
//         const repository = new DynamoDBTeamMemberRepository(new DynamoDBMock());

//         // Assert that calling the delete method throws an error
//         await expect(repository.delete("teamId", "uuid")).rejects.toThrowError('Failed to delete item');
//     });
// });

// describe('DynamoDBTeamMemberRepository - list', () => {
//     it('should return an array of team members when items are found', async () => {
//         // Mocked items to be returned by DynamoDB
//         const mockedItems = [
//             {
//                 tid: { S: "teamId" },
//                 sk: { S: "sortKey1" },
//                 cr: { N: 100 },
//                 uuid: { S: "uuid1" },
//                 na: { S: "John Doe" },
//                 em: { S: "john@example.com" },
//                 hp: { S: "1234567890" },
//                 img: { S: "image-url1" },
//                 rl: { S: "member" },
//                 ca: { S: "2024-06-09T11:00:00.000Z" },
//                 ma: { S: "2024-06-09T11:00:00.000Z" },
//                 ps: {
//                     M: {
//                         pp: { L: [{ S: Position.GOALKEEPER }, { S: Position.MIDFIELDER }] },
//                         gk: { N: 71 },
//                         df: { N: 71 },
//                         at: { N: 71 },
//                         ct: { N: 71 },
//                         ph: { N: 71 },
//                         sp: { N: 71 }
//                     }
//                 }
//             },
//             {
//                 tid: { S: "teamId" },
//                 sk: { S: "sortKey2" },
//                 cr: { N: 200 },
//                 uuid: { S: "uuid2" },
//                 na: { S: "Jane Smith" },
//                 em: { S: "jane@example.com" },
//                 hp: { S: "9876543210" },
//                 img: { S: "image-url2" },
//                 rl: { S: "member" },
//                 ca: { S: "2024-06-09T12:00:00.000Z" },
//                 ma: { S: "2024-06-09T12:00:00.000Z" },
//                 ps: {
//                     M: {
//                         pp: { L: [{ S: Position.GOALKEEPER }, { S: Position.MIDFIELDER }] },
//                         gk: { N: 72 },
//                         df: { N: 72 },
//                         at: { N: 72 },
//                         ct: { N: 72 },
//                         ph: { N: 72 },
//                         sp: { N: 72 }
//                     }
//                 }
//             },
//             {
//                 tid: { S: "teamId" },
//                 sk: { S: "sortKey3" },
//                 cr: { N: 300 },
//                 uuid: { S: "uuid3" },
//                 na: { S: "Alice Johnson" },
//                 em: { S: "alice@example.com" },
//                 hp: { S: "1112223333" },
//                 img: { S: "image-url3" },
//                 rl: { S: "member" },
//                 ca: { S: "2024-06-09T13:00:00.000Z" },
//                 ma: { S: "2024-06-09T13:00:00.000Z" },
//                 ps: {
//                     M: {
//                         pp: { L: [{ S: Position.GOALKEEPER }, { S: Position.MIDFIELDER }] },
//                         gk: { N: 73 },
//                         df: { N: 73 },
//                         at: { N: 73 },
//                         ct: { N: 73 },
//                         ph: { N: 73 },
//                         sp: { N: 73 }
//                     }
//                 }
//             }
//         ];

//         // Mock the query method of DynamoDB to return the mocked items
//         const queryMock = jest.fn().mockImplementation(() => ({
//             promise: jest.fn().mockResolvedValue({ Items: mockedItems })
//         }));
//         const DynamoDBMock = require('aws-sdk').DynamoDB;
//         DynamoDBMock.mockImplementation(() => ({
//             query: queryMock
//         }));

//         // Create an instance of the DynamoDBTeamMemberRepository
//         const repository = new DynamoDBTeamMemberRepository(new DynamoDBMock());

//         // Call the list method with sample teamId
//         const teamMembers = await repository.list("teamId");

//         // Assert that the returned array contains the expected number of items
//         expect(teamMembers).toHaveLength(3);

//         // Assert that each item in the array matches the expected team member object structure
//         teamMembers.forEach((teamMember: TeamMember, index: number) => {
//             expect(teamMember).toEqual({
//                 teamId: "teamId",
//                 meta: `sortKey${index + 1}`,
//                 credit: (index + 1) * 100,
//                 uuid: `uuid${index + 1}`,
//                 name: ["John Doe", "Jane Smith", "Alice Johnson"][index],
//                 email: ["john@example.com", "jane@example.com", "alice@example.com"][index],
//                 mobile: ["1234567890", "9876543210", "1112223333"][index],
//                 image: ["image-url1", "image-url2", "image-url3"][index],
//                 role: "member",
//                 playerStats: {
//                     preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                     goalkeeping: 70 + index + 1,
//                     defense: 70 + index + 1,
//                     attack: 70 + index + 1,
//                     control: 70 + index + 1,
//                     physique: 70 + index + 1,
//                     speed: 70 + index + 1
//                 },
//                 createdAt: new Date(`2024-06-09T1${index + 1}:00:00.000Z`),
//                 modifiedAt: new Date(`2024-06-09T1${index + 1}:00:00.000Z`)
//             });
//         });
//     });

//     it('should return an empty array when no items are found', async () => {
//         // Mock the query method of DynamoDB to return no items
//         const queryMock = jest.fn().mockImplementation(() => ({
//             promise: jest.fn().mockResolvedValue({ Items: [] })
//         }));
//         const DynamoDBMock = require('aws-sdk').DynamoDB;
//         DynamoDBMock.mockImplementation(() => ({
//             query: queryMock
//         }));

//         // Create an instance of the DynamoDBTeamMemberRepository
//         const repository = new DynamoDBTeamMemberRepository(new DynamoDBMock());

//         // Call the list method with sample teamId
//         const teamMembers = await repository.list("teamId");

//         // Assert that the returned array is empty
//         expect(teamMembers).toEqual([]);
//     });
// });