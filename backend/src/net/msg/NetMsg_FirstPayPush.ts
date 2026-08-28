// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_FirstPayPush

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  FirstChargePush,
} from 'mc-local-share';

/**
 * NetMsg_FirstPayPush
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = FirstChargePush
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15047
 */
export class NetMsg_FirstPayPush implements IHandle<PlayerInfoSimple, FirstChargePush> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：FIRSTCHARGE_PUSH (15047) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.FIRSTCHARGE_PUSH;

  Handle(req: PlayerInfoSimple): FirstChargePush {
    throw new Error('Handle not implemented: NetMsg_FirstPayPush');
  }
}
