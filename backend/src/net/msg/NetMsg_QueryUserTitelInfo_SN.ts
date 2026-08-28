// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_QueryUserTitelInfo_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  QueryUserTitelInfoRsp,
} from 'mc-local-share';

/**
 * NetMsg_QueryUserTitelInfo_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = QueryUserTitelInfoRsp
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10371
 */
export class NetMsg_QueryUserTitelInfo_SN implements IHandle<PlayerInfoSimple, QueryUserTitelInfoRsp> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：QUERY_USERTITLE_INFO_RSP (10371) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.QUERY_USERTITLE_INFO_RSP;

  Handle(req: PlayerInfoSimple): QueryUserTitelInfoRsp {
    throw new Error('Handle not implemented: NetMsg_QueryUserTitelInfo_SN');
  }
}
