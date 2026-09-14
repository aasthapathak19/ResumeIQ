import React, { useEffect, useState } from "react";

const DarkModeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const shouldBeDark = saved === "dark" || (!saved && prefersDark);
        setIsDark(shouldBeDark);
        document.documentElement.setAttribute("data-theme", shouldBeDark ? "dark" : "light");
    }, []);

    const toggleDark = () => {
        const next = !isDark;
        setIsDark(next);
        const theme = next ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    };

    return (
        <button
            className="dark-mode-toggle"
            onClick={toggleDark}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle dark mode"
            id="dark-mode-toggle"
        >
            <span className="dark-mode-icon">{isDark ? "☀️" : "🌙"}</span>
        </button>
    );
};

export default DarkModeToggle;
