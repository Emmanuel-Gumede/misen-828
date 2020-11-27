document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("newdrawbtn").addEventListener("click", () => {
		document.getElementById("loader-wrapper").style.display = "block";
		document.getElementById("loader").style.display = "block";
	});

	window.onload = () => {
		document.getElementById("loader").style.display = "none";
		document.getElementById("loader-wrapper").style.display = "none";
	};

	document.getElementById("add-drawbtn").addEventListener("click", newDraw);

	let viewTabs = document.getElementsByClassName("grouptab");
	let activeTab = viewTabs[0];
	let forwardTab = document.getElementById("forward-btn");
	let backwardTab = document.getElementById("backward-btn");

	if (sessionStorage.length === 0) {
		activeTab = viewTabs[0];
	} else {
		activeTab.style.display = "none";
		activeTab = document.getElementsByClassName(`grouptab group${sessionStorage.getItem("viewTab")}`);
		activeTab[0].style.display = "flex";
		activeTab = activeTab[0];
	}

	forwardTab.addEventListener("click", () => {
		for (let i = 0; i < viewTabs.length; i++) {
			if (viewTabs[i] === activeTab) {
				if (i + 1 !== viewTabs.length) {
					activeTab.style.display = "none";
					viewTabs[i + 1].style.display = "flex";
					activeTab = viewTabs[i + 1];
				}
				i + 2 === viewTabs.length || i + 1 === viewTabs.length
					? (forwardTab.style.backgroundColor = "#ff0000")
					: (forwardTab.style.backgroundColor = "#00ff00");

				backwardTab.style.backgroundColor = "#00ff00";
				sessionStorage.setItem("viewTab", i + 1);
				return;
			}
		}
	});

	backwardTab.addEventListener("click", () => {
		for (let i = 0; i < viewTabs.length; i++) {
			if (viewTabs[i] === activeTab) {
				if (i - 1 !== -1) {
					activeTab.style.display = "none";
					viewTabs[i - 1].style.display = "flex";
					activeTab = viewTabs[i - 1];
				}
				i - 1 === 0 || i - 1 === -1
					? (backwardTab.style.backgroundColor = "#ff0000")
					: (backwardTab.style.backgroundColor = "#00ff00");
				forwardTab.style.backgroundColor = "#00ff00";
				sessionStorage.setItem("viewTab", i - 1);
				return;
			}
		}
	});

	let gotoTab = document.getElementById("gotobtn");
	gotoTab.addEventListener("click", () => {
		let gotocard = parseInt(document.getElementById("gotofield").value);
		gotocard % 6 === 0 ? (gotocard = gotocard / 6) : (gotocard = Math.ceil(gotocard / 6) - 1);
		activeTab.style.display = "none";

		if (gotocard > viewTabs.length - 1) {
			gotocard = viewTabs.length - 1;
		}

		switch (gotocard) {
			case 0:
				forwardTab.style.backgroundColor = "#00ff00";
				backwardTab.style.backgroundColor = "#ff0000";
				break;

			case 1:
				forwardTab.style.backgroundColor = "#00ff00";
				backwardTab.style.backgroundColor = "#00ff00";
				break;

			case viewTabs.length - 1:
				forwardTab.style.backgroundColor = "#ff0000";
				backwardTab.style.backgroundColor = "#00ff00";
				break;

			default:
				forwardTab.style.backgroundColor = "#00ff00";
				backwardTab.style.backgroundColor = "#00ff00";
				break;
		}

		activeTab = document.getElementsByClassName(`grouptab group${gotocard}`);
		activeTab[0].style.display = "flex";
		activeTab = activeTab[0];
		sessionStorage.setItem("viewTab", gotocard);
	});

	function newDraw() {
		document.querySelector("#new-draw").style.display = "block";
		document.querySelector("#add-draw").style.display = "none";
		document.querySelector("#draw-history").style.maxHeight = "66vh";
	}
});
