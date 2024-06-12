import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import StartupLoading from "./components/startuploading";
import { AuthenticationProvider } from "./contexts/AuthenticationContext";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import { SettingsModalProvider } from "./SettingsModal";

import { SocketProvider } from "./contexts/SocketContext";
import { LobbyProvider } from "./contexts/LobbyContext";

const Root = () => (
	<Suspense fallback={<StartupLoading />}>
		<SettingsModalProvider>
			<AuthenticationProvider>
				<SocketProvider>
					<LobbyProvider>
						<App />
					</LobbyProvider>
				</SocketProvider>
			</AuthenticationProvider>
		</SettingsModalProvider>
	</Suspense>
);

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "",
				element: <Lobby />,
				children: [
					{
						path: "",
						element: <Home />,
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
