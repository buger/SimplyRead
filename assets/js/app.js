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
    App.prototype.el = $('body');
    App.prototype.events = {
      "click aside a": "clickLink",
      "submit header form": "search"
    };
    App.prototype.initialize = function() {
      this.spinner = new Spinner().spin();
      this.section = this.$('section');
      return $('header input').autocomplete({
        source: __bind(function(request, response) {
          return this.suggest(request.term, response);
        }, this)
      });
    };
    App.prototype.suggest = function(text, callback) {
      return $.ajax({
        url: "http://www.google.ru/s?hl=ru&cp=2&gs_id=c&xhr=t&q=" + text,
        complete: function(resp) {
          var results;
          results = JSON.parse(resp.responseText);
          results = _.map(results[1], function(i) {
            return {
              'value': i[0]
            };
          });
          return callback(_.first(results, 5));
        }
      });
    };
    App.prototype.search = function(evt) {
      var text;
      text = evt.target.text.value;
      $.ajax({
        url: "http://www.google.ru/s?pq=asdasd&hl=ru&cp=4&gs_id=r&xhr=t&q=" + text + "&pf=p&newwindow=1&source=hp&pbx=1&oq=&aq=&aqi=&aql=&gs_sm=&gs_upl=&bav=on.2,or.r_gc.r_pw.r_cp.,cf.osb&fp=994b03860695b560&biw=1140&bih=331&ech=7&psi=-ZDGTvujLIrtOZLU2bsP.1321636116145.1",
        complete: function(resp) {
          return console.warn(resp.responseText);
        }
      });
      return false;
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
