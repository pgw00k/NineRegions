// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_PullActInfo

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PullActInfoReq,
  PullActInfoRep,
} from 'mc-local-share';

/**
 * NetMsg_PullActInfo
 * REQ = PullActInfoReq
 * RES = PullActInfoRep
 * 注册：reqId=10474、recId=10475
 */
export class NetMsg_PullActInfo implements IHandle<PullActInfoReq, PullActInfoRep> {
  /** 请求消息号：PULL_ACT_INFO_REQ (10474) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.PULL_ACT_INFO_REQ;
  /** 响应消息号：PULL_ACT_INFO_REP (10475) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PULL_ACT_INFO_REP;

  Handle(req: PullActInfoReq): PullActInfoRep {
    throw new Error('Handle not implemented: NetMsg_PullActInfo');
  }
}
