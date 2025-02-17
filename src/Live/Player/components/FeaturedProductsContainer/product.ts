import { isEmpty } from 'lodash';
import { MAX_PRODUCT_DESCRIPTION_LENGTH } from './constants';

/**
 * Mounts Product Wrapper element template
 * @param {Object} product data.
 */
export default function ProductElement({
  product,
  useUrl,
  isOutOfStock,
}: ParamType): string {
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

  const children = `<div class="product-image-container">
    <img src="${src}" class="product-image" alt="${title}" />
    ${
      isOutOfStock ? `<span class="out-of-stock-text">Out of Stock </span>` : ''
    }
  </div>
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
  </div>`;

  if (useUrl) {
    return `<a target="_blank" href="${url}" id="product-${id}" href="${url}" class="product-wrapper">
      ${children}
    </a>`;
  }

  return `<div id="product-${id}" class="product-wrapper">
    ${children}
  </div>`;
}

interface ParamType {
  product: any;
  useUrl?: boolean;
  isOutOfStock?: boolean;
}
