import { isEmpty } from 'lodash';
import { MAX_PRODUCT_DESCRIPTION_LENGTH } from './constants';

/**
 * Mounts Product Wrapper element template
 * @param {Object} product data.
 */
export default function (product) {
  if (isEmpty(product)) {
    return null;
  }
  const {
    id,
    url,
    title,
    price,
    description,
    preview_image: {
      image: { medium: src },
    },
  } = product;

  return `<a id="product-${id}" href="${url}" class="product-wrapper" target="_blank">
    <img src="${src}" class="product-image" alt="${title}" />
    <div class="product-details">
      <div class="product-details-header">
        <h4 class="product-title">
          <span style="overflow: hidden">${title}</span>
        </h4>
        <h4 class="product-price">$${price}</h4>
      </div>
      <div class="product-description">
          <span>${
            description.length > MAX_PRODUCT_DESCRIPTION_LENGTH
              ? `${description.substring(0, MAX_PRODUCT_DESCRIPTION_LENGTH)}...`
              : description
          }
          </span>
      </div>
    </div>
  </a>`;
}
