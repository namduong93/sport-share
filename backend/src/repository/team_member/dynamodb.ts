import { TeamMember, validate } from '../../model/team_member_model';
import { TeamMemberRepository } from '../team_member_repository';
import { DDB_TEAM_MEMBERS_TABLE_NAME} from "../../config/dynamodb";
import AWS from 'aws-sdk';
import { User } from '../../model/user_model';

// This is the implementation layer. It is responsible for handling database operations.
export class DynamoDBTeamMemberRepository implements TeamMemberRepository {
    private readonly dynamoDB: AWS.DynamoDB;

    constructor(dynamoDB: AWS.DynamoDB) {
        this.dynamoDB = new AWS.DynamoDB();
    }

    // Fetch a team member in ddb
    async find(teamId: string, uuid: string): Promise<TeamMember | null> {
        const params = {
            TableName: DDB_TEAM_MEMBERS_TABLE_NAME,
            Key: {
                "tid": {S: teamId},
                "sk": {S: await this.generateSortKey(uuid)}
            }
        };

        try {
            const data = await this.dynamoDB.getItem(params).promise();
            if (!data.Item) {
                return null; // Team member not found
            }

            return this.convertDB2Model(data.Item);
        } catch (err) {
            console.error("Error fetching team_member from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Create a team member in ddb
    async create(teamMember: TeamMember, user: User): Promise<TeamMember | null> {
        const currentDate = new Date(Date.now());

        // Set the team member properties from the user object
        teamMember.uuid = user.uuid;
        teamMember.preferredName = user.preferredName || user.firstName + " " + user.lastName;
        teamMember.meta = teamMember.meta || "default";

        // Round the credit to 2 decimal places
        teamMember.credit = Math.floor((teamMember.credit || 0) * 100) / 100;
        teamMember.playerStats = {
            preferredPosition: teamMember.playerStats?.preferredPosition || [],
            defense: teamMember.playerStats?.defense || 0,
            attack: teamMember.playerStats?.attack || 0,
            badmintonRanking: teamMember.playerStats?.badmintonRanking || 0
        };
        teamMember.bio = teamMember.bio || "Hi I'm new here!";
        teamMember.referrer = teamMember.referrer || "Admin";

        // Validate the team member object
        const validated = validate(teamMember);
        if (validated) {
            throw new Error(validated);
        }

        const params = {
            TableName: DDB_TEAM_MEMBERS_TABLE_NAME,
            Item: {
                "sk": { S: await this.generateSortKey(teamMember.uuid) }, // we need this here from FE
                "tid": { S: teamMember.teamId },
                "pn": { S: teamMember.preferredName },
                "meta": { S: teamMember.meta },
                "cr": { N: teamMember.credit.toString() || "0" },
                "ps": {
                    M: {
                        "pp": { L: teamMember?.playerStats?.preferredPosition.map(pos => ({ S: pos }))},
                        "df": { N: teamMember?.playerStats?.defense.toString() },
                        "at": { N: teamMember?.playerStats?.attack.toString() },
                        "br": { N: teamMember?.playerStats?.badmintonRanking.toString() },
                    }
                },
                "ja": { S: currentDate.getTime().toString()},
                "ma": { S: currentDate.getTime().toString()},
                "lt": { S: currentDate.getTime().toString()},
                "bi": { S: teamMember.bio },
                "rf": { S: teamMember.referrer || ""}
            },
            ConditionExpression: "attribute_not_exists(sk)" // Ensure the item does not exist
        };

        try {
            await this.dynamoDB.putItem(params).promise();
            return teamMember;
        } catch (err) {
            console.error("Error creating team_member in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Update a team member in ddb
    async update(teamMember: TeamMember): Promise<TeamMember | null> {
        const currentDate = new Date(Date.now());
        const dateString = currentDate.toString();

        const validated = validate(teamMember);
        if (validated) {
            throw new Error(validated);
        }

        const params = {
            TableName: DDB_TEAM_MEMBERS_TABLE_NAME,
            Key: {
                "tid": { S: teamMember.teamId },
                "sk": { S: await this.generateSortKey(teamMember.uuid) }
            },
            UpdateExpression: `
                SET #pn = :pn,
                    #cr = :cr, 
                    #ps = :ps,
                    #ma = :ma,
                    #bi = :bi,
            `,
            ExpressionAttributeNames: {
                "#cr": "cr",
                "#ps": "ps",
                "#ma": "ma",
                "#bi": "bi"
            },
            ExpressionAttributeValues: {
                ":cr": { N: teamMember.credit.toString() || "0" },
                ":ps": {
                    M: {
                        "pp": { L: teamMember?.playerStats?.preferredPosition.map(pos => ({ S: pos }))},
                        "df": { N: teamMember?.playerStats?.defense.toString() },
                        "at": { N: teamMember?.playerStats?.attack.toString() },
                        "br": { N: teamMember?.playerStats?.badmintonRanking.toString()},
                    }
                },
                ":ma": { S: dateString },
                ":bi": { S: teamMember.bio }
            },
            ReturnValues: "ALL_NEW"
        };

        try {
            const data = await this.dynamoDB.updateItem(params).promise();
            return this.convertDB2Model(data.Attributes);
        } catch (err) {
            console.error("Error updating team_member in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // List all team members in ddb
    async list(teamId: string): Promise<TeamMember[]> {
        const params = {
            TableName: DDB_TEAM_MEMBERS_TABLE_NAME,
            KeyConditionExpression: "#tid = :tid",
            ExpressionAttributeNames: {
                "#tid": "tid"
            },
            ExpressionAttributeValues: {
                ":tid": { S: teamId }
            }
        };

        try {
            const data = await this.dynamoDB.query(params).promise();
            if (!data.Items || data.Items.length === 0) {
                return []; // No team members found for the given teamId
            }

            // Convert DynamoDB items to TeamMember objects
            console.log(data.Items);
            const promises = data.Items.map(async item => await this.convertDB2Model(item));
            return await Promise.all(promises);
        } catch (err) {
            console.error("Error listing team members from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Delete a team member in ddb
    async delete(teamId: string, uuid: string): Promise<boolean> {
        const params = {
            TableName: DDB_TEAM_MEMBERS_TABLE_NAME,
            Key: {
                "tid": { S: teamId },
                "sk": { S: await this.generateSortKey(uuid) }
            }
        };

        try {
            await this.dynamoDB.deleteItem(params).promise();
            return true;
        } catch (err) {
            console.error("Error deleting team_member in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // This method is used to convert the database item to a team_member model
    async convertDB2Model(item: any): Promise<TeamMember> {
        return {
            uuid: item?.sk?.S || "",
            preferredName: item?.pn?.S || "",
            teamId: item?.tid?.S || "",
            meta: item?.mt?.S || "",
            credit: item?.cr?.N || 0,
            playerStats: {
                preferredPosition: item?.ps?.M?.pp?.L?.map((pos: any) => pos.S) || [],
                defense: parseInt(item?.ps?.M?.df?.N || 0, 10),
                attack: parseInt(item?.ps?.M?.at?.N || 0, 10),
                badmintonRanking: parseInt(item?.ps?.M?.br?.N || 0, 10)
            },
            joinAt: item?.ja?.S,
            modifiedAt: item?.ma?.S,
            lastTimePlayed: item?.lt?.S,
            bio: item?.bi?.S || "",
            referrer: item?.rf?.S || ""
        }
    }

    // This method is used to generate a sort key for the team_member
    async generateSortKey(uuid: string): Promise<string> {
        return "uuid#"+uuid;
    }
}