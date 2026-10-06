// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: EditSetting

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  EditSettingRequest,
  EditSettingResponse,
} from 'mc-local-share';

/**
 * EditSetting
 * REQ = EditSettingRequest
 * RES = EditSettingResponse
 * 注册：reqId=10028,recId=10029
 */
export class NetMsg_EditSetting extends MessageBase<EditSettingRequest, EditSettingResponse> {
  /** 请求消息号：EDIT_SETTING_REQ (10028) */
  reqId: MESSAGE_ID = MESSAGE_ID.EDIT_SETTING_REQ;
  /** 响应消息号：EDIT_SETTING_REP (10029) */
  recId: MESSAGE_ID = MESSAGE_ID.EDIT_SETTING_REP;

  override HandleSync(req: EditSettingRequest, client?: Client, uid?: string, token?: string,exData?:any): EditSettingResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: EditSetting');
    }
    return resobj
  }
}
