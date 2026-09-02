import { MESSAGE_ID } from "mc-local-share";
import { IHandle, IResponderPair, Client } from "./IHandle";
import fs from "fs";
import { Logger } from "../core/Logger";

export class MessageBase<REQ, RES> implements IHandle<REQ, RES>, IResponderPair {
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  Handle(req: REQ, client?: Client): RES {
    let fp = `mocks/${this.recId}.json`
    if (this.recId > MESSAGE_ID.NETWORK_MESSAGE_BEGIN && fs.existsSync(fp)) {
      Logger.LogInfo('MessageBase.Handle Loading mock', fp);
      let mock = JSON.parse(fs.readFileSync(fp, "utf-8")) as RES
      return mock
    }

    return undefined as RES
  }
}

export class Example extends MessageBase<any, any> {
  reqId: MESSAGE_ID = MESSAGE_ID.PLAY_STORY_REQ;
  recId: MESSAGE_ID = MESSAGE_ID.PLAY_STORY_REP;

  override Handle(req: any): any {
    let resobj = super.Handle(req)
    if (!resobj) {
      throw new Error('Handle not implemented: Example');
    }
    return resobj
  }
}
