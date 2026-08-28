// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_QueryPersonInfoReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  QueryPersonalInfoReq,
} from 'mc-local-share';

/**
 * NetMsg_QueryPersonInfoReq
 * REQ = QueryPersonalInfoReq
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10348、recId=-1
 */
export class NetMsg_QueryPersonInfoReq implements IHandle<QueryPersonalInfoReq, {}> {
  /** 请求消息号：QUERY_PERSONAL_INFO_REQ (10348) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.QUERY_PERSONAL_INFO_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: QueryPersonalInfoReq): {} {
    throw new Error('Handle not implemented: NetMsg_QueryPersonInfoReq');
  }
}
