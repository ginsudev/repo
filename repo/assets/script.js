const packageinfo = `api/packageinfo/`;

function loadTweaks() {
	fetch(`api/packages.json`)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			let rowHTML = '';
			data.package_ids.forEach((packageId) => {
				fetch(`${packageinfo}${packageId}/control.json`)
					.then((response) => response.json())
					.then((controlData) => {
						rowHTML += `<a href='depictions/index.html?packageId=${packageId}'>`;
						rowHTML += `<div class='tweak-row'>`;
						rowHTML += `<img src='${packageinfo}${packageId}/icon.png' alt='' class='tweak-row-img'/>`;
						rowHTML += `<div class='tweak-info'>`;
						rowHTML += `<h3 class='tweak-title'>${controlData.Name}</h3>`;
						rowHTML += `<p class='tweak-subtitle'>${controlData.Description}</p>`;
						rowHTML += `</div>`;
						rowHTML += `<img src="assets/images/chevron.png" alt="Chevron" class="chevron-icon">`;
						rowHTML += `</div>`;
						rowHTML += `</a>`;
						document.getElementById('tweak-rows').innerHTML = rowHTML;
					})
					.catch((error) => {
						// Display error message if package control info cannot be loaded
						const content = document.getElementById('content');
						content.innerHTML = `Error loading package control info for ${packageId}: ${error}`;
					});
			});
		})
		.catch((error) => {
			// Display error message if package control info cannot be loaded
			const content = document.getElementById('content');
			content.innerHTML = `Error loading packages`;
		});
}
