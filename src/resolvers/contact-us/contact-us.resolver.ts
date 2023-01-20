import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { ContactUs } from '../../entities/contact-us.entity';
import { NewContactUsMessage } from "./contact-us.input";
import { ContactUsRepository } from "./contact-us.repository";
import { FieldError } from '../fieldError';


@Resolver(() => ContactUs )
export class ContactUsResolver {
    @Query(() => [ContactUs] )
    async contactUsMessages(
        @Arg('option', () => String ) option: string
    ) {
        // option states: read | unread | all
        if(option === 'read') {
            return ContactUsRepository.find({where:{isRead: true}});
        }

        if(option === 'unread') {
            return ContactUsRepository.find({where:{isRead:false}});
        }

        return ContactUsRepository.find({order: {
            "createdAt": "DESC",
        },});
    }

    @Mutation(() => ContactUs )
    async addNewContactUsMessage(
        @Arg('data') {fullName,email,region,message}: NewContactUsMessage
    ): Promise<ContactUs> {

        const errors: Array<FieldError>  = [];

        if(!fullName) {
            errors.push({field:"fullName",message:"Nom et Prenom vide!"})
        }

        if(!email) {
            errors.push({field:"email",message:"Email vide!"})
        }

        if(!region) {
            errors.push({field:"region",message:"Region vide!"})
        }

        if(!message) {
            errors.push({field:"message",message:"Message vide!"})
        }

        if(errors.length > 0) {
            throw new Error(JSON.stringify(errors));
        }

        const contactUsMessage = ContactUsRepository.create({fullName, email, region, message});
        await ContactUsRepository.save(contactUsMessage);

        return contactUsMessage;
    }

    @Mutation(() => Boolean)
    async readContactUsMessage(
        @Arg('id', () => String) id: string
    ) {
        await ContactUsRepository.update(id,{isRead:true});
        return true;
    }
}