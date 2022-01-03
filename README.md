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
const live = new Live("<Your API KEY>", {
  environment: "dev|demo|production"
})
```
environment defaults to `production`


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
      var live = new Live("<Your API Key>", {
        environment: 'demo'
      });
      
      // Create instance of the iframe embed
      var embedPlayer = live.elements.embed()
       
      // Mount the player to the div#live-element in our html
      embedPlayer.mount("#live-element", {
        // (Optional) Channel ID can be passed within an object, i.e. the second parameter for the mount method.
        channelId: '0c2e035f-fd07-4390-921f-1e1e865805f1',
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

  useEffect(() => {
      var live = new Live("<Your API Key>", {
        environment: 'demo'
      });

      // Create instance of the iframe embed
      var embedPlayer = live.elements.embed()
       
      // Mount the player to the div#live-element in our html
      embedPlayer.mount("#live-element", {
        // (Optional) Channel ID can be passed within an object, i.e. the second parameter for the mount method.
        channelId: '0c2e035f-fd07-4390-921f-1e1e865805f1',
      })
  }, [])

  return <div id="live-element"><div/>
}

```

In the background, this `embed()` method will create an iFrame that will injected into your html element, we also offer a lower level solution via the `live.elements.video()` method.



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

Within the main params object, it is possible to give an optional `options` object with a boolean field with key `closable`.
If `closable === true`, a close/cross icon will be rendered on top of the VOD player which when clicked will call the `dispose` method of the VOD player.

The `dispose` method can also be called using the `vodPlayer` object.

```js
const containerElement = document.getElementById('vod-container-element');
const videoId = '7460531a-437d-4ddd-bf25-0a87536a406a';
const options = { closable = true };

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
### Get List of Videos (Paginated)

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
### Get Video

```js
const video = vodElement.getVideo(videoId);
```

The `vodElement.getVideo` method will return a Promise that resolves to an Video data object.

This method accepts a required `videoId` parameter.

```js
const videoId = '7460531a-437d-4ddd-bf25-0a87536a406a';
const video = vodElement.getVideo(videoId);
```
### Get Video Featured Products (Paginated)

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
### Get VOD Category

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
