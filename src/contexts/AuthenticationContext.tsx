import { useSettings } from "@/SettingsModal";
import jsonFetch from "@/lib/jsonFetch";
import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

export interface IPublicUser {
	id: string;
	tag: string;
	avatar: "default";
	created_at: string;
}

export interface IAuthenticationContext {
	authenticated: boolean;
	token?: string;
	setToken: (token: string) => void;
	user?: IPublicUser;
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
	authenticated: false,
	setToken: () => {},
});

export function useAPI(): { call: typeof jsonFetch } {
	const { token } = useContext(AuthenticationContext);
	const [apiBase] = useSettings("api_base_url");
	return {
		call: (input: string | Partial<RequestInit>, init?: Partial<RequestInit>) =>
			jsonFetch(
				typeof input === "string" ? new URL(input, apiBase).toString() : input,
				{
					...init,
					headers: token
						? { Authorization: token, ...init?.headers }
						: init?.headers,
				},
			),
	};
}

export function useAuthenticatedUser() {
	const { user } = useContext(AuthenticationContext);
	return user;
}

// TODO: flicker while fetching if user is authenticated, suspense?
export function AuthenticationProvider({ children }: PropsWithChildren) {
	const [token, setInternalToken] = useState(
		window.localStorage.getItem("token"),
	);
	const [authenticated, setAuthenticated] = useState(false);
	const [apiBase] = useSettings("api_base_url");
	const [user, setUser] = useState<IPublicUser>();

	useEffect(() => {
		const validateToken = async () => {
			if (!token) {
				setAuthenticated(false);
				return;
			}
			try {
				const res = await fetch(new URL("/v0/session", apiBase).toString(), {
					method: "GET",
					headers: {
						Authorization: token,
					},
				});
				if (res.status === 200) {
					setAuthenticated(true);
					const user = await res.json();
					setUser(user);
				} else {
					setAuthenticated(false);
				}
			} catch (e) {
				setAuthenticated(false);
			}
		};

		validateToken();
	}, [token]);

	const setToken = (token: string) => {
		window.localStorage.setItem("token", token);
		setInternalToken(token);
	};

	return (
		<AuthenticationContext.Provider value={{ authenticated, user, setToken }}>
			{children}
		</AuthenticationContext.Provider>
	);
}
