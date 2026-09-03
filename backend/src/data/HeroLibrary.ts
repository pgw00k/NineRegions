import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Player } from './Player';

@Entity()
export class HeroLibrary {
    @PrimaryColumn({ type: 'bigint', comment: '角色ID' })
    id: number;

    @Column({ type: 'int', comment: '解锁状态（0：未解锁，1：已解锁）' })
    unlockState: number;

    @Column({ type: 'int', comment: '好感度' })
    favor: number;

    @Column({ type: 'int', comment: '好感等级' })
    favorLv: number;

    @Column({ type: 'int', comment: '当前皮肤' })
    curSkin: number;

    @Column({ type: 'int', comment: '主页皮肤' })
    kanBanSkin: number;

    @Column({ type: 'int', comment: '日常.总好感度' })
    totalFavor: number;

    @Column({ type: 'int', comment: '日常.战斗好感度' })
    battleFavor: number;

    @Column({ type:'bigint',comment:'关联玩家ID' })
    pid: number;

    // ---------- ORM 关联（仅用于连表查询，不用于更新） ----------
    @ManyToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pid' })
    player: Player;
}