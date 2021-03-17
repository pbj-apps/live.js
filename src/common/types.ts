export interface ConfigOptions {
  apiUrl?: string;
  socketUrl?: string;
  environment?: string;
}

export interface LiveConfig {
  key: string;
}

export interface LiveInitConfig {
  (key: string, options: ConfigOptions): LiveConfig;
}

export interface Episode {
  id: string;
}

export interface WatchEndpoint {
  broadcast_url: string;
}

export interface LivePlayerState {
  episode: Episode | null;
  broadcast: WatchEndpoint | null;
  loading: boolean;
}

export interface PlayerInitiationOption {
  episode?: Episode;
}
