import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class URLEntity {
    @Column("text", { primary: true })
    id: string;

    @Column("text")
    url: string;


    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;
}
