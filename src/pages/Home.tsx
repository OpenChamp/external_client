const Home = () => {
	return (
		<div className="flex h-full w-full flex-col items-center justify-between gap-2 pb-12">
			<div className="grid h-full grid-cols-3 gap-4 p-4">
				<Map
					name="Final Destination"
					type="1v1"
					description="Make it to the other side and destroy anyone that gets in your way."
				/>
				<Map
					name="The Great Plateau"
					type="3v3"
					disabled
					description="Conquer the plateau and defeat the enemy team."
				/>
				<Map
					name="The Realm of Shadows"
					type="5v5"
					disabled
					description="Defend your base and destroy the enemy's."
				/>
			</div>
			<button
				className="fantasy-btn fantasy-copper rounded-sm p-3 px-16 text-2xl 
      font-bold text-zinc-100 transition-colors"
			>
				PLAY
			</button>
		</div>
	);
};

const Map = ({
	name,
	type,
	description,
	disabled = false,
}: {
	name: string;
	type: string;
	description: string;
	disabled?: boolean;
}) => {
	const disabledStyles =
		" opacity-50 cursor-not-allowed bg-zinc-950 bg-opacity-50 border-transparent";
	return (
		<div
			className={
				"grid h-full w-full flex-col place-items-center rounded" +
				(disabled ? disabledStyles : " border border-copper-500")
			}
		>
			<div className="flex flex-col items-center justify-center gap-6 text-center">
				<div className="border- h-20 w-20 rotate-45 rounded border-8 border-copper-500 bg-emerald-950" />
				<h2 className="text-3xl font-bold text-copper-300">{name}</h2>
				<p className="text-lg text-zinc-100">{type}</p>
				<p className="text-lg text-zinc-100">{description}</p>
				{disabled && <p className="text-lg text-zinc-100">Coming Soon</p>}
			</div>
			<div className="h-3 w-3 rotate-45 border-2 border-copper-500 bg-gradient-to-r from-emerald-900 to-emerald-800" />
		</div>
	);
};

export default Home;
