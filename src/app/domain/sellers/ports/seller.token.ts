import { InjectionToken } from '@angular/core';

import { SellerRepositoryPort } from './seller-repository.port';

export const SELLER_REPOSITORY = new InjectionToken<SellerRepositoryPort>(
  'SellerRepositoryPort'
);