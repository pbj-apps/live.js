import videojs from 'video.js';
import {
  isEmpty,
  toNumber,
  isUndefined,
  isNull,
  differenceBy,
  map,
  join,
} from 'lodash';
import PlayerElement from './playerElement';
import LoaderElement from './loaderElement';
import streamEndedElement from './streamEndedElement';
import streamEmptyStateElement from './streamEmptyStateElement';
import streamPreviewElement from './streamPreviewElement';
import errorElement from './errorElement';

import { VIDEOJS_SELECTOR, PLAYER_OPTIONS, PLAYER_EVENTS } from './constants';
import {
  socketCommandTypes,
  episodeStatus,
  episodeStreamStatus,
} from '../constants';
import {
  WatchEndpoint,
  LivePlayerState,
  ConfigOptions,
  PlayerInitiationOption,
} from '../../common/types';
import ProductElement from './components/FeaturedProductsContainer/product';
import {
  FEATURED_PRODUCTS_CONTAINER_ELEMENT_ID,
  PRODUCT_LIST_ELEMENT_ID,
} from './components/FeaturedProductsContainer/constants';
import OverlayContent from './components/OverlayContent';

/**
 * Live Stream Player
 * @param {Object} liveInstance Live instance
 */
class LivePlayer {
  // @Todo: add type for live
  live;
  containerElement: HTMLElement;
  playerElement: HTMLElement;
  // @Todo: remove element if not getting used
  element: any | null;
  // @Todo: add type for player
  player;
  options: ConfigOptions;
  watchPromise: Promise<WatchEndpoint> | null;
  state: LivePlayerState;

  constructor(liveInstance, options) {
    this.live = liveInstance;
    this.containerElement = null;
    this.playerElement = null;
    this.element = null;
    this.player = null;
    this.state = this.initialState(options);
    this.options = options || {};
  }

  /**
   * Mounts Live Player
   */
  mount(element: any | null, { showId }) {
    if (!isUndefined(element)) {
      this.containerElement = element;
    }
    if (!isEmpty(showId)) {
      this.loadShow(showId);
      this.subscribeShowSocketEvents(showId);
    } else {
      this.loadActiveStreams();
      this.subscribeSocketEvents();
    }
  }

  loadShow(showId) {
    if (!this.state.episode) {
      this.state.loading = true;
      this.updatePlayer();
    }

    this.live.elements
      .currentShow(showId)
      .then((data) => {
        const { count, results } = data;
        if (count === 0) {
          this.live.elements
            .currentShowPreview(showId)
            .then((data) => {
              this.state.episode = data;
              this.containerElement.innerHTML = streamPreviewElement(data);
            })
            .catch((err) => {
              console.log('err', err);
            });
        } else {
          if (count >= 1) {
            const { stream_status: streamStatus } = results[0];
            this.state.loading = false;
            // initiate broadcast only if the stream status is active.
            if (streamStatus === episodeStreamStatus.ACTIVE) {
              this.state.episode = results[0];
              // Don't run updatePlayer() but start initiateBroadcast instead and wait until loaded.
              this.initiateBroadcast();
            } else {
              this.containerElement.innerHTML = streamEmptyStateElement();
            }
          } else {
            this.state.loading = false;
            this.updatePlayer();
          }
        }
      })
      .catch((err) => {
        console.log('Error', err);
        const error = JSON.stringify(err);
        this.containerElement.innerHTML = errorElement(error);
      });
  }

  /**
   * Initiates the player to load the broadcast information, done when
   * the stream is "broadcasting"
   */
  initiateBroadcast() {
    if (!isEmpty(this.state.episode)) {
      const { id } = this.state.episode;
      this.watchPromise = this.live.episodes.watch({ episode: id });
      this.watchPromise.then((data: WatchEndpoint) => {
        this.state.broadcast = data;
        this.updatePlayer();
      });

      // featch featured products for the episode.
      this.live.elements
        .featuredProducts(id)
        .then(({ results }) => {
          this.state.featuredProducts = results;
          this.updatePlayer();
        })
        .catch((err) => {
          console.log('err', err);
        });

      // Join Featuered Prodcuts Socket Updates
      this.joinFeaturedProductsUpdates(id);
    }
  }

