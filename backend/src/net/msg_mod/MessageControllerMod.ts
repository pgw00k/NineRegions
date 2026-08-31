import { MESSAGE_ID } from 'mc-local-share';
import { MessageController } from '../msg/MessageController';
import { NetMsg_Heartbeat } from './NetMsg_Heartbeat';
import { NetMsg_LogicReconnection } from './NetMsg_LogicReconnection';
import { NetMsg_ActivityInfo_CS_Mod } from './NetMsg_ActivityInfo_CS_Mod';
import { NetMsg_EnterGame_Mod } from './NetMsg_EnterGame_Mod';
export class MessageControllerMod extends MessageController {
  constructor() {
    super();
    this.AutoResponser[MESSAGE_ID.HEARTBEAT_REQ] = new NetMsg_Heartbeat();
    this.AutoResponser[MESSAGE_ID.LOGIC_RECONNECTION_REQ] = new NetMsg_LogicReconnection();

    // Login从登录到主页正常加载需要的逻辑
    // this.AutoResponser[MESSAGE_ID.BATTLEPASS_REQ] = undefined;
    // this.AutoResponser[MESSAGE_ID.FRIEND_INFO_RPT] = undefined;
    // this.AutoResponser[MESSAGE_ID.CHAT_INFO_RPT] = undefined;
    // this.AutoResponser[MESSAGE_ID.FRIEND_REFRESH_SCENE_RPT] = undefined;
    // this.AutoResponser[MESSAGE_ID.GET_ACTIVITIES_REQ] = new NetMsg_ActivityInfo_CS_Mod();
    this.AutoResponser[MESSAGE_ID.ENTER_GAME_REQ] = new NetMsg_EnterGame_Mod();
  }
}