import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";

import App from "./App";
import { AuthenticationProvider } from "./contexts/AuthenticationContext";
import Lobby from "./pages/Lobby";
import { SettingsModalProvider } from "./SettingsModal";

import openChampLogoImgSrc from "@/assets/openchamp.png";
import { SocketProvider } from "./contexts/SocketContext";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/"
			element={
				<Suspense
					fallback={
						<div className="flex h-full w-full items-center justify-center">
							<img src={openChampLogoImgSrc} className="h-20 w-20" />
						</div>
					}
				>
					<SettingsModalProvider>
						<AuthenticationProvider>
							<SocketProvider>
								<App />
							</SocketProvider>
						</AuthenticationProvider>
					</SettingsModalProvider>
				</Suspense>
			}
		>
			<Route path="" element={<Lobby />} />
		</Route>,
	),
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
