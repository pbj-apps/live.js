import Client = require('shopify-buy');
import { isEmpty, omit } from 'lodash';

import { CHECKOUT_ID_KEY } from './constants';
import { ShopifyConfigType } from '../../../common/types';

class Shopify {
  client: any;

  constructor(config: ShopifyConfigType) {
    this.client = null;
    this.buildClient(config);
  }

  buildClient({ domain, storefrontAccessToken }: ShopifyConfigType): any {
    if (!isEmpty(domain) && !isEmpty(storefrontAccessToken)) {
      this.client = Client.buildClient({ domain, storefrontAccessToken });
      return this.client;
    }
    throw new Error('Invalid Shopify Config.');
  }

  checkClient(): void {
    if (isEmpty(this.client)) {
      throw new Error('Shopify client not built.');
    }
  }

  async getCheckoutId(): Promise<string> {
    const checkoutId = sessionStorage.getItem(CHECKOUT_ID_KEY);

    if (checkoutId) {
      return checkoutId;
    }

    const { id: newCheckoutId } = await this.client.checkout.create();
    sessionStorage.setItem(CHECKOUT_ID_KEY, newCheckoutId);
    return newCheckoutId;
  }

  async getProduct(id: string): Promise<any> {
    this.checkClient();
    return await this.client.product.fetch(`gid://shopify/Product/${id}`);
  }

  async addProductToBag({ product, variantOptions }): Promise<any> {
    this.checkClient();

    const checkoutId = await this.getCheckoutId();
    const { variants: productVariants } = product;
    const selectedVariant =
      productVariants.length === 1
        ? productVariants[0]
        : this.client.product.helpers.variantForOptions(
            product,
            omit(variantOptions, 'quantity'),
          );

    return await this.client.checkout.addLineItems(checkoutId, {
      variantId: selectedVariant.id,
      quantity: variantOptions.quantity,
    });
  }

  async getCheckout(): Promise<any> {
    this.checkClient();
    const checkoutId = await this.getCheckoutId();
    return await this.client.checkout.fetch(checkoutId);
  }

  async deleteCheckoutLineItem(id: string): Promise<any> {
    this.checkClient();
    const checkoutId = await this.getCheckoutId();

    return await this.client.checkout.removeLineItems(checkoutId, [id]);
  }
}

export default Shopify;
