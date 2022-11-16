import { wait } from '../utils';
let initiallized = false;
let go;
let goExitPromise;
export async function initializeWasm(url) {
    if (initiallized) {
        return null;
    }
    if (typeof window === 'undefined') {
        return Promise.resolve(null);
    }
    go = new Go();
    if ('instantiateStreaming' in WebAssembly) {
        const wasm = await WebAssembly.instantiateStreaming(fetch(url), go.importObject);
        go.run(wasm.instance);
    }
    else {
        const bytes = await fetch(url).then(resp => resp.arrayBuffer());
        const wasm = await WebAssembly.instantiate(bytes, go.importObject);
        goExitPromise = go.run(wasm.instance);
    }
    await wait(100);
    return go;
}
export function reset() {
    initiallized = false;
}
export function getGO() {
    return go;
}
export function getGoExitPromsie() {
    return goExitPromise;
}
