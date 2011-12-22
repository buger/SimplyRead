global = @

rLINK = /((http|https):\/\/([a-zA-Z0-9\\~\\!\\@\\#\\$\\%\\^\\&amp;\\*\\(\\)_\\-\\=\\+\\\\\\/\\?\\.\\:\\;\\'\\,]*)?)/ig

class App extends Backbone.View

    search_template: Handlebars.compile $("#search_result_tmpl").html()

    el: $('body')

    events:
        "click cite a": "openSite"
        "click aside h3 a": "clickLink"
        "click aside p a": "clickLink"
        "click nav a": "changeSource"
        "click li.pages a": "changePage"
        "click header form img": "showMarkets"
        "click header .markets span": "changeMarket"
        "submit header form": "hideSuggestion"


    initialize: ->
        @spinner = new Spinner().spin()
        @section = @$('section').children()

        $('header input').autocomplete
            source: (request, response) =>
                @suggest request.term, response
            select: (evt, ui) => 
                @search ui.item.value
        .bind 'keyup', (evt) =>
            if evt.currentTarget.value.trim() is ""
                @search ""
            

        $('aside').hover -> 
            if $('aside').hasClass('minimized')
                $('aside').addClass('hover')
        , -> 
            if $('aside').hasClass('minimized')
                $('aside').removeClass('hover') 
                
        
        @search ""

        $('body').bind 'click', (evt) ->
            t = evt.currentTarget

            unless $(t).parent().hasClass('markets') or t.nodeName is 'IMG'
                $('header .markets').hide()

    
    hideSuggestion: ->
        $('header input').autocomplete "close"

    
    suggest: (text, callback) ->        
        if (text.match(/http[s]?:\/\//))
            return @openLink(text)

        @search text

        market = store.get('market')

        console.warn 'market', market, store.get('market')

        data = 
            Market: market
            Query: text
            jsonType: 'callback'


        $.ajax
            url: "http://api.bing.net/qson.aspx?JsonCallback=?"
            dataType: 'jsonp'
            data: data
            cache: true
            success: (resp) ->  
                console.warn resp.SearchSuggestion, resp
                results = _.map resp.SearchSuggestion.Section, (i) -> 'value':i.Text
                
                console.warn 'calling callback', results

                callback _.first results, 4


    search: (text, page = 1, market) ->
        market ?= store.get('market')

        @$('aside').addClass('fade')

        source = @$('nav .active').data('source')

        if source is 'twitter'
            return @twitterSearch text, page

        data = 
            AppID: "F004F1AD3D4BA238DD3F3D67F2D0059E6626F776"
            jsonType: "callback"
            Query: text
            Sources: source
            Version: "2.0"

        if source is 'News'
            data.Market = market
            data.SortBy = 'Relevance'
            data['News.Offset'] = (page-1) * 10
        else if source is 'Web'
            data.Market = market
            data['Web.Offset'] = (page-1) * 10
        else if source is 'Video'
            data.Market = market
            data['Video.Offset'] = (page-1) * 10

        $.ajax              
            url :'http://api.bing.net/json.aspx?JsonCallback=?'
            dataType: 'jsonp'
            data: data          
            
            success: (resp) =>
                unless text.trim() is ""
                    pages = _.map [1..5], (n) -> 
                        number: n
                        current: n is page

                view = 
                    'pages': pages

                if resp.SearchResponse[source]

                    results = _.map resp.SearchResponse[source].Results, (r) ->
                        if source is 'Video'
                            r.Description = "<img src='#{r.StaticThumbnail.Url}' />"

                            match = r.PlayUrl.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/)

                            r.DisplayUrl = match[3]
                        else
                            r.Description = (r.Description or r.Snippet or "")[0..200] + "..."                    

                        result =                    
                            title: r.Title
                            article_url: r.Url or r.PlayUrl
                            site_url: r.DisplayUrl or r.Source
                            date: r.Date 
                            description: r.Description
                            type: source.toLowerCase()

                    view.results = results
                    
                    @$('aside').html @search_template view
                    @$('aside date').timeago()
                else
                    if market isnt 'en-US'
                        return @search text, null, 'en-US'

                    view.results = []

                    @$('aside').html @search_template view


                @$('aside').removeClass('fade')


    twitterSearch: (text, page) ->
        unless text.trim() is ""
            pages = _.map [1..5], (n) -> 
                number: n
                current: n is page
          
        $.ajax
            url: "http://search.twitter.com/search.json"
            data:
                q: text + " filter:links"
                rpp: 15
                page: page
            dataType: "jsonp"
            success: (resp) =>
                unless resp.results
                    @$('aside').html @search_template 'results': []
                else
                    results = _.map resp.results, (r) ->
                        text = r.text.replace rLINK, "<a href='$1'>$1</a>"

                        result =
                            image: r.profile_image_url
                            site_url: r.from_user_name
                            article_url: "http://twitter.com/#{r.from_user}"
                            date: r.created_at
                            description: text
                            type: 'twitter'
                    
                    view = 
                        'results': results
                        'pages': pages
                            
                    @$('aside').html @search_template view
                    @$('aside date').timeago()

                $('aside').removeClass('fade') 


    changeSource: (evt) ->
        if evt.currentTarget.className isnt 'active'
            @$('nav .active').removeClass('active');

            evt.currentTarget.className = 'active';

            @search @$('header input').val()

            $('header input').focus()

        false
    

    clickLink: (evt) ->
        @$('aside li.selected').removeClass('selected')
        $(evt.currentTarget).closest('li').addClass('selected')
        @openLink evt.currentTarget.href

        false


    openLink: (url) ->
        clearInterval @timer

        @$('aside').removeClass('minimized hover')

        window.scroll(0,0)

        unless url.match /http/
            url = "http://" + url

        @section.empty()

        @spinner.spin(@section[0])
        
        @iframe = global.document.createElement('iframe')
        @iframe.src = "iframe.html?url=#{url}"
        @iframe.style.visibility = "hidden"
        @url = url

        @section.append @iframe     

        false


    openSite: (evt) ->
        unless $(evt.currentTarget).closest('li').hasClass('twitter')
            href = evt.currentTarget.href
            host = href.match(/^(?:f|ht)tp(?:s)?\:\/\/([^\/]+)/)[1]
                .replace('www.','')

            $('header input').val("site:#{host}")        
            @search "site:#{host}"

            false


    changePage: (evt) ->
        page = + evt.currentTarget.innerHTML
        @search $('header input').val(), page


    loaded: ->
        @$('aside').addClass('minimized')       

        readability(@iframe.contentWindow, @iframe.contentDocument, @url)
        @spinner.stop()
        @iframe.style.visibility = "visible"
        
        @timer = setInterval =>         
            @iframe.style.height = $(@iframe.contentDocument).height() + 'px'
        , 1000


    showMarkets: ->
        @$('header .markets').toggle()


    changeMarket: (evt) ->
        market = $(evt.currentTarget).data('market')
        store.set('market', market)
        country = market.split('-')[1].toLowerCase()

        $('header form img').attr
            'src': "/assets/images/flags/#{country}.png"

        $(evt.currentTarget).parent().hide()

        @search $('header input').val()




@app = new App()

@_pageLoaded = ->
    app.loaded()

$('header .markets span').each (i, e) ->
    country = $(e).data('market').split('-')[1].toLowerCase()

    $(e).css
        'background-image': "url(/assets/images/flags/#{country}.png)"


unless store.get('market')
    store.set('market', 'en-US')


market = store.get('market')
country = market.split('-')[1].toLowerCase()

$('header form img').attr
    'src': "/assets/images/flags/#{country}.png"