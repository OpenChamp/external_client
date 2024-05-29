import { FriendList } from "@/components/friendlist";
function Lobby() {
	return (
		<section className="flex flex-1 items-center justify-center overflow-hidden">
			<h1 className="flex-1 text-white">Lobby</h1>
			<FriendList />
		</section>
	);
}

export default Lobby;
