import openChampLogoImgSrc from "@/assets/openchamp.png";
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
			<img
				src={openChampLogoImgSrc}
				alt="OpenChamp"
				className="aspect-square h-20 w-20 p-4"
			/>
			{/* <h1 className="mb-4 text-3xl font-bold text-stone-200">OpenChamp</h1> */}
			<form
				className="flex w-72 flex-col gap-4"
				ref={form}
				onSubmit={handleLoginSubmit}
			>
				<label className="flex flex-col">
					{/* <span className="font-bold text-brand-light">Tag</span> */}
					<input
						type="text"
						placeholder="USERNAME"
						name="tag"
						className="rounded-md border-2 border-brand-light border-opacity-30 bg-stone-950 p-3 text-sm font-bold tracking-widest text-white transition-all duration-300 focus:border-brand-light focus:border-opacity-60 focus:bg-stone-900 focus:outline-none"
					/>
				</label>

				<label className="flex flex-col">
					{/* <span className="font-bold text-brand-light">Password</span> */}
					<input
						type="password"
						placeholder="PASSWORD"
						name="password"
						className="rounded-md border-2 border-brand-light border-opacity-30 bg-stone-950 p-3 text-sm font-bold tracking-widest text-white transition-all duration-300 focus:border-brand-light focus:border-opacity-60 focus:bg-stone-900 focus:outline-none"
					/>
				</label>

				<div className="flex flex-col justify-between gap-4">
					<button
						type="submit"
						className="border-copper-400 bg-copper-600 hover:bg-copper-100 hover:border-copper-100 flex-1 rounded-md border px-6 py-3 font-bold text-stone-100 transition-all duration-300 hover:text-stone-800"
					>
						LOGIN
					</button>
					<button
						type="button"
						className="rounded-md border border-transparent px-6 py-3 font-bold text-stone-100 transition-all duration-300 hover:border-stone-100 hover:bg-stone-100 hover:text-stone-800"
						onClick={handleRegisterClick}
					>
						REGISTER
					</button>
				</div>
			</form>
		</section>
	);
}

export default Login;
