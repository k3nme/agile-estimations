// src/home-page/Home.js
import { useState, useContext } from "react";
import { IconButton } from "@mui/material";
import { ColorModeContext } from "../entry-pages/app/App";

function Home() {
	const { setColorMode } = useContext(ColorModeContext);
	const [mode, setMode] = useState<"light" | "dark">(
		localStorage.getItem("theme") as "light" | "dark"
	);

	const handleThemeChange = () => {
		const newMode = mode === "dark" ? "light" : "dark";
		setMode(newMode);
		localStorage.setItem("theme", newMode);
		setColorMode();
	};

	return (
		<>
			<IconButton onClick={handleThemeChange}>
				{mode === "dark" ? "🌞" : "🌙"}
			</IconButton>
		</>
	);
}

export default Home;
