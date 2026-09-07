/* Saru Gabriel-Alexandru — theme toggle, nav border, scrollspy. */
(function () {
	"use strict";

	var root = document.documentElement;
	var toggle = document.querySelector(".theme-toggle");

	if (toggle) {
		toggle.addEventListener("click", function () {
			var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
			root.setAttribute("data-theme", next);
			try {
				localStorage.setItem("theme", next);
			} catch (e) {
				/* storage unavailable — the choice just won't persist */
			}
		});
	}

	var nav = document.querySelector(".nav");

	window.addEventListener(
		"scroll",
		function () {
			if (nav) nav.classList.toggle("is-stuck", window.pageYOffset > 8);
		},
		{ passive: true }
	);

	var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
	var sections = links
		.map(function (link) {
			return document.querySelector(link.getAttribute("href"));
		})
		.filter(Boolean);

	if ("IntersectionObserver" in window && sections.length) {
		var spy = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					links.forEach(function (link) {
						link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
					});
				});
			},
			{ rootMargin: "-40% 0px -55% 0px" }
		);
		sections.forEach(function (section) {
			spy.observe(section);
		});
	}

	/* Subtle entrance for content blocks. The class is added here so the page
	   stays fully visible when JS or IntersectionObserver is unavailable. */
	var motionOk = !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	if (motionOk && "IntersectionObserver" in window) {
		var blocks = document.querySelectorAll(".entry, .project, .row, .figures");
		var shower = new IntersectionObserver(
			function (entries, observer) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					entry.target.classList.add("is-in");
					observer.unobserve(entry.target);
				});
			},
			{ rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
		);
		Array.prototype.forEach.call(blocks, function (el) {
			el.classList.add("reveal");
			shower.observe(el);
		});
	}

	/* CV chooser. Falls back to the one-page PDF where <dialog> is missing. */
	var cvDialog = document.getElementById("cv-dialog");
	var cvFallback = "Saru_Gabriel_Alexandru_CurriculumVitae.pdf";

	Array.prototype.forEach.call(document.querySelectorAll("[data-cv-open]"), function (btn) {
		btn.addEventListener("click", function () {
			if (cvDialog && typeof cvDialog.showModal === "function") {
				cvDialog.showModal();
			} else {
				window.open(cvFallback, "_blank", "noopener");
			}
		});
	});

	if (cvDialog) {
		Array.prototype.forEach.call(cvDialog.querySelectorAll("[data-cv-close]"), function (btn) {
			btn.addEventListener("click", function () {
				cvDialog.close();
			});
		});

		/* Clicking the backdrop lands on the dialog itself, not its contents. */
		cvDialog.addEventListener("click", function (event) {
			if (event.target === cvDialog) cvDialog.close();
		});

		/* Picking a CV is the end of the interaction — close behind it. */
		Array.prototype.forEach.call(cvDialog.querySelectorAll("a[href]"), function (link) {
			link.addEventListener("click", function () {
				cvDialog.close();
			});
		});
	}

	var year = document.querySelector("[data-year]");
	if (year) year.textContent = new Date().getFullYear();
})();
