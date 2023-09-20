import EventEmitter from "event-emitter";

const eventEmitter = EventEmitter();
const eventName = 'contentWidthChanged';

export const subscribe = (handler: () => void) => {
  eventEmitter.on(eventName, handler);
  return () => eventEmitter.off(eventName, handler);
}

export const trigger = () => eventEmitter.emit(eventName);
