import { Entity, PrimaryGeneratedColumn,CreateDateColumn, Column, OneToMany } from "typeorm";
import { Articles } from "./Articles";

@Entity({ name: "comments" })
export class Comments {
	@PrimaryGeneratedColumn({ name: "com_id" })
	id: number;

	@Column({ name: "com_title" })
	title: string;

	@Column({ name: "com_contenu", type: "text" })
	contenu: string;

	@Column({ name: "com_visible" , default:false})
	visible: boolean;

	@Column({ name: "com_name" , default:"" })
    name: string;
    
    @Column({ name: "com_email" , default:"" })
    email: string;
    
	@CreateDateColumn()
	createdAt: Date;

	@OneToMany((type) => Articles, (Articles) => Articles.comments)
	articles: Articles[];
}
