const menuToggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-links');

if (menuToggle && menu) {
	menuToggle.addEventListener('click', () => {
		const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
		menuToggle.setAttribute('aria-expanded', String(!expanded));
		menu.classList.toggle('open');
	});

	menu.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => {
			menu.classList.remove('open');
			menuToggle.setAttribute('aria-expanded', 'false');
		});
	});
}

const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach((item) => {
	const trigger = item.querySelector('.accordion-trigger');

	trigger?.addEventListener('click', () => {
		const isActive = item.classList.contains('active');

		accordionItems.forEach((other) => {
			other.classList.remove('active');
			other.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
		});

		if (!isActive) {
			item.classList.add('active');
			trigger.setAttribute('aria-expanded', 'true');
		}
	});
});

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const filter = button.dataset.filter;

		filterButtons.forEach((btn) => btn.classList.remove('active'));
		button.classList.add('active');

		projectCards.forEach((card) => {
			const category = card.dataset.category;
			const isVisible = filter === 'all' || filter === category;
			card.classList.toggle('hide', !isVisible);
		});
	});
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view');
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15 }
	);

	revealElements.forEach((element) => observer.observe(element));
} else {
	revealElements.forEach((element) => element.classList.add('in-view'));
}

const yearElement = document.querySelector('#year');
if (yearElement) {
	yearElement.textContent = ` | ${new Date().getFullYear()}`;
}

const toolsGallery = document.querySelector('.tools-gallery');
const topLane = document.querySelector('.tools-lane-top');
const bottomLane = document.querySelector('.tools-lane-bottom');

if (toolsGallery && topLane && bottomLane) {
	let ticking = false;

	const syncGalleryWithScroll = () => {
		const topLoopWidth = topLane.scrollWidth / 2;
		const bottomLoopWidth = bottomLane.scrollWidth / 2;

		if (!topLoopWidth || !bottomLoopWidth) {
			return;
		}

		const scrollAmount = window.scrollY;
		const topOffset = (scrollAmount * 0.44) % topLoopWidth;
		const bottomOffset = (scrollAmount * 0.34) % bottomLoopWidth;

		topLane.style.transform = `translate3d(${-topOffset}px, 0, 0)`;
		bottomLane.style.transform = `translate3d(${-(bottomLoopWidth - bottomOffset)}px, 0, 0)`;
	};

	const requestSync = () => {
		if (ticking) {
			return;
		}

		ticking = true;
		requestAnimationFrame(() => {
			ticking = false;
			syncGalleryWithScroll();
		});
	};

	window.addEventListener('scroll', requestSync, { passive: true });
	window.addEventListener('resize', requestSync);
	requestSync();
}

const featuredSlider = document.querySelector('[data-featured-slider]');

if (featuredSlider) {
	const track = featuredSlider.querySelector('[data-featured-track]');
	const prevButton = featuredSlider.querySelector('.featured-slider-prev');
	const nextButton = featuredSlider.querySelector('.featured-slider-next');
	const slides = track ? track.querySelectorAll('.featured-slide') : [];

	if (track && prevButton && nextButton && slides.length > 0) {
		let currentIndex = 0;
		let autoPlayTimer;

		const goToSlide = (index) => {
			const totalSlides = slides.length;
			currentIndex = (index + totalSlides) % totalSlides;
			track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;
		};

		const restartAutoPlay = () => {
			window.clearInterval(autoPlayTimer);
			autoPlayTimer = window.setInterval(() => {
				goToSlide(currentIndex + 1);
			}, 10000);
		};

		prevButton.addEventListener('click', () => {
			goToSlide(currentIndex - 1);
			restartAutoPlay();
		});

		nextButton.addEventListener('click', () => {
			goToSlide(currentIndex + 1);
			restartAutoPlay();
		});

		goToSlide(0);
		restartAutoPlay();
	}
}
