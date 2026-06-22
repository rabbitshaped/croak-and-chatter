document.addEventListener("DOMContentLoaded", () => {
	const croakButton = document.getElementById("croakButton");
	const commentInput = document.getElementById("commentInput");
	const commentCount = document.getElementById("commentCount");
	const musicToggle = document.getElementById("musicToggle");
	const backgroundMusic = document.getElementById("backgroundMusic");

	if (commentInput && commentCount) {
		const updateCommentCount = () => {
			if (commentInput.value.length > commentInput.maxLength) {
				commentInput.value = commentInput.value.slice(0, commentInput.maxLength);
			}

			commentCount.value = commentInput.value.length;
		};

		updateCommentCount();
		commentInput.addEventListener("input", updateCommentCount);
	}

	if (croakButton) {
		croakButton.addEventListener("click", (event) => {
			const form = event.currentTarget.form;
			if (!form.reportValidity()) return;

			event.preventDefault();
			const froggySound = new Audio("/sounds/freesound_community-frog-85649.mp3");
			froggySound.play().catch(() => {});

			setTimeout(() => {
				form.submit();
			}, 500);
		});
	}

	if (musicToggle && backgroundMusic) {
		backgroundMusic.volume = 0.22;

		const setMusicState = (isPlaying) => {
			musicToggle.classList.toggle("is-playing", isPlaying);
			musicToggle.setAttribute("aria-pressed", String(isPlaying));
			musicToggle.setAttribute(
				"aria-label",
				isPlaying ? "Pause pond ambience" : "Play pond ambience",
			);
			musicToggle.title = isPlaying ? "Pause pond ambience" : "Play pond ambience";
		};

		musicToggle.addEventListener("click", async () => {
			if (!backgroundMusic.paused) {
				backgroundMusic.pause();
				setMusicState(false);
				return;
			}

			try {
				await backgroundMusic.play();
				setMusicState(true);
			} catch {
				setMusicState(false);
			}
		});
	}
});
