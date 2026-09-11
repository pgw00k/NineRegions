// tagName: NetMsg_DeleteDeck
import {
  GetShopInfoRequest,
  GetShopInfoResponse,
  ErrorCode,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { NetMsg_GetShopInfo } from '../msg/NetMsg_GetShopInfo';

/**
 * GetShopInfo
 * REQ = GetShopInfoRequest
 * RES = GetShopInfoResponse
 * 注册：reqId=10210,recId=10211
 */
export class NetMsg_GetShopInfo_Mod extends NetMsg_GetShopInfo {

  override async Handle(req: GetShopInfoRequest, client?: Client, uid?: string, token?: string,exData?:any): Promise<GetShopInfoResponse> {
    Logger.LogInfo('GetShopInfo_Mod.Handle', req);
    return super.Handle(req, client, uid, token, exData);
  }
}