import { Field, ID, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class ContactUs {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id:number;

    @Field(() => String)
    @Column()
    fullName:string;

    @Field(() => String)
    @Column()
    email:string;

    @Field(() => String)
    @Column()
    region:string;

    @Field(() => String)
    @Column()
    message:string;

    @Field(() => Boolean)
    @Column('boolean',{default:false})
    isRead: boolean;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}