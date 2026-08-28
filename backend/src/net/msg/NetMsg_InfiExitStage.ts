// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_InfiExitStage

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  InfiExitStageRequest,
  InfiExitStageResponse,
} from 'mc-local-share';

/**
 * Infi_InfiExitStage
 * REQ = InfiExitStageRequest
 * RES = InfiExitStageResponse
 * 注册：reqId=10101、recId=10102
 */
export class NetMsg_InfiExitStage implements IHandle<InfiExitStageRequest, InfiExitStageResponse> {
  /** 请求消息号：INFI_EXIT_STAGE_REQ (10101) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_EXIT_STAGE_REQ;
  /** 响应消息号：INFI_EXIT_STAGE_REP (10102) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_EXIT_STAGE_REP;

  Handle(req: InfiExitStageRequest): InfiExitStageResponse {
    throw new Error('Handle not implemented: Infi_InfiExitStage');
  }
}
