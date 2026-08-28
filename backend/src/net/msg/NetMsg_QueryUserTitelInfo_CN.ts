// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_QueryUserTitelInfo_CN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  QueryUserTitelInfoReq,
} from 'mc-local-share';

/**
 * NetMsg_QueryUserTitelInfo_CN
 * REQ = QueryUserTitelInfoReq
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10370、recId=-1
 */
export class NetMsg_QueryUserTitelInfo_CN implements IHandle<QueryUserTitelInfoReq, {}> {
  /** 请求消息号：QUERY_USERTITLE_INFO_REQ (10370) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.QUERY_USERTITLE_INFO_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: QueryUserTitelInfoReq): {} {
    throw new Error('Handle not implemented: NetMsg_QueryUserTitelInfo_CN');
  }
}
