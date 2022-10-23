import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

export function returnMongoClient(uri) {
	return new MongoClient(uri);
}

export function returnMongoDatabase(client) {
	return client.db(process.env.DB_NAME);
}

export function returnMongoCollection(database, collectionName) {
	return database.collection(collectionName);
}

export function addTokenToDatabase(username, token) {
	const client = returnMongoClient(process.env.MONGO_DB_URL);
	const database = returnMongoDatabase(client);
	const collection = returnMongoCollection(
		database,
		process.env.COLLECTION_NAME
	);
	collection.insertOne({
		user: username,
		authToken: token,
	});
}

export async function checkIfUserExists(owner) {
	const client = returnMongoClient(process.env.MONGO_DB_URL);
	const database = returnMongoDatabase(client);
	const collection = returnMongoCollection(
		database,
		process.env.COLLECTION_NAME
	);
	const user = await collection.find({ user: owner }).toArray();
	return user;
}

export async function getAccessToken(username) {
	const client = returnMongoClient(process.env.MONGO_DB_URL);
	const database = returnMongoDatabase(client);
	const collection = returnMongoCollection(
		database,
		process.env.COLLECTION_NAME
	);

	const accessToken = await collection.find({ user: username }).toArray()[0]
		.authToken;
	return accessToken;
}
