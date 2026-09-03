import { Column, Entity, Generated, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export enum Gender {
    Male = 0,
    Female = 1,
}

@Entity()
export class Player {
    @PrimaryGeneratedColumn({ type: 'bigint' ,comment: '数据库内联ID' })
    id: number = 0;

    @Column({ length: 16, nullable: true, comment: '玩家名称', default: 'Player' })
    name: string = '';

    @Column({ nullable: true, comment: '钱', default: 0 })
    money: number = 0;

    @Column({ nullable: true, comment: '等级', default: 1 })
    level: number = 1;

    @Column({ nullable: true, comment: '经验', default: 0 })
    exp: number = 0;

    @Column({ nullable: true, comment: '钻石', default: 0 })
    diamond: number = 0;

    @Column({ nullable: true, comment: '合成卡牌的粉尘', default: 0 })
    ash: number = 0;

    @Column({ nullable: true, comment: '性别', default: Gender.Male })
    gender: number = Gender.Male;

    @Column({ nullable: true, comment: '创建时间', default: Date.now() })
    createTime: number = Date.now();

    @Column({ nullable: true, comment: '', default: 0 })
    jade:number = 0;

    @Column({ nullable: true, comment: '称号', default: '' })
    curTitle:string = '';

    @Column({ nullable: true, comment: '名片背景', default: 0 })
    curBackGround:number = 0;
    
    @Column({ nullable: true, comment: '最后改名时间', default: 0 })
    lastChangeTime: number = 0;

    @Column({ nullable: false, comment: 'UID', default: '' })
    uid: string = '395085356';
}