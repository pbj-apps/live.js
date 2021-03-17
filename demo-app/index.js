function connect(apiKey, options) {
  const { env, showId } = options || {}
  const Live = window.Live;
  const live = new Live(apiKey, {
    environment: env || 'dev'
  });
  const embedVideoPlayer = live.elements.embed();
  var el = document.getElementById('embed-element');
  embedVideoPlayer.mount(el, {
    showId
  });
}

document.getElementById('connect-btn').addEventListener('click', function() {
  document.getElementById('embed-element').innerHTML = '';
  const orgApiKey = document.getElementById('api-key-input').value;
  const env = document.getElementById('env-input').value;
  const showId = document.getElementById('show-input').value;
  connect(orgApiKey, {
    env,
    showId
  });
});
