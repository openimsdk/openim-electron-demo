import { API, APIKey } from "./api";

declare global {
	interface Window {
	//   require: (module: 'electron') => {
	// 	ipcRenderer: IpcRenderer
	//   };
		userClick: (id: string) => void;
		urlClick: (id: string) => void;
	}
	interface Window extends Record<APIKey,API>{}
}
