(function() {
  var App, GMarkets, country, global, market, rLINK;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  global = this;

  rLINK = /((http|https):\/\/([a-zA-Z0-9\\~\\!\\@\\#\\$\\%\\^\\&amp;\\*\\(\\)_\\-\\=\\+\\\\\\/\\?\\.\\:\\;\\'\\,]*)?)/ig;

  GMarkets = {
    'es-AR': ['es-419', 'ar'],
    'en-AU': ['en', 'au'],
    'de-AT': ['de', 'at'],
    'nl-BE': ['de', 'be'],
    'fr-BE': ['fr', 'be'],
    'pt-BR': ['pt-BR', 'br'],
    'en-CA': ['en', 'ca'],
    'fr-CA': ['fr', 'ca'],
    'es-CL': ['es-419', 'cl'],
    'da-DK': ['da', 'dk'],
    'fi-FI': ['fi', 'fi'],
    'fr-FR': ['fr', 'fr'],
    'de-DE': ['de', 'de'],
    'zh-HK': ['zh-CN', 'hk'],
    'en-IN': ['en', 'in'],
    'en-IE': ['en', 'ie'],
    'it-IT': ['it', 'it'],
    'ja-JP': ['ja', 'jp'],
    'ko-KO': ['ko', 'kr'],
    'es-MX': ['es-419', 'mx'],
    'nl-NL': ['nl', 'nl'],
    'en-NZ': ['en', 'nz'],
    'no-NO': ['no', 'no'],
    'zh-CN': ['zh-CN', 'cn'],
    'pt-PT': ['pt-PT', 'bt'],
    'en-PH': ['en', 'ph'],
    'ru-RU': ['ru', 'ru'],
    'en-SG': ['en', 'sg'],
    'es-ES': ['es', 'es'],
    'sv-SE': ['sv', 'se'],
    'fr-CH': ['fr', 'ch'],
    'de-CH': ['de', 'ch'],
    'zh-TW': ['zh-CN', 'tw'],
    'en-GB': ['en', 'uk'],
    'en-US': ['en', 'us'],
    'es-US': ['es-491', 'us']
  };

  App = (function() {

    __extends(App, Backbone.View);

    function App() {
      App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.search_template = Handlebars.compile($("#search_result_tmpl").html());

    App.prototype.el = $('body');

    App.prototype.events = {
      "click cite a": "openSite",
      "click aside h3 a": "clickLink",
      "click aside p a": "clickLink",
      "click nav a": "changeSource",
      "click li.pages a": "changePage",
      "click header form img": "showMarkets",
      "click header .markets span": "changeMarket",
      "submit header form": "hideSuggestion"
    };

    App.prototype.initialize = function() {
      var _this = this;
      this.spinner = new Spinner().spin();
      this.section = this.$('section').children();
      $('header input').autocomplete({
        source: function(request, response) {
          return _this.suggest(request.term, response);
        },
        select: function(evt, ui) {
          return _this.search(ui.item.value);
        }
      }).bind('keyup', function(evt) {
        if (evt.currentTarget.value.trim() === "") return _this.search("");
      });
      $('aside').hover(function() {
        if ($('aside').hasClass('minimized')) return $('aside').addClass('hover');
      }, function() {
        if ($('aside').hasClass('minimized')) {
          return $('aside').removeClass('hover');
        }
      });
      this.search("");
      return $('body').bind('click', function(evt) {
        var t;
        t = evt.currentTarget;
        if (!($(t).parent().hasClass('markets') || t.nodeName === 'IMG')) {
          return $('header .markets').hide();
        }
      });
    };

    App.prototype.hideSuggestion = function() {
      return $('header input').autocomplete("close");
    };

    App.prototype.suggest = function(text, callback) {
      var gmarket, url;
      if (text.match(/http[s]?:\/\//)) return this.openLink(text);
      this.search(text);
      gmarket = GMarkets[store.get('market') || 'en-US'];
      url = "http://www.google.com/s?cp=2&gs_id=c&xhr=t&q=" + text;
      url += "&hl=" + gmarket[0] + "&gl=" + gmarket[1];
      return $.ajax({
        url: url,
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

    App.prototype.search = function(text, page, market) {
      var data, source;
      var _this = this;
      if (page == null) page = 1;
      if (market == null) market = store.get('market');
      this.$('aside').addClass('fade');
      source = this.$('nav .active').data('source');
      if (source === 'twitter') return this.twitterSearch(text, page);
      data = {
        AppID: "F004F1AD3D4BA238DD3F3D67F2D0059E6626F776",
        jsonType: "callback",
        Query: text,
        Sources: source,
        Version: "2.0"
      };
      if (source === 'News') {
        data.Market = market;
        data.SortBy = 'Relevance';
        data['News.Offset'] = (page - 1) * 10;
      } else if (source === 'Web') {
        data.Market = market;
        data['Web.Offset'] = (page - 1) * 10;
      } else if (source === 'Video') {
        data.Market = market;
        data['Video.Offset'] = (page - 1) * 10;
      }
      return $.ajax({
        url: 'http://api.bing.net/json.aspx?JsonCallback=?',
        dataType: 'jsonp',
        data: data,
        success: function(resp) {
          var pages, results, view;
          if (text.trim() !== "") {
            pages = _.map([1, 2, 3, 4, 5], function(n) {
              return {
                number: n,
                current: n === page
              };
            });
          }
          view = {
            'pages': pages
          };
          if (resp.SearchResponse[source]) {
            results = _.map(resp.SearchResponse[source].Results, function(r) {
              var match, result;
              if (source === 'Video') {
                r.Description = "<img src='" + r.StaticThumbnail.Url + "' />";
                match = r.PlayUrl.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
                r.DisplayUrl = match[3];
              } else {
                r.Description = (r.Description || r.Snippet || "").slice(0, 201) + "...";
              }
              return result = {
                title: r.Title,
                article_url: r.Url || r.PlayUrl,
                site_url: r.DisplayUrl || r.Source,
                date: r.Date,
                description: r.Description,
                type: source.toLowerCase()
              };
            });
            view.results = results;
            _this.$('aside').html(_this.search_template(view));
            _this.$('aside date').timeago();
          } else {
            if (market !== 'en-US') return _this.search(text, null, 'en-US');
            view.results = [];
            _this.$('aside').html(_this.search_template(view));
          }
          return _this.$('aside').removeClass('fade');
        }
      });
    };

    App.prototype.twitterSearch = function(text, page) {
      var pages;
      var _this = this;
      if (text.trim() !== "") {
        pages = _.map([1, 2, 3, 4, 5], function(n) {
          return {
            number: n,
            current: n === page
          };
        });
      }
      return $.ajax({
        url: "http://search.twitter.com/search.json",
        data: {
          q: text + " filter:links",
          rpp: 15,
          page: page
        },
        dataType: "jsonp",
        success: function(resp) {
          var results, view;
          if (!resp.results) {
            _this.$('aside').html(_this.search_template({
              'results': []
            }));
          } else {
            results = _.map(resp.results, function(r) {
              var result;
              text = r.text.replace(rLINK, "<a href='$1'>$1</a>");
              return result = {
                image: r.profile_image_url,
                site_url: r.from_user_name,
                article_url: "http://twitter.com/" + r.from_user,
                date: r.created_at,
                description: text,
                type: 'twitter'
              };
            });
            view = {
              'results': results,
              'pages': pages
            };
            _this.$('aside').html(_this.search_template(view));
            _this.$('aside date').timeago();
          }
          return $('aside').removeClass('fade');
        }
      });
    };

    App.prototype.changeSource = function(evt) {
      if (evt.currentTarget.className !== 'active') {
        this.$('nav .active').removeClass('active');
        evt.currentTarget.className = 'active';
        this.search(this.$('header input').val());
        $('header input').focus();
      }
      return false;
    };

    App.prototype.clickLink = function(evt) {
      this.$('aside li.selected').removeClass('selected');
      $(evt.currentTarget).closest('li').addClass('selected');
      this.openLink(evt.currentTarget.href);
      return false;
    };

    App.prototype.openLink = function(url) {
      clearInterval(this.timer);
      this.$('aside').removeClass('minimized hover');
      window.scroll(0, 0);
      if (!url.match(/http/)) url = "http://" + url;
      this.section.empty();
      this.spinner.spin(this.section[0]);
      this.iframe = global.document.createElement('iframe');
      this.iframe.src = "iframe.html?url=" + url;
      this.iframe.style.visibility = "hidden";
      this.url = url;
      this.section.append(this.iframe);
      return false;
    };

    App.prototype.openSite = function(evt) {
      var host, href, twitter;
      if (!$(evt.currentTarget).closest('li').hasClass('twitter')) {
        href = evt.currentTarget.href;
        host = href.match(/^(?:f|ht)tp(?:s)?\:\/\/([^\/]+)/)[1].replace('www.', '');
        $('header input').val("site:" + host);
        this.search("site:" + host);
      } else {
        href = evt.currentTarget.href;
        twitter = href.replace('http://twitter.com/', '');
        $('header input').val("from:" + twitter);
        this.search("from:" + twitter);
      }
      return false;
    };

    App.prototype.changePage = function(evt) {
      var page;
      page = +evt.currentTarget.innerHTML;
      return this.search($('header input').val(), page);
    };

    App.prototype.loaded = function() {
      var _this = this;
      this.$('aside').addClass('minimized');
      readability(this.iframe.contentWindow, this.iframe.contentDocument, this.url);
      this.spinner.stop();
      this.iframe.style.visibility = "visible";
      return this.timer = setInterval(function() {
        return _this.iframe.style.height = $(_this.iframe.contentDocument).height() + 'px';
      }, 1000);
    };

    App.prototype.showMarkets = function() {
      return this.$('header .markets').toggle();
    };

    App.prototype.changeMarket = function(evt) {
      var country, market;
      market = $(evt.currentTarget).data('market');
      store.set('market', market);
      country = market.split('-')[1].toLowerCase();
      $('header form img').attr({
        'src': "/assets/images/flags/" + country + ".png"
      });
      $(evt.currentTarget).parent().hide();
      return this.search($('header input').val());
    };

    return App;

  })();

  this.app = new App();

  this._pageLoaded = function() {
    return app.loaded();
  };

  $('header .markets span').each(function(i, e) {
    var country;
    country = $(e).data('market').split('-')[1].toLowerCase();
    return $(e).css({
      'background-image': "url(/assets/images/flags/" + country + ".png)"
    });
  });

  if (!store.get('market')) store.set('market', 'en-US');

  market = store.get('market');

  country = market.split('-')[1].toLowerCase();

  $('header form img').attr({
    'src': "/assets/images/flags/" + country + ".png"
  });

}).call(this);
