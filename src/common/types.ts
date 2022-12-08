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
  elapsed_time: string;
  stream_type: string;
}

export interface FeaturedProduct {
  id: string;
  product: { [key: string]: any };
  shop_type: string;
}

export interface LivePlayerState {
  episode: Episode | null;
  broadcast: WatchEndpoint | null;
  loading: boolean;
  featuredProducts: FeaturedProduct[];
  loadingShopifyConfig: boolean;
}

export interface PlayerInitiationOption {
  episode?: Episode;
}

export interface ShopifyConfigType {
  domain: string;
  storefrontAccessToken: string;
}

export interface LivePlayerConfig {
  hideCoverTitle?: boolean;
  hideCoverDescription?: boolean;
  hideTitle?: boolean;
  hideDescription?: boolean;
  hideLiveLogo?: boolean;
  hideShoppingCart?: boolean;
}

export interface VodPlayerConfig {
  hideProducts?: boolean;
  hideDuration?: boolean;
  closable?: boolean;
}
