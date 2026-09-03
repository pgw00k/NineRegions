import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Card {
    @PrimaryColumn({ type: 'bigint', comment: '卡片ID' })
    id: number = 0;

    @Column({ length: 64 })
    name: string = '';
}