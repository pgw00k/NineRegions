import { MESSAGE_ID } from 'mc-local-share';
import { MessageController } from '../msg/MessageController';
import { NetMsg_Heartbeat } from './NetMsg_Heartbeat';
import { NetMsg_LogicReconnection } from './NetMsg_LogicReconnection';
export class MessageControllerMod extends MessageController {
  constructor() {
    super();
    this.AutoResponser[MESSAGE_ID.HEARTBEAT_REQ] = new NetMsg_Heartbeat();
    this.AutoResponser[MESSAGE_ID.LOGIC_RECONNECTION_REQ] = new NetMsg_LogicReconnection();
  }
}