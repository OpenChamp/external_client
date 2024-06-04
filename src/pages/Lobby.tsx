import { FriendList } from "@/components/friendlist";
import { Outlet } from "react-router-dom";

function Lobby() {
	return (
		<section className="flex w-full flex-1 items-center justify-center overflow-hidden">
			<div className="flex h-full flex-1 flex-col items-center justify-center">
				<Outlet />
			</div>
			<FriendList />
		</section>
	);
}

export default Lobby;
