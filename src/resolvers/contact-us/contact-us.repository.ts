
import AppDataSource from '../../data-source';
import { ContactUs } from '../../entities/contact-us.entity';

export const ContactUsRepository = AppDataSource.getRepository(ContactUs).extend({
    // custor methods goes here
})