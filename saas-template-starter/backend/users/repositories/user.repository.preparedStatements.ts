import { eq, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { users } from '../db/schema';
import Singleton from '../../shared/base/singelton';

export class UserPreparedStatements extends Singleton {
    private constructor() {
        super();
    }

    public readonly findOne = db
        .select()
        .from(users)
        .where(eq(users.id, sql.placeholder('id')))
        .prepare('find_user');

    public readonly findAll = db.select().from(users).prepare('find_all_users');

    public readonly findOneByEmail = db
        .select()
        .from(users)
        .where(eq(users.email, sql.placeholder('email')))
        .prepare('find_user_by_email');

    public readonly createUser = db
        .insert(users)
        .values({
            id: sql.placeholder('id'),
            firstName: sql.placeholder('firstName'),
            lastName: sql.placeholder('lastName'),
            email: sql.placeholder('email'),
        })
        .returning()
        .prepare('create_user');

    public readonly updateUser = db
        .update(users)
        .set(sql.placeholder('userData') as Partial<typeof users.$inferInsert>)
        .where(eq(users.id, sql.placeholder('id')))
        .returning()
        .prepare('update_user');

    public readonly deleteUser = db
        .delete(users)
        .where(eq(users.id, sql.placeholder('id')))
        .prepare('delete_user');

    public readonly deleteAll = db.delete(users).prepare('delete_all_users');
}

export const userPreparedStatements = UserPreparedStatements.getInstance<UserPreparedStatements>();
