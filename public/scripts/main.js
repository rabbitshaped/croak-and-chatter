document.addEventListener("DOMContentLoaded", () => {
	// Croaking on submit
	const croakButton = document.getElementById("croakButton");
	croakButton.addEventListener("click", (event) => {
		event.preventDefault();
		// Play frog sound
		let froggySound = new Audio("sounds/freesound_community-frog-85649.mp3");
		// MUST be synchronous
		froggySound.play().catch((err) => {
			console.error("Audio play blocked:", err);
		});
		// Delay only the form submission
		setTimeout(() => {
			event.target.form.submit();
		}, 500);
	});
});
