import { useContext } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { TitleBar } from "./components/titlebar";
import { AuthenticationContext } from "./contexts/AuthenticationContext";
import Login from "./pages/Login";

function App() {
	const { authenticated } = useContext(AuthenticationContext);
	return (
		<main className="flex h-full flex-col">
			<TitleBar />
			{authenticated ? <Outlet /> : <Login />}
		</main>
	);
}

export default App;
