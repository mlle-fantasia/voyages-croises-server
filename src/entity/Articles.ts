import { Entity, PrimaryGeneratedColumn, CreateDateColumn,UpdateDateColumn, Column, OneToMany } from "typeorm";
import { Comments } from "./Comments";
import { Files } from "./Files";
import { Users } from "./Users";

@Entity({ name: "articles" })
export class Articles {
	@PrimaryGeneratedColumn({ name: "ar_id" })
	id: number;

	@Column({ name: "ar_order" })
	order: number;

	@Column({ name: "ar_title" })
	title: string;

	@Column({ name: "ar_resume" })
	resume: string;

	@Column({ name: "ar_contenu", type: "text" })
	contenu: string;

	@Column({ name: "ar_miniature" , nullable: true})
	miniature: string;

	@Column({ name: "ar_visible" , default:false})
	visible: boolean;

	@CreateDateColumn()
	createdAt: Date;
	
	@UpdateDateColumn()
    updateddAt: Date;

	@OneToMany((type) => Comments, (Comments) => Comments.articles)
	comments: Comments[];

	@OneToMany((type) => Files, (Files) => Files.articles)
	files: Files[];

	@OneToMany((type) => Users, (Users) => Users.articles)
	users: Users[];
}
