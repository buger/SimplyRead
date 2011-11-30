global = @

class App extends Backbone.View

    search_template: Handlebars.compile $("#search_result_tmpl").html()

    el: $('body')

    events:
        "click aside a": "clickLink"
        "click nav a": "changeSource"


    initialize: ->
        @spinner = new Spinner().spin()
        @section = @$('section').children()

        $('header input').autocomplete
            source: (request, response) =>
                @suggest request.term, response


        $('aside').hover -> 
            if $('aside').hasClass('minimized')
                $('aside').addClass('hover')
        , -> 
            if $('aside').hasClass('minimized')
                $('aside').removeClass('hover') 
                
        
        @search ""

    
    suggest: (text, callback) ->
        if (text.match(/http[s]?:\/\//))
            return @openLink(text)

        @search text

        $.ajax
            url: "http://www.google.com/s?cp=2&gs_id=c&xhr=t&q=#{text}"
            complete: (resp) ->
                results = JSON.parse(resp.responseText)
                results = _.map results[1], (i) -> 'value':i[0]

                callback _.first results, 4


    search: (text) ->
        @$('aside').removeClass('minimized hover')

        source = @$('nav .active').data('source')

        if source is 'twitter'
            return @twitterSearch text

        data = 
            AppID: "F004F1AD3D4BA238DD3F3D67F2D0059E6626F776"
            jsonType: "callback"
            Query: text
            Sources: source
            Version: "2.0"

        if source is 'News'
            data.Market = store.get('news_market')
            data.SortBy = 'Relevance'

        $.ajax              
            url :'http://api.bing.net/json.aspx?JsonCallback=?'
            dataType: 'jsonp'
            data: data          
            
            success: (resp) =>              
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
                            description: r.Description
                            type: source.toLowerCase()
                    
                    
                    @$('aside').html @search_template 'results': results
                else
                    @$('aside').html @search_template 'results': []

                    unless store.get 'news_market'
                        store.set 'news_market', 'en-US'
                        @search text

    twitterSearch: (text)->
        $.ajax
            url: "http://search.twitter.com/search.json?q=#{text}%20filter:links"
            dataType: "jsonp"
            success: (resp) =>
                unless resp.results
                    @$('aside').html @search_template 'results': []
                else
                    results = _.map resp.results, (r) ->
                        link = r.text.match(/(http|https):\/\/([a-zA-Z0-9\\~\\!\\@\\#\\$\\%\\^\\&amp;\\*\\(\\)_\\-\\=\\+\\\\\\/\\?\\.\\:\\;\\'\\,]*)?/)[0]              

                        result =
                            title: r.from_user_name                        
                            article_url: link
                            description: r.text  
                            
                    @$('aside').html @search_template 'results': results




    changeSource: (evt) ->
        if evt.currentTarget.className isnt 'active'
            @$('nav .active').removeClass('active');

            evt.currentTarget.className = 'active';

            @search @$('header input').val()

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


    loaded: ->
        @$('aside').addClass('minimized')       

        readability(@iframe.contentWindow, @iframe.contentDocument, @url)
        @spinner.stop()
        @iframe.style.visibility = "visible"
        
        @timer = setInterval =>         
            @iframe.style.height = $(@iframe.contentDocument).height() + 'px'
        , 1000


@app = new App()

@_pageLoaded = ->
    app.loaded()