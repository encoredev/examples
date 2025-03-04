import { BaseRepository } from './baseRepository';
import { IBaseCRUD } from './iBaseCRUD';
import Singleton from './singelton';

/**
 * Base service class that implements the IBaseCRUD interface.
 * Provides generic implementation for common CRUD operations.
 *
 * @template T The type of the entity returned by queries.
 * @template U The type used for creating and updating entities (typically excludes auto-generated fields).
 * @extends {Singleton}
 * @implements {IBaseCRUD<T, U>}
 */
export class BaseService<T, U> extends Singleton implements IBaseCRUD<T, U> {
    /**
     * Creates a new instance of BaseService.
     * @param repository The repository that handles database interactions for this service.
     */
    protected constructor(protected readonly repository: BaseRepository<T, U>) {
        super();
    }

    /**
     * Retrieves a single entity by its ID.
     * @param id The unique identifier of the entity.
     * @returns A promise resolving to the found entity.
     */
    findOne(id: string): Promise<T> {
        return this.repository.findOne(id);
    }

    /**
     * Retrieves all entities.
     * @returns A promise resolving to an array of all entities.
     */
    findAll(): Promise<T[]> {
        return this.repository.findAll();
    }

    /**
     * Creates a new entity.
     * @param item The entity data to create.
     * @returns A promise resolving to the created entity.
     */
    createOne(item: U): Promise<T> {
        return this.repository.createOne(item);
    }

    /**
     * Updates an existing entity.
     * @param id The unique identifier of the entity to update.
     * @param item The updated entity data.
     * @returns A promise that resolves when the update is complete.
     */
    updateOne(id: string, item: U): Promise<void> {
        return this.repository.updateOne(id, item);
    }

    /**
     * Deletes an entity by its ID.
     * @param id The unique identifier of the entity to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    deleteOne(id: string): Promise<void> {
        return this.repository.deleteOne(id);
    }
}
