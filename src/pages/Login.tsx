import {
	AuthenticationContext,
	useAPI,
} from "@/contexts/AuthenticationContext";
import {
	faDiscord,
	faGithub,
	faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useContext, useRef } from "react";

const socialLinks = [
	{
		to: "https://github.com/OpenChamp",
		icon: faGithub,
	},
	{
		to: "https://discord.gg/f6DGjvTWYT",
		icon: faDiscord,
	},
	{
		to: "https://www.youtube.com/channel/UCHQjCkTokQBNpS3vunY7d7Q",
		icon: faYoutube,
	},
	{
		to: "https://ko-fi.com/openchamp",
		icon: faHandHoldingDollar,
	},
];

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
				className="flex w-[350px] flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-950 bg-opacity-80 p-6 shadow-xl"
				ref={form}
				onSubmit={handleLoginSubmit}
			>
				<label className="flex flex-col">
					<input
						type="text"
						placeholder="USERNAME"
						name="tag"
						className="rounded-md border border-zinc-800 bg-zinc-900 p-3 text-sm font-bold tracking-widest text-white transition-all duration-300 placeholder:text-zinc-300 focus:bg-zinc-800"
					/>
				</label>

				<label className="flex flex-col">
					<input
						type="password"
						placeholder="PASSWORD"
						name="password"
						className="rounded-md border border-zinc-800 bg-zinc-900 p-3 text-sm font-bold tracking-widest text-white transition-all duration-300 placeholder:text-zinc-300 focus:bg-zinc-800"
					/>
				</label>

				<div className="flex flex-col justify-between gap-4">
					<button
						type="submit"
						className="flex-1 rounded-md border border-copper-400 bg-copper-600 px-6 py-3 font-bold text-zinc-100 transition-all duration-300 hover:border-copper-100 hover:bg-copper-100 hover:text-zinc-800"
					>
						LOGIN
					</button>
					<button
						type="button"
						className="rounded-md border border-transparent px-6 py-3 font-bold text-zinc-100 transition-all duration-300 hover:border-zinc-100 hover:bg-zinc-100 hover:text-zinc-800"
						onClick={handleRegisterClick}
					>
						REGISTER
					</button>
					<div className="mb-4 flex justify-center gap-2">
						{socialLinks.map((link) => (
							<a key={link.to} href={link.to} target="_blank" rel="noreferrer">
								<button
									key={link.to}
									className="flex aspect-square h-10 w-10 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-zinc-100 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-800"
								>
									<FontAwesomeIcon icon={link.icon} size="xl" />
								</button>
							</a>
						))}
					</div>
				</div>
			</form>
		</section>
	);
}

export default Login;
