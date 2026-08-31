// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: PVPMatch_CN_BattleReady

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  BattleReadyRequest,
} from 'mc-local-share';

/**
 * PVPMatch_CN_BattleReady
 * REQ = BattleReadyRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=25001、recId=-1
 */
export class NetMsg_BattleReady_CN implements IHandle<BattleReadyRequest, {}> {
  /** 请求消息号：BATTLE_READY_REQ (25001) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.BATTLE_READY_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: BattleReadyRequest): {} {
    throw new Error('Handle not implemented: PVPMatch_CN_BattleReady');
  }
}
