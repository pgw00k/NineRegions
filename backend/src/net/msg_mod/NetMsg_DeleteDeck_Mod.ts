// tagName: NetMsg_DeleteDeck
import {
  DeleteDeckRequest,
  DeleteDeckResponse,
  ErrorCode,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { DeckService } from '../../database/service/Deck.service';
import { NetMsg_DeleteDeck } from '../msg/NetMsg_DeleteDeck';

/**
 * NetMsg_DeleteDeck
 * REQ = DeleteDeckRequest
 * RES = DeleteDeckResponse
 * 注册：reqId=10007,recId=10008
 */
export class NetMsg_DeleteDeck_Mod extends NetMsg_DeleteDeck {

  override async Handle(req: DeleteDeckRequest, client?: Client, uid?: string, token?: string,exData?:any): Promise<DeleteDeckResponse> {
    let did = req.did;
    let res: DeleteDeckResponse = {
      error: ErrorCode.SUCCESS,
    };
    try {
      if (did) {
        let isDeleted = await DeckService.Instance.deleteDeck(did);
        if (!isDeleted) {
          res.error = ErrorCode.DECK_NOT_FIND;
        }else{
          res.did = did;
        }
      } else {
        res.error = ErrorCode.DECK_NOT_FIND;
      }
    } catch (error) {
      Logger.LogError('Error in NetMsg_DeleteDeck_Mod.Handle', error);
      res.error = ErrorCode.ERROR;
    }
    return res;
  }
}