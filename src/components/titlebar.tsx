import { appWindow } from "@tauri-apps/api/window";
import { useContext, type PropsWithChildren } from "react";

import { SettingsModalContext } from "@/SettingsModal";
import {
	IPublicUser,
	useAuthenticatedUser,
} from "@/contexts/AuthenticationContext";

export function TitleBar({ children }: PropsWithChildren) {
	const settingsModal = useContext(SettingsModalContext);
	const user = useAuthenticatedUser();

	return (
		<header
			data-tauri-drag-region
			className="absolute z-50 flex w-full items-center justify-end gap-1"
		>
			{/* {user && <UserMenu user={user} />} */}
			<div
				data-tauri-drag-region
				className="flex grow items-center justify-end gap-1 pr-1"
			>
				<TitleBarButton
					icon="https://api.iconify.design/heroicons:minus-16-solid.svg"
					onClick={() => appWindow.minimize()}
				/>
				<TitleBarButton
					icon="https://api.iconify.design/heroicons:cog-6-tooth.svg"
					onClick={() => settingsModal.setOpen(true)}
				/>
				<TitleBarButton
					icon="https://api.iconify.design/heroicons:x-mark-16-solid.svg"
					onClick={() => appWindow.close()}
				/>
			</div>
		</header>
	);
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
			className="cursor-pointer p-2 transition-colors hover:brightness-125"
			onClick={onClick}
		>
			<div
				className="h-4 w-4 bg-copper-300"
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
				className="aspect-square h-full rounded-full border-2 border-copper-600 bg-brand-dark"
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
