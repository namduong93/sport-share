import {UserRepository} from "../user_repository";
import AWS from "aws-sdk";
import {DDB_USERS_TABLE_NAME} from "../../config/dynamodb";
import {sha256} from "js-sha256";
import {BAD_REQUEST, USER_NOT_FOUND} from "../../utils/error";
import {Device} from "../../model/device_model";
import { User, UserType, validate } from "../../model/user_model";

export class DynamoDBUserRepository implements UserRepository {
    private readonly dynamoDB: AWS.DynamoDB;

    constructor(dynamoDB: AWS.DynamoDB) {
        this.dynamoDB = new AWS.DynamoDB();
    }

    async authenticate(email: string, password: string): Promise<User | null> {
        if (!email || email.length === 0) {
            return null;
        }
        email = await this.trimDotsForEmail(email);

        if (!password || password.length === 0) {
            return null;
        }

        // Fetch user from ddb
        const params = {
            TableName: DDB_USERS_TABLE_NAME,
            KeyConditionExpression: "#em = :em",
            ExpressionAttributeNames: {
                "#em": "em"
            },
            ExpressionAttributeValues: {
                ":em": {S: email}
            }
        };

        try {
            const data = await this.dynamoDB.query(params).promise();
            if (!data.Items || data.Items.length === 0) {
                return null; // User not found
            }

            const user = await this.convertDB2Model(data.Items[0]);
            if (user.password === sha256(password)) {
                return user;
            } else {
                return null;
            }
        } catch (err) {
            console.error("Error fetching user from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    async create(user: User): Promise<User | null> {
        const currentDate = new Date(Date.now());
        user.uuid = user.uuid || currentDate.getTime().toString();

        const validated = validate(user);
        if (validated) {
            throw new Error(validated);
        }
        user.email = await this.trimDotsForEmail(user.email);

        const params = {
            TableName: DDB_USERS_TABLE_NAME,
            Item: {
                "em": {S: user.email},
                "sk": {S: await this.generateSortKey(user.uuid)},
                "uuid": {S: user.uuid},
                "fn": {S: user.firstName},
                "ln": {S: user.lastName},
                "rl": {S: user.role},
                "pfn": {S: user.preferredName},
                "pw": {S: sha256(user.password ? user.password : "")},
                "img": {S: user.image || ""},
                "ca": {S: currentDate.getTime().toString()},
                "ma": {S: ""},
                "bio": {S: user.bio},
                "ref": {S: user.referrer || ""}
            },
            ConditionExpression: "attribute_not_exists(sk)" // Ensure the item does not exist
        };

        // Todo: insert this user to table team member 1, role member

        await this.dynamoDB.putItem(params).promise();

        return user;
    }

    async delete(email: string, userId: string): Promise<boolean> {
        if (!email || email.length === 0) {
            return false;
        }
        email = await this.trimDotsForEmail(email);

        const params = {
            TableName: DDB_USERS_TABLE_NAME,
            Key: {
                "em": {S: email},
                "sk": {S: await this.generateSortKey(userId)}
            }
        };

        try {
            await this.dynamoDB.deleteItem(params).promise();
            return true;
        } catch (err) {
            console.error("Error deleting user from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        if (!email || email.length === 0) {
            return null;
        }
        email = await this.trimDotsForEmail(email);

        // Fetch user from ddb
        const params = {
            TableName: DDB_USERS_TABLE_NAME,
            KeyConditionExpression: "#em = :em",
            ExpressionAttributeNames: {
                "#em": "em"
            },
            ExpressionAttributeValues: {
                ":em": {S: email}
            }
        };

        try {
            const data = await this.dynamoDB.query(params).promise();
            if (!data.Items || data.Items.length === 0) {
                return null; // User not found
            }

            return this.convertDB2Model(data.Items[0]);
        } catch (err) {
            console.error("Error fetching user from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    async list(): Promise<User[]> {
        const params = {
            TableName: DDB_USERS_TABLE_NAME
        };

        try {
            const data = await this.dynamoDB.scan(params).promise();
            if (!data.Items) {
                return [];
            }

            const users: User[] = [];
            for (const item of data.Items) {
                users.push(await this.convertDB2Model(item));
            }

            return users;
        } catch (err) {
            console.error("Error fetching users from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    async update(user: User): Promise<User | null> {
        const currentDate = new Date(Date.now());

        const validated = validate(user);
        if (validated) {
            throw new Error(validated);
        }
        user.email = await this.trimDotsForEmail(user.email);

        const params = {
            TableName: DDB_USERS_TABLE_NAME,
            Key: {
                "em": {S: user.email},
                "sk": {S: await this.generateSortKey(user.uuid)}
            },
            UpdateExpression: "SET #fn = :fn, #ln = :ln, #pfn = :pfn, #img = :img, #ma = :ma",
            ExpressionAttributeNames: {
                "#fn": "fn",
                "#ln": "ln",
                "#pfn": "pfn",
                "#img": "img",
                "#ma": "ma"
            },
            ExpressionAttributeValues: {
                ":fn": {S: user.firstName},
                ":ln": {S: user.lastName},
                ":pfn": {S: user.preferredName},
                ":img": {S: user.image},
                ":ma": {S: currentDate.getTime().toString()},
            }
        };

        try {
            await this.dynamoDB.updateItem(params).promise();
            return user;
        } catch (err) {
            console.error("Error updating user in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
        if (!userId || userId.length === 0) {
            return false;
        }
    
        // First verify the old password
        const user = await this.findById(userId);
        if (!user) {
            return false;
        }
    
        // Check if old password matches
        if (user.password !== sha256(oldPassword)) {
            return false;
        }
    
        // Update with new password
        const params = {
            TableName: DDB_USERS_TABLE_NAME,
            Key: {
                "em": {S: user.email},
                "sk": {S: await this.generateSortKey(userId)}
            },
            UpdateExpression: "SET #pw = :pw, #ma = :ma",
            ExpressionAttributeNames: {
                "#pw": "pw",
                "#ma": "ma"
            },
            ExpressionAttributeValues: {
                ":pw": {S: sha256(newPassword)},
                ":ma": {S: new Date().getTime().toString()}
            }
        };
    
        try {
            await this.dynamoDB.updateItem(params).promise();
            return true;
        } catch (err) {
            console.error("Error updating password in DynamoDB:", err);
            throw err; 
        }
    }

    async convertDB2Model(item: AWS.DynamoDB.AttributeMap): Promise<User> {
        return {
            email: item?.em?.S || "",
            uuid: item?.uuid?.S || "",
            firstName: item?.fn?.S || "",
            lastName: item?.ln?.S || "",
            role: item?.rl?.S as UserType || "",
            preferredName: item?.pfn?.S || "",
            password: item?.pw?.S || "",
            image: item?.img?.S || "",
            token: "",
            createdAt: item?.ca?.S || "",
            modifiedAt: item?.ma?.S || "",
            bio: item?.bio?.S || "",
            referrer: item?.ref?.S || ""
        };
    }

    convertDB2DeviceModel(item: AWS.DynamoDB.MapAttributeValue | undefined): Device {
        return {
            deviceId: item?.dvid.S || "",
            deviceToken: item?.dvtk.S || "",
            os: item?.os.S || ""
        };
    }

    async trimDotsForEmail(email: string): Promise<string> {
        return email.replace(/\./g, "");
    }

    async findById(userId: string): Promise<User> {
        if (!userId || userId.length === 0) {
            throw BAD_REQUEST;
        }

        const params = {
            TableName: DDB_USERS_TABLE_NAME,
            FilterExpression: '#sk = :sk',
            ExpressionAttributeNames: {
                '#sk': 'sk'
            },
            ExpressionAttributeValues: {
                ':sk': { S: await this.generateSortKey(userId)}
            }
        };

        const data = await this.dynamoDB.scan(params).promise();
        if (!data.Items || data.Items.length === 0) {
            throw USER_NOT_FOUND;
        }

        return this.convertDB2Model(data.Items[0]);
    }

    async generateSortKey(uuid: string): Promise<string> {
        return "uuid#"+uuid;
    }
}