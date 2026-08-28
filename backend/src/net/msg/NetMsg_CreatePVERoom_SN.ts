// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_CreatePVERoom_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  CreatePVERoomResponse,
} from 'mc-local-share';

/**
 * NetMsg_CreatePVERoom_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = CreatePVERoomResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10010
 */
export class NetMsg_CreatePVERoom_SN implements IHandle<PlayerInfoSimple, CreatePVERoomResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：CREATE_PVEROOM_REP (10010) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CREATE_PVEROOM_REP;

  Handle(req: PlayerInfoSimple): CreatePVERoomResponse {
    throw new Error('Handle not implemented: NetMsg_CreatePVERoom_SN');
  }
}
