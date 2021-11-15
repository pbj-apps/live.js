import { isEmpty } from 'lodash';

import Elements from './elements';
import DataSource from './dataSource';
import Auth from './auth';
import Sockets from './sockets';
import './styles/index.css';
import { ConfigOptions } from '../common/types';
import getApiUrl from '../utils/getApiUrl';
import getSocketUrl from '../utils/getSocketUrl';

class Live {
  key: string;
  elements;
  episode;
  apiUrl;
  socketUrl;
  dataSource;
  sockets;
  episodes;
  auth: Auth;
  options: ConfigOptions;
  vod;

  constructor(liveKey: string, givenOpts: ConfigOptions = {}) {
    this.key = liveKey;
    this.options = givenOpts;
    this.elements = null;
    this.episode = null;
    this.apiUrl = getApiUrl(givenOpts.environment);
    this.socketUrl = getSocketUrl(givenOpts.environment);
    this.init();
  }

  /**
   * Intialises library using key
   */
  init(): void {
    this.auth = new Auth(this);
    this.dataSource = new DataSource(this);
    this.sockets = new Sockets(this);
    this.episodes = this.dataSource.buildRepository({
      list: {
        path: 'live-streams',
        method: 'GET',
      },
      watch: {
        path: ({ episode }) => `live-streams/${episode}/watch`,
        method: 'GET',
      },
      liveStream: {
        path: ({ episode }) => `live-streams/${episode}`,
        method: 'GET',
      },
      activeShow: {
        path: ({ showId }) => `episodes/current?channel_id=${showId}`,
        method: 'GET',
      },
      showPreview: {
        path: ({ showId }) => `channels/${showId}/public`,
        method: 'GET',
      },
      activeStreams: {
        path: `episodes/current`,
        method: 'GET',
      },
      featuredProducts: {
        path: ({ episodeId }) =>
          `v1/shopping/episodes/${episodeId}/highlighted-featured-products`,
        method: 'GET',
      },
    });
    this.vod = this.dataSource.buildRepository({
      items: {
        path: ({ params }) =>
          `vod/items${
            isEmpty(params) ? '' : `?${new URLSearchParams(params).toString()}`
          }`,
        method: 'GET',
      },
      videos: {
        path: ({ params }) =>
          `vod/videos${
            isEmpty(params) ? '' : `?${new URLSearchParams(params).toString()}`
          }`,
        method: 'GET',
      },
      video: {
        path: (videoId) => `vod/videos/${videoId}`,
        method: 'GET',
      },
      videoFeaturedProducts: {
        path: ({ params, videoId }) =>
          `v1/shopping/videos/${videoId}/featured-products${
            isEmpty(params) ? '' : `?${new URLSearchParams(params).toString()}`
          }`,
        method: 'GET',
      },
      categories: {
        path: ({ params }) =>
          `vod/categories${
            isEmpty(params) ? '' : `?${new URLSearchParams(params).toString()}`
          }`,
        method: 'GET',
      },
      category: {
        path: (categoryId) => `vod/categories/${categoryId}`,
        method: 'GET',
      },
      playlistInfo: {
        path: (playlistId) => `vod/playlists/${playlistId}`,
        method: 'GET',
      },
    });
    this.elements = new Elements(this);
  }
}

export default Live;
