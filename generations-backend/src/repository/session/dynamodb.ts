import {SessionRepository} from "../session_repository";
import AWS from "aws-sdk";
import {DDB_SESSIONS_TABLE_NAME} from "../../config/dynamodb";
import {Session} from "../../model/session_model";

export class DynamoDBSessionRepository implements SessionRepository {
    private readonly dynamoDB: AWS.DynamoDB;

    constructor(dynamoDB: AWS.DynamoDB) {
        this.dynamoDB = new AWS.DynamoDB();
    }

    async find(tk: string): Promise<Session | null> {
        const params = {
            TableName: DDB_SESSIONS_TABLE_NAME,
            Key: {
                "tk": {S: tk}
            }
        };

        try {
            const data = await this.dynamoDB.getItem(params).promise();
            if (!data.Item) {
                return null; // Session not found
            }
            return this.convertDB2Model(data.Item);
        } catch (err) {
            console.error("Error fetching session from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    async create(session: Session): Promise<Session | null> {
        const currentDate = new Date(Date.now());
        const dateString = currentDate.toString();
        session.uuid = session.uuid || "";

        const params = {
            TableName: DDB_SESSIONS_TABLE_NAME,
            Item: {
                "tk": {S: session.token},
                "uuid": {S: session.uuid},
                "exp": {S: session.expiresAt},
                "ca": {S: dateString},
                "ma": {S: dateString},
            },
            ConditionExpression: "attribute_not_exists(tk)" // Ensure the item does not exist
        };

        try {
            await this.dynamoDB.putItem(params).promise();
            return session;
        } catch (err) {
            console.error("Error creating session in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    async update(session: Session): Promise<Session | null> {
        const currentDate = new Date(Date.now());
        const dateString = currentDate.toString();

        const params = {
            TableName: DDB_SESSIONS_TABLE_NAME,
            Key: {
                "tk": {S: session.token}
            },
            UpdateExpression: "SET #uuid = :uuid, #exp = :exp, #ma = :ma",
            ExpressionAttributeNames: {
                "#uuid": "uuid",
                "#exp": "exp",
                "#ma": "ma"
            },
            ExpressionAttributeValues: {
                ":uuid": {S: session.uuid},
                ":exp": {S: session.expiresAt},
                ":ma": {S: dateString}
            }
        };

        try {
            await this.dynamoDB.updateItem(params).promise();
            return session;
        } catch (err) {
            console.error("Error updating session in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    async delete(tk: string): Promise<boolean> {
        const params = {
            TableName: DDB_SESSIONS_TABLE_NAME,
            Key: {
                "tk": {S: tk}
            }
        };

        try {
            await this.dynamoDB.deleteItem(params).promise();
            return true;
        } catch (err) {
            console.error("Error deleting session in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    async convertDB2Model(item: any): Promise<Session> {
        return {
            token: item?.tk?.S || "",
            uuid: item?.uuid?.S || "",
            expiresAt: item?.exp?.S || 0,
            createdAt: new Date(item.ca.S || ""),
            modifiedAt: new Date(item.ma.S || "")
        };
    }
}