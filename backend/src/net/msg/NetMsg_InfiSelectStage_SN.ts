// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_SelectStage_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  InfiSelectStageResponse,
} from 'mc-local-share';

/**
 * Infi_SelectStage_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = InfiSelectStageResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10089
 */
export class NetMsg_InfiSelectStage_SN implements IHandle<PlayerInfoSimple, InfiSelectStageResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：INFI_SELECT_STAGE_REP (10089) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_STAGE_REP;

  Handle(req: PlayerInfoSimple): InfiSelectStageResponse {
    throw new Error('Handle not implemented: Infi_SelectStage_SN');
  }
}
