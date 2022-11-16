import { CbEvents } from '../constant';
import { WSEvent } from '../types';
declare type Cbfn = (data: WSEvent) => void;
declare class Emitter {
    private events;
    constructor();
    emit(event: CbEvents, data: Cbfn): this;
    on(event: CbEvents, fn: Cbfn): this;
    off(event: CbEvents, fn: Cbfn): this | undefined;
}
export default Emitter;
