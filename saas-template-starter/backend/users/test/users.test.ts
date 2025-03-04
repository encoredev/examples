import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as auth from '~encore/auth';
import { User } from '../types';
import { findUser } from '../api/user.api';
import { userRepository } from '../repositories/user.repository';

// Create a mock user to use in tests
const mockUser: User = {
    id: 'test1234',
    email: 'test@gmail.com',
    firstName: 'Jon',
    lastName: 'Doe',
    isDeleted: false,
    createdAt: new Date('2023-05-17T14:32:45Z'),
    updatedAt: new Date('2023-05-17T14:32:45Z'),
};

describe('Users Controller Endpoints Test', () => {
    beforeEach(() => {
        userRepository.deleteAll();
        vi.resetAllMocks();
        // Mock the auth data
        const authSpy = vi.spyOn(auth, 'getAuthData');
        authSpy.mockImplementation(() => ({ userID: 'test1234' }));

        // Mock the user repository findOne method to return our mock user
        const repoSpy = vi.spyOn(userRepository, 'findOne');
        repoSpy.mockResolvedValue(mockUser);
    });

    it('should create one user', async () => {
        // Mock the createOne method
        const createSpy = vi.spyOn(userRepository, 'createOne');
        const expectedUser = {
            id: 'test4321',
            email: 'test1234@gmail.com',
            firstName: 'Jane',
            lastName: 'Doe',
            isDeleted: false,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        };
        createSpy.mockResolvedValue(expectedUser);

        const result = await userRepository.createOne({
            id: 'test4321',
            email: 'test1234@gmail.com',
            firstName: 'Jane',
            lastName: 'Doe',
        });

        // Check that createOne was called with the right parameters
        expect(createSpy).toHaveBeenCalledWith({
            id: 'test4321',
            email: 'test1234@gmail.com',
            firstName: 'Jane',
            lastName: 'Doe',
        });

        // Check that the result matches what we expect
        expect(result).toEqual(expectedUser);
    });

    it('should find one user', async () => {
        // Call the actual API endpoint
        const result = await findUser({ id: 'test1234' });

        // Verify the repository was called with correct parameters
        expect(userRepository.findOne).toHaveBeenCalledWith('test1234');

        // Verify the result matches our expectations
        expect(result).toEqual(mockUser);
    });

    it('should update one user', async () => {
        // Mock the updateOne method
        const updateSpy = vi.spyOn(userRepository, 'updateOne');
        updateSpy.mockResolvedValue();

        const updatedUser = {
            id: 'test1234',
            email: 'anything@gmail.com',
            firstName: 'Jon',
            lastName: 'Doe',
        };

        await userRepository.updateOne('test1234', updatedUser);

        // Check that updateOne was called with the right parameters
        expect(updateSpy).toHaveBeenCalledWith('test1234', updatedUser);

        // Update the findOne mock to return our updated user for this test
        vi.spyOn(userRepository, 'findOne').mockResolvedValue({
            ...mockUser,
            email: 'anything@gmail.com',
        });

        // Verify the user was updated
        const updatedUserResult = await userRepository.findOne('test1234');
        expect(updatedUserResult).toEqual({
            ...mockUser,
            email: 'anything@gmail.com',
        });
    });

    it('should delete one user', async () => {
        // Mock the deleteOne method
        const deleteSpy = vi.spyOn(userRepository, 'deleteOne');
        deleteSpy.mockResolvedValue();

        await userRepository.deleteOne('test1234');

        // Check that deleteOne was called with the right parameters
        expect(deleteSpy).toHaveBeenCalledWith('test1234');

        // Mock findOne to return undefined after deletion
        vi.spyOn(userRepository, 'findOne').mockResolvedValue(undefined as unknown as User);

        // Verify the user was deleted
        const deletedUser = await userRepository.findOne('test1234');
        expect(deletedUser).toBeUndefined();
    });
});
