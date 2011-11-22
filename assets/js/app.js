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
    App.prototype.search_template = Handlebars.compile($("#search_result_tmpl").html());
    App.prototype.el = $('body');
    App.prototype.events = {
      "click aside a": "clickLink",
      "click nav a": "changeSource"
    };
    App.prototype.initialize = function() {
      this.spinner = new Spinner().spin();
      this.section = this.$('section').children();
      $('header input').autocomplete({
        source: __bind(function(request, response) {
          return this.suggest(request.term, response);
        }, this)
      });
      $('aside').hover(function() {
        if ($('aside').hasClass('minimized')) {
          return $('aside').addClass('hover');
        }
      }, function() {
        if ($('aside').hasClass('minimized')) {
          return $('aside').removeClass('hover');
        }
      });
      return this.search("");
    };
    App.prototype.suggest = function(text, callback) {
      if (text.match(/http[s]?:\/\//)) {
        return this.openLink(text);
      }
      this.search(text);
      return $.ajax({
        url: "http://www.google.com/s?cp=2&gs_id=c&xhr=t&q=" + text,
        complete: function(resp) {
          var results;
          results = JSON.parse(resp.responseText);
          results = _.map(results[1], function(i) {
            return {
              'value': i[0]
            };
          });
          return callback(_.first(results, 4));
        }
      });
    };
    App.prototype.search = function(text) {
      var data, source;
      this.$('aside').removeClass('minimized hover');
      source = this.$('nav .active').data('source');
      if (source === 'twitter') {
        return this.twitterSearch(text);
      }
      data = {
        AppID: "F004F1AD3D4BA238DD3F3D67F2D0059E6626F776",
        jsonType: "callback",
        Query: text,
        Sources: source,
        Version: "2.0"
      };
      if (source === 'News') {
        data.Market = store.get('news_market');
        data.SortBy = 'Relevance';
      }
      return $.ajax({
        url: 'http://api.bing.net/json.aspx?JsonCallback=?',
        dataType: 'jsonp',
        data: data,
        success: __bind(function(resp) {
          var results;
          if (resp.SearchResponse[source]) {
            results = _.map(resp.SearchResponse[source].Results, function(r) {
              var match, result;
              if (source === 'Video') {
                r.Description = "<img src='" + r.StaticThumbnail.Url + "' />";
                match = r.PlayUrl.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
                r.DisplayUrl = match[3];
              } else {
                r.Description = (r.Description || r.Snippet).slice(0, 201) + "...";
              }
              return result = {
                title: r.Title,
                article_url: r.Url || r.PlayUrl,
                site_url: r.DisplayUrl || r.Source,
                description: r.Description,
                type: source.toLowerCase()
              };
            });
            return this.$('aside').html(this.search_template({
              'results': results
            }));
          } else {
            this.$('aside').html(this.search_template({
              'results': []
            }));
            if (!store.get('news_market')) {
              store.set('news_market', 'en-US');
              return this.search(text);
            }
          }
        }, this)
      });
    };
    App.prototype.twitterSearch = function(text) {
      return $.ajax({
        url: "http://search.twitter.com/search.json?q=" + text + "%20filter:links",
        dataType: "jsonp",
        success: __bind(function(resp) {
          var results;
          if (!resp.results) {
            return this.$('aside').html(this.search_template({
              'results': []
            }));
          } else {
            results = _.map(resp.results, function(r) {
              var link, result;
              link = r.text.match(/(http|https):\/\/([a-zA-Z0-9\\~\\!\\@\\#\\$\\%\\^\\&amp;\\*\\(\\)_\\-\\=\\+\\\\\\/\\?\\.\\:\\;\\'\\,]*)?/)[0];
              return result = {
                title: r.from_user_name,
                article_url: link,
                description: r.text
              };
            });
            return this.$('aside').html(this.search_template({
              'results': results
            }));
          }
        }, this)
      });
    };
    App.prototype.changeSource = function(evt) {
      if (evt.currentTarget.className !== 'active') {
        this.$('nav .active').removeClass('active');
        evt.currentTarget.className = 'active';
        this.search(this.$('header input').val());
      }
      return false;
    };
    App.prototype.clickLink = function(evt) {
      this.openLink(evt.currentTarget.href);
      return false;
    };
    App.prototype.openLink = function(url) {
      clearInterval(this.timer);
      this.$('aside').removeClass('minimized hover');
      window.scroll(0, 0);
      if (!url.match(/http/)) {
        url = "http://" + url;
      }
      this.section.empty();
      this.spinner.spin(this.section[0]);
      this.iframe = global.document.createElement('iframe');
      this.iframe.src = "iframe.html?url=" + url;
      this.iframe.style.visibility = "hidden";
      this.url = url;
      this.section.append(this.iframe);
      return false;
    };
    App.prototype.loaded = function() {
      this.$('aside').addClass('minimized');
      readability(this.iframe.contentWindow, this.iframe.contentDocument, this.url);
      this.spinner.stop();
      this.iframe.style.visibility = "visible";
      return this.timer = setInterval(__bind(function() {
        return this.iframe.style.height = $(this.iframe.contentDocument).height() + 'px';
      }, this), 1000);
    };
    return App;
  })();
  this.app = new App();
  this._pageLoaded = function() {
    return app.loaded();
  };
}).call(this);
