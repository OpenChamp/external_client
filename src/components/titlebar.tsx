import { invoke } from "@tauri-apps/api";
import { appWindow } from '@tauri-apps/api/window';
import type { PropsWithChildren } from "react";

import openChampLogoImgSrc from "@/assets/openchamp.png";

export function TitleBar({ children }: PropsWithChildren) {
	return (
		<header
			data-tauri-drag-region
			className="relative flex h-20 w-full border-b border-b-brand-light border-opacity-20"
		>
			<img
				src={openChampLogoImgSrc}
				alt="OpenChamp"
				className="aspect-square h-full p-4"
			/>
			{children}
			<TitleBarButtonCluster>
				<TitleBarButton
					icon="https://api.iconify.design/heroicons:minus-16-solid.svg"
					onClick={() => appWindow.minimize()}
				/>
				<TitleBarButton
					icon="https://api.iconify.design/heroicons:cog-6-tooth.svg"
					onClick={() => {}}
				/>
				<TitleBarButton
					icon="https://api.iconify.design/heroicons:x-mark-16-solid.svg"
					onClick={() => appWindow.close()}
				/>
			</TitleBarButtonCluster>
		</header>
	);
}

function TitleBarButtonCluster({ children }: PropsWithChildren) {
	return <div className="absolute right-0 top-0 flex">{children}</div>;
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
