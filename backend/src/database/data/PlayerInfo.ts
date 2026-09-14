import { Column, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DateTransformer } from "../../utils/DateTransformer";
import { Player } from "./Player";

/**
 * 玩家的详情信息
 */
@Entity()
export class PlayerInfo {
    @PrimaryColumn({ type: 'bigint', comment: '数据库内联ID' })
    uid: number = 0;

    @Column({ type: 'int', nullable: true, comment: '排位等级', default: 1 })
    ladderLv: number = 1;

    @Column({ type: 'int', nullable: true, comment: '排位当前星数', default: 0 })
    ladderStar: number = 0;

    @Column({ type: 'int', nullable: true, comment: '胜点', default: 0 })
    meritPoint: number = 0;

    // ---------- ORM 关联（仅用于连表查询，不用于更新） ----------
    @OneToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uid', referencedColumnName: 'id' })
    player: Player;
}