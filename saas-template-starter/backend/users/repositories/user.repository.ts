import { APIError } from 'encore.dev/api';
import { userPreparedStatements, type UserPreparedStatements } from './user.repository.preparedStatements';

import { withErrorHandling } from '../../shared/utils/withErrorHandling';
import { User, UserRequest } from '../types';
import { BaseRepository } from '../../shared/base/baseRepository';

export class UserRepository extends BaseRepository<User, UserRequest> {
    private constructor(private readonly preparedStatements: UserPreparedStatements) {
        super();
    }

    findOne(id: string): Promise<User> {
        return withErrorHandling(async () => {
            const [user] = await this.preparedStatements.findOne.execute({ id });
            if (!user) {
                throw APIError.notFound('User not found');
            }
            return user as User;
        }, 'Error finding user');
    }

    public async findOneByEmail(email: string): Promise<User> {
        return withErrorHandling(async () => {
            const [user] = await this.preparedStatements.findOneByEmail.execute({ email });
            if (!user) {
                throw APIError.notFound('User not found');
            }
            return user as User;
        }, 'Error finding user by email');
    }

    findAll(): Promise<User[]> {
        throw new Error('Method not implemented.');
    }

    createOne(user: UserRequest): Promise<User> {
        return withErrorHandling(async () => {
            const [createdUser] = await this.preparedStatements.createUser.execute({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            });
            if (!createdUser) {
                throw APIError.internal('Failed to create user');
            }
            return createdUser as User;
        }, 'Error creating user');
    }

    updateOne(id: string, user: UserRequest): Promise<void> {
        return withErrorHandling(async () => {
            const userExists = await this.findOne(id);
            if (!userExists) {
                throw APIError.notFound('User not found');
            }

            const [updatedUser] = await this.preparedStatements.updateUser.execute({
                id,
                userData: user,
            });

            if (!updatedUser) {
                throw APIError.internal('Failed to update user');
            }
        }, 'Error updating user');
    }

    deleteOne(id: string): Promise<void> {
        return withErrorHandling(async () => {
            const userExists = await this.findOne(id);
            if (!userExists) {
                throw APIError.notFound('User not found');
            }

            await this.preparedStatements.deleteUser.execute({ id });
        }, 'Error deleting user');
    }

    deleteAll(): Promise<void> {
        return withErrorHandling(async () => {
            await this.preparedStatements.deleteAll.execute();
        }, 'Error deleting all users');
    }
}

export const userRepository = UserRepository.getInstance<UserRepository>(userPreparedStatements);
