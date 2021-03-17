/**
 * Mounts Video Player element template
 * @param {Object} episode episode data for title/description
 */
export default function (episode) {
  if (episode === null) {
    return null;
  }
  const { show } = episode;
  return `
    <div class="video-player-container">
      <div class="video-player data-vjs-player">
        <video class="video-js vjs-16-9 vjs-big-play-centered"></video>
        <div class="video-details">
          <svg width="52" height="26" viewBox="0 0 52 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="51.0968" height="25.7458" rx="5.35815" fill="#E8386D"/>
            <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="52" height="26">
            <rect width="51.0968" height="25.7458" rx="5.35815" fill="white"/>
            </mask>
            <g mask="url(#mask0)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.7652 5.94302V19.9428H15.7224V17.2877H9.60371V5.94302H6.7652Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5692 7.94299V10.399H17.6561V19.9428H23.5264V17.4865H20.4298V7.94299H14.5692Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0988 5.59391C18.4182 5.82573 18.7361 5.94303 19.0434 5.94303C19.3564 5.94303 19.6773 5.82573 19.9967 5.59391C20.2448 5.41402 20.5406 5.06908 20.5406 4.44672C20.5406 3.81726 20.2448 3.47061 19.9967 3.29072C19.3633 2.83157 18.7441 2.82291 18.0989 3.29057C17.8508 3.47046 17.5549 3.8171 17.5549 4.44672C17.5549 5.06923 17.8508 5.41433 18.0988 5.59391Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M29.1695 16.0358L25.5426 7.94299H22.4127L27.8063 19.9428H30.3746" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M36.7443 10.1715C38.3645 10.1715 39.5182 11.1756 39.5182 12.7674H33.9216C33.9216 11.0777 35.1734 10.1715 36.7443 10.1715ZM36.8918 17.7143C34.7317 17.7143 33.9217 16.392 33.8971 14.7512H41.9973C42.1202 14.0164 42.1202 13.4778 42.1202 13.0857C42.1202 10.1715 39.7882 7.94299 36.8183 7.94299C33.2099 7.94299 31.1725 10.5143 31.1725 13.9429C31.1725 17.0532 33.0379 19.9428 36.8918 19.9428C39.8126 19.9428 41.6537 18.1797 42.0219 16.2204H39.3217C38.9782 17.0285 38.4137 17.7143 36.8918 17.7143Z" fill="white"/>
            </g>
            <ellipse cx="45.0947" cy="5.92314" rx="1.93489" ry="1.93489" fill="white"/>
            <circle cx="45.0947" cy="5.92313" r="2.64566" stroke="white" stroke-width="0.5"/>
          </svg>        
          <h3 class="video-title">${show && show.title}</h3>
          <p class="video-description">${show && show.description}</p>
        </div>
      </div>
    </div>
  `;
}
