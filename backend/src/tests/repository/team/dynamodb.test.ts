import { DynamoDBTeamRepository } from '../../../repository/team/dynamodb';
// import AWS from "aws-sdk";
import { Team } from '../../../model/team_model';

// Mock the AWS DynamoDB client
jest.mock('aws-sdk', () => {
    return {
        DynamoDB: jest.fn(() => ({
            getItem: jest.fn()
        }))
    };
});

describe('DynamoDBTeamRepository - create', () => {
    describe('should create a team and return it', () => {
        it('input random team id', async () => {
            // Mock the putItem method of DynamoDB to succeed
            const putItemMock = jest.fn().mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({})
            }));
            const DynamoDBMock = require('aws-sdk').DynamoDB;
            DynamoDBMock.mockImplementation(() => ({
                putItem: putItemMock
            }));
    
            // Create an instance of the DynamoDBTeamRepository
            const repository = new DynamoDBTeamRepository(new DynamoDBMock());
    
            // Create a sample team object
            const team: Team = {
                id: "can be anything!",            // string: The id of the team - can put any string in here
                name: "3456",                      // string: The name of the team
                email: "aaa@gmail.com",            // string: The email address of the team
                image: "abcxyz.com2",              // string: The URL of the team's profile image
                createdAt: new Date(),
                modifiedAt: new Date()
            };
    
            // Call the create method with the sample team
            const createdTeam = await repository.create(team);
    
            // Assert that the returned team member matches the input team
            expect(createdTeam?.name).toEqual(team.name);
            expect(createdTeam?.email).toEqual(team.email);
            expect(createdTeam?.image).toEqual(team.image);
            expect(createdTeam?.createdAt).toEqual(team.createdAt);
            expect(createdTeam?.modifiedAt).toEqual(team.modifiedAt);
    
            // Except from team id as we are now do not take in id input by user
            expect(createdTeam?.id).not.toEqual(team.name);
        });

        it('input no team id', async () => {
            // Mock the putItem method of DynamoDB to succeed
            const putItemMock = jest.fn().mockImplementation(() => ({
                promise: jest.fn().mockResolvedValue({})
            }));
            const DynamoDBMock = require('aws-sdk').DynamoDB;
            DynamoDBMock.mockImplementation(() => ({
                putItem: putItemMock
            }));
    
            // Create an instance of the DynamoDBTeamRepository
            const repository = new DynamoDBTeamRepository(new DynamoDBMock());
    
            // Create a sample team object
            const team = {
                id: "",                            // string: The id of the team - can be empty
                name: "3456",                      // string: The name of the team
                email: "aaa@gmail.com",            // string: The email address of the team
                image: "abcxyz.com2",              // string: The URL of the team's profile image
                createdAt: new Date(),
                modifiedAt: new Date()
            };
    
            // Call the create method with the sample team
            const createdTeam = await repository.create(team);
    
            // Assert that the returned team matches the input team 
            expect(createdTeam?.name).toEqual(team.name);
            expect(createdTeam?.email).toEqual(team.email);
            expect(createdTeam?.image).toEqual(team.image);
            expect(createdTeam?.createdAt).toEqual(team.createdAt);
            expect(createdTeam?.modifiedAt).toEqual(team.modifiedAt);
        });
    })
});
