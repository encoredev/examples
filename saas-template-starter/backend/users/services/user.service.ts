import { BaseService } from '../../shared/base/baseService';
import { UserRepository, userRepository } from '../repositories/user.repository';
import { User, UserRequest } from '../types';

export class UserService extends BaseService<User, UserRequest> {
    private constructor(protected readonly repository: UserRepository) {
        super(repository);
    }

    public async findOneByEmail(email: string): Promise<User> {
        return this.repository.findOneByEmail(email);
    }
}

export const userService = UserService.getInstance<UserService>(userRepository);
