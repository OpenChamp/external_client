import { useSettings } from "@/SettingsModal";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "./AuthenticationContext";

interface ISocketContext {
	socket: WebSocket | null;
	send: (data: any) => void;
	on: (event: string, callback: (data: any) => void) => void;
	off: (event: string, callback: (data: any) => void) => void;
}

export const SocketContext = createContext<ISocketContext>({
	socket: null,
	send: () => {},
	on: () => {},
	off: () => {},
});

export function useSocket() {
	const context = useContext(SocketContext);
	return context.send
}

export function useEvent(event: string, callback: (data: any) => void, deps: any[]) {
	const context = useContext(SocketContext);
	useEffect(() => {
		context.on(event, callback);
		return () => {
			context.off(event, callback);
		};
	}, deps);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const [apiBase] = useSettings("api_base_url")
	const { token } = useContext(AuthenticationContext)
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [connectionCounter, setConnectionCounter] = useState<number>(0);
	const [, setReconnectTimeout] = useState<NodeJS.Timeout | null>(null);
	const [, setHeartbeat] = useState<NodeJS.Timeout | null>(null);
	const [events] = useState<Record<string, ((data: any) => void)[]>>({});

	const send = (data: any) => {
		if (socket) {
			console.log("[ws] <-", data)
			socket.send(JSON.stringify(data));
		}
	};

	const on = (event: string, callback: (data: any) => void) => {
		if (!events[event]) {
			events[event] = [];
		}
		events[event].push(callback);
	};

	const off = (event: string, callback: (data: any) => void) => {
		if (events[event]) {
			events[event] = events[event].filter((cb) => cb !== callback);
		}
	};

	useEffect(() => {
		if (!token) {
			return;
		}

		console.log(`[ws] Connecting to server [rc=${connectionCounter}]`)
	
		const ws = new WebSocket(`${apiBase}/v0/ws?jwt=${token}&rc=${connectionCounter}`);
		
		setSocket(ws);
		return () => {
			ws.close();
		};
	}, [apiBase, token, connectionCounter]);

	useEffect(() => {
		if (!socket) return
		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log("[ws] ->", data)
			if (data.e === "start_heartbeat") {
				setHeartbeat(setInterval(() => {
					send({ e: "heartbeat" });
				}, data.d.interval));
			}
			if (events[data.e]) {
				events[data.e].forEach((cb) => cb(data.d));
			}
		};
		socket.onopen = () => {
			console.log("[ws] Connected to server");
		}
		socket.onclose = () => {
			console.log("[ws] Disconnected from server");
			setHeartbeat(hb => {
				if (hb) {
					clearInterval(hb);
				}
				return null;
			})
			
			setReconnectTimeout(rct => {
				if (rct) {
					clearTimeout(rct);
				}
				return setTimeout(() => {
					setConnectionCounter(cc => cc + 1);
				}, 5000);
			})
		}
	}, [socket]);

	return (
		<SocketContext.Provider value={{ socket, send, on, off }}>
			{children}
		</SocketContext.Provider>
	);
}