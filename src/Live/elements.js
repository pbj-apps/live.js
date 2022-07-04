import { isEmpty, isNull } from 'lodash';

import LivePlayer from './Player';
import EmbedPlayer from './EmbedPlayer';
import VodPlayer from './VodPlayer';
import convertObjectToSnakeCase from '../utils/convertObjectToSnakeCase';

/**
 * Live Elements
 * @param {Object} liveInstance Live instance
 */
class Elements {
  constructor(liveInstance) {
    this.live = liveInstance;
    this.activeStreams = this.getActiveStreams;
    this.currentShow = this.getCurrentShow;
    this.currentShowPreview = this.getCurrentShowPreview;
    this.episode = null;
    this.broadcast = null;
    this.featuredProducts = this.getFeaturedProducts;
    this.episodes = {
      list: this.getEpisodeList.bind(this),
      featuredProducts: this.getFeaturedProductsResults.bind(this),
      highlightedFeaturedProducts: this.getHighlightedFeaturedProducts.bind(
        this,
      ),
      next: this.getNextEpisode.bind(this),
    };
    this.vod = {
      embed: this.embedVod.bind(this),
      getItems: this.getVodItems.bind(this),
      getVideos: this.getVideos.bind(this),
      getVideo: this.getVideo.bind(this),
      getVideoFeaturedProducts: this.getVideoFeaturedProducts.bind(this),
      getVideoFeaturedProductsMeta: this.getVideoFeaturedProductsMeta.bind(
        this,
      ),
      getCategories: this.getCategories.bind(this),
      getCategory: this.getCategory.bind(this),
      getPlaylistInfo: this.getPlaylistInfo.bind(this),
    };
    // this.chat = new LiveChat();
  }

  /**
   * Gets all episodes;
   */
  async getEpisodeList({ params }) {
    return this.live.episodes
      .list({ params: convertObjectToSnakeCase(params) })
      .then((response) => response.results)
      .catch((err) => err);
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
    return this.live.episodes.highlightedFeaturedProducts({ episodeId });
  }

  /**
   * Get episode's featured prodcuts;
   */
  getFeaturedProductsResults({ episodeId, params }) {
    return this.live.episodes
      .featuredProducts({
        episodeId,
        params: convertObjectToSnakeCase(params),
      })
      .then((response) => response.results)
      .catch((err) => err);
  }

  /**
   * Get episode's highlighted featured prodcuts;
   */
  getHighlightedFeaturedProducts({ episodeId, params }) {
    return this.live.episodes
      .highlightedFeaturedProducts({
        episodeId,
        params: convertObjectToSnakeCase(params),
      })
      .then((response) => response.results)
      .catch((err) => err);
  }

  /**
   * Get next episode;
   */
  getNextEpisode() {
    return this.live.episodes
      .next()
      .then((response) => response)
      .catch((err) => err);
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
      liveInstance: this.live,
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

  async getVideoFeaturedProductsMeta({ params, videoId }) {
    if (isEmpty(videoId)) {
      throw new Error('Video ID is missing.');
    }
    return await this.live.vod
      .videoFeaturedProductsMeta({ params, videoId })
      .then((response) => response.results)
      .catch((err) => err);
  }

  async getProductDetails(productId) {
    if (isEmpty(productId)) {
      throw new Error('Product ID is missing.');
    }
    return await this.live.shoppingCatalogue
      .productDetails(productId)
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

  async getShopifyConfig() {
    return await this.live.shoppingCatalogue
      .shopifyConfig()
      .then((response) => response)
      .catch((err) => err);
  }
}

export default Elements;
