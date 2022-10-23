import { Octokit } from "@octokit/rest";
import * as dotenv from "dotenv";
import request from "request";
import {
	addTokenToDatabase,
	checkIfUserExists,
	returnMongoClient,
	returnMongoCollection,
	returnMongoDatabase,
} from "./mongoDbFunctions.js";

dotenv.config();

export function returnOctokit(accessToken) {
	return new Octokit({
		auth: accessToken,
	});
}

export async function deleteRepo(owner, repo) {
	const user = await checkIfUserExists(owner);
	if (!user) {
		console.log("Please authenticate user");
	} else {
		try {
			console.log(user[0].authToken);
			const octokit = returnOctokit(user[user.length - 1].authToken);
			await octokit.request(`DELETE /repos/${user[0].user}/${repo}`, {
				owner: owner,
				repo: repo,
			});
			console.log("Repo successfully deleted");
		} catch (e) {
			console.log("Delete could not be completed");
			console.log(e);
		}
	}
}

export async function authPostRequest(code) {
	let accessToken;
	const options = {
		url: "https://github.com/login/oauth/access_token",
		json: true,
		body: {
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code: code,
		},
	};

	request.post(options, (err, res, body) => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(`Status: ${res.statusCode}`);
		accessToken = body.access_token;
		getGithubUsername(accessToken);
	});
}

export async function getGithubUsername(accessToken) {
	const octokit = returnOctokit(accessToken);

	const username = await octokit
		.request(`GET /user`, {})
		.then((githubJson) => {
			return githubJson.data.login;
		});

	console.log(username);

	const userBool = await checkIfUserExists(username);

	if (userBool.length > 0) {
		console.log("User already exists");
	} else {
		addTokenToDatabase(username, accessToken);
	}
}

export async function getAllRepos(owner, accessToken) {
	const username = getGithubUsername(accessToken);
}
