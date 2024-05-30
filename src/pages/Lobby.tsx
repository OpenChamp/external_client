import { FriendList } from "@/components/friendlist";
function Lobby() {
	return (
		<section className="flex w-full flex-1 items-center justify-center overflow-hidden">
			<div className="h-full flex-1 p-2">
				<h1 className="text-copper-300">Lobby</h1>
			</div>

			<FriendList />
		</section>
	);
}

export default Lobby;
