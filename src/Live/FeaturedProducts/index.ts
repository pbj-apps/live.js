import {
  isEmpty,
  differenceBy,
  isEqual,
  forEach,
  map,
  find,
  filter,
  parseInt,
  isNil,
  size,
} from 'lodash';

import { PRODUCT_LIST_ELEMENT_ID } from '../Player/components/FeaturedProductsContainer/constants';
import ProductElement from '../Player/components/FeaturedProductsContainer/product';
import ProductDetailsElement from './components/ProductDetails';
import VariantRadio from './components/VariantRadio';
import VariantSelectElement from './components/VariantSelect';
import Shopify from './Shopify';
import {
  PRODUCT_DETAILS_CLASS,
  QUNAITITY_SELECTOR_NAME,
} from './components/ProductDetails/constants';
import {
  PRODUCTS_TOGGLE_TEXT_CLASS,
  PRODUCT_DETAILS_FORM_NAME,
  REMOVE_ITEM_BUTTON_CLASS,
  SHOPIFY_BAG_BACK_BUTTON_CLASS,
  SHOPIFY_BAG_BUTTON_CLASS,
  SHOPIFY_BAG_CLASS,
  VARIANT_SELECTORS_CONTAINER,
  VARIANT_SELECTOR_NAME_SUFFIX,
} from './constants';
import { ShopifyConfigType } from '../../common/types';
import { renderButtonText as ButtonTextElement } from '../Player/components/FeaturedProductsContainer';
import BagButtonElement from './components/BagButton';
import BagElement from './components/Bag';

class FeaturedProducts {
  playerContainerElement: HTMLElement;
  featuredProductsContainerElement: HTMLElement;
  shopifyStoreDetails: ShopifyConfigType;
  shopifyInstance: Shopify;
  hasBagButtonRendered: boolean;
  isBagOpen: boolean;
  products;
  productDetails;
  variantDetails;
  selectedVariantOptions;
  textContainerElement: HTMLElement;

  constructor({
    playerContainerElement,
    featuredProductsContainerElement,
    products = [],
    shopifyStoreDetails,
  }: ContructorType) {
    this.playerContainerElement = playerContainerElement;
    this.featuredProductsContainerElement = featuredProductsContainerElement;
    this.shopifyStoreDetails = shopifyStoreDetails;
    this.textContainerElement = document.querySelector(
      `.${PRODUCTS_TOGGLE_TEXT_CLASS}`,
    );
    this.isBagOpen = false;
    this.hasBagButtonRendered = false;
    this.updateProducts(products);
  }

  changeContainerHiddenState(productList): void {
    if (isEmpty(productList) && !this.featuredProductsContainerElement.hidden) {
      this.featuredProductsContainerElement.hidden = true;
    } else if (
      !isEmpty(productList) &&
      this.featuredProductsContainerElement.hidden
    ) {
      this.featuredProductsContainerElement.hidden = false;
    }
  }

  updateProducts(featuredProductsUpdate): void {
    this.changeContainerHiddenState(featuredProductsUpdate);

    const unfeaturedProducts: [any] = differenceBy(
      this.products,
      featuredProductsUpdate,
      'product.id',
    );
    const newFeaturedProducts: [any] = differenceBy(
      featuredProductsUpdate,
      this.products,
      'product.id',
    );

    forEach(unfeaturedProducts, ({ product: unfeaturedProduct }) => {
      this.removeProduct(unfeaturedProduct);
    });

    if (!isEmpty(newFeaturedProducts)) {
      this.renderProducts(newFeaturedProducts);
    }

    this.products = featuredProductsUpdate;
  }

  renderProducts(productList): void {
    forEach(productList, ({ product }) => {
      this.renderProduct(product);
    });
  }

  renderProduct(product): void {
    if (
      isEqual(product.product_type, 'shopify') &&
      !isEmpty(this.shopifyStoreDetails) &&
      !isEmpty(this.shopifyStoreDetails.storefrontAccessToken)
    ) {
      this.renderShopifyProduct(product);
    } else {
      this.renderLiveProduct(product);
    }
  }

  renderLiveProduct(product): void {
    document
      .getElementById(PRODUCT_LIST_ELEMENT_ID)
      .insertAdjacentHTML(
        'afterbegin',
        ProductElement({ product, useUrl: true }),
      );
  }

