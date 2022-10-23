const submitButton = document.getElementById("postSubmitButton");
const usernameInput = document.getElementById("inline-username");
const repoNameInput = document.getElementById("inline-repo-name");

function postRequestToDelete() {
	const newRequest = new XMLHttpRequest();
	newRequest.open("POST", "http://127.0.0.1:5000/delete", true);
	newRequest.setRequestHeader("Content-Type", "application/json");

	newRequest.send(
		JSON.stringify({
			owner: usernameInput.value,
			repoName: repoNameInput.value,
		})
	);
}

submitButton.addEventListener("click", postRequestToDelete);
