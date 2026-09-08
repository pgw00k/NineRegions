import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Player } from "./Player";

@Entity()
@Unique('UQ_PLAYER_FRIEND', ['pid', 'fid'])
export class FriendShip {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '关系ID' })
    id: number;

    @Column({ type:'bigint',comment:'关联玩家ID' })
    pid: number;

    @Column({ type:'bigint',comment:'好友ID' })
    fid: number;

    @ManyToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pid' })
    player: Player;

    @ManyToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fid' })
    friend: Player;
}