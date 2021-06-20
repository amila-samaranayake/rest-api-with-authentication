import { DocumentDefinition } from 'mongoose';
import User, { UserDocument } from '../model/user.model';

export const createUser = async (input: DocumentDefinition<UserDocument>) => {
    try {
        return await User.create(input);
    } catch (error) {
        throw new Error(error);
    }
}

