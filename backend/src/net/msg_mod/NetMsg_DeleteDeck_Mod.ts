// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_DeleteDeck

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DeleteDeckRequest,
  DeleteDeckResponse,
  ErrorCode,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { DeckService } from '../../database/service/Deck.service';
import { AppDataSource } from '../../database/DataSource';

/**
 * NetMsg_DeleteDeck
 * REQ = DeleteDeckRequest
 * RES = DeleteDeckResponse
 * 注册：reqId=10052,recId=10053
 */
export class NetMsg_DeleteDeck_Mod extends MessageBase<DeleteDeckRequest, DeleteDeckResponse> {
  private deckService: DeckService;

  constructor() {
    super();
    this.deckService = new DeckService(AppDataSource);
  }

  override async Handle(req: DeleteDeckRequest, client?: Client): Promise<DeleteDeckResponse> {
    Logger.LogInfo('NetMsg_DeleteDeck_Mod.Handle', { ...req, uid: client?.uid });
    
    try {
      // 删除套牌
      const result = await this.deckService.deleteDeck(req.did || 0);
      
      return {
        error: result ? ErrorCode.SUCCESS : ErrorCode.ERROR,
        did: req.did
      };
    } catch (error) {
      Logger.LogError('Error in NetMsg_DeleteDeck_Mod.Handle', error);
      return {
        error: ErrorCode.ERROR,
        did: req.did
      };
    }
  }
}