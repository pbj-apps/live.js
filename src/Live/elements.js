import LivePlayer from './Player';
import EmbedPlayer from './EmbedPlayer';

/**
 * Live Elements
 * @param {Object} liveInstance Live instance
 */
class Elements {
  constructor(liveInstance) {
    this.live = liveInstance;
    this.list = this.getEpisodeList;
    this.activeStreams = this.getActiveStreams;
    this.currentShow = this.getCurrentShow;
    this.currentShowPreview = this.getCurrentShowPreview;
    this.episode = null;
    this.broadcast = null;
    // this.chat = new LiveChat();
  }

  /**
   * Gets all shows;
   */
  getEpisodeList() {
    return this.live.episodes.list();
  }

  /**
   * Gets all active streams;
   */
  getActiveStreams() {
    return this.live.episodes.activeStreams();
  }

  /**
   * Get episode;
   */
  getEpisode(episode) {
    return this.live.episodes.liveStream({ episode });
  }

  /**
   * Get show;
   */
  getCurrentShow(showId) {
    return this.live.episodes.activeShow({ showId });
  }

  /**
   * Get show preview;
   */
  getCurrentShowPreview(showId) {
    return this.live.episodes.showPreview({ showId });
  }

  video(options) {
    return new LivePlayer(this.live, options);
  }

  embed(options) {
    return new EmbedPlayer(this.live, options);
  }
}

export default Elements;
