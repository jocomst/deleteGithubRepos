import express, { json } from "express";
import cors from "cors";
import { deleteRepo, authPostRequest } from "./repoFunctions.js";

const app = express();
const port = 5000;

app.use(json());
app.use(cors());

app.post("/delete", (req, res) => {
	try {
		const { owner, repoName } = req.body;
		deleteRepo(owner, repoName);
		res.sendStatus(200);
	} catch (e) {
		console.error(e);
		console.log("Repo not found");
		res.sendStatus(404);
	}
});

app.get("/user/signin/callback", (req, res) => {
	const { query } = req;
	const { code } = query;
	if (!code) {
		res.sendStatus(404);
	} else {
		authPostRequest(code);
		res.redirect("http://localhost:5500/src/public_html");
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
