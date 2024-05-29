import { tauri } from "@tauri-apps/api";
import {
	PropsWithChildren,
	createContext,
	use,
	useContext,
	useEffect,
	useState,
	useTransition,
} from "react";

const SettingDisplayMap = {
	api_base_url: { label: "API Base URL", kind: "string" },
	game_exec_path: { label: "Game Executable Path", kind: "string" },
} as const;

export interface ISettingsModalContext {
	open: boolean;
	settings: Record<keyof typeof SettingDisplayMap, SettingValue>;
	setOpen: (open: boolean) => void;
	update: (key: string, value: any) => void;
}

type SettingValue = string;

export const SettingsModalContext = createContext<ISettingsModalContext>({
	open: false,
	settings: {} as ISettingsModalContext["settings"],
	setOpen: () => {},
	update: () => {},
});

export function useSettings(key: keyof typeof SettingDisplayMap) {
	const { settings, update } = useContext(SettingsModalContext);
	const setting = settings[key];
	const setValue = (value: any) => update(key, value);
	return [setting, setValue] as const;
}

export function SettingsModalProvider({ children }: PropsWithChildren) {
	const [initialSettingsPromise] = useState(
		() =>
			tauri.invoke("get_config") as Promise<ISettingsModalContext["settings"]>,
	);
	const initialSettings = use(initialSettingsPromise);
	const [_, startUpdateTransition] = useTransition();
	const [settings, setSettings] = useState(initialSettings);
	const [open, setOpen] = useState(false);

	const update = (key: string, value: any) => {
		startUpdateTransition(async () => {
			setSettings((prev) => ({ ...prev, [key]: value }));
			const res = (await tauri.invoke("set_config_value", {
				key,
				value,
			})) as ISettingsModalContext["settings"];
			setSettings(res);
		});
	};

	return (
		<SettingsModalContext.Provider value={{ open, setOpen, settings, update }}>
			{children}
			{open ? <SettingsModal /> : null}
		</SettingsModalContext.Provider>
	);
}

function SettingsModal() {
	const { setOpen, settings, update } = useContext(SettingsModalContext);
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="relative h-full max-h-[70vh] w-full max-w-xl rounded-lg border-2 border-brand-light border-opacity-30 bg-brand-dark p-4">
				<h2 className="text-2xl font-bold text-white">Launcher Options</h2>
				<button
					className="absolute right-1 top-1 cursor-pointer rounded-full p-1 transition-colors duration-100 hover:bg-brand-light hover:bg-opacity-15"
					onClick={() => setOpen(false)}
				>
					<div
						className="h-4 w-4 bg-brand-light"
						style={{
							mask: `url(https://api.iconify.design/heroicons:x-mark-16-solid.svg) no-repeat center`,
							WebkitMask: `url(https://api.iconify.design/heroicons:x-mark-16-solid.svg) no-repeat center`,
						}}
					/>
				</button>

				{Object.entries(settings).map(([key, setting]) => (
					<Setting
						key={key}
						id={key as keyof typeof SettingDisplayMap}
						setting={setting}
						update={update}
					/>
				))}
			</div>
		</div>
	);
}

function Setting({
	id,
	setting,
	update,
}: {
	id: keyof typeof SettingDisplayMap;
	setting: SettingValue;
	update: (key: string, value: any) => void;
}) {
	const display = SettingDisplayMap[id];
	switch (display.kind) {
		case "string":
			return (
				<SettingStringField
					id={id}
					label={display.label}
					value={setting}
					update={update}
				/>
			);
		default:
			return null;
	}
}

function SettingStringField({
	id,
	label,
	value,
	update,
}: {
	id: keyof typeof SettingDisplayMap;
	label: string;
	value: string;
	update: (key: string, value: string) => void;
}) {
	const [internalValue, setValue] = useState(value);
	useEffect(() => {
		setValue(value);
	}, [value]);
	return (
		<label className="mt-4 flex flex-col space-y-1">
			<span className="font-bold text-brand-light">{label}</span>
			<input
				type="text"
				value={internalValue}
				onChange={(e) => setValue(e.target.value)}
				onBlur={() => update(id, internalValue)}
				className="focus:bg-brand-darker rounded-md border-2 border-brand-light border-opacity-30 bg-brand-dark px-3 py-2 text-white focus:border-brand-light focus:border-opacity-60 focus:outline-none"
			/>
		</label>
	);
}
