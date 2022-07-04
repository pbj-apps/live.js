/**
 * stream preview element
 */
export default function (data, { hideTitle, hideDescription }) {
  const {
    description: description,
    preview_asset: { asset_type: assetType, asset_url: assetUrl, image },
    title,
  } = data;

  if (assetType === 'image') {
    return `
      <div class="stream-preview-wrapper">
        <img src="${image.full_size}" class="stream-preview-image">
        </img>
        <div class="stream-preview-details">
          ${hideTitle ? '' : `<h1>${title}</h1>`}
          ${hideDescription ? '' : `<p>${description}</p>`}
        </div>
      </div>
    `;
  } else {
    return `
      <div class="stream-preview-wrapper">
        <video src="${assetUrl}" class="stream-preview-image" autoplay muted loop>
        </video>
        <div class="stream-preview-details">
          ${hideTitle ? '' : `<h1>${title}</h1>`}
          ${hideDescription ? '' : `<p>${description}</p>`}
        </div>
      </div>
    `;
  }
}
