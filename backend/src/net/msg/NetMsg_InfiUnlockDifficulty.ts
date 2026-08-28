// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_UnlockDifficulty

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  InfiUnlockDifficultyReq,
  InfiUnlockDifficultyRep,
} from 'mc-local-share';

/**
 * Infi_UnlockDifficulty
 * REQ = InfiUnlockDifficultyReq
 * RES = InfiUnlockDifficultyRep
 * 注册：reqId=10110、recId=10111
 */
export class NetMsg_InfiUnlockDifficulty implements IHandle<InfiUnlockDifficultyReq, InfiUnlockDifficultyRep> {
  /** 请求消息号：INFI_UNLOCK_DIFFICULTY_REQ (10110) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_UNLOCK_DIFFICULTY_REQ;
  /** 响应消息号：INFI_UNLOCK_DIFFICULTY_REP (10111) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_UNLOCK_DIFFICULTY_REP;

  Handle(req: InfiUnlockDifficultyReq): InfiUnlockDifficultyRep {
    throw new Error('Handle not implemented: Infi_UnlockDifficulty');
  }
}
