// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_EditDeck

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  EditDeckRequest,
  EditDeckResponse,
  ErrorCode,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { DeckService } from '../../database/service/Deck.service';
import { AppDataSource } from '../../database/DataSource';

/**
 * NetMsg_EditDeck
 * REQ = EditDeckRequest
 * RES = EditDeckResponse
 * 注册：reqId=10050,recId=10051
 */
export class NetMsg_EditDeck_Mod extends MessageBase<EditDeckRequest, EditDeckResponse> {
  private deckService: DeckService;

  constructor() {
    super();
    this.deckService = new DeckService(AppDataSource);
  }

  override async Handle(req: EditDeckRequest, client?: Client): Promise<EditDeckResponse> {
    console.log('EditDeckRequest:', client);
    let deck: any = {
      pid: client!.uid,
      ...req.deck,
    }
    try {
      // 在这里实现编辑套牌的逻辑  
      if (req.deck?.did) {
        // 更新现有套牌
        deck = await this.deckService.updateDeck(req.deck.did, req.deck);
      } else {
        // 创建新套牌
        deck = await this.deckService.createDeck(req.deck || {});
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