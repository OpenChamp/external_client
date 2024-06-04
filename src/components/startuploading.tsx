import openChampLogoImgSrc from "@/assets/openchamp.png";

const StartupLoading = () => (
	<div className="grid h-full w-full place-items-center">
		<div className="grid aspect-square h-[75%] place-items-center rounded-full border-4 border-copper-700 p-2">
			<div className="grid aspect-square h-[100%] place-items-center rounded-full border border-zinc-700">
				<div className="relative grid w-full place-items-center gap-4">
					<img
						src={openChampLogoImgSrc}
						className="h-32 w-32"
						alt="Loading..."
					/>
					<p className="absolute top-36 text-xl font-medium tracking-widest text-copper-500">
						LOADING
					</p>
				</div>
			</div>
		</div>
	</div>
);

export default StartupLoading;
