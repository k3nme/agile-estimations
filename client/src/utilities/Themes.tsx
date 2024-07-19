// src/themes.js
import { createTheme } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./ThemeVariables";

export const light = createTheme({
	palette: {
		primary: {
			main: lightTheme.primary,
		},
		secondary: {
			main: lightTheme.secondary,
		},
	},
	typography: {
		fontFamily: "Rubik, Arial, sans-serif",
	},
});

export const dark = createTheme({
	palette: {
		primary: {
			main: darkTheme.primary,
		},
		secondary: {
			main: darkTheme.secondary,
		},
	},
	typography: {
		fontFamily: "Rubik, Arial, sans-serif",
	},
});
