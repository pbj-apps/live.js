import { map } from 'lodash';

import { VARIANT_SELECTOR_NAME_SUFFIX } from '../../constants';

/**
 * Mounts Product Variant selector template
 * @param name name of the variant option
 * @param values values of the variant option
 * @param index index of the variant option
 * @param getDisabledStatus function to get the disabled status of the variant option
 * @param selectedVariantOptions object with the selected variant options
 * @param firstAvailableOptions object to set the first available variant options
 */
export default function VariantSelect({
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

    return `<option value="${value}" 
    ${isSelected ? 'selected' : ''}
    ${isDisabled ? 'disabled' : ''}>${value}</option>`;
  }

  return `<div class="product-form-input">
    <label class="variant-label" for="${name}${VARIANT_SELECTOR_NAME_SUFFIX}">${name}</label>
    <div class="select-wrapper">
      <select class="variant-select" data-selector-type="select" data-type="${name}" data-index="${optionIndex}" id="${name}${VARIANT_SELECTOR_NAME_SUFFIX}" name="${name}${VARIANT_SELECTOR_NAME_SUFFIX}">
        ${options.join('')}
      </select>
    </div>
  </div>`;
}
