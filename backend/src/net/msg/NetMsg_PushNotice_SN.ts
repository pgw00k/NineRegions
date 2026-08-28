// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_PushNotice_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  PushNoticeRsp,
} from 'mc-local-share';

/**
 * NetMsg_PushNotice_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = PushNoticeRsp
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15042
 */
export class NetMsg_PushNotice_SN implements IHandle<PlayerInfoSimple, PushNoticeRsp> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：PUSH_NOTICE_RSP (15042) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PUSH_NOTICE_RSP;

  Handle(req: PlayerInfoSimple): PushNoticeRsp {
    throw new Error('Handle not implemented: NetMsg_PushNotice_SN');
  }
}
