import { APIError } from 'encore.dev/api';
import { withErrorHandling } from '../../shared/utils/withErrorHandling';
import { BaseRepository } from '../../shared/base/baseRepository';
import {
    productPricingPreparedStatements,
    ProductPricingPreparedStatements,
} from './productPricing.repository.preparedStatements';
import { ProductPrice, ProductPriceRequest } from '../types';

export class ProductPricingRepository extends BaseRepository<ProductPrice, ProductPriceRequest> {
    protected constructor(private readonly preparedStatements: ProductPricingPreparedStatements) {
        super();
    }

    findOne(id: string): Promise<ProductPrice> {
        return withErrorHandling(async () => {
            const [productPrice] = await this.preparedStatements.findOne.execute({ id });
            if (!productPrice) {
                throw APIError.notFound('Product price not found');
            }
            return productPrice as ProductPrice;
        }, 'Error finding product price');
    }

    findByProductId(productId: string): Promise<ProductPrice> {
        return withErrorHandling(async () => {
            const [productPrice] = await this.preparedStatements.findByProductId.execute({ productId });
            if (!productPrice) {
                throw APIError.notFound(`No price found for product ${productId}`);
            }
            return productPrice as ProductPrice;
        }, 'Error finding product price by product ID');
    }

    findAll(): Promise<ProductPrice[]> {
        return withErrorHandling(async () => {
            const prices = await this.preparedStatements.findAll.execute();
            return prices as ProductPrice[];
        }, 'Error finding all product prices');
    }

    createOne(data: ProductPriceRequest): Promise<ProductPrice> {
        return withErrorHandling(async () => {
            const [created] = await this.preparedStatements.createOne.execute({
                priceId: data.priceId,
                productId: data.productId,
                price: data.price,
                currency: data.currency,
            });

            if (!created) {
                throw APIError.internal('Failed to create product price');
            }
            return created as ProductPrice;
        }, 'Error creating product price');
    }

    updateOne(productId: string, productPriceData: ProductPriceRequest): Promise<void> {
        return withErrorHandling(async () => {
            const productPrice = await this.findByProductId(productId);

            if (!productPrice) {
                throw APIError.notFound('Product price not found');
            }

            const [updated] = await this.preparedStatements.updateOne.execute({
                productPriceData,
                productId,
            });

            if (!updated) {
                throw APIError.internal('Failed to update product price');
            }
        }, 'Error updating product price');
    }

    deleteOne(priceId: string): Promise<void> {
        return withErrorHandling(async () => {
            const [deleted] = await this.preparedStatements.deleteOne.execute({ priceId });

            if (!deleted) {
                throw APIError.notFound('Product price not found or could not be deleted');
            }
        }, 'Error deleting product price');
    }
}

export const productPricingRepository = ProductPricingRepository.getInstance<ProductPricingRepository>(
    productPricingPreparedStatements
);
