document.addEventListener("DOMContentLoaded", () => {
	const deleteScrollKey = "croak-and-chatter:delete-scroll";
	const croakButton = document.getElementById("croakButton");
	const commentInput = document.getElementById("commentInput");
	const commentCount = document.getElementById("commentCount");
	const musicToggle = document.getElementById("musicToggle");
	const backgroundMusic = document.getElementById("backgroundMusic");
	const commentsSection = document.querySelector(".comments-section");

	try {
		const savedDeleteScroll = sessionStorage.getItem(deleteScrollKey);
		if (savedDeleteScroll !== null) {
			sessionStorage.removeItem(deleteScrollKey);
			const scrollPosition = Number(savedDeleteScroll);
			const restoreScroll = () => {
				window.scrollTo({ top: scrollPosition, behavior: "instant" });
			};

			restoreScroll();
			requestAnimationFrame(restoreScroll);
			window.addEventListener("load", restoreScroll, { once: true });
		}
	} catch {
		// Storage can be unavailable in strict privacy modes; deletion still works.
	}

	document.querySelectorAll(".delete-comment-form").forEach((form) => {
		form.addEventListener("submit", () => {
			try {
				sessionStorage.setItem(deleteScrollKey, String(window.scrollY));
			} catch {
				// Keep the normal form submission if storage is unavailable.
			}
		});
	});

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
		const tabletQuery = window.matchMedia("(max-width: 1100px)");
		const editIndex = commentCards.findIndex((card) =>
			card.classList.contains("edit-card"),
		);
		let carouselStart = editIndex >= 0 ? editIndex : 0;
		let previousMode = "";

		const getCarouselMode = () => {
			if (mobileQuery.matches) return "mobile";
			if (tabletQuery.matches) return "tablet";
			return "desktop";
		};

		const updateCarousel = () => {
			const mode = getCarouselMode();
			const isMobile = mode === "mobile";
			const isTablet = mode === "tablet";
			const isCarousel = isMobile || isTablet;
			const pageSize = isMobile ? 1 : isTablet ? 4 : commentCards.length;
			const maximumStart = Math.max(0, commentCards.length - pageSize);

			if (mode !== previousMode) {
				if (isTablet) carouselStart = carouselStart >= 4 ? maximumStart : 0;
				if (mode === "desktop") carouselStart = 0;
				previousMode = mode;
			}

			carouselStart = Math.max(0, Math.min(carouselStart, maximumStart));
			commentsSection.classList.toggle("is-carousel-ready", isCarousel);
			commentsSection.classList.toggle("is-mobile-carousel", isMobile);
			commentsSection.classList.toggle("is-tablet-carousel", isTablet);

			commentCards.forEach((card, index) => {
				const isActive =
					isCarousel &&
					index >= carouselStart &&
					index < carouselStart + pageSize;
				card.classList.toggle("is-active", isActive);

				if (isCarousel) {
					card.hidden = !isActive;
					card.setAttribute("aria-hidden", String(!isActive));
				} else {
					card.hidden = false;
					card.removeAttribute("aria-hidden");
				}
			});

			if (!carouselControls || !commentCards.length) return;

			carouselControls.hidden = !isCarousel;
			if (currentOutput) {
				const firstVisible = carouselStart + 1;
				const lastVisible = Math.min(carouselStart + pageSize, commentCards.length);
				currentOutput.textContent = isTablet
					? `${firstVisible}–${lastVisible}`
					: String(firstVisible);
			}
			if (totalOutput) totalOutput.textContent = String(commentCards.length);
			if (previousButton) previousButton.disabled = carouselStart === 0;
			if (nextButton) nextButton.disabled = carouselStart >= maximumStart;
		};

		previousButton?.addEventListener("click", () => {
			if (carouselStart === 0) return;
			carouselStart = getCarouselMode() === "tablet" ? 0 : carouselStart - 1;
			updateCarousel();
		});

		nextButton?.addEventListener("click", () => {
			const pageSize = getCarouselMode() === "tablet" ? 4 : 1;
			const maximumStart = Math.max(0, commentCards.length - pageSize);
			if (carouselStart >= maximumStart) return;
			carouselStart =
				getCarouselMode() === "tablet" ? maximumStart : carouselStart + 1;
			updateCarousel();
		});

		if (typeof mobileQuery.addEventListener === "function") {
			mobileQuery.addEventListener("change", updateCarousel);
			tabletQuery.addEventListener("change", updateCarousel);
		} else {
			mobileQuery.addListener(updateCarousel);
			tabletQuery.addListener(updateCarousel);
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
		const musicStorageKey = "croak-and-chatter:pond-music";
		backgroundMusic.volume = 0.22;
		let wantsMusic = false;
		let lastSavedSecond = -1;

		const readMusicState = () => {
			try {
				const savedState = JSON.parse(sessionStorage.getItem(musicStorageKey));
				return {
					enabled: savedState?.enabled === true,
					currentTime: Number.isFinite(savedState?.currentTime)
						? Math.max(0, savedState.currentTime)
						: 0,
				};
			} catch {
				return { enabled: false, currentTime: 0 };
			}
		};

		const saveMusicState = () => {
			try {
				sessionStorage.setItem(
					musicStorageKey,
					JSON.stringify({
						enabled: wantsMusic,
						currentTime: backgroundMusic.currentTime || 0,
					}),
				);
			} catch {
				// Audio controls still work when storage is unavailable.
			}
		};

		const setMusicState = (isPlaying) => {
			musicToggle.classList.toggle("is-playing", isPlaying);
			musicToggle.setAttribute("aria-pressed", String(isPlaying));
			musicToggle.setAttribute(
				"aria-label",
				isPlaying ? "Pause pond ambience" : "Play pond ambience",
			);
			musicToggle.title = isPlaying ? "Pause pond ambience" : "Play pond ambience";
		};

		const resumeAfterInteraction = async (event) => {
			if (!wantsMusic || !backgroundMusic.paused) return;
			if (event.target instanceof Element && event.target.closest("#musicToggle")) return;

			try {
				await backgroundMusic.play();
				document.removeEventListener("pointerdown", resumeAfterInteraction);
				document.removeEventListener("keydown", resumeAfterInteraction);
			} catch {
				// The next user gesture can try again if autoplay remains blocked.
			}
		};

		const tryResumeMusic = async () => {
			if (!wantsMusic) return;

			try {
				await backgroundMusic.play();
			} catch {
				document.addEventListener("pointerdown", resumeAfterInteraction);
				document.addEventListener("keydown", resumeAfterInteraction);
			}
		};

		const savedMusicState = readMusicState();
		wantsMusic = savedMusicState.enabled;
		const restorePlayhead = () => {
			if (savedMusicState.currentTime > 0) {
				backgroundMusic.currentTime = savedMusicState.currentTime;
			}
			tryResumeMusic();
		};

		if (backgroundMusic.readyState >= 1) {
			restorePlayhead();
		} else {
			backgroundMusic.addEventListener("loadedmetadata", restorePlayhead, {
				once: true,
			});
		}

		backgroundMusic.addEventListener("play", () => setMusicState(true));
		backgroundMusic.addEventListener("pause", () => setMusicState(false));
		backgroundMusic.addEventListener("timeupdate", () => {
			const currentSecond = Math.floor(backgroundMusic.currentTime);
			if (currentSecond - lastSavedSecond < 2) return;
			lastSavedSecond = currentSecond;
			saveMusicState();
		});
		window.addEventListener("pagehide", saveMusicState);

		musicToggle.addEventListener("click", async () => {
			if (!backgroundMusic.paused) {
				wantsMusic = false;
				backgroundMusic.pause();
				saveMusicState();
				return;
			}

			wantsMusic = true;
			try {
				await backgroundMusic.play();
				saveMusicState();
			} catch {
				wantsMusic = false;
				setMusicState(false);
				saveMusicState();
			}
		});

		setMusicState(false);
	}
});
