import { MESSAGE_ID } from 'mc-local-share';
import { MessageController } from '../msg/MessageController';
import { NetMsg_Heartbeat } from './NetMsg_Heartbeat';
import { NetMsg_ActivityInfo_CS_Mod } from './NetMsg_ActivityInfo_CS_Mod';
import { NetMsg_EnterGame_Mod } from './NetMsg_EnterGame_Mod';
import { NetMsg_BPInfoReq_Mod } from './NetMsg_BPInfoReq_Mod';
import { NetMsg_FriendInfo_CN_Mod } from './NetMsg_FriendInfo_CN_Mod';
import { NetMsg_ChatInfo_CN_Mod } from './NetMsg_ChatInfo_CN_Mod';
import { NetMsg_MainTownReconnect_Mod } from './NetMsg_MainTownReconnect_Mod';
import { NetMsg_EditDeck_Mod } from './NetMsg_EditDeck_Mod';
import { NetMsg_DeleteDeck_Mod } from './NetMsg_DeleteDeck_Mod';
import { NetMsg_GetShopInfo_Mod } from './NetMsg_GetShopInfo_Mod';
import { NetMsg_ShopBuy_Mod } from './NetMsg_ShopBuy_Mod';
import { NetMsg_ChangeDeckCardBack_Mod } from './NetMsg_ChangeDeckCardBack_Mod';
import { NetMsg_StartMatchPVP_CS_Mod } from './NetMsg_StartMatchPVP_CS_Mod';
import { NetMsg_CancelMatch_CS_Mod } from './NetMsg_CancelMatch_CS_Mod';
import { NetMsg_BattleReady_CN_Mod } from './NetMsg_BattleReady_CN_Mod';
import { NetMsg_ChangeCard_Mod } from './NetMsg_ChangeCard_Mod';
import { NetMsg_DeploymentComplete_Mod } from './NetMsg_DeploymentComplete_Mod';
import { NetMsg_ShowEnd_Mod } from './NetMsg_ShowEnd_Mod';
import { NetMsg_BattleReconnection_Mod } from './NetMsg_BattleReconnection_Mod';
import { NetMsg_EditSetting_CS_Mod } from './NetMsg_EditSetting_CS_Mod';


export class MessageControllerMod extends MessageController {
  constructor() {
    super();
    this.AutoResponser[MESSAGE_ID.HEARTBEAT_REQ] = new NetMsg_Heartbeat();

    // Login从登录到主页正常加载需要的逻辑
    this.AutoResponser[MESSAGE_ID.ENTER_GAME_REQ] = new NetMsg_EnterGame_Mod();
    this.AutoResponser[MESSAGE_ID.BATTLEPASS_REQ] = new NetMsg_BPInfoReq_Mod();
    this.AutoResponser[MESSAGE_ID.FRIEND_INFO_RPT] = new NetMsg_FriendInfo_CN_Mod();
    this.AutoResponser[MESSAGE_ID.CHAT_INFO_RPT] = new NetMsg_ChatInfo_CN_Mod();
    
    // 套牌相关操作
    this.AutoResponser[MESSAGE_ID.EDIT_DECK_REQ] = new NetMsg_EditDeck_Mod();
    this.AutoResponser[MESSAGE_ID.DELETE_DECK_REQ] = new NetMsg_DeleteDeck_Mod();
    this.AutoResponser[MESSAGE_ID.CHANGE_DECK_CARDBACK_REQ] = new NetMsg_ChangeDeckCardBack_Mod();

    // 逻辑重新连接
    this.AutoResponser[MESSAGE_ID.LOGIC_RECONNECTION_REQ] = new NetMsg_MainTownReconnect_Mod();
    // this.AutoResponser[MESSAGE_ID.FRIEND_REFRESH_SCENE_RPT] = undefined;
    // this.AutoResponser[MESSAGE_ID.GET_ACTIVITIES_REQ] = new NetMsg_ActivityInfo_CS_Mod();

    // 商店相关操作
    this.AutoResponser[MESSAGE_ID.GET_SHOP_INFO_REQ] = new NetMsg_GetShopInfo_Mod();
    this.AutoResponser[MESSAGE_ID.SHOP_BUY_REQ] = new NetMsg_ShopBuy_Mod();

    // 天梯
    this.AutoResponser[MESSAGE_ID.MATCH_LADDERROOM_REQ] = new NetMsg_StartMatchPVP_CS_Mod();
    this.AutoResponser[MESSAGE_ID.CANCEL_MATCH_REQ] = new NetMsg_CancelMatch_CS_Mod();
    this.AutoResponser[MESSAGE_ID.BATTLE_READY_REQ] = new NetMsg_BattleReady_CN_Mod();
    this.AutoResponser[MESSAGE_ID.CHANGE_CARD_REQ] = new NetMsg_ChangeCard_Mod();
    this.AutoResponser[MESSAGE_ID.DEPLOYMENT_COMPLETE_REQ] = new NetMsg_DeploymentComplete_Mod();
    this.AutoResponser[MESSAGE_ID.SHOW_END_REQ] = new NetMsg_ShowEnd_Mod();
    // 战斗弱重连（客户端等待战斗消息超时后另建 socket 发 20001）
    this.AutoResponser[MESSAGE_ID.BATTLE_RECONNECTION_REQ] = new NetMsg_BattleReconnection_Mod();

    // 其他业务逻辑
    this.AutoResponser[MESSAGE_ID.EDIT_SETTING_REQ] = new NetMsg_EditSetting_CS_Mod();
  }
}