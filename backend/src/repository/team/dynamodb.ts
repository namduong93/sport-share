import {Team, validate} from "../../model/team_model";
import {TeamRepository} from "../team_repository";
import {DDB_TEAMS_TABLE_NAME} from "../../config/dynamodb";
import AWS from 'aws-sdk';

// This is the implementation layer. It is responsible for handling database operations.
export class DynamoDBTeamRepository implements TeamRepository {
    private readonly dynamoDB: AWS.DynamoDB;

    constructor(dynamoDB: AWS.DynamoDB) {
        this.dynamoDB = new AWS.DynamoDB();
    }

    // Fetch a team in ddb
    async find(id: string): Promise<Team | null> {
        const params = {
            TableName: DDB_TEAMS_TABLE_NAME,
            Key: {
                "id": {S: id}
            }
        };

        try {
            const data = await this.dynamoDB.getItem(params).promise();
            if (!data.Item) {
                return null; // Team not found
            }

            return this.convertDB2Model(data.Item);
        } catch (err) {
            console.error("Error fetching team from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Create a team in ddb
    async create(team: Team): Promise<Team | null> {
        const currentDate = new Date(Date.now());
        const dateString = currentDate.toString();
        team.id = currentDate.getTime().toString();

        const validated = validate(team);
        if (validated) {
            throw new Error(validated);
        }

        const params = {
            TableName: DDB_TEAMS_TABLE_NAME,
            Item: {
                "id": {S: team.id},
                "na": {S: team.name},
                "em": {S: team.email},
                "img": {S: team.image},
                "ca": {S: dateString},
            },
            ConditionExpression: "attribute_not_exists(tid)" // Ensure the item does not exist
        };

        try {
            await this.dynamoDB.putItem(params).promise();
            return team;
        } catch (err) {
            console.error("Error creating team in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Update a team in ddb
    async update(team: Team): Promise<Team | null> {
        const currentDate = new Date(Date.now());
        const dateString = currentDate.toString();

        const validated = validate(team);
        if (validated) {
            throw new Error(validated);
        }

        const params = {
            TableName: DDB_TEAMS_TABLE_NAME,
            Key: {
                "id": {S: team.id}
            },
            UpdateExpression: "SET #na = :name, #em = :email, #img = :image, #ma = :modifiedAt",
            ExpressionAttributeNames: {
                "#na": "na",
                "#em": "em",
                "#img": "img",
                "#ma": "ma"
            },
            ExpressionAttributeValues: {
                ":name": {S: team.name},
                ":email": {S: team.email},
                ":image": {S: team.image},
                ":modifiedAt": {S: dateString}
            },
            ReturnValues: "ALL_NEW"
        };

        try {
            const data = await this.dynamoDB.updateItem(params).promise();
            return this.convertDB2Model(data.Attributes);
        } catch (err) {
            console.error("Error updating team in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // List all teams in ddb
    async list(): Promise<Team[]> {
        const params = {
            TableName: DDB_TEAMS_TABLE_NAME,
        };

        try {
            const data = await this.dynamoDB.scan(params).promise();
            return data.Items ? data.Items.map(this.convertDB2Model) : [];
        } catch (err) {
            console.error("Error listing teams in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Delete a team in ddb
    async delete(id: string): Promise<boolean> {
        const params = {
            TableName: DDB_TEAMS_TABLE_NAME,
            Key: {
                "id": {S: id}
            }
        };

        try {
            await this.dynamoDB.deleteItem(params).promise();
            return true;
        } catch (err) {
            console.error("Error deleting team in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Convert DynamoDB item to Team object
    private convertDB2Model(item: any): Team {
        return {
            id: item?.id?.S || "",
            name: item?.na?.S || "",
            email: item?.em?.S || "",
            image: item?.img?.S || "",
            createdAt: new Date(item?.ca?.S || Date.now()),
            modifiedAt: new Date(item?.ma?.S || Date.now())
        };
    }
}