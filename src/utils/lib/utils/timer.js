export async function wait(duration) {
    return new Promise(resolve => {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            resolve(null);
        }, duration);
    });
}
