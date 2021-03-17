const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('api_key');
const environment = urlParams.get('environment');
const showId = urlParams.get('show_id');

if(apiKey) {
  const Live = window.Live;
  const live = new Live(apiKey, { environment });
  
  const videoPlayer = live.elements.video();
  videoPlayer.mount(document.getElementById('element'), { showId: showId });
  
  function getUrlParameter(url, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
  
  window.addEventListener("message", onMessageResponse);
  
  function onMessageResponse(event) {
    const {
      data: {
        message,
        args
      }
    } = event
  
    if (typeof videoPlayer[message] === "function") { 
      videoPlayer[message](args)
    }
    else {
      console.error(`${message} is not a valid function name.`)
    }
  }
}
