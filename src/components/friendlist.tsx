import {
	IPublicUser,
	useAuthenticatedUser,
} from "@/contexts/AuthenticationContext";

export function FriendList() {
	const user = useAuthenticatedUser();

	return (
		<aside className="flex h-full w-56 flex-col border-l border-zinc-800 bg-zinc-900">
			{user && <UserMenu user={user} />}
			<div className="flex items-center justify-between">
				<h2 className="p-2 text-copper-300">Friends</h2>
				<button className="p-2 text-brand-light hover:bg-brand-light hover:bg-opacity-10">
					+
				</button>
			</div>
			<div className="flex-1 overflow-y-scroll"></div>
		</aside>
	);
}

function UserMenu({ user }: { user: IPublicUser }) {
	return (
		<div className="from-red flex gap-2 border-b border-l border-zinc-800 border-l-brand-light border-opacity-5 bg-gradient-to-bl from-zinc-800 to-transparent p-3">
			<img
				src={`/avatars/${user.avatar}.png`}
				alt={user.tag}
				className="aspect-square h-16 rounded-full border-2 border-copper-600 bg-brand-dark"
			/>

			<div className="flex flex-1 flex-col justify-center gap-0.5">
				<span className="max-w-full overflow-ellipsis whitespace-nowrap text-sm font-semibold text-brand-light">
					{user.tag}
				</span>
				<span className="flex items-center gap-1 text-xs text-green-600">
					<div className="h-3 w-3 rounded-full border-2 border-green-300 bg-green-600 " />
					Online
				</span>
			</div>
		</div>
	);
}
