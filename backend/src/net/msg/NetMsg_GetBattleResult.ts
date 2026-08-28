// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: GetBattleResult

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
} from 'mc-local-share';

/**
 * GetBattleResult
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = {}（recvProto 缺失，回退）
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 说明：RES 使用 {} 作为占位。（引用了 share 中不存在的类型 GetBattleResultResponse，已回退）
 * 说明：recId 引用 MESSAGE_ID.GET_BATTLERESULT_REP 未定义，回退为 -1（未注册）。
 * 注册：reqId=-1、recId=-1
 */
export class NetMsg_GetBattleResult implements IHandle<PlayerInfoSimple, {}> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: PlayerInfoSimple): {} {
    throw new Error('Handle not implemented: GetBattleResult');
  }
}
