import { BaseRepositoryTemplate } from "./BaseRepositoryTemplate";
import { UserLibrary } from "../data/UserLibrary";

/**
 * 玩家服务类 - 处理玩家数据的CRUD操作和相关业务逻辑
 */
export class UserLibraryService extends BaseRepositoryTemplate<UserLibrary> {

    static Instance: UserLibraryService;

    constructor() {
        super(UserLibrary);
        this._Template = this._Repository.create();
        UserLibraryService.Instance = this;
    }

    GetBySdkID(sdkid:string): Promise<UserLibrary | null> {
        return this._Repository.findOne({
            where: { sdkid }
        });
    }

}
