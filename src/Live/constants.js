export const socketCommandTypes = {
  JOIN_EPISODE_LIST_UPDATES: 'join-episode-list-updates',
  JOIN_EPISODE_UPDATES: 'join-episode-updates',
  LEAVE_EPISODE_UPDATES: 'leave-episode-updates',
  LEAVE_EPISODE_LIST_UPDATES: 'leave-episode-list-updates',
  EPISODE_STATUS_UPDATE: 'episode-status-update',
  JOIN_MUX_LIVESTREAM_WEBHOOK_UPDATES: 'join-mux-livestream-webhook-updates',
  LEAVE_MUX_LIVESTREAM_WEBHOOK_UPDATES: 'leave-mux-livestream-webhook-updates',
  JOIN_EPISODE_FEATURED_PRODUCT_UPDATES:
    'join-episode-featured-product-updates',
  EPISODE_FEATURED_PRODUCT_UPDATES: 'episode-featured-product-updates',
};

export const episodeStatus = {
  ACTIVE: 'active',
  FINISHED: 'finished',
};

export const episodeStreamStatus = {
  ACTIVE: 'active',
};

export const environmentMapping = {
  dev: 'api.pbj-live.dev.pbj.engineering',
  demo: 'api.pbj-live.demo.pbj.engineering',
  production: 'api.pbj.live',
};
