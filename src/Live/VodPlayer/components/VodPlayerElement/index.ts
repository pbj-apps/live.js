import { isEmpty } from 'lodash';
import { formatDuration, intervalToDuration } from 'date-fns';

import featuredProductsContainer from '../../../Player/components/FeaturedProductsContainer';

/**
 * Mounts VOD Player element template
 */
export default function (vodData) {
  const { title, asset, preview_asset: previewAsset, duration } = vodData || {};

  const assetImage = asset.image?.full_size;
  const previewImage = previewAsset?.image?.full_size;
  const thumbnailImage = isEmpty(previewImage) ? assetImage : previewImage;

  return `
    <div class="video-container">
      <div class="vod-player-container" data-vjs-player="true">
          <video id="vod-player-video-element" class="video-js vjs-16-9 vjs-big-play-centered"
          playsInline="true"></video>
          <div class="vod-overlay-content-container"></div>
          ${featuredProductsContainer()}
      </div>
      <div class="video-cover">
        ${
          !isEmpty(thumbnailImage) &&
          `<img src=${thumbnailImage} alt="${title}" />`
        }
        <div class="cover-container">
          <span class="duration">${formatDuration(
            intervalToDuration({ start: 0, end: duration * 1000 }),
          )}</span>
        </div>
        <button type="button" class="play-button">
          <svg width="17" height="18" viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.526 1.517c-.293.3-.47.695-.499 1.114l.077 12.393c.169.502.532.862 1.007 1.02.346.115.765.126 1.215-.046l10.61-5.305a2.34 2.34 0 0 0 1.046-1.047c.28-.56.316-1.176.126-1.747-.176-.53-.553-1.027-1.143-1.377L2.892 1.072a1.58 1.58 0 0 0-1.365.445h-.001z" stroke="#22174A" stroke-width="1.8" fill="none" fill-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
    `;
}
