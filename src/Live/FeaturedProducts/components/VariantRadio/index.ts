import { map, join } from 'lodash';
import { VARIANT_SELECTOR_NAME_SUFFIX } from '../../constants';

/**
 * Mounts Product Variant Radio selector template
 * @param name name of the variant option
 * @param values values of the variant option
 */
export default function (
  name: string,
  values: { value: string; isOrderable: boolean },
): string {
  function renderOptions() {
    return join(
      map(
        values,
        ({ value, isOrderable }) =>
          `<span>
            <input id="${name}${VARIANT_SELECTOR_NAME_SUFFIX}${value}" 
              type="radio" name="${name}${VARIANT_SELECTOR_NAME_SUFFIX}" 
              value="${value}" ${!isOrderable && 'disabled'}/>
            <label for="${name}${VARIANT_SELECTOR_NAME_SUFFIX}${value}">
              ${value}
            </label>
          </span>`,
      ),
      '',
    );
  }

  return `<div class="product-form-input">
    <label class="variant-label">${name}</label>
    <div class="radio-options-container">
      ${renderOptions()}
    <div>
  </div>
  `;
}
