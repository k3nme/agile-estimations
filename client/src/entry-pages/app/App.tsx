// src/App.tsx
import {
	useState,
	createContext,
	useMemo,
	useEffect,
	Suspense,
	useCallback,
} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Home from "../home-page/Home";
import PlanningPage from "../../planning-pages/PlanningPage";
import { light, dark } from "../../utilities/Themes";
import JoinRoom from "../room-ops/JoinRoom";
import RoomHistory from "../room-ops/RoomHistory";
import CreateRoom from "../room-ops/CreateRoom";

export const ColorModeContext = createContext({
	setColorMode: () => {},
});

function App() {
	const [mode, setMode] = useState<"light" | "dark">("light");

	useEffect(() => {
		const themeType = localStorage.getItem("theme");
		if (themeType === "dark") {
			setMode("light");
		} else {
			setMode("dark");
		}
	}, []);

	const handleThemeChange = useCallback(() => {
		if (mode === "dark") {
			setMode("light");
			localStorage.setItem("theme", "light");
		} else {
			setMode("dark");
			localStorage.setItem("theme", "dark");
		}
	}, [mode]);

	const materialTheme = useMemo(() => {
		if (mode === "dark") {
			return light;
		} else {
			return dark;
		}
	}, [mode]);

	const colorMode = useMemo(
		() => ({
			setColorMode: handleThemeChange,
		}),
		[handleThemeChange]
	);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={materialTheme}>
				<CssBaseline />
				<Suspense fallback={<div className='container'>Loading...</div>}>
					<Router>
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/create-room' element={<CreateRoom />} />
							<Route path='/join-room' element={<JoinRoom />} />
							<Route path='/history' element={<RoomHistory />} />
							<Route path='/:roomID' element={<PlanningPage />} />
						</Routes>
					</Router>
				</Suspense>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
