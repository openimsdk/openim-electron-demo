import { CbEvents } from "../constants";
import { WsResponse } from "../types";

interface Events {
    [key:string]:Cbfn[]
}

type Cbfn = (data:WsResponse)=>void


class Emitter {

    private events:Events;

    constructor() {
      this.events = {};
    }
    emit(event:CbEvents, data:WsResponse) {
      if (this.events[event]) {
        this.events[event].forEach((fn) => fn(data));
      }
      return this;
    }
  
    on(event:CbEvents, fn:Cbfn) {
      if (this.events[event]) this.events[event].push(fn);
      else this.events[event] = [fn];
      
      return this;
    }
  
    off(event:CbEvents, fn:Cbfn) {
      if (event && typeof fn ==="function") {
        const listeners = this.events[event];
        const index = listeners.findIndex((_fn) => _fn === fn);
        listeners.splice(index, 1);
      } else this.events[event] = [];
      return this;
    }
  }

  export default Emitter;