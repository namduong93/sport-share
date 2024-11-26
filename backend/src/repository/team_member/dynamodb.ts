import { TeamMember, validate } from '../../model/team_member_model';
import { TeamMemberRepository } from '../team_member_repository';
import { User } from '../../model/user_model';
import { DDB_TEAM_MEMBERS_TABLE_NAME} from "../../config/dynamodb";
import AWS from 'aws-sdk';

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
        teamMember.image = user.image;
        teamMember.name = user.name;
        teamMember.preferredName = user.preferredName;
        teamMember.mobile = user.mobile;

        // Round the credit to 2 decimal places
        teamMember.credit = Math.floor(teamMember.credit * 100) / 100;

        // Validate the team member object
        const validated = validate(teamMember);
        if (validated) {
            throw new Error(validated);
        }

        const params = {
            TableName: DDB_TEAM_MEMBERS_TABLE_NAME,
            Item: {
                "tid": { S: teamMember.teamId },
                "sk": { S: await this.generateSortKey(teamMember.uuid) },
                "uuid": { S: teamMember.uuid }, // we need this here from FE
                "cr": { N: teamMember.credit.toString() || "0" },
                "na": { S: teamMember.name },
                "pfn": { S: teamMember.preferredName },
                "em": { S: teamMember.email },
                "hp": { S: teamMember.mobile },
                "img": { S: teamMember.image },
                "rl": { S: teamMember.role },
                "ps": {
                    M: {
                        "pp": { L: teamMember?.playerStats?.preferredPosition.map(pos => ({ S: pos }))},
                        "gk": { N: teamMember?.playerStats?.goalkeeping.toString() },
                        "df": { N: teamMember?.playerStats?.defense.toString() },
                        "at": { N: teamMember?.playerStats?.attack.toString() },
                        "ct": { N: teamMember?.playerStats?.control.toString() },
                        "ph": { N: teamMember?.playerStats?.physique.toString() },
                        "sp": { N: teamMember?.playerStats?.speed.toString() }
                    }
                },
                "ca": { S: currentDate.getTime().toString()},
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
                SET #cr = :cr, 
                    #na = :na, 
                    #em = :em, 
                    #hp = :hp, 
                    #img = :img,
                    #rl = :rl, 
                    #ma = :ma,
                    #ps = :ps
            `,
            ExpressionAttributeNames: {
                "#cr": "cr",
                "#na": "na",
                "#em": "em",
                "#hp": "hp",
                "#img": "img",
                "#rl": "rl",
                "#ma": "ma",
                "#ps": "ps"
            },
            ExpressionAttributeValues: {
                ":cr": { N: teamMember.credit.toString() || "0" },
                ":na": { S: teamMember.name },
                ":em": { S: teamMember.email },
                ":hp": { S: teamMember.mobile },
                ":img": { S: teamMember.image },
                ":rl": { S: teamMember.role },
                ":ma": { S: dateString },
                ":ps": {
                    M: {
                        "pp": { L: teamMember?.playerStats?.preferredPosition.map(pos => ({ S: pos }))},
                        "gk": { N: teamMember?.playerStats?.goalkeeping.toString() },
                        "df": { N: teamMember?.playerStats?.defense.toString() },
                        "at": { N: teamMember?.playerStats?.attack.toString() },
                        "ct": { N: teamMember?.playerStats?.control.toString() },
                        "ph": { N: teamMember?.playerStats?.physique.toString() },
                        "sp": { N: teamMember?.playerStats?.speed.toString() }
                    }
                }
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
            teamId: item?.tid?.S || "",
            meta: item?.sk?.S || "",
            credit: item?.cr?.N || 0,
            uuid: item?.uuid?.S || "",
            name: item?.na?.S || "",
            email: item?.em?.S || "",
            mobile: item?.hp?.S || "",
            image: item?.img?.S || "",
            role: item?.rl?.S || "",
            playerStats: {
                preferredPosition: item?.ps?.M?.pp?.L?.map((pos: any) => pos.S) || [],
                goalkeeping: parseInt(item?.ps?.M?.gk?.N || 0, 10),
                defense: parseInt(item?.ps?.M?.df?.N || 0, 10),
                attack: parseInt(item?.ps?.M?.at?.N || 0, 10),
                control: parseInt(item?.ps?.M?.ct?.N || 0, 10),
                physique: parseInt(item?.ps?.M?.ph?.N || 0, 10),
                speed: parseInt(item?.ps?.M?.sp?.N || 0, 10)
            },
            createdAt: new Date(item?.ca?.S || Date.now()),
            modifiedAt: new Date(item?.ma?.S || Date.now())
        }
    }

    // This method is used to generate a sort key for the team_member
    async generateSortKey(uuid: string): Promise<string> {
        return "uuid#"+uuid;
    }
}