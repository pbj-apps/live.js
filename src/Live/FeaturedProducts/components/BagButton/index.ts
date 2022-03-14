import { SHOPIFY_BAG_BUTTON_CLASS } from '../../constants';

/**
 * Mounts Items Count template
 * @param itemsInBag number of items in the bag
 */
export function renderItemsCount(itemsInBag?: number): string {
  if (itemsInBag && itemsInBag > 0) {
    return `<span class="items-count">${itemsInBag}</span>`;
  }

  return '';
}

/**
 * Mounts Shopify Bag Button template
 * @param itemsInBag number of items in the bag
 */
export default function (itemsInBag?: number): string {
  return `
  <button class="${SHOPIFY_BAG_BUTTON_CLASS}">
    ${renderItemsCount(itemsInBag)}
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" 
          d="M8.35102 12.7725C8.43547 12.1814 8.94177 11.7422 
              9.53896 11.7422H22.9419C23.5391 11.7422 24.0454 12.1814 
              24.1299 12.7725L25.8034 24.4873C26.0099 25.9332 24.888 
              27.2267 23.4275 27.2267H9.05335C7.59284 27.2267 6.47093 
              25.9332 6.67748 24.4873L8.35102 12.7725Z" 
          stroke="white" stroke-width="2"
      />
      <path d="M20.6652 15.0602V8.02184C20.6652 5.80059 19.0806 3.9999 17.1259 
              3.9999H15.3562C13.4015 3.9999 11.8169 5.80059 11.8169 8.02184V15.0602V15.0602" 
          stroke="white" stroke-width="2"
      />
      <path d="M7.94511 22.2498H24.5356" stroke="white" stroke-width="2" stroke-linecap="square"/>
    </svg>
  </button>
  `;
}
