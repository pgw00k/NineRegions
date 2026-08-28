// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: GetRank

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetRankRequest,
} from 'mc-local-share';

/**
 * GetRank
 * REQ = GetRankRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10240、recId=-1
 */
export class NetMsg_GetRnakReq implements IHandle<GetRankRequest, {}> {
  /** 请求消息号：GET_RANK_REQ (10240) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_RANK_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: GetRankRequest): {} {
    throw new Error('Handle not implemented: GetRank');
  }
}
