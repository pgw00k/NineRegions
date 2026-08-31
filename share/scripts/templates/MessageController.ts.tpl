// 由 mc-local-share generate_ts 自动生成，请勿手改。

import { MessageControllerBase } from '../MessageControllerBase';
import { MESSAGE_ID } from 'mc-local-share';
{{IMPORTS_LINES}}

export class MessageController extends MessageControllerBase {
  constructor() {
    super();
{{REGISTER_LINES}}
  }
}