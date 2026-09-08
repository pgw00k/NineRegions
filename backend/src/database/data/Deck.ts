import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Player } from './Player';

@Entity()
@Unique('UQ_PLAYER_DECK', ['pid', 'did'])
export class Deck {
    @PrimaryColumn({ type: 'bigint', comment: '组牌ID-数据库内联使用' })
    id: number = 0;

    @Column({ type: 'bigint', default: 0, comment: '组牌ID-客户端使用' })
    did: number = 0;

    @Column({ length: 64 })
    name: string = '';

    @Column({ type: 'int', default: 0 })
    hero: number;

    @Column({ type: 'int', default: 0 })
    job: number;

    @Column({ type: 'bigint', default: 0 })
    skill: number;

    @Column({ type: 'bigint', default: 0, array: true })
    cards: number[] = [];

    @Column({ type: 'int', default: 0 })
    equipSlot1: number;

    @Column({ type: 'int', default: 0 })
    equipSlot2: number;

    @Column({ type: 'int', default: 0 })
    equipSlot3: number;

    @Column({ type: 'int', default: 0 })
    equipSlot4: number;

    @Column({ type: 'int', default: 0 })
    cardBack: number;

    @Column({ type: 'int', default: 0 })
    wins: number = 0;

    @Column({ type: 'boolean', default: false })
    shared: boolean = false;


    @Column({ type:'bigint',comment:'关联玩家ID' })
    pid: number;

    @ManyToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pid' })
    player: Player;
}