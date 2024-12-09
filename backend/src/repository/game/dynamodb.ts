import {
    Game,
    GameAttendee,
    gameStatus,
    gameStatusArray,
    gameVotes,
    gameVotesArray,
    validate
} from "../../model/game_model";
import {GameRepository} from "../game_repository";
import {DDB_GAMES_TABLE_NAME} from "../../config/dynamodb";
import AWS from 'aws-sdk';
import {Team} from "../../model/team_model";
import {TeamMember} from "../../model/team_member_model";

// This is the implementation layer. It is responsible for handling database operations.
export class DynamoDBGameRepository implements GameRepository {
    private readonly dynamoDB: AWS.DynamoDB;

    constructor(dynamoDB: AWS.DynamoDB) {
        this.dynamoDB = new AWS.DynamoDB();
    }

    // Fetch a game in ddb
    async find(teamId: string, id: string): Promise<Game | null> {
        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            Key: {
                "tid": {S: teamId},
                "sk": {S: await this.generateSortKey(id)}
            }
        };

        try {
            const data = await this.dynamoDB.getItem(params).promise();
            if (!data.Item) {
                return null; // Game not found
            }

            return this.convertDB2Model(data.Item);
        } catch (err) {
            console.error("Error fetching game from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Create a game in ddb
    async create(game: Game): Promise<Game | null> {
        const currentDate = new Date(Date.now());
        game.id = currentDate.getTime().toString();
        game.status = game.status || gameStatus.VOTES_PENDING;

        // Set default values for minAttendance and maxAttendance
        let minAttendance = game.minAttendance || 0;
        if (isNaN(minAttendance)) {
            minAttendance = 0;
        }
        game.minAttendance = minAttendance;
        let maxAttendance = game.maxAttendance || 0;
        if (isNaN(maxAttendance)) {
            maxAttendance = 0;
        }
        game.maxAttendance = maxAttendance;

        const validated = validate(game);
        if (validated) {
            throw new Error(validated);
        }

        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            Item: {
                "tid": {S: game.teamId},
                "sk": {S: await this.generateSortKey(game.id)},
                "id": {S: game.id},
                "loc": {S: game.location || ""},
                "na": {S: game.name || ""},
                "des": {S: game.description || ""},
                "st": {S: game.startTime || ""},
                "dur": {S: game.duration || ""},
                "dfr": {S: game.deadlineForRegistration || ""},
                "min": {N: game.minAttendance?.toString() || "0"},
                "max": {N: game.maxAttendance?.toString() || "0"},
                "est": {S: game.estimatedExpense || ""},
                "img": {S: JSON.stringify(game.images) || ""},
                "thn": {S: game.thumbnail || ""},
                "go": {S: JSON.stringify([]) || ""},
                "ngo": {S: JSON.stringify([]) || ""},
                "mbe": {S: JSON.stringify([]) || ""},
                "sts": {S: game.status},
                "ams": {S: ""}, // Announcements are empty by default
                "cb": {S: game.createdBy || ""},
                "ca": {S: currentDate.getTime().toString()},
            },
            ConditionExpression: "attribute_not_exists(sk)" // Ensure the item does not exist
        };
        try {
            await this.dynamoDB.putItem(params).promise();
            return game;
        } catch (err) {
            console.error("Error creating game in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Update a game in ddb
    async update(game: Game): Promise<Game | null> {
        const currentDate = new Date(Date.now());
        const validated = validate(game);
        if (validated) {
            throw new Error(validated);
        }
        let minAttendance = game.minAttendance || 0;
        if (isNaN(minAttendance)) {
            minAttendance = 0;
        }
        game.minAttendance = minAttendance;
        let maxAttendance = game.maxAttendance || 0;
        if (isNaN(maxAttendance)) {
            maxAttendance = 0;
        }
        game.maxAttendance = maxAttendance;
        if (game.announcements == undefined) {
            game.announcements = [];
        }

        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            Key: {
                "tid": {S: game.teamId},
                "sk": {S: await this.generateSortKey(game.id)},
            },
            UpdateExpression: "SET #loc = :loc, #na = :na, #des = :des, #st = :st, #dur = :dur, #dfr = :dfr, #min = :min, #max = :max, #est = :est, #img = :img, #thn = :thn, #go = :go, #ngo = :ngo, #mbe = :mbe, #sts = :sts, #ams = :ams, #cb = :cb, #ma = :ma",
            ExpressionAttributeNames: {
                "#loc": "loc",
                "#na": "na",
                "#des": "des",
                "#st": "st",
                "#dur": "dur",
                "#dfr": "dfr",
                "#min": "min",
                "#max": "max",
                "#est": "est",
                "#img": "img",
                "#thn": "thn",
                "#go": "go",
                "#ngo": "ngo",
                "#mbe": "mbe",
                "#sts": "sts",
                "#ams": "ams",
                "#cb": "cb",
                "#ma": "ma",
            },
            ExpressionAttributeValues: {
                ":loc": {S: game.location || ""},
                ":na": {S: game.name || ""},
                ":des": {S: game.description || ""},
                ":st": {S: game.startTime || ""},
                ":dur": {S: game.duration || ""},
                ":dfr": {S: game.deadlineForRegistration || ""},
                ":min": {N: game.minAttendance?.toString() || "0"},
                ":max": {N: game.maxAttendance?.toString() || "0"},
                ":est": {S: game.estimatedExpense || ""},
                ":img": {S: JSON.stringify(game.images) || ""},
                ":thn": {S: game.thumbnail || ""},
                ":go": {S: JSON.stringify(game.going) || ""},
                ":ngo": {S: JSON.stringify(game.notGoing) || ""},
                ":mbe": {S: JSON.stringify(game.maybe) || ""},
                ":sts": {S: game.status},
                ":ams": {S: JSON.stringify(game.announcements) || ""},
                ":cb": {S: game.createdBy || ""},
                ":ma": {S: currentDate.getTime().toString()},
            },
            ReturnValues: "ALL_NEW"
        };

        try {
            const data = await this.dynamoDB.updateItem(params).promise();
            return this.convertDB2Model(data.Attributes);
        } catch (err) {
            console.error("Error updating game in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // List all games in ddb
    async list(teamId: string): Promise<Game[]> {
        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            KeyConditionExpression: "#tid = :tid",
            ExpressionAttributeNames: {
                "#tid": "tid"
            },
            ExpressionAttributeValues: {
                ":tid": {S: teamId}
            }
        };

        try {
            const data = await this.dynamoDB.query(params).promise();
            if (!data.Items || data.Items.length === 0) {
                return []; // No games found for the given teamId
            }

            // Convert the list of items to a list of Game objects
            const promises = data.Items.map(async item => await this.convertDB2Model(item));
            return await Promise.all(promises);
        } catch (err) {
            console.error("Error listing games from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Delete a game in ddb
    async delete(teamId: string, id: string): Promise<boolean> {
        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            Key: {
                "tid": {S: teamId},
                "sk": {S: await this.generateSortKey(id)}
            }
        };

        try {
            await this.dynamoDB.deleteItem(params).promise();
            return true;
        } catch (err) {
            console.error("Error deleting game from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Vote on a game in ddb
    async vote(teamId: string, id: string, uuid: string, vote: string): Promise<boolean> {
        // Check if the game exists
        const game = await this.find(teamId, id);
        if (!game) {
            throw new Error("Game not found");
        }

        // Check if the vote is valid
        if (!gameVotesArray.includes(vote)) {
            throw new Error("Invalid vote types");
        }

        // Check if the game is cancelled
        if (game.status === gameStatus.CANCELLED) {
            throw new Error("Game is cancelled");
        }

        // Check if the game is already started
        let startTime = new Date(game.startTime);
        if (startTime < new Date(Date.now())) {
            throw new Error("Game has already started");
        }

        // Backward compatibility
        if (game.going == undefined) {
            game.going = [];
        }
        if (game.notGoing == undefined) {
            game.notGoing = [];
        }
        if (game.maybe == undefined) {
            game.maybe = [];
        }

        // Check if the max attendance is reached
        if (game.maxAttendance > 0 && game.going.length >= game.maxAttendance && vote === gameVotes.YES) {
            throw new Error("Max attendance reached");
        }

        if (vote === gameVotes.YES) {
            // Player is going
            // Check if the user has already voted
            if (game.notGoing.includes(uuid)) {
                // Remove the user from the not going list
                game.notGoing = game.notGoing.filter(u => u !== uuid);
            }
            if (game.maybe.includes(uuid)) {
                // Remove the user from the maybe list
                game.maybe = game.maybe.filter(u => u !== uuid);
            }
            // Check if the user has already voted as going
            if (game.going.includes(uuid)) {
                throw new Error("User has already voted");
            }
            // Add the user to the going list
            game.going.push(uuid);
        } else if (vote === gameVotes.NO) {
            // Player is not going
            // Check if the user has already voted
            if (game.going.includes(uuid)) {
                // Remove the user from the going list
                game.going = game.going.filter(u => u !== uuid);
            }
            if (game.maybe.includes(uuid)) {
                // Remove the user from the maybe list
                game.maybe = game.maybe.filter(u => u !== uuid);
            }
            // Check if the user has already voted as not going
            if (game.notGoing.includes(uuid)) {
                throw new Error("User has already voted");
            }
            // Add the user to the not going list
            game.notGoing.push(uuid);
        } else if (vote === gameVotes.MAYBE) {
            // Player is maybe
            // Check if the user has already voted
            if (game.going.includes(uuid)) {
                // Remove the user from the going list
                game.going = game.going.filter(u => u !== uuid);
            }
            if (game.notGoing.includes(uuid)) {
                // Remove the user from the not going list
                game.notGoing = game.notGoing.filter(u => u !== uuid);
            }
            // Check if the user has already voted as maybe
            if (game.maybe.includes(uuid)) {
                throw new Error("User has already voted");
            }
            // Add the user to the maybe list
            game.maybe.push(uuid);
        }

        const updatedGame = await this.update(game);
        if (!updatedGame) {
            throw new Error("Error updating game");
        }

        // Todo: we will return false if total votes reaching the limit
        return true;
    }

    // Remove a vote on a game in ddb
    async removeVote(teamId: string, id: string, uuid: string): Promise<boolean> {
        const game = await this.find(teamId, id);
        if (!game) {
            throw new Error("Game not found");
        }

        // Check if the game is cancelled
        if (game.status === gameStatus.CANCELLED) {
            throw new Error("Game is cancelled, unable to remove votes");
        }

        // Check if the game is already started
        let startTime = new Date(game.startTime);
        if (startTime < new Date(Date.now())) {
            throw new Error("Game has already started");
        }

        // Check if the deadline for registration has passed
        let deadlineForRegistration = new Date(game.deadlineForRegistration);
        if (deadlineForRegistration < new Date(Date.now())) {
            throw new Error("Deadline for registration has passed");
        }

        // Backward compatibility
        if (game.going == undefined) {
            game.going = [""];
        }
        if (game.notGoing == undefined) {
            game.notGoing = [""];
        }

        // Check if the user has already voted
        if (game.going.includes(uuid)) {
            // Remove the user from the going list
            game.going = game.going.filter(u => u !== uuid);
        }
        if (game.notGoing.includes(uuid)) {
            // Remove the user from the not going list
            game.notGoing = game.notGoing.filter(u => u !== uuid);
        }
        if (game.maybe.includes(uuid)) {
            // Remove the user from the maybe list
            game.maybe = game.maybe.filter(u => u !== uuid);
        }

        const updatedGame = await this.update(game);
        if (!updatedGame) {
            throw new Error("Error updating game");
        }

        return true
    }

    // Announce on a game in ddb
    async announce(teamId: string, id: string, uuid: string, announcement: string): Promise<boolean> {
        const game = await this.find(teamId, id);
        if (!game) {
            throw new Error("Game not found");
        }

        if (game.announcements == undefined) {
            game.announcements = [];
        }

        let now = new Date(Date.now()).getTime().toString();

        game.announcements.push({
            id: now,
            createdBy: uuid,
            announcement: announcement,
            createdAt: now,
        });

        const updatedGame = await this.update(game);
        if (!updatedGame) {
            throw new Error("Error updating game");
        }

        return true;
    }

    // Remove an announcement on a game in ddb
    async removeAnnouncement(teamId: string, id: string, announcementId: string): Promise<boolean> {
        const game = await this.find(teamId, id);
        if (!game) {
            throw new Error("Game not found");
        }

        if (game.announcements == undefined) {
            game.announcements = [];
        }

        game.announcements = game.announcements.filter(a => a.id !== announcementId);

        const updatedGame = await this.update(game);
        if (!updatedGame) {
            throw new Error("Error updating game");
        }

        return true;
    }

    // Update the status of a game in ddb
    async status(teamId: string, id: string, status: string): Promise<boolean> {
        const game = await this.find(teamId, id);
        if (!game) {
            throw new Error("Game not found");
        }

        // Check if the status is valid
        if (!gameStatusArray.includes(status)) {
            throw new Error("Invalid status");
        }

        game.status = status;

        const updatedGame = await this.update(game);
        if (!updatedGame) {
            throw new Error("Error updating game");
        }

        return true;
    }

    // Update MVP a game in ddb
    async voteMVP(team: Team, game: Game, teamMember: TeamMember): Promise<boolean> {
        if (team.id !== game.teamId) {
            throw new Error("Team and game do not match");
        }

        if (game.status === gameStatus.CANCELLED) {
            throw new Error("Game is cancelled, unable to select MVP");
        }

        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            Key: {
                "tid": { S: game.teamId },
                "sk": { S: await this.generateMvpSortKey(game.id, teamMember.uuid) }
            },
            UpdateExpression: "SET #uuid = :uuid, #nm = :nm, #pfn = :pfn, #img = :img",
            ExpressionAttributeNames: {
                "#uuid": "uuid",
                "#nm": "nm",
                "#pfn": "pfn",
                "#img": "img"
            },
            ExpressionAttributeValues: {
                ":uuid": { S: teamMember.uuid },
                // ":fn": { S: teamMember.firstName },
                // ":ln": { S: teamMember.lastName },
                // ":pfn": { S: teamMember.preferredName || "" },
                // ":img": { S: teamMember.image || "" }
            },
            ReturnValues: "UPDATED_NEW"
        };

        try {
            await this.dynamoDB.updateItem(params).promise();
            return true;
        } catch (err) {
            console.error("Error upserting MVP in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Fetch MVP of a game in ddb
    async findMVP(teamId: string, gameId: string): Promise<GameAttendee | null> {
        // Fetch MVP from game table, with sort key begins with "game#gameId#mvp#"
        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            KeyConditionExpression: "#tid = :tid AND begins_with(#sk, :sk)",
            ExpressionAttributeNames: {
                "#tid": "tid",  // team id
                "#sk": "sk"     // sort key
            },
            ExpressionAttributeValues: {
                ":tid": {S: teamId},
                ":sk": {S: await this.generateMvpSortKey(gameId, "")}
            }
        };
        try {
            const data = await this.dynamoDB.query(params).promise();
            if (!data.Items || data.Items.length === 0) {
                return null; // MVP not found
            }
            return this.convertDB2ModelGameAttendee(data.Items[0]);
        } catch (err) {
            console.error("Error fetching MVP from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Upsert a member number of goals in ddb
    async upsertGoals(team: Team, game: Game, teamMember: TeamMember, goals: string): Promise<boolean> {
        if (team.id !== game.teamId) {
            throw new Error("Team and game do not match");
        }

        if (game.status === gameStatus.CANCELLED) {
            throw new Error("Game is cancelled, unable to select MVP");
        }

        // Check if the game is cancelled
        if (game.status === gameStatus.CANCELLED) {
            throw new Error("Game is cancelled, unable to update goals");
        }

        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            Key: {
                "tid": { S: team.id },
                "sk": { S: await this.generateGoalsSortKey(game.id, teamMember.uuid) }
            },
            UpdateExpression: "SET #uuid = :uuid, #gls = :gls, #nm = :nm, #pfn = :pfn, #img = :img",
            ExpressionAttributeNames: {
                "#uuid": "uuid",
                "#gls": "gls",
                "#nm": "nm",
                "#pfn": "pfn",
                "#img": "img"
            },
            ExpressionAttributeValues: {
                ":uuid": { S: teamMember.uuid },
                ":gls": { S: goals },
                // ":fn": { S: teamMember.firstName },
                // ":ln": { S: teamMember.lastName },
                // ":pfn": { S: teamMember.preferredName || "" },
                // ":img": { S: teamMember.image || ""},
            },
            ReturnValues: "UPDATED_NEW"
        };

        try {
            await this.dynamoDB.updateItem(params).promise();
            return true;
        } catch (err) {
            console.error("Error upserting goals in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Fetch goals of a member in a game in ddb
    async findGoalsOfMember(teamId: string, gameId: string, uuid: string): Promise<GameAttendee | null> {
        // Fetch goals from game table, with sort key begins with "game#gameId#goals#"
        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            KeyConditionExpression: "#tid = :tid AND begins_with(#sk, :sk)",
            ExpressionAttributeNames: {
                "#tid": "tid",  // team id
                "#sk": "sk"     // sort key
            },
            ExpressionAttributeValues: {
                ":tid": {S: teamId},
                ":sk": {S: await this.generateGoalsSortKey(gameId, uuid)}
            }
        };
        try {
            const data = await this.dynamoDB.query(params).promise();
            if (!data.Items || data.Items.length === 0) {
                return null; // Goals not found
            }
            return this.convertDB2ModelGameAttendee(data.Items[0]);
        } catch (err) {
            console.error("Error fetching goals from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Upsert assists of a member in a game in ddb
    async upsertAssists(team: Team, game: Game, teamMember: TeamMember, assists: string): Promise<boolean> {
        if (team.id !== game.teamId) {
            throw new Error("Team and game do not match");
        }

        if (game.status === gameStatus.CANCELLED) {
            throw new Error("Game is cancelled, unable to update assists");
        }

        // Check if the game is cancelled
        if (game.status === gameStatus.CANCELLED) {
            throw new Error("Game is cancelled, unable to update assists");
        }

        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            Key: {
                "tid": {S: team.id},
                "sk": {S: await this.generateAssistsSortKey(game.id, teamMember.uuid)}
            },
            UpdateExpression: "SET #uuid = :uuid, #ass = :ass, #nm = :nm, #pfn = :pfn, #img = :img",
            ExpressionAttributeNames: {
                "#uuid": "uuid",
                "#ass": "ass",
                "#nm": "nm",
                "#pfn": "pfn",
                "#img": "img"
            },
            ExpressionAttributeValues: {
                ":uuid": {S: teamMember.uuid},
                ":ass": {S: assists},
                // ":fn": {S: teamMember.firstName},
                // ":ln": {S: teamMember.lastName},
                // ":pfn": {S: teamMember.preferredName || ""},
                // ":img": {S: teamMember.image || ""},
            },
            ReturnValues: "UPDATED_NEW"
        };

        try {
            await this.dynamoDB.updateItem(params).promise();
            return true;
        } catch (err) {
            console.error("Error upserting goals in DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Fetch assists of a member in a game in ddb
    async findAssistsOfMember(teamId: string, gameId: string, uuid: string): Promise<GameAttendee | null> {
        // Fetch goals from game table, with sort key begins with "game#gameId#assists#"
        const params = {
            TableName: DDB_GAMES_TABLE_NAME,
            KeyConditionExpression: "#tid = :tid AND begins_with(#sk, :sk)",
            ExpressionAttributeNames: {
                "#tid": "tid",  // team id
                "#sk": "sk"     // sort key
            },
            ExpressionAttributeValues: {
                ":tid": {S: teamId},
                ":sk": {S: await this.generateAssistsSortKey(gameId, uuid)}
            }
        };
        try {
            const data = await this.dynamoDB.query(params).promise();
            if (!data.Items || data.Items.length === 0) {
                return null; // Goals not found
            }
            return this.convertDB2ModelGameAttendee(data.Items[0]);
        } catch (err) {
            console.error("Error fetching goals from DynamoDB:", err);
            throw err; // Propagate error to the caller
        }
    }

    // Convert DynamoDB item to GameAttendee object
    async convertDB2ModelGameAttendee(item: any): Promise<GameAttendee> {
        return {
            uuid: item?.uuid?.S,
            vote: gameVotes.YES,
            preferredName: item?.pfn?.S || "",
            goals: item?.gls?.S || "",
            assists: item?.ass?.S || "",
        };
    }

    // Convert DynamoDB item to Game object
    async convertDB2Model(item: any): Promise<Game> {
        let going = item?.go?.S ? JSON.parse(item?.go?.S) : [];
        let notGoing = item?.ngo?.S ? JSON.parse(item?.ngo?.S) : [];
        let maybe = item?.mbe?.S ? JSON.parse(item?.mbe?.S) : [];
        let images = item?.img?.S ? JSON.parse(item?.img?.S) : [];
        let announcements = item?.ams?.S ? JSON.parse(item?.ams?.S) : [];

        return {
            teamId: item?.tid?.S,
            meta: item?.sk?.S,
            id: item?.id?.S,
            location: item?.loc?.S,
            name: item?.na?.S,
            description: item?.des?.S,
            startTime: item?.st?.S,
            duration: item?.dur?.S,
            deadlineForRegistration: item?.dfr?.S,
            minAttendance: parseInt(item?.min?.N),
            maxAttendance: parseInt(item?.max?.N),
            going: going,
            notGoing: notGoing,
            maybe: maybe,
            estimatedExpense: item?.est?.S,
            images: images,
            thumbnail: item?.thn?.S,
            status: item?.sts?.S,
            announcements: announcements,
            createdBy: item?.cb?.S,
            createdAt: item?.ca?.S,
            modifiedAt: item?.ma?.S,
        };
    }

    // Generate a sort key for the game
    async generateSortKey(id: string): Promise<string> {
        return "game#"+id;
    }

    // Generate a sort key for game mvp
    async generateMvpSortKey(gameId: string, uuid: string): Promise<string> {
        if (uuid === undefined || uuid === null || uuid === "") {
            return "game#"+gameId+"#mvp#"+uuid
        } else {
            return "game#"+gameId+"#mvp#";
        }
    }

    // Generate a sort key for game goals
    async generateGoalsSortKey(gameId: string, uuid: string): Promise<string> {
        if (uuid === undefined || uuid === null || uuid === "") {
            return "game#"+gameId+"#goals#"+uuid
        } else {
            return "game#"+gameId+"#goals#";
        }
    }

    // Generate a sort key for game assists
    async generateAssistsSortKey(gameId: string, uuid: string): Promise<string> {
        if (uuid === undefined || uuid === null || uuid === "") {
            return "game#"+gameId+"#assists#"+uuid
        } else {
            return "game#"+gameId+"#assists#";
        }
    }

}