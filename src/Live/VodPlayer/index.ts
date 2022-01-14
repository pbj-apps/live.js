import videojs from 'video.js';
import { isEmpty, differenceBy, pull, find, map, filter } from 'lodash';

import Live from '..';
import '../styles/index.css';
import { VOD_PLAYER_OPTIONS, PRE_FETCH_VALUE } from './constants';
import VODPlayerElement from './components/VodPlayerElement';
import { VIDEOJS_SELECTOR } from '../Player/constants';
import CloseButton from './components/CloseButton';
import {
  FEATURED_PRODUCTS_CONTAINER_ELEMENT_ID,
  PRODUCT_LIST_ELEMENT_ID,
} from '../Player/components/FeaturedProductsContainer/constants';
import Loader from './components/Loader';
import ProductElement from '../Player/components/FeaturedProductsContainer/product';
import { convertStringToSeconds } from '../../utils/duration';

class VodPlayer {
  live: Live;
  containerElement;
  player;
  videoData;
  options;
  featuredProducts = [];
  visibleProducts = [];

  constructor({ containerElement, videoData, options = {}, liveInstance }) {
    this.live = liveInstance;
    this.containerElement = containerElement;
    this.videoData = videoData;
    this.options = options;
    this.init();
  }

  init(): void {
    this.containerElement.innerHTML = VODPlayerElement(this.videoData);
    const videoElement = this.containerElement.querySelector(VIDEOJS_SELECTOR);
    this.player = videojs(videoElement, VOD_PLAYER_OPTIONS);
    this.player.src({
      src: this.videoData.asset.asset_url,
    });

    this.renderCloseButton();

    this.containerElement
      .querySelector('.play-button')
      .addEventListener('click', this.onPlay.bind(this));

    this.renderFeaturedProducts();
  }

  renderFeaturedProducts(): void {
    this.live.elements
      .getVideoFeaturedProductsMeta({
        videoId: this.videoData.id,
        params: {
          per_page: 1000,
        },
      })
      .then((productsMetaData) => {
        this.player.on('timeupdate', () => {
          const currentTime = this.player.currentTime();
          const updatedVisibleProductIdList = map(
            filter(productsMetaData, (productData) => {
              const { highlight_timings: highlightTimings } = productData;
              const isTimingPresent =
                !isEmpty(highlightTimings) && !isEmpty(highlightTimings[0]);

              const startTime = isTimingPresent
                ? convertStringToSeconds(highlightTimings[0].start_time)
                : 0;
              const endTime = isTimingPresent
                ? convertStringToSeconds(highlightTimings[0].end_time)
                : this.player.duration();

              return (
                currentTime >= startTime - PRE_FETCH_VALUE &&
                currentTime <= endTime
              );
            }),
            'product_id',
          );

          this.updateVisibleProducts(updatedVisibleProductIdList);
        });
      });
  }

  updateVisibleProducts(updatedVisibleProductList: string[]): void {
    const featuredProductsContainerElement = document.getElementById(
      FEATURED_PRODUCTS_CONTAINER_ELEMENT_ID,
    );

    if (
      isEmpty(updatedVisibleProductList) &&
      !featuredProductsContainerElement.hidden
    ) {
      featuredProductsContainerElement.hidden = true;
    } else if (
      !isEmpty(updatedVisibleProductList) &&
      featuredProductsContainerElement.hidden
    ) {
      featuredProductsContainerElement.hidden = false;
    }

    const hiddenProducts = differenceBy(
      this.visibleProducts,
      updatedVisibleProductList,
    );

    const newFeaturedProducts = differenceBy(
      updatedVisibleProductList,
      this.visibleProducts,
    );

    if (!isEmpty(hiddenProducts)) {
      hiddenProducts.forEach((hiddenProduct) => {
        document.getElementById(`product-${hiddenProduct}`).remove();
      });
    }

    if (!isEmpty(newFeaturedProducts)) {
      newFeaturedProducts.forEach((productId) => {
        const product = find(this.featuredProducts, { id: productId });

        if (isEmpty(product)) {
          this.renderProductLoader(`loader-${productId}`);
          this.live.elements
            .getProductDetails(productId)
            .then((fetchedProduct) => {
              this.featuredProducts = [
                ...this.featuredProducts,
                fetchedProduct,
              ];
              document.getElementById(`loader-${productId}`).remove();
              this.renderProduct(fetchedProduct);
            });
        } else {
          this.renderProduct(product);
        }
      });
    }

    this.visibleProducts = [
      ...pull(this.visibleProducts, ...hiddenProducts),
      ...newFeaturedProducts,
    ];
  }

  renderProduct(product): void {
    document
      .getElementById(PRODUCT_LIST_ELEMENT_ID)
      .insertAdjacentHTML('afterbegin', ProductElement(product));
  }

  renderProductLoader(loaderId: string): void {
    document
      .getElementById(PRODUCT_LIST_ELEMENT_ID)
      .insertAdjacentHTML('afterbegin', Loader(loaderId));
  }

  renderCloseButton(): void {
    if (this.options.closable) {
      this.containerElement
        .querySelector('.vod-overlay-content-container')
        .insertAdjacentHTML('afterbegin', CloseButton());

      this.containerElement
        .querySelector('.close-button')
        .addEventListener('click', this.dispose.bind(this));
    }
  }

  onPlay(): void {
    this.containerElement.querySelector('.video-cover').hidden = true;
    this.player.play();
  }

  dispose(): void {
    this.containerElement.innerHTML = '';
    this.player.dispose();
  }
}

export default VodPlayer;
