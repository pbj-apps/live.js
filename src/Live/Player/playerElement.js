/**
 * Mounts Video Player element template
 * @param {Object} episode episode data for title/description
 */
export default function playerElement(episode) {
  if (episode === null) {
    return null;
  }
  return `
    <div class="video-player-container">
      <div class="video-player data-vjs-player">
        <video id="player-video-element" class="video-js vjs-16-9 vjs-big-play-centered" playsinline></video>
      </div>
    </div>
  `;
}
