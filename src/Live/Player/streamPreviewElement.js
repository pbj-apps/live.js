/**
 * stream preview element
 */
export default function (data) {
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
          <h1>
            ${title}
          </h1>
          <p>${description}</p>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="stream-preview-wrapper">
        <video src="${assetUrl}" class="stream-preview-image" autoplay muted loop>
        </video>
        <div class="stream-preview-details">
          <h1>
            ${title}
          </h1>
          <p>${description}</p>
        </div>
      </div>
    `;
  }
}
