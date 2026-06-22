document.addEventListener("DOMContentLoaded", () => {
	const croakButton = document.getElementById("croakButton");
	const commentInput = document.getElementById("commentInput");
	const commentCount = document.getElementById("commentCount");
	const musicToggle = document.getElementById("musicToggle");
	const backgroundMusic = document.getElementById("backgroundMusic");
	const commentsSection = document.querySelector(".comments-section");

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

	if (commentsSection) {
		const commentCards = Array.from(
			commentsSection.querySelectorAll(".comment-card"),
		);
		const carouselControls = commentsSection.querySelector(
			".comment-carousel-controls",
		);
		const previousButton = commentsSection.querySelector(
			".carousel-button--previous",
		);
		const nextButton = commentsSection.querySelector(".carousel-button--next");
		const currentOutput = commentsSection.querySelector(".carousel-current");
		const totalOutput = commentsSection.querySelector(".carousel-total");
		const mobileQuery = window.matchMedia("(max-width: 700px)");
		const editIndex = commentCards.findIndex((card) =>
			card.classList.contains("edit-card"),
		);
		let currentIndex = editIndex >= 0 ? editIndex : 0;

		const updateCarousel = () => {
			const isMobile = mobileQuery.matches;
			commentsSection.classList.toggle("is-carousel-ready", isMobile);

			commentCards.forEach((card, index) => {
				const isActive = isMobile && index === currentIndex;
				card.classList.toggle("is-active", isActive);

				if (isMobile) {
					card.hidden = !isActive;
					card.setAttribute("aria-hidden", String(!isActive));
				} else {
					card.hidden = false;
					card.removeAttribute("aria-hidden");
				}
			});

			if (!carouselControls || !commentCards.length) return;

			carouselControls.hidden = !isMobile;
			if (currentOutput) currentOutput.textContent = String(currentIndex + 1);
			if (totalOutput) totalOutput.textContent = String(commentCards.length);
			if (previousButton) previousButton.disabled = currentIndex === 0;
			if (nextButton) nextButton.disabled = currentIndex === commentCards.length - 1;
		};

		previousButton?.addEventListener("click", () => {
			if (currentIndex === 0) return;
			currentIndex -= 1;
			updateCarousel();
		});

		nextButton?.addEventListener("click", () => {
			if (currentIndex >= commentCards.length - 1) return;
			currentIndex += 1;
			updateCarousel();
		});

		if (typeof mobileQuery.addEventListener === "function") {
			mobileQuery.addEventListener("change", updateCarousel);
		} else {
			mobileQuery.addListener(updateCarousel);
		}

		updateCarousel();
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
