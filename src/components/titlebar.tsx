import { invoke } from "@tauri-apps/api";
import { useContext, type PropsWithChildren } from "react";

import { SettingsModalContext } from "@/SettingsModal";
import openChampLogoImgSrc from "@/assets/openchamp.png";
import {
	IPublicUser,
	useAuthenticatedUser,
} from "@/contexts/AuthenticationContext";
import { Link } from "react-router-dom";

export function TitleBar({ children }: PropsWithChildren) {
	const settingsModal = useContext(SettingsModalContext);
	const user = useAuthenticatedUser();

	return (
		<header
			data-tauri-drag-region
			className="relative flex h-20 w-full border-b border-b-brand-light border-opacity-20"
		>
			<div className="fixed z-50 h-4 w-full" data-tauri-drag-region />
			{/* Always on top so that the window can be dragged from the top bar */}
			<Link to="/">
				<img
					src={openChampLogoImgSrc}
					alt="OpenChamp"
					className="aspect-square h-20 w-20 p-4"
				/>
			</Link>
			<nav className="flex flex-1">{children}</nav>
			{user ? <UserMenu user={user} /> : null}
			<TitleBarButtonCluster>
				<TitleBarButton
					icon="https://api.iconify.design/heroicons:minus-16-solid.svg"
					onClick={() => invoke("minimize_main_window")}
				/>
				<TitleBarButton
					icon="https://api.iconify.design/heroicons:cog-6-tooth.svg"
					onClick={() => settingsModal.setOpen(true)}
				/>
				<TitleBarButton
					icon="https://api.iconify.design/heroicons:x-mark-16-solid.svg"
					onClick={() => invoke("exit_app")}
				/>
			</TitleBarButtonCluster>
		</header>
	);
}

function TitleBarButtonCluster({ children }: PropsWithChildren) {
	return <div className="absolute right-0 top-0 z-50 flex">{children}</div>;
}

function TitleBarButton({
	icon,
	onClick,
}: {
	icon: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className="cursor-pointer p-2 transition-colors duration-100 hover:bg-brand-light hover:bg-opacity-15"
			onClick={onClick}
		>
			<div
				className="h-4 w-4 bg-brand-light"
				style={{
					mask: `url(${icon}) no-repeat center`,
					WebkitMask: `url(${icon}) no-repeat center`,
				}}
			/>
		</button>
	);
}

function UserMenu({ user }: { user: IPublicUser }) {
	return (
		<div className="from-red absolute right-0 top-0 flex h-full w-64 gap-2 border-l border-l-brand-light border-opacity-5 bg-gradient-to-bl from-[#FFFFFF1A] to-transparent p-2.5">
			<img
				src={`/avatars/${user.avatar}.png`}
				alt={user.tag}
				className="aspect-square h-full rounded-full border-4 border-brand-light border-opacity-30 bg-brand-dark"
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
