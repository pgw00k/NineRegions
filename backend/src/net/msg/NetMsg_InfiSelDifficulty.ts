// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_SelectDifficulty

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  InfiSelectDifficultyReq,
  InfiSelectDifficultyRep,
} from 'mc-local-share';

/**
 * Infi_SelectDifficulty
 * REQ = InfiSelectDifficultyReq
 * RES = InfiSelectDifficultyRep
 * 注册：reqId=10114、recId=10115
 */
export class NetMsg_InfiSelDifficulty implements IHandle<InfiSelectDifficultyReq, InfiSelectDifficultyRep> {
  /** 请求消息号：INFI_SELECT_DIFFICULTY_REQ (10114) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_DIFFICULTY_REQ;
  /** 响应消息号：INFI_SELECT_DIFFICULTY_REP (10115) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_DIFFICULTY_REP;

  Handle(req: InfiSelectDifficultyReq): InfiSelectDifficultyRep {
    throw new Error('Handle not implemented: Infi_SelectDifficulty');
  }
}
