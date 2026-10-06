import {
  ErrorCode,
  EditSettingRequest,
  EditSettingResponse,
  MESSAGE_ID,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { NetMsg_EditSetting } from '../msg/NetMsg_EditSetting';

/**
 * StartMatchPVP_CS
 */
export class NetMsg_EditSetting_CS_Mod extends NetMsg_EditSetting {

  override async Handle(req: EditSettingRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<EditSettingResponse> {
    Logger.LogInfo('NetMsg_EditSetting_CS_Mod.Handle', req);
    return {
      error: ErrorCode.SUCCESS,
      setting:req.setting
    }
  }
}