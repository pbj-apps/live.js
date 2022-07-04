const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('api_key');
const environment = urlParams.get('environment');
const showId = urlParams.get('show_id');
const hideCoverTitle = urlParams.get('hide_cover_title');
const hideCoverDescription = urlParams.get('hide_cover_description');
const hideTitle = urlParams.get('hide_title');
const hideDescription = urlParams.get('hide_description');
const hideLiveLogo = urlParams.get('hide_live_logo');
const hideShoppingCart = urlParams.get('hide_shopping_cart');

if (apiKey) {
  const Live = window.Live;
  const live = new Live(apiKey, { environment });

  const videoPlayer = live.elements.video();
  videoPlayer.mount(document.getElementById('element'), {
    showId,
    livePlayerConfig: {
      hideCoverTitle,
      hideCoverDescription,
      hideTitle,
      hideDescription,
      hideLiveLogo,
      hideShoppingCart,
    },
  });

  // eslint-disable-next-line no-inner-declarations
  function getUrlParameter(url, name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  window.addEventListener('message', onMessageResponse);

  // eslint-disable-next-line no-inner-declarations
  function onMessageResponse(event) {
    const {
      data: { message, args },
    } = event;

    if (typeof videoPlayer[message] === 'function') {
      videoPlayer[message](args);
    } else {
      console.error(`${message} is not a valid function name.`);
    }
  }
}
