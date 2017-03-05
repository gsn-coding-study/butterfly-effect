var JS = (function (self) {
  /**
   * vanilla javascript @see https://gist.github.com/joyrexus/7307312
   */
  self.documentReady = function (cb) {
    document.addEventListener('DOMContentLoaded', cb);
  }

  self.addEvent = function (el, event, cb, isCapture) {
    if (window.addEventListener) el.addEventListener(event, cb, isCapture);
    else if (window.attachEvent) el.attachEvent("on" + event, cb);
    else el["on" + event] = cb;
  }

  self.get = function (s) {
    return document.getElementById(s) ||
      document.getElementsByClassName(s) ||
      document.getElementsByTagName(s) ||
      document.querySelector(s);
  }

  self.element = function (tag, attrs) {
    attrs = attrs || {};

    var e = document.createElement(tag);
    for (var key in attrs) {
      e.setAttribute(key, attrs[key]);
    }
    return e;
  }

  return self;
}(JS || {}));