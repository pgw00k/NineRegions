import { IHandleBase } from "./IHandle";
import { type MESSAGE_ID } from "mc-local-share";

export class MessageControllerBase {

    public AutoResponser: Record<MESSAGE_ID, IHandleBase> = {} as any;

  constructor() {
  }
  
}