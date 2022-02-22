import { EventEmitter } from 'events';
const events = new EventEmitter()
events.setMaxListeners(12)
export default events;