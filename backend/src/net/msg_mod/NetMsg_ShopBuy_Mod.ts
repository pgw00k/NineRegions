// tagName: NetMsg_DeleteDeck
import {
  ShopBuyRequest,
  ShopBuyResponse,
  ErrorCode,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { NetMsg_ShopBuy } from '../msg/NetMsg_ShopBuy';

/**
 * ShopBuy
 * REQ = ShopBuyRequest
 * RES = ShopBuyResponse
 * 注册：reqId=10212,recId=10213
 */
export class NetMsg_ShopBuy_Mod extends NetMsg_ShopBuy {

  override async Handle(req: ShopBuyRequest, client?: Client, uid?: string, token?: string,exData?:any): Promise<ShopBuyResponse> {
    Logger.LogInfo('ShopBuy_Mod.Handle', req);
    /**
     * {"type":4,"buyID":155,"buyCount":3,"couponBuyCount":0,"costPack":{"type":0,"cost1":13,"cost2":0,"transferCount":0}}
     */
    // return super.Handle(req, client, uid, token, exData);
    return {
      error: ErrorCode.SUCCESS,
      type: req.type,
      buyID: req.buyID,
      buyCount: req.buyCount,
      items:[
        {
          items: [
            {
              iid: 51,
              count: 60000,
            }
          ]
        }
      ],
      change: {
        prize: [{
          itemId: 51,
          count: 60000,
        }],
        cards:[],
        items:[{
          iid: 51,
          count: 60000,
        }],
        equips:[],
        cardBacks:[],
      },
      shopInfo: [],
    };
  }
}