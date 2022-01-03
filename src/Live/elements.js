import { isEmpty, isNull } from 'lodash';

import LivePlayer from './Player';
import EmbedPlayer from './EmbedPlayer';
import VodPlayer from './VodPlayer';

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
    this.featuredProducts = this.getFeaturedProducts;
    this.vod = {
      embed: this.embedVod.bind(this),
      getItems: this.getVodItems.bind(this),
      getVideos: this.getVideos.bind(this),
      getVideo: this.getVideo.bind(this),
      getVideoFeaturedProducts: this.getVideoFeaturedProducts.bind(this),
      getCategories: this.getCategories.bind(this),
      getCategory: this.getCategory.bind(this),
      getPlaylistInfo: this.getPlaylistInfo.bind(this),
    };
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

  /**
   * Get featured prodcuts;
   */
  getFeaturedProducts(episodeId) {
    return this.live.episodes.featuredProducts({ episodeId });
  }

  video(options) {
    return new LivePlayer(this.live, options);
  }

  embed(options) {
    return new EmbedPlayer(this.live, options);
  }

  async embedVod({ containerElement, videoId, options }) {
    if (isEmpty(videoId)) {
      throw new Error('Video ID is missing.');
    }
    if (isNull(containerElement)) {
      throw new Error('Container element is missing.');
    }

    const vodPlayer = new VodPlayer({
      containerElement,
      videoData: await this.getVideo(videoId),
      options,
    });

    return vodPlayer;
  }

  async getVodItems({ params } = {}) {
    return await this.live.vod
      .items({ params })
      .then((response) => response.results)
      .catch((err) => err);
  }

  async getVideos({ params } = {}) {
    return await this.live.vod
      .videos({ params })
      .then((response) => response.results)
      .catch((err) => err);
  }

  async getVideo(videoId) {
    if (isEmpty(videoId)) {
      throw new Error('Video ID is missing.');
    }
    return await this.live.vod
      .video(videoId)
      .then((response) => response)
      .catch((err) => err);
  }

  async getVideoFeaturedProducts({ params, videoId }) {
    if (isEmpty(videoId)) {
      throw new Error('Video ID is missing.');
    }
    return await this.live.vod
      .videoFeaturedProducts({ params, videoId })
      .then((response) => response.results)
      .catch((err) => err);
  }

  async getCategories({ params } = {}) {
    return await this.live.vod
      .categories({ params })
      .then((response) => response.results)
      .catch((err) => err);
  }

  async getCategory(categoryId) {
    if (isEmpty(categoryId)) {
      throw new Error('Category ID is missing.');
    }
    return await this.live.vod
      .category(categoryId)
      .then((response) => response)
      .catch((err) => err);
  }

  async getPlaylistInfo(playlistId) {
    if (isEmpty(playlistId)) {
      throw new Error('Playlist ID is missing.');
    }
    return await this.live.vod
      .playlist(playlistId)
      .then((response) => response)
      .catch((err) => err);
  }
}

export default Elements;
