import { map, join, times } from 'lodash';

import ProductWrapperElement from '../../../Player/components/FeaturedProductsContainer/product';
import {
  PRODUCT_DETAILS_FORM_NAME,
  VARIANT_SELECTORS_CONTAINER,
} from '../../constants';
import {
  PRODUCT_DETAILS_CLASS,
  QUNAITITY_SELECTOR_NAME,
  QUNANTITY_LIMIT,
} from './constants';

/**
 * Mounts Products Details element template
 * @param {Object} product data for product details.
 */
export default function (
  product: { [key: string]: any },
  isOutOfStock: boolean,
): string {
  function renderQuantityOptions() {
    const options = times(QUNANTITY_LIMIT, (number) => number + 1);

    return join(
      map(
        options,
        (number) =>
          `<option value=${number} >
          ${number}
          </option>`,
      ),
      '',
    );
  }

  function renderForm() {
    if (!isOutOfStock) {
      return `<form name="${PRODUCT_DETAILS_FORM_NAME}">
          <div>
            <div class="${VARIANT_SELECTORS_CONTAINER}"></div>
            <div class="product-form-input">
              <label class="variant-label">Quantity</label>
              <div class="select-wrapper">
                <select name="${QUNAITITY_SELECTOR_NAME}">
                  ${renderQuantityOptions()}
                </select>
              </div>
            </div>
            <p class="error-message" hidden>Please select all the options</p>
          </div>
          <button type="submit">Add to Bag</button>
        </form>`;
    }

    return ``;
  }

  return `<div class="${PRODUCT_DETAILS_CLASS}" id="product-list">
      <button type="button" class="close-button">
        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.2" d="M14.5 29C6.49165 29 0 22.5084 0 14.5C0 6.49165 6.49165 0 14.5 0C22.5084 
            0 29 6.49165 29 14.5C29 22.5084 22.5084 29 14.5 29ZM14.5 12.4497L10.3994 8.34765L8.34765 
            10.3994L12.4497 14.5L8.34765 18.6006L10.3994 20.6524L14.5 16.5503L18.6006 
            20.6524L20.6524 18.6006L16.5503 14.5L20.6524 10.3994L18.6006 8.34765L14.5 12.4497Z" 
            fill="#22174A"/>
        </svg>
      </button>
      ${ProductWrapperElement({ product, isOutOfStock })}
      ${renderForm()}
    </div>`;
}
