---
title: "Optimizing Front-End Performance"
date: 2014-04-22
layout: post.hbt
---

In [the first part](https://gist.github.com/kvzivn/ce1cdb75a367eb7be044) of this post I described how fast our application should ideally respond to our users interaction and why it’s important to keep those numbers under a certain level.

Since we’re currently developing primarily for desktops, and our application isn’t very animation heavy, I will focus this part mainly on what we can do to improve the load time of our pages.



## Table of Contents
<div class="Post-toc">
    <span class="Post-tocItem">[- Optimizing requests](#optimizing-requests)</span>
    <span class="Post-tocSubItem">[- Modularizing our load](#modularizing-our-load)</span>
    <span class="Post-tocItem">[- Core content delivery](#core-content-delivery)</span>
    <span class="Post-tocSubItem">[- Inlining critical CSS](#inlining-critical-css)</span>
    <span class="Post-tocSubItem">[- Removing render blocking JavaScript](#removing-render-blocking-javascript)</span>
    <span class="Post-tocItem">[- Optimizing our stylesheets](#optimizing-our-stylesheets)</span>
    <span class="Post-tocSubItem">[- Unused CSS](#unused-css)</span>
    <span class="Post-tocItem">[- Summary](#summary)</span>
</div>

## Optimizing requests

In my previous post I showed a screenshot from the networks tab in my developer tools.

The high number of requests (115 on that particular page) is one of the main reasons why some of our pages aren't loading as fast as they could be. And the way we are loading some of our resources isn’t always done in the best way, either.

To get a hang of what’s going on we should understand that not all requests are equal. Some are initiated in different places and they block different parts of the user experience.

In the same way, not all bytes getting loaded are equal. Different content types (images, scripts, CSS) have a different impact on performance, and some are more important to load faster than others.

Let’s take a look at a couple of techniques we can use to improve our load time.

### Modularizing our Load

The browser’s job is to present content that we choose, by requesting it from our server and displaying it in our users browser window.

There are basically three types of page content:

- Our core content (which is essential HTML+CSS and a usable non-JS enhanced experience)
- The enhancements (JS, enhanced CSS, web fonts, images)
- And the leftovers (stuff like analytics and third-party content)

It might sound very simple, but just by priorotizing and separating concerns like this, we can improve our performance a lot. Because once we have it separated, we can figure out when to load what and use two JavaScript events to load stuff in the right order.

We should start by making sure that our core content gets loaded **asap**. The core content consists of markup, styling, and JavaScript that is required to render a sufficiently presentable portion of our pages.

And then we want to load our enhancements on `DOMContentReady`, which is basically after the HTML and CSS has been downloaded and the page has started to render.

And after that, we load our leftovers on `Load`, which is when the page has been fully rendered and everything else is done loading.

## Core content delivery

The main principle here is to separate the loading of our assets throughout those three phases, so that the loading of the core content should never be blocked by any enhancement or leftover.

In other words, we have to shorten [the critical rendering path](https://www.dbswebsite.com/blog/2014/08/26/understanding-the-critical-rendering-path/) that is required for our content to start displaying, by pushing the important content down the line as fast as possible and deferring the less important stuff.

### Inlining critical CSS

Before the browser can render any content it must process every single stylesheet that is loaded for the current page. As a result, the browser will **block rendering** until all our external stylesheets are downloaded and processed. This requires multiple roundtrips  to our server and delays the time to the first render. Not good.

Here’s how to avoid it.

The technique is called ‘Inlining Critical CSS’ and it allows the browser to render the most important pieces of our pages before it starts to process all our other stylesheets.

So if our markup looks like this:
```html
<html>
  <head>
    <link rel=“stylesheet” href=“sitewide-overlimit.css”>
  </head>
  <body>
    <div class=“container”>
      Sup.
    </div>
  </body>
</html>
```

And our CSS-file looks like this:
```css
#recipient-validation-fail {
    color: #DF0101 !important;
}

.container {
  width: 500px;
  margin: 0 auto;
}

#recipient-validation-fail-border {
    border: 1px solid #DF0101 !important;
}
```

Then we can inline our critical CSS like this:
```html
<html>
  <head>
    <style>
      .container { width: 500px; margin: 0 auto; }
    </style>
    </head>
  <body>
    <div class=“container”>
      Sup.
    </div>
    <script>
      var cb = function() {
        var l = document.createElement(‘link’); l.rel = ‘stylesheet’;
        l.href = ‘sitewide-overlimit.css’;
        var h = document.getElementsByTagName(‘head’)[0]; h.parentNode.insertBefore(l, h);
      };
      var raf = requestAnimationFrame || mozRequestAnimationFrame ||
          webkitRequestAnimationFrame || msRequestAnimationFrame;
      if (raf) raf(cb);
      else window.addEventListener(‘load’, cb);
    </script>
  </body>
</html>
```

The critical styles needed for our most important content are inlined and applied immediately. And the full *sitewide-overlimit.css* is loaded after the initial painting of the page. It gets applied to the page once it finishes loading, without blocking the initial render of the critical content. Pretty sweet, huh?

But how do we know which parts of our CSS is critical? Easy. We use a node module called [CriticalCSS](https://github.com/filamentgroup/criticalcss). It can be used in our build process and basically just finds the CSS we need and then outputs it into a file.

### Removing render-blocking JavaScript

The same inlining principle (minus the callback function) goes for JavaScript-files that are needed to render our page content. Inlining scripts eliminates the external request and allows the browser to deliver a faster time to first render.

However, we should be aware that inlining also increases the size of our HTML documents and that the same script may be needed to be inlined in multiple pages.

We should also note that the inlined content needs to be pretty small and must execute quickly to deliver good performance. Scripts that are not critical to initial render should be made asynchronous or deferred until after the first render.

And to prevent JavaScript from blocking the parser, it’s recommended to use the HTML async attribute on external scripts:

```javascript
<script async src=“app.js”>
```

And when loading scripts that are not necessary for the initial page render (i.e the leftovers I mentioned earlier) they can be deferred until after the critical parts of our page has finished loading. This can be done by using the defer attribute:

```javascript
<script defer src=“app.js”>
```

##  Optimizing our stylesheets

To further improve our performance, we should really try to keep our CSS code base in good shape.

By streamlining our classes, shortening our selectors, and basically just rooting out anything that we don’t need can potentially save us from hundreds of unnecessary KB’s.

### Unused CSS

I did a web page performance audit on one of our newer pages and came across this:

![unused](https://cloud.githubusercontent.com/assets/4533644/10084620/ba8fba8e-6304-11e5-8e71-4095a403a0e2.png)

As you can see we have some unused CSS that we probably could (and should) get rid off. The main reason why our CSS in Anpdm is so bloated, is because we are loading in the entire Bootstrap framework when for example on this page we’re only using 10% of it.

One way to clean up our CSS and trim down our page-weight is by using a tool like Giacomo Martino’s  [UnCSS](https://github.com/giakki/uncss). Here’s how UnCSS removes the unused rules in our stylesheets:

1. The HTML files are loaded by PhantomJS and JavaScript is executed.
2. Used stylesheets are extracted from the resulting HTML.
3. The stylesheets are concatenated and the rules are parsed by css-parse.
4. document.querySelector filters out selectors that are not found in the HTML files.
5. The remaining rules are converted back to CSS.

## Summary

The performance of our application affects our users — which means that everyone working on our product should understand it and try to improve it.

When we spend time designing and developing our interfaces, we have to realize that we are going to use a far larger amount of other peoples time. Our users time.

A faster page load enables them to accomplish more in a shorter amount of time, which leads not only to a better user experience, but also a higher ratio of useful work being done.
