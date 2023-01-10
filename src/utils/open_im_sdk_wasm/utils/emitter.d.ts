import { WSEvent } from '../types/entity';
import { CbEvents } from '../constant';
declare type Cbfn = (data: WSEvent) => void;
declare class Emitter {
    private events;
    constructor();
    emit(event: CbEvents, data: WSEvent): this;
    on(event: CbEvents, fn: Cbfn): this;
    off(event: CbEvents, fn: Cbfn): this | undefined;
}
export default Emitter;
