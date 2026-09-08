import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Player } from "./Player";

@Entity()
export class UserLibrary {
    @PrimaryColumn({ type:'bigint',comment:'关联玩家ID' })
    id: string = '0';

    @Column({ comment:'平台传过来的登录ID' ,default:""})
    sdkid: string = "";

    // ---------- ORM 关联（仅用于连表查询，不用于更新） ----------
    @ManyToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id' })
    player: Player;
}