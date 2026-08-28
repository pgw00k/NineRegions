// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GetShareDecks_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetSharedDecksRep,
} from 'mc-local-share';

/**
 * NetMsg_GetShareDecks_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetSharedDecksRep
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10361
 */
export class NetMsg_GetShareDecks_SN implements IHandle<PlayerInfoSimple, GetSharedDecksRep> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GET_SHAREDDECKS_REP (10361) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_SHAREDDECKS_REP;

  Handle(req: PlayerInfoSimple): GetSharedDecksRep {
    throw new Error('Handle not implemented: NetMsg_GetShareDecks_SN');
  }
}
