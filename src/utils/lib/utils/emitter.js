class Emitter {
    events;
    constructor() {
        this.events = {};
    }
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(fn => {
                return fn(data);
            });
        }
        return this;
    }
    on(event, fn) {
        if (this.events[event]) {
            this.events[event].push(fn);
        }
        else {
            this.events[event] = [fn];
        }
        return this;
    }
    off(event, fn) {
        if (event && typeof fn === 'function' && this.events[event]) {
            const listeners = this.events[event];
            if (!listeners || listeners.length === 0) {
                return;
            }
            const index = listeners.findIndex(_fn => {
                return _fn === fn;
            });
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
        return this;
    }
}
export default Emitter;