  async renderBag(checkout?): Promise<void> {
    const fetchedCheckout =
      checkout || (await this.shopifyInstance.getCheckout());
    const BAG_ELEMENT = this.featuredProductsContainerElement.querySelector(
      `.${SHOPIFY_BAG_CLASS}`,
    );

    if (BAG_ELEMENT) {
      BAG_ELEMENT.remove();
    }

    this.featuredProductsContainerElement.insertAdjacentHTML(
      'beforeend',
      BagElement(fetchedCheckout),
    );

    this.featuredProductsContainerElement
      .querySelector(`.${SHOPIFY_BAG_CLASS} .${SHOPIFY_BAG_BACK_BUTTON_CLASS}`)
      .addEventListener('click', this.handleBagButtonClick);

    forEach(fetchedCheckout.lineItems, ({ id }) => {
      document
        .getElementById(id)
        .querySelector(`.${REMOVE_ITEM_BUTTON_CLASS}`)
        .addEventListener('click', () => {
          this.onRemoveLineItem(id);
        });
    });
  }

  async onRemoveLineItem(id: string): Promise<void> {
    const checkout = await this.shopifyInstance.deleteCheckoutLineItem(id);
    await this.renderBag(checkout);
    this.updateBagButtonElement(size(checkout.lineItems));
  }

  async onBagOpen(): Promise<void> {
    if (isEmpty(this.shopifyInstance)) {
      this.shopifyInstance = new Shopify(this.shopifyStoreDetails);
    }

    await this.renderBag();

    if (!isNil(this.textContainerElement)) {
      this.textContainerElement.innerHTML = ButtonTextElement('Shopping Cart');
    }

    document.getElementById(PRODUCT_LIST_ELEMENT_ID).hidden = true;
  }

  onBagClose(): void {
    this.featuredProductsContainerElement
      .querySelector(`.${SHOPIFY_BAG_CLASS}`)
      .remove();

    if (!isNil(this.textContainerElement)) {
      this.textContainerElement.innerHTML = ButtonTextElement();
    }
    document.getElementById(PRODUCT_LIST_ELEMENT_ID).hidden = false;
  }

  handleBagButtonClick = (): void => {
    this.isBagOpen = !this.isBagOpen;
    if (this.isBagOpen) {
      this.onBagOpen();
    } else {
      this.onBagClose();
    }
  };

  renderBagButton(): void {
    const LastControlElement = this.playerContainerElement.querySelector(
      '.vjs-control-bar > :last-child',
    );

    if (!isNil(LastControlElement)) {
      LastControlElement.insertAdjacentHTML('beforebegin', BagButtonElement());

      this.playerContainerElement
        .querySelector(`.${SHOPIFY_BAG_BUTTON_CLASS}`)
        .addEventListener('click', this.handleBagButtonClick);
      this.hasBagButtonRendered = true;
    }
  }

  renderShopifyProduct(product): void {
    if (!this.hasBagButtonRendered) {
      this.renderBagButton();
    }
    document
      .getElementById(PRODUCT_LIST_ELEMENT_ID)
      .insertAdjacentHTML('afterbegin', ProductElement({ product }));
    document
      .getElementById(`product-${product.id}`)
      .addEventListener('click', () => {
        this.openShopifyProductDetails(product);
      });
  }

  removeProduct(unfeaturedProduct): void {
    document.getElementById(`product-${unfeaturedProduct.id}`).remove();
  }

  updateBagButtonElement(itemsInBag: number): void {
    const CurrentBagButtonElement = this.playerContainerElement.querySelector(
      `.${SHOPIFY_BAG_BUTTON_CLASS}`,
    );

    if (CurrentBagButtonElement) {
      CurrentBagButtonElement.remove();
    }

    this.playerContainerElement
      .querySelector('.vjs-control-bar > :last-child')
      .insertAdjacentHTML('beforebegin', BagButtonElement(itemsInBag));
    this.playerContainerElement
      .querySelector(`.${SHOPIFY_BAG_BUTTON_CLASS}`)
      .addEventListener('click', this.handleBagButtonClick);
  }

