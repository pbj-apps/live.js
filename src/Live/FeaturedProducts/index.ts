import {
  isEmpty,
  differenceBy,
  isEqual,
  omit,
  forEach,
  map,
  find,
  reduce,
  filter,
  parseInt,
  isNil,
  first,
  size,
  toNumber,
  some,
  sortBy,
} from 'lodash';

import { PRODUCT_LIST_ELEMENT_ID } from '../Player/components/FeaturedProductsContainer/constants';
import ProductElement from '../Player/components/FeaturedProductsContainer/product';
import ProductDetailsElement from './components/ProductDetails';
import VariantRadio from './components/VariantRadio';
import VariantSelectElement from './components/VariantSelect';
import Shopify from './Shopify';
import {
  PRODUCT_DETAILS_CLASS,
  QUANTITY_SELECTOR_NAME,
} from './components/ProductDetails/constants';
import {
  BAG_OPEN_CLASS,
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
import { splitShopifyId } from '../../utils/splitShopifyId';
import { getItemCount } from '../../utils/getLineItemCount';

class FeaturedProducts {
  playerContainerElement: HTMLElement;
  featuredProductsContainerElement: HTMLElement;
  shopifyStoreDetails: ShopifyConfigType;
  shopifyInstance: Shopify;
  hasBagButtonRendered: boolean;
  isBagOpen: boolean;
  products;
  firstAvailableOptions;
  productDetails;
  variantDetails;
  mappedVariantOptions;
  selectedVariantOptions;
  textContainerElement: HTMLElement;

  constructor({
    playerContainerElement,
    featuredProductsContainerElement,
    products,
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
    this.firstAvailableOptions = {};
    this.products = [];
    this.updateProducts(products);
  }

  updateFeaturedProductsContainerElement(
    featuredProductsContainerElement: HTMLElement,
  ): void {
    this.featuredProductsContainerElement = featuredProductsContainerElement;
    featuredProductsContainerElement.querySelector(
      `#${PRODUCT_LIST_ELEMENT_ID}`,
    ).innerHTML = '';
    this.products = [];
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

  async renderBag(cart?): Promise<void> {
    const fetchedCart = cart || (await this.shopifyInstance.getCart());
    const BAG_ELEMENT = this.featuredProductsContainerElement.querySelector(
      `.${SHOPIFY_BAG_CLASS}`,
    );

    if (BAG_ELEMENT) {
      BAG_ELEMENT.remove();
    }

    this.featuredProductsContainerElement.insertAdjacentHTML(
      'beforeend',
      BagElement(fetchedCart),
    );
    this.featuredProductsContainerElement.classList.add(BAG_OPEN_CLASS);

    this.featuredProductsContainerElement
      .querySelector(`.${SHOPIFY_BAG_CLASS} .${SHOPIFY_BAG_BACK_BUTTON_CLASS}`)
      .addEventListener('click', this.handleBagButtonClick);

    forEach(fetchedCart.lines.edges, ({ node }) => {
      const { id: nodeId, merchandise } = node;
      const { id: productVariantId } = merchandise;
      const { id: elementId } = splitShopifyId(productVariantId);

      document
        .getElementById(elementId)
        .querySelector(`.${REMOVE_ITEM_BUTTON_CLASS}`)
        .addEventListener('click', () => {
          this.onRemoveLineItem(nodeId);
        });
    });
  }

  async onRemoveLineItem(id: string): Promise<void> {
    const cart = await this.shopifyInstance.deleteCheckoutLineItem(id);
    await this.renderBag(cart);
    this.updateBagButtonElement(getItemCount(cart.lines.edges));
  }

  async onBagOpen(): Promise<void> {
    const ProductDetailsElement = this.featuredProductsContainerElement.querySelector(
      `.${PRODUCT_DETAILS_CLASS}`,
    );

    if (isEmpty(this.shopifyInstance)) {
      this.shopifyInstance = new Shopify(this.shopifyStoreDetails);
    }

    await this.renderBag();

    if (!isNil(this.textContainerElement)) {
      this.textContainerElement.innerHTML = ButtonTextElement('Shopping Cart');
    }

    document.getElementById(PRODUCT_LIST_ELEMENT_ID).hidden = true;

    if (!isNil(ProductDetailsElement)) {
      ProductDetailsElement.remove();
    }
  }

  onBagClose(): void {
    this.featuredProductsContainerElement
      .querySelector(`.${SHOPIFY_BAG_CLASS}`)
      .remove();
    this.featuredProductsContainerElement.classList.remove(BAG_OPEN_CLASS);

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
    const productElement = document.getElementById(
      `product-${unfeaturedProduct.id}`,
    );

    if (!isNil(productElement)) {
      productElement.remove();
    }
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
      quantity: parseInt(formData.get(QUANTITY_SELECTOR_NAME)),
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
      const cart = await this.shopifyInstance.addProductToBag({
        product: this.productDetails,
        variantOptions: this.selectedVariantOptions,
      });
      this.updateBagButtonElement(getItemCount(cart.lines.edges));
      this.onCloseProductDetails();
    }
  };

  async openShopifyProductDetails(product): Promise<void> {
    const { external_id: externalId, title } = product;

    if (isEmpty(this.shopifyInstance)) {
      this.shopifyInstance = new Shopify(this.shopifyStoreDetails);
    }

    this.productDetails = await this.shopifyInstance.getProduct(externalId);

    if (!isNil(this.productDetails)) {
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
        this.renderShopifyVariantSelectors(this.productDetails);

        document
          .querySelector(`form[name="${PRODUCT_DETAILS_FORM_NAME}"]`)
          .addEventListener('submit', this.onProductFormSubmit);
      }
    }
  }

  async renderShopifyVariantSelectors(productDetails): Promise<void> {
    const { options, variants } = productDetails;
    const variantOptions = filter(options, ({ name, values }) => {
      const isDefaultName = isEqual(name, 'Title');
      const isDefaultValue = isEqual(values[0].value, 'Default Title');
      return !(isDefaultName && isDefaultValue);
    });

    // Set the first available options for each variant option
    const { selectedOptions: cheapestAvailableOptions } =
      first(sortBy(filter(variants.nodes, 'availableForSale'), 'price')) || {};
    this.selectedVariantOptions = reduce(
      variantOptions,
      (prevValues, { name }) => ({
        ...prevValues,
        [name]: isNil(cheapestAvailableOptions)
          ? ''
          : find(cheapestAvailableOptions, { name }).value,
      }),
      this.selectedVariantOptions || {},
    );

    this.variantDetails = variantOptions;

    this.mappedVariantOptions = await this.getVariantOptions(
      variantOptions,
      variants.nodes,
    );
    forEach(this.variantDetails, (variant, index) => {
      this.renderShopifyVariant(variant, index);
    });
  }

  // Handles the change event for the variant options
  handleVariantChange = (event): void => {
    const { name: selectorName, value } = event.target;
    const { type: name, index: targetIndex } = event.target.dataset;
    // When a variant option is changed, update the selected variant options
    this.selectedVariantOptions = {
      ...this.selectedVariantOptions,
      [name]: value,
    };
    // Update all of the other selectors disabled status based on the new selected options
    const variantSelectors = document.querySelectorAll('.variant-select');
    const filteredSelectors = filter(
      variantSelectors,
      (selector) => selector.name !== selectorName,
    );
    forEach(filteredSelectors, (selector) => {
      const {
        index: nextIndex,
        type: nextSelectorName,
        selectorType: nextSelectorType,
      } = selector.dataset;
      if (nextIndex > targetIndex) {
        if (nextSelectorType === 'select') {
          const options = selector.options;
          for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const isDisabled = this.getDisabledStatus({
              index: toNumber(nextIndex),
              name: nextSelectorName,
              value: option.value,
            });
            option.disabled = isDisabled;
            if (isDisabled) {
              if (option.selected) {
                option.selected = false;
                this.selectedVariantOptions = omit(
                  this.selectedVariantOptions,
                  [nextSelectorName],
                );
                // set the first available option as selected
                // This is necessary as event listeners are not triggered when setting the value programmatically
                const firstAvailableOption = find(
                  this.mappedVariantOptions,
                  (option) => option.name === nextSelectorName,
                );
                if (firstAvailableOption) {
                  this.selectedVariantOptions = {
                    ...this.selectedVariantOptions,
                    [nextSelectorName]: first(firstAvailableOption.values)
                      .value,
                  };
                }
              }
            }
          }
        } else {
          const { value: nextSelectorValue } = selector;
          const isDisabled = this.getDisabledStatus({
            index: toNumber(nextIndex),
            name: nextSelectorName,
            value: nextSelectorValue,
          });
          selector.disabled = isDisabled;
          if (isDisabled) {
            if (selector.checked) {
              selector.checked = false;
              this.selectedVariantOptions = omit(this.selectedVariantOptions, [
                nextSelectorName,
              ]);
            }
          }
        }
      }
    });

    // Updates the add to cart button disabled status based on the number of selected options
    const updatedSelectedOptions = omit(this.selectedVariantOptions, [
      'quantity',
    ]);
    const addToCartButton = document.querySelector(
      '#add-to-cart-button',
    ) as HTMLButtonElement;
    if (addToCartButton) {
      addToCartButton.disabled =
        size(updatedSelectedOptions) < size(this.variantDetails);
    }
  };

  getDisabledStatus = ({ index, value, name }): boolean => {
    // Check if the current option is available based on the mapped variant options
    if (index === 0) {
      const currentOption = find(this.mappedVariantOptions, { name });
      if (currentOption) {
        const currentOptionValue = find(currentOption.values, { value });
        if (currentOptionValue) {
          return !currentOptionValue.isAvailable;
        }
      }
    }
    if (index > 0) {
      // depending on the index of the selector, go through mapped variant options and check if the option is available deep in the child options
      const firstOption = first(this.mappedVariantOptions);
      if (firstOption) {
        // Using the index, find the current option inside the first option and check if it is available
        const selectedValue = this.selectedVariantOptions[firstOption.name];
        const currentOption = find(firstOption.values, {
          value: selectedValue,
        });
        if (currentOption) {
          // If the current option is available, keep going deeper till you find the right child options that match the selected values
          const childOption = find(currentOption.childOptions[name], { value });
          if (childOption) {
            return !childOption.isAvailable;
          } else {
            // if the child option is not in the next level of the child options, we need to go deeper based off of the previous index
            const previousCurrentOptionName = this.variantDetails[index - 1]
              .name;
            const previousSelectedValue = this.selectedVariantOptions[
              previousCurrentOptionName
            ];
            const selectedChildOption = find(
              currentOption.childOptions[previousCurrentOptionName],
              { value: previousSelectedValue },
            );
            if (selectedChildOption) {
              const { childOptions } = selectedChildOption;
              return childOptions[name]
                ? !find(childOptions[name], { value })?.isAvailable
                : true;
            }
          }
        }
      }
    }

    return false;
  };

  getVariantOptions(variantOptions, variants): void {
    // loop through the variants and map all variant options to the variant whether they are available or not.
    const mappedVariantOptions = map(variantOptions, ({ name, values }) => {
      const mappedValues = map(values, (value) => {
        const childOptions = {};
        forEach(variants, (variant) => {
          const selectedOption = find(variant.selectedOptions, { name, value });
          if (selectedOption) {
            let currentChildOptions = childOptions;
            forEach(
              variant.selectedOptions,
              ({ name: childName, value: childValue }) => {
                if (childName !== name) {
                  if (!currentChildOptions[childName]) {
                    currentChildOptions[childName] = [];
                  }
                  const existingOption = find(currentChildOptions[childName], {
                    value: childValue,
                  });
                  if (!existingOption) {
                    currentChildOptions[childName].push({
                      value: childValue,
                      isAvailable: variant.availableForSale,
                      childOptions: {},
                    });
                  }
                  currentChildOptions = find(currentChildOptions[childName], {
                    value: childValue,
                  }).childOptions;
                }
              },
            );
          }
        });
        return {
          value,
          isAvailable: some(
            variants,
            (variant) =>
              find(variant.selectedOptions, { name, value }) &&
              variant.availableForSale,
          ),
          childOptions,
        };
      });
      return {
        name,
        values: mappedValues,
      };
    });
    return mappedVariantOptions;
  }

  renderShopifyVariant(
    { name, values }: { name: string; values: any },
    index: number,
  ): void {
    const RenderElement = isEqual(name.toLowerCase(), 'size')
      ? VariantRadio
      : VariantSelectElement;

    document
      .querySelector(`.${VARIANT_SELECTORS_CONTAINER}`)
      .insertAdjacentHTML(
        'beforeend',
        RenderElement({
          name,
          values,
          index,
          getDisabledStatus: this.getDisabledStatus,
          selectedVariantOptions: this.selectedVariantOptions,
          firstAvailableOptions: this.firstAvailableOptions,
        }),
      );

    const variantSelectors = document.querySelectorAll(
      `.variant-select[name="${name}${VARIANT_SELECTOR_NAME_SUFFIX}"]`,
    );
    for (let i = 0; i < variantSelectors.length; i++) {
      variantSelectors[i].addEventListener('change', this.handleVariantChange);
    }
  }

  onCloseProductDetails = (): void => {
    if (!isNil(this.textContainerElement)) {
      this.textContainerElement.innerHTML = ButtonTextElement();
    }
    document.querySelector(`.${PRODUCT_DETAILS_CLASS}`).remove();
    document.getElementById(PRODUCT_LIST_ELEMENT_ID).hidden = false;
  };
}

interface ContructorType {
  playerContainerElement: HTMLElement;
  featuredProductsContainerElement: HTMLElement;
  products: { [key: string]: any }[];
  shopifyStoreDetails: ShopifyConfigType;
}

export default FeaturedProducts;
