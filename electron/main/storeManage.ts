import Store from "electron-store";

let store: Store;

export const getStore = () => {
  if (!store) {
    store = new Store();
  }
  return store;
};

export { Store };
