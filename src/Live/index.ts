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
        path: ({ showId }) => `episodes/current?show_id=${showId}`,
        method: 'GET',
      },
      showPreview: {
        path: ({ showId }) => `shows/${showId}/public`,
        method: 'GET',
      },
      activeStreams: {
        path: `episodes/current`,
        method: 'GET',
      },
    });
    this.elements = new Elements(this);
  }
}

export default Live;
