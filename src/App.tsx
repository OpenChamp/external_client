import { useContext } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { TitleBar } from "./components/titlebar";
import { AuthenticationContext } from "./contexts/AuthenticationContext";
import Login from "./pages/Login";

function App() {
	const { authenticated: isAuthenticated } = useContext(AuthenticationContext);

	return (
		<main className="flex h-full flex-col">
			<TitleBar />
			{isAuthenticated ? <Outlet /> : <Login />}
		</main>
	);
}

export default App;
