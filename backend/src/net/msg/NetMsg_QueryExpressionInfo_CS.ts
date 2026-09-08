// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_QueryExpressionInfo

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryExpressionInfoReq,
  QueryExpressionInfoRsp,
} from 'mc-local-share';

/**
 * NetMsg_QueryExpressionInfo
 * REQ = QueryExpressionInfoReq
 * RES = QueryExpressionInfoRsp
 * 注册：reqId=10350,recId=10351
 */
export class NetMsg_QueryExpressionInfo_CS extends MessageBase<QueryExpressionInfoReq, QueryExpressionInfoRsp> {
  /** 请求消息号：QUERY_EXPRESSION_INFO_REQ (10350) */
  reqId: MESSAGE_ID = MESSAGE_ID.QUERY_EXPRESSION_INFO_REQ;
  /** 响应消息号：QUERY_EXPRESSION_INFO_RSP (10351) */
  recId: MESSAGE_ID = MESSAGE_ID.QUERY_EXPRESSION_INFO_RSP;

  override HandleSync(req: QueryExpressionInfoReq, client?: Client, uid?: string, token?: string,exData?:any): QueryExpressionInfoRsp {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_QueryExpressionInfo');
    }
    return resobj
  }
}
