const packageinfo = `api/packageinfo/`;

function load() {
	fetchTweaksList().then((data) => {
		handleTweakData(data);
	});
}

function handleTweakData(data) {
	const listElement = document.createElement('div');

	data.package_ids.forEach((packageId) => {
		fetchPackageControl(packageId).then((controlData) => {
			const link = document.createElement('a');
			link.href = `depictions/index.html?packageId=${packageId}`;

			// Row content
			const tweakRow = document.createElement('div');
			tweakRow.className = 'tweak-row';

			// Tweak icon
			const image = document.createElement('img');
			image.src = `${packageinfo}${packageId}/icon.png`;
			image.className = 'tweak-row-img';
			tweakRow.appendChild(image);

			// Tweak description
			const tweakInfo = document.createElement('div');
			tweakInfo.className = 'tweak-info';

			const tweakTitle = document.createElement('h3');
			const tweakTitleText = document.createTextNode(`${controlData.Name}`);
			tweakTitle.className = 'tweak-title';
			tweakTitle.appendChild(tweakTitleText);
			tweakInfo.appendChild(tweakTitle);

			const tweakSubtitle = document.createElement('p');
			const tweakSubtitleText = document.createTextNode(`${controlData.Description}`);
			tweakSubtitle.className = 'tweak-subtitle';
			tweakSubtitle.appendChild(tweakSubtitleText);
			tweakInfo.appendChild(tweakSubtitleText);

			const chevronImage = document.createElement('img');
			chevronImage.src = 'assets/images/chevron.png';
			chevronImage.alt = 'Chevron';
			chevronImage.className = 'chevron-icon';

			tweakRow.appendChild(tweakInfo);
			tweakRow.appendChild(chevronImage);
			link.appendChild(tweakRow);
			listElement.appendChild(link);
		});

		document.getElementById('tweak-rows').appendChild(listElement);
	});
}

function isValidResponse(response) {
	return !(response.status >= 400 && response.status < 600);
}

// Async

async function fetchPackageControl(packageId) {
	try {
		const response = await fetch(`${packageinfo}${packageId}/control.json`);
		if (isValidResponse(response)) {
			return response.json();
		} else {
			throw new Error('Bad response from server');
		}
	} catch (error) {
		console.log(error);
	}
}

async function fetchTweaksList() {
	try {
		const response = await fetch(`api/packages.json`);
		if (isValidResponse(response)) {
			return response.json();
		} else {
			throw new Error('Bad response from server');
		}
	} catch (error) {
		console.log(error);
	}
}
