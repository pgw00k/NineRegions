import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Player } from "./Player";
import { NumericTransformer } from "../../utils/NumericTransformer";

@Entity()
@Unique('UQ_PLAYER_CARD', ['uid', 'cid'])
export class CardLibrary {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '牌库牌型ID，每位玩家牌库新增的一种牌型会新增一行' })
    id: number;

    @Column({ type:'bigint',comment:'关联玩家ID'})
    uid: number;

    @Column({ type:'bigint',comment:'牌型ID',transformer: NumericTransformer })
    cid: number;

    @Column({ type:'int',comment:'牌型数量' })
    count: number;

    // ---------- ORM 关联（仅用于连表查询，不用于更新） ----------
    @ManyToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uid' })
    player: Player;
}