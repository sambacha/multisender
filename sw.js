importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/17581b075d28614d3f80.js",
    "revision": "646803182f74408de8d37f07e8b6a444"
  },
  {
    "url": "/_nuxt/17cd7d389d6273058638.js",
    "revision": "aa8fe0e0560d389945b522434933e229"
  },
  {
    "url": "/_nuxt/304cbf2060f48f07b583.js",
    "revision": "b54d3939a4a37909d7714cda6ab3b6a4"
  },
  {
    "url": "/_nuxt/44fcb5bde0f9e0d03d80.js",
    "revision": "d0daecc327eb49db4d4db1c663e5f035"
  },
  {
    "url": "/_nuxt/60175048f87ae89f6bf7.js",
    "revision": "b646c9891af47b6be09195d9c8440d39"
  },
  {
    "url": "/_nuxt/64beb077fe003cdf260a.js",
    "revision": "9497e60d8bd45d1ba19f175f364aa94d"
  },
  {
    "url": "/_nuxt/68fd3167420663043d2d.js",
    "revision": "f5b17cca6fb80b8c74f366adb84ef220"
  },
  {
    "url": "/_nuxt/82911b35df4a72809258.js",
    "revision": "47a0d6d7adb46c60c0a3e8cdb07cf8f3"
  },
  {
    "url": "/_nuxt/82b8cde7dfa82fde3754.js",
    "revision": "683d2c93265ea0708bded02afb089b59"
  },
  {
    "url": "/_nuxt/9280d96d186d56fd54e6.js",
    "revision": "c700d3eb87ac5f1524c5d2189f93a40f"
  },
  {
    "url": "/_nuxt/9f42cb6a79f885d734d6.js",
    "revision": "c40e09ae4dd57a98b9ebeaaee2f5db60"
  },
  {
    "url": "/_nuxt/bda551c76d87d3769f3f.js",
    "revision": "dfd1b533f5cf08dbc1000b684b4365e2"
  },
  {
    "url": "/_nuxt/c47fa71b8e4e4a2c604c.js",
    "revision": "c5f27522e2af7aa9e310eb1abb618574"
  },
  {
    "url": "/_nuxt/cff054af7aeed55ad526.js",
    "revision": "45eb3bce9ce826d1017c66406e6076e1"
  },
  {
    "url": "/_nuxt/ebb6ab9fb2757f86e4ba.js",
    "revision": "6631626554ae973c1ee572650bb54817"
  }
], {
  "cacheId": "multisender.app",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')
