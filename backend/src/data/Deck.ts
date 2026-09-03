import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Player } from './Player';

@Entity()
export class Deck {
    @PrimaryColumn({ type: 'bigint', comment: '卡片ID' })
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