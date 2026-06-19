document.addEventListener("DOMContentLoaded", () => {
	const croakButton = document.getElementById("croakButton");
	if (!croakButton) return;

	croakButton.addEventListener("click", (event) => {
		const form = event.currentTarget.form;
		if (!form.reportValidity()) return;

		event.preventDefault();
		const froggySound = new Audio("/sounds/freesound_community-frog-85649.mp3");
		froggySound.play().catch((err) => {
			console.error("Audio play blocked:", err);
		});

		setTimeout(() => {
			form.submit();
		}, 500);
	});
});
