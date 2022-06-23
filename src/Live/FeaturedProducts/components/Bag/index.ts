import { map, join, size } from 'lodash';

import {
  SHOPIFY_BAG_BACK_BUTTON_CLASS,
  SHOPIFY_BAG_CLASS,
} from '../../constants';

/**
 * Mounts Shopify Bag template
 * @param items items in the bag
 */
export default function (checkout): string {
  const {
    lineItems,
    lineItemsSubtotalPrice: { amount },
    webUrl,
  } = checkout;

  function renderItems() {
    return join(
      map(lineItems, (item) => {
        const {
          id: lineItemId,
          quantity,
          title,
          variant: {
            image: { src },
            price,
          },
        } = item;

        return `<div id="${lineItemId}" class="shopify-item-container">
          <div class="item-details">
            <div class="product-details">
              <span class="title">${title}</span>
              <span class="price">$${price}</span>
            </div>
            <span class="qunatity">Quantity ${quantity}</span>
          </div>
          <img class="product-image" src=${src} alt=${title} />
          <button type="button" class="remove-item-button">
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.289 1.289 12.71 12.71M12.711 1.289 1.289 12.71" stroke="currentColor"/>
            </svg>
          </button>
        </div>`;
      }),
      '',
    );
  }

  return `
    <div class="${SHOPIFY_BAG_CLASS}">
      <div>
        <button class="${SHOPIFY_BAG_BACK_BUTTON_CLASS}">
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.625 18.75L9.375 12.5L15.625 6.25" stroke="#22174A" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          ${size(lineItems)} Items
        </button>
        ${renderItems()}
        <div class="bag-total">
          <span>Estimated Total</span>
          <span>$${amount}</span>
        </div>
      </div>
      <a href="${webUrl}" target="_blank" rel="noopener noreferrer">Go to Checkout</a>
    </div>
    `;
}
