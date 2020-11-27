document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("group-train-btn").addEventListener("click", groupTrain);
	document.getElementById("group-predict-btn").addEventListener("click", groupPredict);

	let playGroup = document.getElementsByClassName("play-group");
	let messageBoard = document.getElementById("message-board");
	let selectGroup = document.getElementsByClassName("playgroup-title");
	let selectedGroup = document.getElementById("group-select");
	let wheelSet = [];

	let selected1 = selectGroup[0].parentNode.querySelectorAll(".play-number");

	let showTitle1 = document.createElement("div");
	showTitle1.className = "show-title";
	showTitle1.textContent = selectGroup[0].innerText;
	selectedGroup.appendChild(showTitle1);
	selectGroup[0].style.backgroundColor = "#00ee00";

	for (let j = 0; j < selected1.length; j++) {
		let showNumber1 = document.createElement("div");
		showNumber1.className = "play-wheel-group";
		showNumber1.textContent = selected1[j].innerText;
		wheelSet.push(parseInt(selected1[j].innerText));
		selectedGroup.appendChild(showNumber1);
		selected1[j].style.backgroundColor = "#00ee00";
	}

	groupPredict();
	wheelNumbers();

	for (let i = 0; i < selectGroup.length; i++) {
		selectGroup[i].addEventListener("click", (e) => {
			wheelSet = [];
			document.querySelectorAll(".play-number").forEach((ele) => {
				ele.style.backgroundColor = "#ffc300";
			});
			let selected = e.target.parentNode.querySelectorAll(".play-number");
			let selectedTitle = document.querySelectorAll(".playgroup-title");
			selectedGroup.innerText = "";
			selectedTitle.forEach((ele) => {
				ele.style.backgroundColor = "#000000";
			});
			let showTitle = document.createElement("div");
			showTitle.className = "show-title";
			showTitle.textContent = e.target.innerText;
			selectedGroup.appendChild(showTitle);
			selectedTitle[i].style.backgroundColor = "#00ee00";

			for (let j = 0; j < selected.length; j++) {
				let showNumber = document.createElement("div");
				showNumber.className = "play-wheel-group";
				showNumber.textContent = selected[j].innerText;
				wheelSet.push(parseInt(selected[j].innerText));
				selectedGroup.appendChild(showNumber);
				selected[j].style.backgroundColor = "#00ee00";
			}

			wheelNumbers();
		});
	}

	async function groupTrain() {
		messageBoard.innerText = "Training in progess...";
		let groupName = { group: document.documentURI.slice(27) };
		let trained = await request("POST", "/group/train", groupName);
		messageBoard.innerText = trained.message;
	}

	async function groupPredict() {
		let groupName = { group: document.documentURI.slice(27) };
		let pred_score = document.getElementsByClassName("group-pred-score");
		let predicted = await request("POST", "/group/predict", groupName);

		if (isNaN(predicted[0])) {
			messageBoard.innerText = "";
			messageBoard.innerText = `${document.documentURI.slice(27).toUpperCase()} has not been trained`;
		} else {
			for (let i = 0; i < playGroup.length; i++) {
				pred_score[i].innerText = Math.round(predicted[i] * 100) + "%";
			}
		}
	}

	async function wheelNumbers() {
		let groupNumbers = { group: wheelSet };
		let wheelResults = await request("POST", "/group/wheel", groupNumbers);
		let ticketDisplay = document.getElementById("group-wheel");
		ticketDisplay.innerText = "";

		for (let i = 0; i < wheelResults.length; i++) {
			let ticketEntry = document.createElement("div");
			let ticketCheck = document.createElement("div");
			ticketEntry.className = "number-block";
			ticketCheck.className = "number-check";
			ticketEntry.appendChild(ticketCheck);

			for (let j = 0; j < wheelResults[i].length; j++) {
				let numberEntry = document.createElement("div");
				numberEntry.className = "number-pick";
				numberEntry.textContent = wheelResults[i][j];
				ticketEntry.appendChild(numberEntry);
			}

			ticketDisplay.appendChild(ticketEntry);
		}
	}

	function request(method, url, data = null) {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open(method, url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.onload = () => {
				if (xhr.status === 200) {
					return resolve(JSON.parse(xhr.responseText || "{}"));
				} else {
					return reject(new Error(`Request failed with status ${xhr.status}`));
				}
			};
			if (data) {
				xhr.send(JSON.stringify(data));
			} else {
				xhr.send();
			}
		});
	}
});
