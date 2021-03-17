import { isEmpty } from 'lodash';
import SocketObserver from './socketObserver';
import { socketCommandTypes } from './constants';

const { JOIN_EPISODE_UPDATES } = socketCommandTypes;

/**
 * Live Sockets
 *
 */
class Sockets {
  constructor(liveInstance) {
    this.live = liveInstance;
    this.commandTypes = socketCommandTypes;
    this.observers = {};

    this.establishSocketConnection();
  }

  /**
   * Connect to websocket;
   */
  async establishSocketConnection() {
    const { socketUrl, key, auth } = this.live;

    const tokenResponse = await auth.getToken();

    const socketServerURL = `${socketUrl}/ws/episodes/stream?token=${tokenResponse.auth_token}&org_api_key=${key}`;
    this.ws = new WebSocket(socketServerURL);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!isEmpty(data)) {
        const { command } = data;
        if (!isEmpty(this.observers[command])) {
          this.observers[command].broadcast(data);
        }
      }
    };

    this.ws.onopen = () => {
      const obj = JSON.stringify({
        command: JOIN_EPISODE_UPDATES,
      });
      this.ws.send(obj);
    };

    return this.ws;
  }

  /**
   * Subscribe to event update;
   */
  subscribeToEvent(command, fn) {
    if (isEmpty(this.observers[command])) {
      this.observers[command] = new SocketObserver();
    }
    this.observers[command].subscribe(fn);
  }
}

export default Sockets;
