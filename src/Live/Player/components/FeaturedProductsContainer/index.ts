import { isEmpty } from 'lodash';

import {
  FEATURED_PRODUCTS_CONTAINER_ELEMENT_ID,
  PRODUCT_LIST_ELEMENT_ID,
} from './constants';

/**
 * Mounts button text element template
 * @param {string} text string to replace the default copy.
 */
export function renderButtonText(text?: string): string {
  if (!isEmpty(text)) {
    return `<span class="featured-prodcuts-btn-text">&nbsp;${text}</span>
          <span class="featured-prodcuts-btn-text-small" hidden>&nbsp;${text}</span>`;
  }

  return `<span class="featured-prodcuts-btn-text">&nbsp;Featured Products</span>
        <span class="featured-prodcuts-btn-text-small" hidden>&nbsp;Products</span>`;
}

/**
 * Mounts Feature Products container element template
 * @param {Object} featuredProducts data for current episode.
 */
export default function (): string {
  return `<input type="checkbox" id="minimize-products-checkbox" />
    <div
      id="${FEATURED_PRODUCTS_CONTAINER_ELEMENT_ID}" hidden>
      <label class="featured-products-btn" for="minimize-products-checkbox">
        <span role="img" class="icon">
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="left"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"
            />
          </svg>
        </span>
        <div class="button-text-container">
          ${renderButtonText()}
        </div>
      </label>
      <div id="${PRODUCT_LIST_ELEMENT_ID}">
      </div>
    </div>`;
}
