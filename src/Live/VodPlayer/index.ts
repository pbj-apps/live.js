import videojs from 'video.js';

import '../styles/index.css';
import { VOD_PLAYER_OPTIONS } from './constants';
import VODPlayerElement from './components/VodPlayerElement';
import { VIDEOJS_SELECTOR } from '../Player/constants';
import CloseButton from './components/CloseButton';

class VodPlayer {
  containerElement;
  player;
  videoData;
  options;

  constructor({ containerElement, videoData, options = {} }) {
    this.containerElement = containerElement;
    this.videoData = videoData;
    this.options = options;
    this.init();
  }

  init(): void {
    this.containerElement.innerHTML = VODPlayerElement(this.videoData);
    const videoElement = this.containerElement.querySelector(VIDEOJS_SELECTOR);
    this.player = videojs(videoElement, VOD_PLAYER_OPTIONS);
    this.player.src({
      src: this.videoData.asset.asset_url,
    });

    this.renderCloseButton();

    this.containerElement
      .querySelector('.play-button')
      .addEventListener('click', this.onPlay.bind(this));
  }

  renderCloseButton(): void {
    if (this.options.closable) {
      this.containerElement
        .querySelector('.vod-overlay-content-container')
        .insertAdjacentHTML('afterbegin', CloseButton());

      this.containerElement
        .querySelector('.close-button')
        .addEventListener('click', this.dispose.bind(this));
    }
  }

  onPlay(): void {
    this.containerElement.querySelector('.video-cover').hidden = true;
    this.player.play();
  }

  dispose(): void {
    this.containerElement.innerHTML = '';
    this.player.dispose();
  }
}

export default VodPlayer;
