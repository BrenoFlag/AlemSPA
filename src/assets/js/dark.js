//
//    The Dark Mode System
//

const darkModeToggle = document.getElementById("dark-mode-toggle");

// Helper functions to toggle dark mode
function enableDarkMode() {
	document.body.classList.add("dark-mode");
	localStorage.setItem("theme", "dark");
	// Update aria-pressed state
	if (darkModeToggle) {
		darkModeToggle.setAttribute("aria-pressed", "true");
	}
}

function disableDarkMode() {
	document.body.classList.remove("dark-mode");
	localStorage.setItem("theme", "light");
	// Update aria-pressed state
	if (darkModeToggle) {
		// Defensive check: ensure button exists
		darkModeToggle.setAttribute("aria-pressed", "false");
	}
}

// Always initialize the site in light mode regardless of stored or system preference
function setDefaultLightMode() {
        disableDarkMode();
}

// Run on page load to enforce the default light theme
setDefaultLightMode();

// Add event listener to the dark mode button toggle
if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
                // On click, toggle the theme based on the current body state
                document.body.classList.contains("dark-mode") ? disableDarkMode() : enableDarkMode();
        });
}
