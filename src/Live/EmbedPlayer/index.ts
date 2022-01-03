import { isNull, isNil } from 'lodash';
import { DEFAULT_IFRAME_DOMAIN } from './constants';
import config from '../../config';

/**
 * Live Stream Player
 * @param {Object} liveInstance Live instance
 */
class EmbedPlayer {
  // @Todo: add type for live
  live;
  options;
  iframe: HTMLIFrameElement | null = null;
  iframeUrl: string;
  private playerOrigin: string | null = null;

  constructor(liveInstance, options) {
    this.live = liveInstance;
    this.options = options || {};
  }

  /**
   * Mounts Live Player
   */
  mount(element: HTMLElement, options: any) {
    const { channelId } = options || {};
    const target = element;

    if (isNull(target)) {
      throw new Error('No match found for selector ' + element);
    }

    this.iframe =
      target.tagName !== 'IFRAME'
        ? this.createIframe(target)
        : (target as HTMLIFrameElement);

    const iframeDomainOrigin = !isNil(config.iframeDomain)
      ? config.iframeDomain
      : DEFAULT_IFRAME_DOMAIN;

    this.iframeUrl =
      this.options.iframeUrl ||
      `${iframeDomainOrigin}?api_key=${this.live.key}&environment=${
        this.live.options.environment
      }${channelId && `&showId=${channelId}`}`;
    this.playerOrigin = new URL(this.iframeUrl).origin;

    if (!this.iframe.src) {
      this.createNewPlayer(this.iframe, this.options);
    }
    // @Todo: do something when a player already exists
  }

  /**
   * Starts Video
   */
  start() {
    this.postMessage({ message: 'start' });
  }

  /**
   * Stops Video
   */
  stop() {
    this.postMessage({ message: 'stop' });
  }

  /**
   * Enters fullscreen for player
   */
  openFullscreen() {
    this.postMessage({ message: 'openFullscreen' });
  }

  /**
   * Exits fullscreen for player
   */
  closeFullscreen() {
    this.postMessage({ message: 'closeFullscreen' });
  }

  /**
   * Destroys Live Player
   */
  dispose() {
    this.postMessage({ message: 'dispose' });
  }

  /**
   * Changes volume on player
   */
  volume(volume: string) {
    this.postMessage({ message: 'volume', args: volume });
  }

  private createIframe(target) {
    const ifr = document.createElement('iframe');
    ifr.style.height = '100%';
    ifr.style.width = '100%';
    ifr.style.border = 'none';
    ifr.allowFullscreen = true;
    target.appendChild(ifr);
    return ifr;
  }

  private createNewPlayer(iframe: HTMLIFrameElement, options: any) {
    const iframeUrl = this.iframeUrl;
    this.setIframeSrc(iframe, iframeUrl);
  }

  private setIframeSrc(iframe: HTMLIFrameElement, url: string) {
    iframe.src = url;
  }

  private postMessage(message: any) {
    if (!this.playerOrigin || !this.iframe?.contentWindow) {
      return;
    }

    if (this.playerOrigin) {
      this.iframe.contentWindow.postMessage(message, this.playerOrigin);
    }
  }
}

export default EmbedPlayer;
