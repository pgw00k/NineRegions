// tagName: NetMsg_EditDeck
import {
  EditDeckRequest,
  EditDeckResponse,
  ErrorCode,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { DeckService } from '../../database/service/Deck.service';
import { NetMsg_EditDeck } from '../msg/NetMsg_EditDeck';

/**
 * NetMsg_EditDeck
 * REQ = EditDeckRequest
 * RES = EditDeckResponse
 * 注册：reqId=10005,recId=10006
 */
export class NetMsg_EditDeck_Mod extends NetMsg_EditDeck {

  override async Handle(req: EditDeckRequest, client?: Client, uid?: string, token?: string,exData?:any): Promise<EditDeckResponse> {
    let suid = uid || client?.uid;
    let deck: any = {
      uid: suid,
      ...req.deck,
    }
    try {
      // 在这里实现编辑套牌的逻辑  
      if (deck.did && deck.did > 0) {
        // 更新现有套牌
        deck = await DeckService.Instance.updateDeck(deck.did, deck);
      } else {
        // 创建新套牌
        deck = await DeckService.Instance.createDeck(deck || {});
      }

      return {
        error: ErrorCode.SUCCESS,
        deck: deck ?? undefined
      };
    } catch (error) {
      Logger.LogError('Error in NetMsg_EditDeck_Mod.Handle', error);
      return {
        error: ErrorCode.ERROR,
        deck: undefined
      };
    }
  }
}