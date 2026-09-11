// tagName: NetMsg_DeleteDeck
import {
  ErrorCode,
  ChangeDeckCardBackRequest,
  ChangeDeckCardBackResponse,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { NetMsg_ChangeDeckCardBack } from '../msg/NetMsg_ChangeDeckCardBack';
import { DeckService } from '../../database/service/Deck.service';

/**
 * ShopBuy
 * REQ = ShopBuyRequest
 * RES = ShopBuyResponse
 * 注册：reqId=10212,recId=10213
 */
export class NetMsg_ChangeDeckCardBack_Mod extends NetMsg_ChangeDeckCardBack {

  override async Handle(req: ChangeDeckCardBackRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<ChangeDeckCardBackResponse> {
    Logger.LogInfo('ChangeDeckCardBack_Mod.Handle', req);
    // return super.Handle(req, client, uid, token, exData);
    let result = await DeckService.Instance.UpdateDecks(req.dids, {
      cardBack: req.cardBack,
    });
    return {
      error: result ? ErrorCode.SUCCESS : ErrorCode.DECK_SET_INVALID,
      dids: req.dids,
      cardBack: req.cardBack,
    }
  }
}