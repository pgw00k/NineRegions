import { ArrayContains, DeleteResult, EntityTarget, FindManyOptions, FindOptionsWhere, Like, ObjectLiteral, Repository } from "typeorm";
import { AppDataSource } from "../DataSource";
import { Extract } from "../../utils/ObjectExtension";

export interface UpdateData<T> {
    update:Partial<T>,
    affected:number,
}

export class BaseRepositoryTemplate<T1 extends ObjectLiteral>  {
    protected _Repository: Repository<T1>;
    protected _Template: Partial<T1>;

    constructor(entityClass: EntityTarget<T1>) {
        this._Repository = AppDataSource.getRepository(entityClass);
    }

    /**
     * 创建一个新行，会自动保存
     * @param data 
     * @param operator 
     * @returns 
     */
    async Create(data: Partial<T1>): Promise<Partial<T1>> {

        let newData = this.CreateEntity(data) as any
        let newRow = await this._Repository.save(newData)

        return newRow
    }

    /**
     * 需要在Data中携带id用来确认更新行
     * @param data 
     * @param exData 
     * @returns 
     */
    async Update(data: Partial<T1>,exData?: Partial<T1>): Promise<UpdateData<T1>> {

        if (!this._Template) {
            this._Template = this._Repository.create()
        }

        let r:UpdateData<T1> = {
            affected:0,
            update:{}
        }

        let { id, ...base } = data
        r.update = Extract(base, this._Template)

        let safeExData = {}
        if(exData)
        {
            let { eid, ...exDataBase } = exData
            safeExData = Extract(exDataBase, this._Template)
        }
        if (Object.keys(r.update).length > 0) {
            // console.log(r)
            let rowData: any = {
                ...r.update,
                ...safeExData
            }
            let row = (await this._Repository.update({id}, rowData))
            r.affected = row.affected ? row.affected : 0
        } 
        return r
    }

    async Read(options?: FindManyOptions<T1>): Promise<T1[]> {
        let opt = options??{}
        let newOpt = {
            ...opt
        }
        // let raw = await this._Repository.find(newOpt)
        // console.log(raw)
        return this._Repository.find(newOpt)
    }

    async Delete(options: FindOptionsWhere<T1>[]): Promise<number> {
        let result = await this._Repository.delete(options)
        return result.affected??0
    }

    /**
     * 创建一个新对象，不会直接写入数据库
     * @param data 
     * @returns 
     */
    public CreateEntity(data: Partial<T1>):Partial<T1>
    {
        let baseData:any = {
            ...data
        }
        let newData = this._Repository.create(baseData) as any
        return newData
    }
}