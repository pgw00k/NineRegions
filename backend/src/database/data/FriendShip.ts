import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Player } from "./Player";

@Entity()
@Unique('UQ_PLAYER_FRIEND', ['uid', 'fid'])
export class FriendShip {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '关系ID' })
    id: number;

    @Column({ type:'bigint',comment:'关联玩家ID' })
    uid: number;

    @Column({ type:'bigint',comment:'好友ID' })
    fid: number;

    @OneToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uid' })
    player: Player;
}