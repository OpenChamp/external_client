import {
	AuthenticationContext,
	useAPI,
} from "@/contexts/AuthenticationContext";
import { useContext, useRef } from "react";

function Login() {
	const form = useRef<HTMLFormElement>(null);
	const api = useAPI();
	const { setToken } = useContext(AuthenticationContext);

	// TODO: these could be combined into a single function, at least the fetch part

	async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!form.current) return;
		try {
			const res = await api.call("/v0/session/", {
				method: "POST",
				body: new FormData(form.current),
			});
			if ("token" in res) {
				setToken(res.token);
			} else if ("error" in res) {
				console.error(res.error);
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function handleRegisterClick(
		event: React.MouseEvent<HTMLButtonElement>,
	) {
		event.preventDefault();
		if (!form.current) return;
		try {
			const res = await api.call("/v0/users/", {
				method: "POST",
				body: new FormData(form.current),
			});
			if ("token" in res) {
				setToken(res.token);
			} else if ("error" in res) {
				console.error(res.error);
			}
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<section className="flex flex-1 flex-col items-center justify-center">
			<form
				className="flex w-72 flex-col space-y-4"
				ref={form}
				onSubmit={handleLoginSubmit}
			>
				<label className="flex flex-col">
					<span className="font-bold text-brand-light">Tag</span>
					<input
						type="text"
						placeholder="Username"
						name="tag"
						className="focus:bg-brand-darker rounded-md border-2 border-brand-light border-opacity-30 bg-brand-dark px-3 py-2 text-white focus:border-brand-light focus:border-opacity-60 focus:outline-none"
					/>
				</label>
				<label className="flex flex-col">
					<span className="font-bold text-brand-light">Password</span>
					<input
						type="password"
						placeholder="••••••••••••"
						name="password"
						className="focus:bg-brand-darker rounded-md border-2 border-brand-light border-opacity-30 bg-brand-dark px-3 py-2 text-white focus:border-brand-light focus:border-opacity-60 focus:outline-none"
					/>
				</label>
				<div className="flex justify-between gap-2">
					<button
						type="button"
						className="flex-1 rounded-md border-2 border-brand-light border-opacity-30 p-1 text-brand-light hover:bg-brand-light hover:bg-opacity-10"
						onClick={handleRegisterClick}
					>
						Register
					</button>
					<button
						type="submit"
						className="flex-1 rounded-md border-2 border-brand-light border-opacity-30 bg-[#6F58C9] p-1 text-brand-light hover:bg-opacity-80"
					>
						Login
					</button>
				</div>
			</form>
		</section>
	);
}

export default Login;
