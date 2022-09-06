function connect(apiKey, options) {
  const { channelId } = options || {};
  const Live = window.Live;
  const live = new Live(apiKey);
  const embedVideoPlayer = live.elements.embed();
  var el = document.getElementById('embed-element');
  embedVideoPlayer.mount(el, {
    channelId,
    options: {
      // Enable the below options to hide the overlay elements
      // hideCoverTitle: true,
      // hideCoverDescription: true,
      // hideLiveLogo: true,
      // hideTitle: true,
      // hideDescription: true,
      // hideShoppingCart: true,
    },
  });

  // Socket event joining and subscribing demo
  connectSockets(live);

  document.getElementById('exposed-vod-methods-div').hidden = false;
  document
    .getElementById('get-vod-items-btn')
    .addEventListener('click', async function () {
      const vodItems = await live.elements.vod.getItems().then((res) => {
        console.log({ res });
        return res;
      });
    });

  document
    .getElementById('get-videos-btn')
    .addEventListener('click', async function () {
      const videos = await live.elements.vod.getVideos().then((res) => {
        console.log({ res });
        return res;
      });
    });

  document
    .getElementById('get-video-btn')
    .addEventListener('click', async function () {
      const video = await live.elements.vod
        .getVideo(document.getElementById('video-id-input').value)
        .then((video) => {
          console.log({ video });
          return video;
        });
    });

  document
    .getElementById('get-video-featured-products-btn')
    .addEventListener('click', async function () {
      console.log('entered');
      const requestParams = {
        videoId: document.getElementById('video-id-2-input').value,
      };
      const products = await live.elements.vod
        .getVideoFeaturedProducts(requestParams)
        .then((products) => {
          console.log({ products });
          return products;
        });
    });

  document
    .getElementById('get-categories-btn')
    .addEventListener('click', async function () {
      const categories = await live.elements.vod
        .getCategories()
        .then((caregories) => {
          console.log({ caregories });
          return caregories;
        });
    });

  document
    .getElementById('get-category-btn')
    .addEventListener('click', async function () {
      const category = await live.elements.vod
        .getCategory(document.getElementById('category-id-input').value)
        .then((category) => {
          console.log({ category });
          return category;
        });
    });

  document
    .getElementById('get-playlist-btn')
    .addEventListener('click', async function () {
      const playlist = await live.elements.vod
        .getPlaylistInfo(document.getElementById('playlist-id-input').value)
        .then((playlist) => {
          console.log({ playlist });
          return playlist;
        });
    });

  document
    .getElementById('embed-vod-btn')
    .addEventListener('click', async function () {
      const vodElement = document.getElementById('vod-embed-element');
      const videoId = document.getElementById('video-id-3-input').value;
      const player = await live.elements.vod.embed({
        containerElement: vodElement,
        videoId,
        options: {
          closable: true,
          // Enable below option to hide featured products and/or duartion
          // hideProducts: true,
          // hideDuration: true,
        },
      });
      document
        .getElementById('dispose-vod-btn')
        .addEventListener('click', async function () {
          player.dispose();
        });
    });

  document
    .getElementById('get-episodes-list-btn')
    .addEventListener('click', async function () {
      const params = {
        startingAt: new Date().toISOString(),
        daysAhead: 7,
        // pagination params 👇🏻
        perPage: 1,
        page: 1,
      };

      live.elements.episodes
        .list({
          params,
        })
        .then((episodes) => {
          console.log({ episodes });
        });
    });

  document
    .getElementById('get-next-episode-btn')
    .addEventListener('click', function () {
      live.elements.episodes.next().then((nextEpisode) => {
        console.log({ nextEpisode });
      });
    });

  document
    .getElementById('episode-products-btn')
    .addEventListener('click', async function () {
      const requestParams = {
        episodeId: document.getElementById('episode-products-input').value,
      };
      await live.elements.episodes
        .featuredProducts(requestParams)
        .then((products) => {
          console.log({ products });
        });
    });

  document
    .getElementById('episode-highlighted-products-btn')
    .addEventListener('click', async function () {
      const requestParams = {
        episodeId: document.getElementById('episode-highlighted-products-input')
          .value,
      };
      await live.elements.episodes
        .highlightedFeaturedProducts(requestParams)
        .then((products) => {
          console.log({ products });
        });
    });
}

document.getElementById('connect-btn').addEventListener('click', function () {
  document.getElementById('embed-element').innerHTML = '';
  const orgApiKey = document.getElementById('api-key-input').value;
  const channelId = document.getElementById('channel-id-input').value;
  connect(orgApiKey, {
    channelId,
  });
});

function connectSockets(live) {
  const liveSockets = live.sockets;

  const socketMessage = JSON.stringify({
    command: 'join-episode-updates',
  });

  liveSockets.send(socketMessage, subscribeToEvent);

  function subscribeToEvent() {
    liveSockets.subscribeToEvent('episode-status-update', (message) => {
      console.log(message);
    });
  }
}
