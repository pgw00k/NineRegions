// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_SelectDifficulty

import { MessageBase } from '../MessageBase';
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
export class NetMsg_InfiSelDifficulty extends MessageBase<InfiSelectDifficultyReq, InfiSelectDifficultyRep> {
  /** 请求消息号：INFI_SELECT_DIFFICULTY_REQ (10114) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_DIFFICULTY_REQ;
  /** 响应消息号：INFI_SELECT_DIFFICULTY_REP (10115) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_DIFFICULTY_REP;

  override Handle(req: InfiSelectDifficultyReq): InfiSelectDifficultyRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_SelectDifficulty');
    }
    return resobj
  }
}
