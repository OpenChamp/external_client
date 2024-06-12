import { createContext, useContext, useState } from "react";
import { useEvent, useSocket } from "./SocketContext";

export interface Lobby {
	gamemode: '1v1' | '3v3' | '5v5'
}

export interface ILobbyContext {
	lobby?: Lobby
	createLobby: (gamemode: '1v1' | '3v3' | '5v5') => void
	leaveCurrentLobby: () => void
}

export const LobbyContext = createContext<ILobbyContext>({
	createLobby: () => {},
	leaveCurrentLobby: () => {}
});

export function LobbyProvider({ children }: { children: React.ReactNode }) {
	const [lobby, setLobby] = useState<Lobby | undefined>(undefined)
	const emit = useSocket()

	const createLobby = (gamemode: '1v1' | '3v3' | '5v5') => {
		emit({ e: "lobby[create]", d: { gamemode } })
	}

	const leaveCurrentLobby = () => {
		emit({ e: "lobby[leave]" })
		setLobby(undefined)
	}

	useEvent('lobby[joined]', (data: Lobby) => {
		console.log('Joined lobby:', data)
		setLobby(data)
	}, [])

	return (
		<LobbyContext.Provider value={{ lobby, createLobby, leaveCurrentLobby }}>
			{children}
		</LobbyContext.Provider>
	)
}


