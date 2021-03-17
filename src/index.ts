import Live from './Live';
import { LiveInitConfig, LiveConfig, ConfigOptions } from './common/types';

declare global {
  interface Window {
    Live: LiveInitConfig;
  }
}

const live = (key: string, options: ConfigOptions): LiveConfig => {
  return new Live(key, options);
};

window.Live = window.Live || live;

export default live;
