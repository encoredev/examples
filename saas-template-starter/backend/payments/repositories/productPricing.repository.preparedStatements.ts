import { eq, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { productPriceTags } from '../db/schema';
import Singleton from '../../shared/base/singelton';

export class ProductPricingPreparedStatements extends Singleton {
    private constructor() {
        super();
    }

    public readonly findOne = db
        .select()
        .from(productPriceTags)
        .where(eq(productPriceTags.productId, sql.placeholder('productId')))
        .prepare('find_product_price_by_product_id');

    public readonly findByPriceId = db
        .select()
        .from(productPriceTags)
        .where(eq(productPriceTags.id, sql.placeholder('id')))
        .prepare('find_product_price_by_id');

    public readonly findByProductId = db
        .select()
        .from(productPriceTags)
        .where(eq(productPriceTags.productId, sql.placeholder('productId')))
        .prepare('find_product_price_by_product_id');

    public readonly findAll = db.select().from(productPriceTags).prepare('find_all_product_prices');

    public readonly createOne = db
        .insert(productPriceTags)
        .values({
            priceId: sql.placeholder('priceId'),
            productId: sql.placeholder('productId'),
            price: sql.placeholder('price'),
            currency: sql.placeholder('currency'),
        })
        .returning()
        .prepare('create_product_price');

    public readonly updateOne = db
        .update(productPriceTags)
        .set(sql.placeholder('productPriceData') as Partial<typeof productPriceTags.$inferInsert>)
        .where(eq(productPriceTags.id, sql.placeholder('id')))
        .returning()
        .prepare('update_product_price');

    public readonly deleteOne = db
        .delete(productPriceTags)
        .where(eq(productPriceTags.priceId, sql.placeholder('priceId')))
        .returning()
        .prepare('delete_product_price');
}

export const productPricingPreparedStatements =
    ProductPricingPreparedStatements.getInstance<ProductPricingPreparedStatements>();