  subscribeShowSocketEvents(showId) {
    this.live.sockets.subscribeToEvent(
      socketCommandTypes.EPISODE_STATUS_UPDATE,
      (message) => {
        const {
          stream_status: streamStatus,
          episode,
          extra: { playback_cutoff: playbackCutoff },
        } = message;

        if (!isNull(episode)) {
          if (episode.channel_id === showId) {
            if (streamStatus === episodeStreamStatus.ACTIVE) {
              this.loadShow(showId);
            }
          }
          // playbackCutoff is a bool;
          // It is true when we close the stream from OBS
          // If it is true, we play the whole stream
          if (!playbackCutoff && episode.status === episodeStatus.FINISHED) {
            this.loadShow(showId);
          }
        }
      },
    );
  }

  loadActiveStreams() {
    if (!this.state.episode) {
      this.state.loading = true;
      this.updatePlayer();
    }

    this.live.elements
      .activeStreams()
      .then((data) => {
        const { count, results } = data;
        if (count >= 1) {
          const { stream_status: streamStatus } = results[0];
          this.state.loading = false;
          // initiate broadcast only if the stream status is active.
          if (streamStatus === episodeStreamStatus.ACTIVE) {
            this.state.episode = results[0];
            // Don't run updatePlayer() but start initiateBroadcast instead and wait until loaded.
            this.initiateBroadcast();
          } else {
            this.containerElement.innerHTML = streamEmptyStateElement();
          }
        } else {
          this.state.loading = false;
          this.updatePlayer();
        }
      })
      .catch((err) => {
        console.log('Error', err);
        const error = JSON.stringify(err);
        this.containerElement.innerHTML = errorElement(error);
      });
  }

  subscribeSocketEvents() {
    this.live.sockets.subscribeToEvent(
      socketCommandTypes.EPISODE_STATUS_UPDATE,
      (message) => {
        const {
          stream_status: streamStatus,
          episode,
          extra: { playback_cutoff: playbackCutoff },
        } = message;

        // playbackCutoff is a bool;
        // It is true when we close the stream from OBS
        // If it is true, we play the whole stream
        if (
          !isNull(this.state.episode) &&
          this.state.episode.id === episode.id &&
          !playbackCutoff &&
          episode.status === episodeStatus.FINISHED
        ) {
          this.endScreen(this.containerElement);
        } else if (
          isNull(this.state.episode) &&
          streamStatus === episodeStreamStatus.ACTIVE
        ) {
          this.loadActiveStreams();
        }
      },
    );
  }

  /**
   * Joins 'join-episode-featured-product-updates' socket event
   * and subscribes to 'episode-featured-product-updates' event.
   */
  joinFeaturedProductsUpdates(episodeId) {
    const socketMessage = JSON.stringify({
      command: socketCommandTypes.JOIN_EPISODE_FEATURED_PRODUCT_UPDATES,
      episode_id: episodeId,
    });

    this.live.sockets.send(socketMessage);
    this.live.sockets.subscribeToEvent(
      socketCommandTypes.EPISODE_FEATURED_PRODUCT_UPDATES,
      (message) => {
        const {
          highlighted_featured_products: featuredProductsUpdate,
        } = message;
        const featuredProductsContainerElement = document.getElementById(
          FEATURED_PRODUCTS_CONTAINER_ELEMENT_ID,
        );

        if (
          isEmpty(featuredProductsUpdate) &&
          !featuredProductsContainerElement.hidden
        ) {
          featuredProductsContainerElement.hidden = true;
        } else if (
          !isEmpty(featuredProductsUpdate) &&
          featuredProductsContainerElement.hidden
        ) {
          featuredProductsContainerElement.hidden = false;
        }

        const featuredProductsState = this.state.featuredProducts;
        const unfeaturedProducts: [any] = differenceBy(
          featuredProductsState,
          featuredProductsUpdate,
          'product.id',
        );
        const newFeaturedProducts: [any] = differenceBy(
          featuredProductsUpdate,
          featuredProductsState,
          'product.id',
        );
        unfeaturedProducts.forEach(({ product: unfeaturedProduct }) => {
          document.getElementById(`product-${unfeaturedProduct.id}`).remove();
        });

        if (!isEmpty(newFeaturedProducts)) {
          document.getElementById(PRODUCT_LIST_ELEMENT_ID).insertAdjacentHTML(
            'afterbegin',
            join(
              map(newFeaturedProducts, ({ product: featuredProduct }) =>
                ProductElement(featuredProduct),
              ),
              '',
            ),
          );
        }
        this.state.featuredProducts = featuredProductsUpdate;
      },
    );
  }

