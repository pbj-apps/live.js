import { map } from 'lodash';

import { VARIANT_SELECTOR_NAME_SUFFIX } from '../../constants';

/**
 * Mounts Product Variant Radio selector template
 * @param name name of the variant option
 * @param values values of the variant option
 * @param index index of the variant option
 * @param getDisabledStatus function to get the disabled status of the variant option
 * @param selectedVariantOptions object with the selected variant options
 * @param firstAvailableOptions object to set the first available variant options
 */
export default function VariantRadio({
  name,
  values,
  index: optionIndex,
  getDisabledStatus,
  selectedVariantOptions,
  firstAvailableOptions,
}): string {
  const options = map(values, (value) => renderOptions(value));
  // Sets the first available option as selected and updates the first available option object with the selected value
  function checkSelectedOption(value) {
    if (
      selectedVariantOptions[name] === value &&
      firstAvailableOptions[name] !== value
    ) {
      firstAvailableOptions[name] = value;
      return true;
    } else {
      return;
    }
  }

  function renderOptions(value) {
    const isDisabled = getDisabledStatus({
      index: optionIndex,
      value,
      name,
    });

    const isSelected = checkSelectedOption(value);

    return `<span>
      <input  
        id="${name}${VARIANT_SELECTOR_NAME_SUFFIX}${value}" 
        class="variant-select"
        data-type="${name}"
        data-index="${optionIndex}"
        ${isSelected ? 'checked' : ''}
        type="radio" 
        name="${name}${VARIANT_SELECTOR_NAME_SUFFIX}" 
        value="${value}" 
        ${isDisabled ? 'disabled' : ''}
      />
      <label for="${name}${VARIANT_SELECTOR_NAME_SUFFIX}${value}">
        ${value}
      </label>
    </span>`;
  }

  return `<div class="product-form-input">
    <label class="variant-label">${name}</label>
    <div class="radio-options-container">
      ${options.join('')}
    <div>
  </div>
  `;
}
