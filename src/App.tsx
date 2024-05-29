import { useContext } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { TitleBar } from "./components/titlebar";
import { AuthenticationContext } from "./contexts/AuthenticationContext";
import Login from "./pages/Login";

function App() {
	const { authenticated } = useContext(AuthenticationContext);

	if (!authenticated) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<Login />
			</div>
		);
	}

	return (
		<main className="flex h-full flex-col">
			<TitleBar />
			<Outlet />
		</main>
	);
}

export default App;
