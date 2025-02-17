import { map, join } from 'lodash';
import getSymbolFromCurrency from 'currency-symbol-map';

import { getItemCount } from '../../../../utils/getLineItemCount';
import { splitShopifyId } from '../../../../utils/splitShopifyId';
import { formatMoney } from '../../../../utils/formatMoney';
import {
  SHOPIFY_BAG_BACK_BUTTON_CLASS,
  SHOPIFY_BAG_CLASS,
} from '../../constants';

/**
 * Mounts Shopify Bag template
 * @param items items in the bag
 */
export default function (cart): string {
  const { lines: lineItems, cost, checkoutUrl: webUrl } = cart;
  const { subtotalAmount } = cost || {};
  const { amount, currencyCode: subTotalCurrencyCode } = subtotalAmount || {};
  const { edges } = lineItems || {};
  const formattedAmount = formatMoney(amount);

  function getSubTotal() {
    if (getSymbolFromCurrency(subTotalCurrencyCode) === undefined) {
      return formattedAmount;
    }
    return `${getSymbolFromCurrency(subTotalCurrencyCode)}${formattedAmount}`;
  }

  function renderItems() {
    return join(
      map(edges, ({ node }) => {
        const { merchandise, quantity } = node;
        const {
          id: lineItemId,
          title,
          image: { url },
          price,
        } = merchandise;
        const { amount: priceAmount, currencyCode: priceCurrencyCode } = price;
        const formattedPriceAmount = formatMoney(priceAmount);
        const { id: elementId } = splitShopifyId(lineItemId);

        return `<div id="${elementId}" class="shopify-item-container">
          <div class="item-details">
            <div class="product-details">
              <span class="title">${title}</span>
              <span class="price">${getSymbolFromCurrency(
                priceCurrencyCode,
              )}${formattedPriceAmount}</span>
            </div>
            <span class="qunatity">Quantity ${quantity}</span>
          </div>
          <img class="product-image" src=${url} alt=${title} />
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
          ${getItemCount(edges)} Items
        </button>
        ${renderItems()}
        <div class="bag-total">
          <span>Estimated Total</span>
          <span>${getSubTotal()}</span>
        </div>
      </div>
      <a href="${webUrl}" target="_blank" rel="noopener noreferrer">Go to Checkout</a>
    </div>
    `;
}
