import { IHandle } from '../IHandle';
import {
    MESSAGE_ID,
    GetActitiviesRequest,
    GetActitiviesResponse,
} from 'mc-local-share';
import { NetMsg_ActivityInfo_CS } from '../msg/NetMsg_ActivityInfo_CS';

/**
 * NetMsg_ActivityInfo_CS_Mod
 */
export class NetMsg_ActivityInfo_CS_Mod extends NetMsg_ActivityInfo_CS {
    Handle(req: GetActitiviesRequest): GetActitiviesResponse {
        return {
            activities: [],
            data: [],
            trade: []
        };
    }
}
