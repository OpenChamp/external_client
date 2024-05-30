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
	api_base_url: { label: "BASE API URL", kind: "string" },
	game_exec_path: { label: "GAME EXECUTABLE PATH", kind: "string" },
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

function logout() {
	window.localStorage.removeItem("token");
	window.location.reload();
}

function SettingsModal() {
	const { setOpen, settings, update } = useContext(SettingsModalContext);
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="relative h-full max-h-[70vh] w-full max-w-xl rounded-lg border border-zinc-900 bg-zinc-950 p-4 shadow-xl">
				<p className="text-md text-zinc-300">Launcher Settings</p>
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

				<button
					className="mt-4 rounded-md bg-copper-600 px-8 py-3 font-bold text-zinc-100 transition-all duration-300 hover:bg-copper-100 hover:text-zinc-800"
					onClick={logout}
				>
					LOGOUT
				</button>
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
			<span className="text-zinc-300">{label}</span>
			<input
				type="text"
				value={internalValue}
				onChange={(e) => setValue(e.target.value)}
				onBlur={() => update(id, internalValue)}
				className="rounded-md bg-zinc-900 px-3 py-2 text-white"
			/>
		</label>
	);
}
