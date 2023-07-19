import Store from "electron-store";

let store: Store;

export const getStore = () => {
  if (!store) {
    store = new Store({ cwd: global.dataPath });
  }
  return store;
};

export { Store };