  updatePlayer() {
    if (this.state.loading) {
      this.containerElement.innerHTML = LoaderElement();
    } else if (this.state.episode && this.state.broadcast) {
      this.containerElement.innerHTML = PlayerElement(this.state.episode);
      this.loadPlayer();
    } else {
      this.containerElement.innerHTML = streamEmptyStateElement();
    }
  }

  /**
   * Loads Video JS Player
   */
  loadPlayer() {
    this.playerElement = document.querySelector(VIDEOJS_SELECTOR);
    videojs(this.playerElement, PLAYER_OPTIONS);
    if (!isEmpty(this.state.episode)) {
      this.loadVideo();
    }
  }

  /**
   * Loads Video URL
   */
  loadVideo() {
    const { broadcast_url: broadcastUrl } = this.state.broadcast;
    const player = videojs.getPlayer(this.playerElement);
    player
      .el()
      .insertAdjacentHTML(
        'afterBegin',
        OverlayContent(this.state.episode, this.state.featuredProducts),
      );
    this.player = player;
    player.src({
      src: broadcastUrl,
      type: 'application/x-mpegURL',
      withCredentials: false,
    });
    player.play();
    player.on(PLAYER_EVENTS.ENDED, () => {
      this.endScreen(this.containerElement);
    });
  }

  /**
   * Get latest instance of Live Player
   */
  getPlayer() {
    this.player = videojs.getPlayer(this.playerElement);
    return this;
  }

  /**
   * Starts Video
   */
  start() {
    if (!isEmpty(this.player)) {
      this.player.muted(false);
      this.player.play();
    }
  }

  /**
   * Stops Video
   */
  stop() {
    if (!isEmpty(this.player)) {
      this.player.pause();
    }
  }

  /**
   * Enters fullscreen for player
   */
  openFullscreen() {
    if (!isEmpty(this.player)) {
      this.player.requestFullscreen();
    }
  }

  /**
   * Exits fullscreen for player
   */
  closeFullscreen() {
    if (!isEmpty(this.player)) {
      this.player.exitFullscreen();
    }
  }

  /**
   * Destroys Live Player
   */
  dispose() {
    if (!isEmpty(this.player)) {
      this.player.dispose();
      this.playerElement.innerHTML = null;
    }
  }

  /**
   * Changes volume on player
   */
  volume(volume: string) {
    if (!isEmpty(this.player)) {
      const updateVolume = toNumber(volume);
      if (updateVolume >= 0 && updateVolume <= 1) {
        this.player.volume(updateVolume);
      }
    }
  }

  /**
   * Mount EndScreen
   */
  endScreen(element: HTMLElement) {
    if (!isUndefined(element)) {
      this.state.episode = null;
      this.containerElement = element;
      this.containerElement.innerHTML = streamEndedElement();
    }
  }

  /**
   * Mount empty placeholder
   */
  emptyScreen(element: HTMLElement) {
    if (!isUndefined(element)) {
      this.containerElement = element;
      this.containerElement.innerHTML = streamEmptyStateElement();
    }
  }

  /**
   * Retrieves the first initial state
   */
  initialState(options: PlayerInitiationOption): LivePlayerState {
    return {
      loading: false,
      episode: null,
      broadcast: null,
      featuredProducts: null,
    };
  }
}

export default LivePlayer;
