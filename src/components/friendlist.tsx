export function FriendList() {
	return (
		<aside className="flex h-full w-64 flex-col border-l border-brand-light border-opacity-10 bg-brand-dark">
			<div className="flex items-center justify-between">
				<h2 className="p-2 font-semibold text-brand-light">Friends</h2>
				<button className="p-2 text-brand-light hover:bg-brand-light hover:bg-opacity-10">
					+
				</button>
			</div>
			<div className="flex-1 overflow-y-scroll"></div>
		</aside>
	);
}
