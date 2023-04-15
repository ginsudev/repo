// Get package ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const packageId = urlParams.get('packageId');

function loadData() {
	setIcon();
	fetchInfo();
}

function setIcon() {
	document.getElementById('package-icon').src = `../packageinfo/${packageId}/icon.png`;
}

function fetchInfo() {
	fetch(`../packageinfo/${packageId}/display.json`)
		.then((response) => response.json())
		.then((data) => {
			// Get package control info from control.json file
			fetch(`../packageinfo/${packageId}/control.json`)
				.then((response) => response.json())
				.then((controlData) => {
					document.getElementById('package-name').innerText = controlData.Name;
					document.getElementById('author').innerText = controlData.Author;
					document.getElementById('twitter').innerText = data.contact.twitter;
					document.getElementById('discord').innerText = data.contact.discord;
					document.getElementById('section').innerText = controlData.Section;
					document.getElementById('source-code').innerText = data.information.source_code_link;

					const version = document.querySelectorAll('.version');
					version.forEach((versionNumber) => {
						versionNumber.innerText = controlData.Version;
					});
				})
				.catch((error) => {
					// Display error message if package control info cannot be loaded
					const content = document.getElementById('content');
					content.innerHTML = `Error loading package control info for ${packageId}: ${error}`;
				});
		})
		.catch((error) => {
			// Display error message if package info cannot be loaded
			const content = document.getElementById('content');
			content.innerHTML = `Error loading package info for ${packageId}: ${error}`;
		});
}
