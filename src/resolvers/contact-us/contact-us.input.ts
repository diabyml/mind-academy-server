import { Field, InputType } from "type-graphql";

@InputType()
export class NewContactUsMessage {
    @Field(() => String)
    fullName: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    region: string;

    @Field(() => String)
    message: string;
}