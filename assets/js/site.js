/* Federico Maguire Portfolio: small, dependency-free interactions */
(function () {
	"use strict";

	var header = document.querySelector(".site-header");
	var toggle = document.querySelector(".nav-toggle");
	var nav = document.getElementById("site-nav");

	/* Header gets a border once the page scrolls */
	if (header) {
		var onScroll = function () {
			header.classList.toggle("is-scrolled", window.scrollY > 8);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
	}

	/* Mobile menu */
	if (toggle && nav) {
		var setOpen = function (open) {
			toggle.setAttribute("aria-expanded", open ? "true" : "false");
			nav.classList.toggle("is-open", open);
		};
		toggle.addEventListener("click", function () {
			setOpen(toggle.getAttribute("aria-expanded") !== "true");
		});
		nav.addEventListener("click", function (e) {
			if (e.target.closest("a")) setOpen(false);
		});
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && nav.classList.contains("is-open")) {
				setOpen(false);
				toggle.focus();
			}
		});
		document.addEventListener("click", function (e) {
			if (nav.classList.contains("is-open") && !header.contains(e.target)) setOpen(false);
		});
		window.matchMedia("(min-width: 1041px)").addEventListener("change", function (mq) {
			if (mq.matches) setOpen(false);
		});
	}

	/* Lightbox for gallery images (links marked data-lightbox) */
	var links = document.querySelectorAll("a[data-lightbox]");
	if (links.length && typeof HTMLDialogElement === "function") {
		var dialog = document.createElement("dialog");
		dialog.className = "lightbox";
		dialog.setAttribute("aria-label", "Image viewer");
		dialog.innerHTML =
			'<figure><img alt="" /><div class="lightbox-bar"><figcaption></figcaption>' +
			'<button type="button" class="button lightbox-close">Close</button></div></figure>';
		document.body.appendChild(dialog);

		var dImg = dialog.querySelector("img");
		var dCap = dialog.querySelector("figcaption");
		var opener = null;

		var close = function () { dialog.close(); };
		dialog.querySelector(".lightbox-close").addEventListener("click", close);
		dialog.addEventListener("click", function (e) {
			if (e.target === dialog) close();
		});
		dialog.addEventListener("close", function () {
			dImg.removeAttribute("src");
			if (opener) opener.focus();
		});

		Array.prototype.forEach.call(links, function (link) {
			link.addEventListener("click", function (e) {
				if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
				e.preventDefault();
				var img = link.querySelector("img");
				var alt = img ? img.getAttribute("alt") : "";
				opener = link;
				dImg.src = link.getAttribute("href");
				dImg.alt = alt || "";
				dCap.textContent = alt || "";
				dialog.showModal();
			});
		});
	}
})();
