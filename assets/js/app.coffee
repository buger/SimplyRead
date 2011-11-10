global = @

class App extends Backbone.View

	el: $('article')

	events:
		"click aside a": "clickLink"


	initialize: ->
		@spinner = new Spinner().spin()
		@section = @$('section')
	
	clickLink: (evt) ->
		@openLink evt.target.href

	openLink: (url) ->
		unless url.match /http/
			url = "http://" + url

		@section.empty()

		@spinner.spin()
		@section.append(@spinner.el)
			.css 'padding-top':'40px'
		
		@iframe = global.document.createElement('iframe')
		@iframe.sandbox = "allow-forms allow-same-origin allow-scripts"
		@iframe.src = "iframe.html?url=#{url}"

		@section.append @iframe

		false


	loaded: ->
		@spinner.stop()
		@section.css 'padding-top':'0px'
		readability(@iframe.contentWindow, @iframe.contentDocument)		

		setTimeout =>
			@iframe.style.height = $(@iframe.contentDocument).height() + 'px'
		, 200


@app = new App()

@_pageLoaded = ->
	app.loaded()