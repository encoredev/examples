import { BaseService } from '../../shared/base/baseService';
import { ProductPricingRepository, productPricingRepository } from '../repositories/productPricing.repository';
import { ProductPrice, ProductPriceRequest } from '../types';

export class ProductPricingService extends BaseService<ProductPrice, ProductPriceRequest> {
    private constructor(protected readonly repository: ProductPricingRepository) {
        super(repository);
    }
}

export const productPriceService = ProductPricingService.getInstance<ProductPricingService>(productPricingRepository);