  onProductFormSubmit = async (event): Promise<void> => {
    const orderDetailsForm = <HTMLFormElement>(
      document.querySelector(`form[name="${PRODUCT_DETAILS_FORM_NAME}"]`)
    );
    const ErrorMesssageElement = <HTMLElement>(
      orderDetailsForm.querySelector('.error-message')
    );

    event.preventDefault();
    const formData = new FormData(event.target);
    this.selectedVariantOptions = {
      quantity: parseInt(formData.get(QUNAITITY_SELECTOR_NAME)),
    };

    if (!ErrorMesssageElement.hidden) {
      ErrorMesssageElement.hidden = true;
    }

    forEach(this.variantDetails, ({ name }) => {
      const value = formData.get(`${name}${VARIANT_SELECTOR_NAME_SUFFIX}`);

      if (value) {
        this.selectedVariantOptions = {
          ...this.selectedVariantOptions,
          [name]: value,
        };
      } else {
        ErrorMesssageElement.hidden = false;
      }
    });

    if (ErrorMesssageElement.hidden) {
      const checkout = await this.shopifyInstance.addProductToBag({
        product: this.productDetails,
        variantOptions: this.selectedVariantOptions,
      });

      this.updateBagButtonElement(size(checkout.lineItems));
      this.onCloseProductDetails();
    }
  };

  async openShopifyProductDetails(product): Promise<void> {
    const { external_id: externalId, title } = product;

    if (isEmpty(this.shopifyInstance)) {
      this.shopifyInstance = new Shopify(this.shopifyStoreDetails);
    }

    this.productDetails = await this.shopifyInstance.getProduct(externalId);

    if (!isNil(this.textContainerElement)) {
      this.textContainerElement.innerHTML = ButtonTextElement(title);
    }

    document.getElementById(PRODUCT_LIST_ELEMENT_ID).hidden = true;

    this.featuredProductsContainerElement.insertAdjacentHTML(
      'beforeend',
      ProductDetailsElement(product, !this.productDetails.availableForSale),
    );

    document
      .querySelector(`.${PRODUCT_DETAILS_CLASS} .close-button`)
      .addEventListener('click', this.onCloseProductDetails);

    if (this.productDetails.availableForSale) {
      this.renderShopifyVairantSelectors(this.productDetails);

      document
        .querySelector(`form[name="${PRODUCT_DETAILS_FORM_NAME}"]`)
        .addEventListener('submit', this.onProductFormSubmit);
    }
  }

  renderShopifyVairantSelectors(productDetails): void {
    const { options } = productDetails;

    const variants = filter(options, ({ name, values }) => {
      const isDefaultName = isEqual(name, 'Title');
      const isDefaultValue = isEqual(values[0].value, 'Default Title');
      return !(isDefaultName && isDefaultValue);
    });

    this.variantDetails = variants;
    forEach(variants, (variant) => {
      this.renderShopifyVariant(variant);
    });
  }

  isVariantAvailable(name: string, value: any): boolean {
    for (let i = 0; i < this.productDetails.variants.length; i += 1) {
      const { selectedOptions, available } = this.productDetails.variants[i];
      if (available) {
        const isVariantPresent = find(selectedOptions, { name, value });
        if (isVariantPresent) {
          return true;
        }
      }
    }
    return false;
  }

  renderShopifyVariant({ name, values }: { name: string; values: any }): void {
    const updatedVariantValues = map(values, ({ value }) => ({
      value,
      isOrderable: this.isVariantAvailable(name, value),
    }));

    const RenderElement = isEqual(name.toLowerCase(), 'color')
      ? VariantSelectElement
      : VariantRadio;

    document
      .querySelector(`.${VARIANT_SELECTORS_CONTAINER}`)
      .insertAdjacentHTML(
        'beforeend',
        RenderElement(name, updatedVariantValues),
      );
  }

  onCloseProductDetails(): void {
    if (!isNil(this.textContainerElement)) {
      this.textContainerElement.innerHTML = ButtonTextElement();
    }
    document.querySelector(`.${PRODUCT_DETAILS_CLASS}`).remove();
    document.getElementById(PRODUCT_LIST_ELEMENT_ID).hidden = false;
  }
}

interface ContructorType {
  playerContainerElement: HTMLElement;
  featuredProductsContainerElement: HTMLElement;
  products: { [key: string]: any }[];
  shopifyStoreDetails: ShopifyConfigType;
}

export default FeaturedProducts;
