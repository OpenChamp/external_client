export function FriendList() {
	return (
		<aside className="flex h-full w-64 flex-col border-l border-stone-800 bg-stone-900">
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
