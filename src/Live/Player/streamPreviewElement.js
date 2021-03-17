/**
 * stream preview element
 */
export default function (data) {
  const {
    description,
    preview_image_url,
    preview_url_type,
    preview_video_url,
    title,
  } = data;

  if (preview_url_type === 'image') {
    return `
      <div class="stream-preview-wrapper">
        <img src="${preview_image_url}" class="stream-preview-image">
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
        <video src="${preview_video_url}" class="stream-preview-image" autoplay muted loop>
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
