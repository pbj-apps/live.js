import Live from './index';

interface TokenResponse {
  auth_token: string;
}

export default class Auth {
  activeToken: string;
  currentAuthRequest: Promise<TokenResponse>;
  live: Live;

  constructor(liveInstace: Live) {
    this.live = liveInstace;
  }

  getToken(): Promise<TokenResponse> {
    if (this.activeToken) {
      return Promise.resolve({
        auth_token: this.activeToken,
      });
    }

    if (!this.currentAuthRequest) {
      this.currentAuthRequest = this.createGuestSession();
    }

    return this.currentAuthRequest;
  }

  private async createGuestSession(): Promise<TokenResponse> {
    const tokenResponse = await fetch(`${this.live.apiUrl}auth/guest/session`, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.live.key,
      },
    });

    const tokenJson = await tokenResponse.json();

    if (!tokenJson.auth_token) {
      return Promise.reject(tokenJson);
    }

    return Promise.resolve({
      auth_token: tokenJson.auth_token,
    });
  }
}
