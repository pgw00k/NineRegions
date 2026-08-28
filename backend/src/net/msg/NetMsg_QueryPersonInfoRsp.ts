// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_QueryPersonInfoRsp

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  QueryPersonalInfoRsp,
} from 'mc-local-share';

/**
 * NetMsg_QueryPersonInfoRsp
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = QueryPersonalInfoRsp
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10349
 */
export class NetMsg_QueryPersonInfoRsp implements IHandle<PlayerInfoSimple, QueryPersonalInfoRsp> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：QUERY_PERSONAL_INFO_RSP (10349) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.QUERY_PERSONAL_INFO_RSP;

  Handle(req: PlayerInfoSimple): QueryPersonalInfoRsp {
    throw new Error('Handle not implemented: NetMsg_QueryPersonInfoRsp');
  }
}
