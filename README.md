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
      embedPlayer.mount("#live-element")
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
      embedPlayer.mount("#live-element")
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
