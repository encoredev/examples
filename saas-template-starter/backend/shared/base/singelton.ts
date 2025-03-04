/**
 * Singleton is an abstract base class that implements the Singleton design pattern.
 *
 * This class provides a reusable implementation of the Singleton pattern that can be
 * extended by other classes to ensure only one instance of each class exists throughout
 * the application lifecycle. It properly handles inheritance and supports constructor
 * parameters.
 *
 * Usage:
 * ```typescript
 * class MyService extends Singleton {
 *   private constructor() {
 *     super();
 *     // initialization
 *   }
 *
 *   public doSomething(): void {
 *     // implementation
 *   }
 * }
 *
 * // Get the singleton instance
 * const service = MyService.getInstance<MyService>();
 * ```
 *
 * Why use Singleton?
 * - Ensures only one instance of a class exists throughout the application lifecycle
 * - Supports inheritance and constructor parameters
 * - Provides a reusable implementation of the Singleton pattern
 *
 * This is possible due to the event loop in Node.js, which is single-threaded and runs
 * in a non-blocking manner. This allows the Singleton pattern to work as expected due to the async await nature of the event loop.
 * Thus sharing the same instance across different parts of the application is safe, since the event loop ensures that only one instance
 * is created but can be accessed by multiple parts of the application concurrently.
 */
export default abstract class Singleton {
    /**
     * A Map that stores singleton instances keyed by their constructor reference.
     * This allows different classes extending Singleton to have their own unique instances.
     * @private
     * @static
     */
    private static readonly instances = new Map<unknown, unknown>();

    /**
     * Protected constructor to prevent direct instantiation with 'new'.
     * Forces consumers to use the getInstance method instead.
     *
     * @param _args - Optional constructor arguments (passed through getInstance)
     * @protected
     */
    protected constructor(..._args: unknown[]) {
        // Constructor is protected - only allow subclasses to instantiate
    }

    /**
     * Gets or creates the singleton instance of the extending class.
     * If an instance already exists, it returns that instance; otherwise, it creates a new one.
     *
     * @param args - Constructor arguments to pass to the class constructor when creating the instance
     * @returns The singleton instance of the class
     * @template T - The type of the instance being returned (typically the class extending Singleton)
     * @static
     */
    public static getInstance<T>(...args: unknown[]): T {
        const classConstructor = this;

        if (!Singleton.instances.has(classConstructor)) {
            // Use type casting to create instance despite protected constructor
            const instance = new (classConstructor as any)(...args);
            Singleton.instances.set(classConstructor, instance);
        }

        return Singleton.instances.get(classConstructor) as T;
    }
}
