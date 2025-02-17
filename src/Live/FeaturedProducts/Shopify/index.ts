import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { isEmpty } from 'lodash';

import { CART_ID_KEY } from './constants';
import { ShopifyConfigType } from '../../../common/types';
import {
  createCartMutation,
  addLineItemsMutation,
  removeLineItemsMutation,
  getProductQuery,
  getCartQuery,
} from './operations';

class Shopify {
  client: any;

  constructor(config: ShopifyConfigType) {
    this.client = null;
    this.buildClient(config);
  }

  buildClient({ domain, storefrontAccessToken }: ShopifyConfigType): any {
    if (!isEmpty(domain) && !isEmpty(storefrontAccessToken)) {
      this.client = createStorefrontApiClient({
        storeDomain: domain,
        apiVersion: '2024-04',
        publicAccessToken: storefrontAccessToken,
      });
      return this.client;
    }
    throw new Error('Invalid Shopify Config.');
  }

  checkClient(): void {
    if (isEmpty(this.client)) {
      throw new Error('Shopify client not built.');
    }
  }

  async getCartId(): Promise<string> {
    const cartId = sessionStorage.getItem(CART_ID_KEY);

    if (cartId) {
      return cartId;
    }

    const { data, errors } = await this.client.request(createCartMutation);
    if (errors) {
      console.error(errors.message);
      return;
    } else {
      const { cartCreate } = data;
      sessionStorage.setItem(CART_ID_KEY, cartCreate.cart.id);
      return cartCreate.cart.id;
    }
  }

  async getProduct(id: string): Promise<any> {
    this.checkClient();
    const { data, errors } = await this.client.request(getProductQuery({ id }));
    if (errors) {
      console.error(errors.message);
      return;
    }
    if (data) {
      return data.product;
    }
    if (!data && !errors) {
      throw new Error('Shopify product request failed.');
    }
  }

  getSelectedVariant({ product, variantOptions }) {
    const { variants: productVariants } = product;
    const selectedVariant =
      productVariants.length === 1
        ? productVariants.nodes[0]
        : productVariants.nodes.find((variant) => {
            return variant.selectedOptions.every((option) => {
              return variantOptions[option.name] === option.value;
            });
          });

    if (!selectedVariant) {
      throw new Error('Variant not found.');
    }

    return selectedVariant;
  }

  async addProductToBag({ product, variantOptions }): Promise<any> {
    this.checkClient();
    const cartId = await this.getCartId();
    const selectedVariant = this.getSelectedVariant({
      product,
      variantOptions,
    });

    const { data, errors } = await this.client.request(
      addLineItemsMutation({
        cartId,
        selectedVariantId: selectedVariant.id,
        quantity: variantOptions.quantity,
      }),
    );
    if (errors) {
      console.error(errors.message);
      return;
    } else {
      return data.cartLinesAdd.cart;
    }
  }

  async getCart(): Promise<any> {
    this.checkClient();
    const cartId = await this.getCartId();

    const { data, errors } = await this.client.request(
      getCartQuery({ cartId }),
    );
    if (errors) {
      console.error(errors.message);
      return;
    } else {
      return data.cart;
    }
  }

  async deleteCheckoutLineItem(id: string): Promise<any> {
    this.checkClient();
    const cartId = await this.getCartId();

    const { data, errors } = await this.client.request(
      removeLineItemsMutation({ cartId, lineId: id }),
    );
    if (errors) {
      console.error(errors.message);
      return;
    } else {
      return data.cartLinesRemove.cart;
    }
  }
}

export default Shopify;
