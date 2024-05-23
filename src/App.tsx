import { Outlet } from "react-router-dom";
import "./App.css";
import { TitleBar } from "./components/titlebar";

function App() {
	return (
		<main>
			<TitleBar />
			<Outlet />
		</main>
	);
}

export default App;
