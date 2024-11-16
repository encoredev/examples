import { DataSource } from "typeorm";
import { URLEntity } from "./url.entity";

export async function initializeApp() {
    // Postgres provisioned on docker by myself
    const AppDataSource = new DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "password",
        database: "mydb", // create database manually before you run the app
        entities: [URLEntity],
        synchronize: true,
    });

    try {
        await AppDataSource.initialize();
        console.log("Database connected!");
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
    }
    return AppDataSource
}