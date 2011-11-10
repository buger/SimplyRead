(function() {
  var App, global;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  global = this;
  App = (function() {
    __extends(App, Backbone.View);
    function App() {
      App.__super__.constructor.apply(this, arguments);
    }
    App.prototype.el = $('article');
    App.prototype.events = {
      "click aside a": "clickLink"
    };
    App.prototype.initialize = function() {
      this.spinner = new Spinner().spin();
      return this.section = this.$('section');
    };
    App.prototype.clickLink = function(evt) {
      return this.openLink(evt.target.href);
    };
    App.prototype.openLink = function(url) {
      if (!url.match(/http/)) {
        url = "http://" + url;
      }
      this.section.empty();
      this.spinner.spin();
      this.section.append(this.spinner.el).css({
        'padding-top': '40px'
      });
      this.iframe = global.document.createElement('iframe');
      this.iframe.sandbox = "allow-forms allow-same-origin allow-scripts";
      this.iframe.src = "iframe.html?url=" + url;
      this.section.append(this.iframe);
      return false;
    };
    App.prototype.loaded = function() {
      this.spinner.stop();
      this.section.css({
        'padding-top': '0px'
      });
      readability(this.iframe.contentWindow, this.iframe.contentDocument);
      return setTimeout(__bind(function() {
        return this.iframe.style.height = $(this.iframe.contentDocument).height() + 'px';
      }, this), 200);
    };
    return App;
  })();
  this.app = new App();
  this._pageLoaded = function() {
    return app.loaded();
  };
}).call(this);
