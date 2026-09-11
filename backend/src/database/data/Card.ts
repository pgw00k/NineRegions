import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Card {
    @PrimaryColumn({ type: 'bigint', comment: '牌型ID' })
    cid: number;

    @Column({ type: 'int', default: 1, comment: '是否正式牌型' })
    IsFormal: number = 1;

    @Column({ type: 'int', default: 0, comment: '是否法术牌' })
    IsMagic: number = 0;

    @Column({ type: 'int', default: 0, comment: '费用' })
    cost: number = 0;

    @Column({ type: 'int', default: 0, comment: '攻击值' })
    atk: number = 0;

    @Column({ type: 'int', default: 0, comment: '防御值' })
    def: number = 0;

    @Column({ type: 'int', default: 0, comment: '稀有度' })
    rarity: number = 0;

    @Column({ type: 'int', comment: '技能ID列表', array: true })
    skillId: number[] = [];

    @Column({ type: 'int', comment: '被动技能ID列表', array: true })
    passiveSkillId: number[] = [];

    @Column({ type: 'int', comment: '技能扩展列表', array: true })
    auraSkillId: number[] = [];

    @Column({ type: 'boolean', default: false, comment: '巨型牌' })
    IsHuge: boolean = false;

    @Column({ type: 'int', default: 0, comment: '飞行层' })
    FlyLayer: number = 0;

    // 后续如果要实现AI相关的功能，可能要把配表里的其他内容也加上，初步估计AIDamege/AIDamageType等应该都是AI相关的内容
}