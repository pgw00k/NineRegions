// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Achieve_InfoReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetAchieveInfoRequest,
} from 'mc-local-share';

/**
 * Achieve_InfoReq
 * REQ = GetAchieveInfoRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10230、recId=-1
 */
export class NetMsg_AchieveInfo_CN implements IHandle<GetAchieveInfoRequest, {}> {
  /** 请求消息号：GET_ACHIEVE_INFO_REQ (10230) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_ACHIEVE_INFO_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: GetAchieveInfoRequest): {} {
    throw new Error('Handle not implemented: Achieve_InfoReq');
  }
}
