import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne, JoinColumn, Unique, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './Player';
import { SNumericTransformer } from '../../utils/SNumericTransformer';

@Entity()
export class Deck {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '组牌ID' })
    did: number;

    @Column({ type:'varchar', length: 64, comment: '组牌名称' })
    name: string = '';

    @Column({ type: 'int', default: 0 })
    hero: number;

    @Column({ type: 'int', default: 0 })
    job: number;

    @Column({ type: 'bigint', default: 0 })
    skill: number;

    @Column({ type: 'bigint', array: true })
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

    @Column({ type:'bigint',comment:'关联玩家ID',transformer: SNumericTransformer,default: 0 })
    uid: string = '0';

    @ManyToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uid' })
    player: Player;
}