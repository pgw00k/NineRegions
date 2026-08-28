// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Guide_RecordRep

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GuiderUpdateResponse,
} from 'mc-local-share';

/**
 * Guide_RecordRep
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GuiderUpdateResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10311
 */
export class NetMsg_GuideRecordRep implements IHandle<PlayerInfoSimple, GuiderUpdateResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GUIDER_UPDATE_REP (10311) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GUIDER_UPDATE_REP;

  Handle(req: PlayerInfoSimple): GuiderUpdateResponse {
    throw new Error('Handle not implemented: Guide_RecordRep');
  }
}
