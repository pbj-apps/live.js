# PBJ Live Javascript SDK
![Live](banner.png)

Stream your [pbj.live](https://pbj.live) content from your web App.

# 📦 Installation

## 1. Import the web-sdk package:

#### Using CDN

```html
<script src="https://js.pbj.live/sdk.js"></script>
```

#### Using NPM

`npm install @pbj/live.js`
or
`yarn add @pbj/live.js`

```js
import Live from '@pbj/live.js';
```


This script will expose a global `Live` class. Initiate the class with your organization api key:

## 2. Initialize the LivePlayerSDK with your api key:
```
const live = new Live("<Your API KEY>")
```

# 🚀  Usage

When the `Live` class is initiated you will be able to do several things:

- Render a PBJ Live stream to a HTML element
- Retrieve information from our APIs

## Elements

### Embed element
*Currently our recommended way to integrate with PBJ Live.*

#### html

In your html, create a `div` tag with your preferred naming, we use `live-element` in these examples. 

So in your html, add:
```html
<html>
  <body>
    <!--- Add Live element here ---!>
    <div id="live-element"></div>
    
    <script src="https://js.pbj.live/v1/sdk.js"></script>
    <script type="text/javascript">
      var live = new Live("<Your API Key>");
      
      // Create instance of the iframe embed
      var embedPlayer = live.elements.embed()
       
      // Mount the player to the div#live-element in our html
      const liveElement = document.querySelector('#live-element');
      embedPlayer.mount(liveElement, {
        // (Optional) Channel ID can be passed within an object, i.e. the second parameter for the mount method.
        channelId: '0c2e035f-fd07-4390-921f-1e1e865805f1',
        // More about channel ID in "Using different channels" section below.
      })
    </script>
  </body>
</html>
```

#### using hooks

```jsx
import React, { useEffect } from 'react';
import Live from '@pbj/live.js';

const LiveVideo = () => {
  const liveElementRef = useRef();

  useEffect(() => {
      var live = new Live("<Your API Key>", {
        environment: 'demo'
      });

      // Create instance of the iframe embed
      var embedPlayer = live.elements.embed()
       
      // Mount the player to the div in our html
      embedPlayer.mount(liveElementRef.current, {
        // (Optional) Channel ID can be passed within an object, i.e. the second parameter for the mount method.
        channelId: '0c2e035f-fd07-4390-921f-1e1e865805f1',
        // More about channel ID in "Using different channels" section below.
      })
  }, [])

  return <div ref={liveElementRef}><div/>
}

```

In the background, this `embed()` method will create an iFrame that will injected into your html element, we also offer a lower level solution via the `live.elements.video()` method.

#### Using different channels
Selecting a specific channel to show in the LIVE video player requires the channel_id option to be added to the options while calling the `embedPlayer.mount`.

```js
embedPlayer.mount(liveElement, {
  channelId: '<Your channel ID>',
})
```
To get the channel ID go to the dashboard and select a stream from the dropdown `Select Streams`. Once, you've selected this channel, copy the ID in the URL address bar. (URL format: https://pbj.live/dashboard/broadcast/Your-Channel-ID
Example: <br/>
URL: `https://pbj.live/dashboard/broadcast/31d319ae-919b-4ac2-bd10-f9a390c9aa81`<br/>
Channel ID: `31d319ae-919b-4ac2-bd10-f9a390c9aa81`


### Mount Options

The `embedPlayer.mount` method accepts an object as it's param. Within the main params object, it is possible to give a `channelId` as depicted in the examples above. It is also possible to to give an `options` object (within the main params object) with a number of boolean fields that can toggle player overlay content.

| Field  | Default Value | Details |
| ------------- | ------------- | ------------- |
| hideCoverTitle  | false  | Toggles the Live cover title. |
| hideCoverDescription  | false  | Toggles the Live cover description. |
| hideLiveLogo  | false  | Toggles the Live logo on the Live Video Player. |
| hideTitle  | false  | Toggles the Live episode title on the Live Video Player. |
| hideDescription  | false  | Toggles the Live episode description on the Live Video Player. |
| hideShoppingCart  | false  | Toggles the Live episode shopping cart/bag and featured products on the Live Video Player. |

```js
const liveElement = document.querySelector('#live-element');

embedPlayer.mount(liveElement, {
    channelId: '0c2e035f-fd07-4390-921f-1e1e865805f1',
    options: {
      hideLiveLogo: true,
      hideTitle: true,
      hideDescription: true,
      hideShoppingCart: true,
    },
  });
```

### Video Element
```js
const episode = live.elements.video();
```

#### Mount to HTML object

Then mount this element to your HTML element:
```js
const videoElement = live.elements.video({
  episode: id
});

videoElement.mount("#live-video")
```

#### Start video
```js
videoElement.start();
embedPlayer.start();
```

#### Stop video
```js
videoElement.stop();
embedPlayer.stop();
```

#### Remove video element
```js
videoElement.dispose();
embedPlayer.dispose();
```

#### Change volume
You can change the volume of player by calling below method, 0 being the lowest and 1 being the highest.
```js
videoElement.volume(0.5);
embedPlayer.volume(0.7);
```

#### Open full screen programatically
```js
videoElement.openFullscreen()
embedPlayer.openFullscreen()
```

#### Close full screen programatically
```js
videoElement.closeFullscreen()
embedPlayer.closeFullscreen()
```
__________________________________________________________

### Episodes Element

```js
const episodesElement = live.elements.episodes;
```
This returns an object of serveral methods that can be used to fetch episodes data.
#### Note: Methods marked as "Paginated" accept "page" and "perPage" as optional fields within the params object.

Sample method call for a paginated mehtod.
```js
const params = { perPage: 99, page: 1 };
const episodes = episodesElement.list({params});
```

### Get a list of Episodes (Paginated)

```js
const episodes = episodesElement.list();
```

The `episodesElement.list` method will return a Promise that resolves to an array of Episode data objects.

This method along with pagination params, supports the following params.

| Field  | Default Value | Details |
| ------------- | ------------- | ------------- |
| startingAt (ISO DateTime string)  | Start of user's day  | Helps in getting episodes having start datetime greater than `startingAt`.  |
| daysAhead (number)  | 1  | Helps in getting episodes for number of days ahead. |

Example:
```js
const params = { perPage: 99, page: 1, startingAt: new Date().toISOString(), daysAhead: 7 };
const episodes = episodesElement.list({ params });
```

### Get a list of an Episode's Featured Products (Paginated)

```js
const featuredProducts = episodesElement.featuredProducts({episodeId});
```

The `episodesElement.featuredProducts` method will return a Promise that resolves to an array of Episode's Featured Products data.

This methods accepts an object as its parameter with a required `episodeId` field, along with the pagination params object.

Example:
```js
const episodeId = '7460531a-437d-4ddd-bf25-0a87536e1256a';
const params = { per_page: 99, page: 1 };
const featuredProducts = episodesElement.featuredProducts({ episodeId, params });
```

### Get a list of an Episode's Highlighted Featured Products (Paginated)

```js
const highlightedFeaturedProducts = episodesElement.highlightedFeaturedProducts({episodeId});
```

The `episodesElement.highlightedFeaturedProducts` method will return a Promise that resolves to an array of Episode's Highlighted Featured Products data.

This methods accepts an object as its parameter with a required `episodeId` field, along with the pagination params object.

Example:
```js
const episodeId = '7460531a-437d-4ddd-bf25-0a87536e1256a';
const params = { per_page: 99, page: 1 };
const highlightedFeaturedProducts = episodesElement.highlightedFeaturedProducts({ episodeId, params });
```

### Get Next or Ongoing episode

```js
const nextEpisode = episodesElement.next();
```

The `episodesElement.next` method will return a Promise that resolves to the data of the episode to go live next.

__________________________________________________________

### VOD (Video on Demand) Element

```js
const vodElement = live.elements.vod;
```
This returns an object of serveral methods that can be used to embed VOD Player and to get VOD Data.
#### Note: Methods marked as "Paginated" accept "page" and "per_page" as optional fields within the params object.

Sample method call for a paginated mehtod.
```js
const params = { per_page: 99, page: 1 };
const vodItems = vodElement.getItems({params});
```


#### Embed VOD Player

```js
const vodPlayer = vodElement.embed(params);
```
The `vodElement.embed` method will mount a VOD player within a container element.

This methods accepts a params object with required `containerElement` and `videoId` fields and returns an object of the VodPlayer.

Within the main params object, it is possible to give an optional `options` object with boolean fields that can toggle player overlay content.
| Field  | Default Value | Details |
| ------------- | ------------- | ------------- |
| closable  | false  | Toggles a close/cross icon on top of the VOD player which when clicked calls the `dispose` method of the player.  |
| hideProducts  | false  | Toggles the VOD featured prodcuts on the player.  |
| hideDuration  | false  | Toggles the video duration details on the player. |

The `dispose` method can also be called using the `vodPlayer` object.

```js
const containerElement = document.getElementById('vod-container-element');
const videoId = '7460531a-437d-4ddd-bf25-0a87536a406a';
const options = { closable = true, hideProducts = true };

const vodPlayer = vodElement.embed({ containerElement, videoId, options });

// To dispose the vodPlayer
vodPlayer.dispose();
```

#### Get List of VOD Items (Paginated)

```js
const vodItems = vodElement.getItems();
```

The `vodElement.getItems` method will return a Promise that resolves to an array of Vod Items.

This method along with pagination params, supports a `search` field in params object.

```js
const params = { per_page: 99, page: 1, search: 'vod' };
const vodItems = vodElement.getItems({ params });
```

Note: Search filtering is present only on category, playlist and video titles and is case in-sensitive. 
For example: To filter all vod items having category/video/playlist title with 'sample' in them, request should be:

```js
const params = { search: 'sample' };
const vodItems = vodElement.getItems({ params });
```
### Get a list of Videos (Paginated)

```js
const videos = vodElement.getVideos();
```

The `vodElement.getVideos` method will return a Promise that resolves to an array of Video objects.

This method along with pagination params, supports a `search` field in params object.

```js
const params = { per_page: 99, page: 1, title: 'video' };
const videos = vodElement.getVideos({ params });
```

Note: Search filtering is present only on title, description, featured product name and featured product category and is case in-sensitive. 
For example: To filter all videos having title, description, featured product name or featured product category name with 'sample' in them, request should be:

```js
const params = { search: 'sample' };
const videos = vodElement.getVideos({ params });
```
### Get a specific Video

```js
const video = vodElement.getVideo(videoId);
```

The `vodElement.getVideo` method will return a Promise that resolves to an Video data object.

This method accepts a required `videoId` parameter.

```js
const videoId = '7460531a-437d-4ddd-bf25-0a87536a406a';
const video = vodElement.getVideo(videoId);

```
### Get a Video's Featured Products (Paginated)

```js
const featuredProducts = vodElement.getVideoFeaturedProducts({ videoId });
```

The `vodElement.getVideoFeaturedProducts` method will return a Promise that resolves to an Video Featured Products data object.

This methods accepts an object as its parameter with a required `videoId` field, along with the pagination `params` object.

```js
const videoId = '7460531a-437d-4ddd-bf25-0a87536a406a';
const params = { per_page: 99, page: 1 };
const featuredProducts = vodElement.getVideoFeaturedProducts({ videoId, params });
```

### Get A Video's Featured Products Meta Information

```js
const featuredProducts = vodElement.getVideoFeaturedProductsMeta({ videoId, params });
```

The `vodElement.getVideoFeaturedProductsMeta` method will return a Promise that resolves to a Video Featured Products Meta.
A Video's featured products meta is used to get a products `highlighted timings`. These are the start & end times a product 
is featured on the video.

This methods accepts an object as its parameter with a required `videoId` field, along with the pagination `params` object.

```js
const videoId = '7460531a-437d-4ddd-bf25-0a87536a406a';
const params = { per_page: 1 };
const featuredProducts = vodElement.getVideoFeaturedProductsMeta({ videoId, params });
```

### Get VOD Categories (Paginated)

```js
const categories = vodElement.getCategories();
```

The `vodElement.getCategories` method will return a Promise that resolves to an array of Category objects.

This method along with pagination params, supports an optional `items_per_category` field in params object, which can help to include category items inside the response. The default for this field is `5`.

```js
const params = { per_page: 99, page: 1, items_per_category: 999 };
const categories = vodElement.getCategories({ params });
```
### Get a VOD Category

```js
const category = vodElement.getCategory(categoryId);
```

The `vodElement.getCategory` method will return a Promise that resolves to an Category data object.

This method accepts a required `categoryId` parameter.

```js
const categoryId = 'df1904d3-7b75-4039-8bab-24e15ac2632f';
const category = vodElement.getCategory(categoryId);
```
### Get Playlist Info

```js
const playlistInfo = vodElement.getPlaylistInfo(playlistId);
```

The `vodElement.getPlaylistInfo` method will return a Promise that resolves to an Playlist info data object.

This method accepts a required `playlistId` parameter.

```js
const playlistId = 'ee6904d3-7b75-4039-8bab-24e15ac2632f';
const playlistInfo = vodElement.getCategory(playlistId);
```

## Sockets

### Socket Element
```js
const liveSockets = live.sockets;
```

The `liveSockets` helps to `join` and `subscribe` to a number of important realtime updates or events.

### Supported joinable socket event types
- join-episode-updates
- join-episode-featured-product-updates

#### Note: Event types are case-sensitive.

### Joining `join-episode-updates` socket Event
```js
const EVENT_TYPE = 'join-episode-updates';
const socketMessage = JSON.stringify({
  command: EVENT_TYPE,
  });
  
function callback(){
  // Do something after joining the event!
}
  
liveSockets.send(socketMessage, callback);

```
### Joining `join-episode-featured-product-updates` socket Event

`join-episode-featured-product-updates` event type needs an `episode_id` field to join event updates of a particular episode.

```js
const EVENT_TYPE = 'join-episode-featured-product-updates';
const EPISODE_ID = '0c2e035f-fd07-4390-921f-1e1e865803f7';
const socketMessage = JSON.stringify({
  command: EVENT_TYPE,
  episode_id: EPISODE_ID,
  });
  
function callback(){
  // Do something after joining the event!
}
  
liveSockets.send(socketMessage, callback);
```

### Supported subscribable socket event types
- episode-status-update
- episode-featured-product-updates

#### Note: Event subscription only works if the corresponding parent event has been `joined`.

| Subscribable Event  | Parent Event |
| ------------------- | ------------- |
| episode-status-update  | join-episode-updates  |
| episode-featured-product-updates  | join-episode-featured-product-updates |

### Subscribing to an Event
```js
const EVENT_TYPE = 'episode-status-update';

function onUpdate(message){
  // Do something with the message!
  console.log(message)
}

liveSockets.subscribeToEvent(EVENT_TYPE, onUpdate);

```
---

## Further Notes: 
- Cart line items and variants are limited to the first 100 items.