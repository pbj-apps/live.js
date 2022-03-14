import { map, join } from 'lodash';
import { VARIANT_SELECTOR_NAME_SUFFIX } from '../../constants';

/**
 * Mounts Product Variant selector template
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
          `<option value="${value}" ${!isOrderable && 'disabled'}>
          ${value}
          </option>`,
      ),
      '',
    );
  }

  return `<div class="product-form-input">
    <label class="variant-label" for="${name}${VARIANT_SELECTOR_NAME_SUFFIX}">${name}</label>
    <div class="select-wrapper">
      <select id="${name}${VARIANT_SELECTOR_NAME_SUFFIX}" name="${name}${VARIANT_SELECTOR_NAME_SUFFIX}">
        ${renderOptions()}
      </select>
    </div>
  </div>`;
}
