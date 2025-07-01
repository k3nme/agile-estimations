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
import { CssBaseline } from "@mui/material";
import Home from "../home-page/Home";
import PlanningPage from "../../planning-pages/PlanningPage";
import JoinRoom from "../room-ops/JoinRoom";
import MaintenanceMode from "../home-page/MaintenanceMode";
import CreateRoom from "../room-ops/CreateRoom";
export const ColorModeContext = createContext({
  setColorMode: () => { },
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

  const colorMode = useMemo(
    () => ({
      setColorMode: handleThemeChange,
    }),
    [handleThemeChange],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <CssBaseline />
      <Suspense fallback={<div className="container">Loading...</div>}>
        <Router>
          <Routes>
            <Route path='/' element={<MaintenanceMode />} />

            {/*<Route path="/" element={<Home />} /> */}
            {/*<Route path="/create-room" element={<CreateRoom />} />*/}
            {/*<Route path="/join-room" element={<JoinRoom />} />*/}
            {/*<Route path="/:roomID" element={<PlanningPage />} />*/}
          </Routes>
        </Router>
      </Suspense>
    </ColorModeContext.Provider>
  );
}

export default App;
