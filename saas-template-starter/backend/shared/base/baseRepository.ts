import Singleton from './singelton';
import { IBaseCRUD } from './iBaseCRUD';

/**
 * BaseRepository is an abstract class that implements basic CRUD operations
 * using the Singleton pattern to ensure only one instance exists per repository type.
 *
 * This class serves as a foundation for all repositories in the application,
 * providing a consistent interface for data access operations.
 *
 * @template T - The entity type returned by the repository (fully populated model)
 * @template U - The data transfer object type used for creating/updating entities
 * @extends {Singleton}
 * @implements {IBaseCRUD<T, U>}
 */
export abstract class BaseRepository<T, U> extends Singleton implements IBaseCRUD<T, U> {
    protected constructor() {
        super();
    }

    /**
     * Retrieves a single entity by its unique identifier
     * @param {string} id - The unique identifier of the entity
     * @returns {Promise<T>} A promise that resolves to the found entity
     */
    abstract findOne(id: string): Promise<T>;

    /**
     * Retrieves all entities of this type
     * @returns {Promise<T[]>} A promise that resolves to an array of entities
     */
    abstract findAll(): Promise<T[]>;

    /**
     * Creates a new entity
     * @param {U} item - The data transfer object containing entity information
     * @returns {Promise<T>} A promise that resolves to the created entity
     */
    abstract createOne(item: U): Promise<T>;

    /**
     * Updates an existing entity
     * @param {string} id - The unique identifier of the entity to update
     * @param {U} item - The data transfer object containing updated entity information
     * @returns {Promise<void>} A promise that resolves when the update is complete
     */
    abstract updateOne(id: string, item: U): Promise<void>;

    /**
     * Deletes an entity by its unique identifier
     * @param {string} id - The unique identifier of the entity to delete
     * @returns {Promise<void>} A promise that resolves when the deletion is complete
     */
    abstract deleteOne(id: string): Promise<void>;
}
