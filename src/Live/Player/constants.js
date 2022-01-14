export const VIDEOJS_SELECTOR = '.video-js';
export const PLAYER_OPTIONS = {
  muted: true,
  autoplay: true,
  controls: true,
  nativeControlsForTouch: true,
  controlBar: {
    volumePanel: true,
    pictureInPictureToggle: false,
    fullscreenToggle: true,
    remainingTimeDisplay: false,
    progressControl: {
      seekBar: false,
    },
    liveDisplay: false,
  },
  html5: {
    vhs: {
      withCredentials: true,
    },
  },
};

export const PLAYER_EVENTS = {
  ENDED: 'ended',
};

export const STREAM_TYPES = {
  PRE_RECORDED_LIVE_STREAM: 'pre_recorded_live_stream',
};
