import { MESSAGE_ID } from "mc-local-share";
import { IHandle, IResponderPair } from "./IHandle";
import { Client } from "./Client";

import fs from "fs";
import { Logger } from "../core/Logger";

export class MessageBase<REQ, RES> implements IHandle<REQ, RES>, IResponderPair {
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  LoadMock(req: REQ, client?: Client): RES {
    let fp = `mocks/${this.recId}.json`
    if (this.recId > MESSAGE_ID.NETWORK_MESSAGE_BEGIN && fs.existsSync(fp)) {
      Logger.LogInfo('MessageBase.LoadMock Loading mock', fp);
      let mock = JSON.parse(fs.readFileSync(fp, "utf-8")) as RES
      return mock
    }
    return undefined as RES
  }

  async Handle(req: REQ, client?: Client): Promise<RES> {
    return Promise.resolve(this.HandleSync(req, client))
  }

  HandleSync(req: REQ, client?: Client): RES {
    return this.LoadMock(req, client)
  }
}