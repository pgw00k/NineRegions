// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: TrialSectionReward

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  SectionRewardRequest,
  SectionRewardResponse,
} from 'mc-local-share';

/**
 * TrialSectionReward
 * REQ = SectionRewardRequest
 * RES = SectionRewardResponse
 * 注册：reqId=10331、recId=10332
 */
export class NetMsg_TrialSectionReward_CS implements IHandle<SectionRewardRequest, SectionRewardResponse> {
  /** 请求消息号：SECTION_REWARD_REQ (10331) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.SECTION_REWARD_REQ;
  /** 响应消息号：SECTION_REWARD_REP (10332) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SECTION_REWARD_REP;

  Handle(req: SectionRewardRequest): SectionRewardResponse {
    throw new Error('Handle not implemented: TrialSectionReward');
  }
}
