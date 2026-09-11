import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Player } from "./Player";

@Entity()
export class UserLibrary {
    @PrimaryColumn({ type:'varchar',length: 64, comment:'平台传过来的登录ID' ,default:""})
    sdkid: string = "";

    @Column({ type:'bigint',comment:'关联玩家ID' })
    uid: string = '0';

    // ---------- ORM 关联（仅用于连表查询，不用于更新） ----------
    @ManyToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uid' })
    player: Player;
}