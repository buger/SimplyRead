global = @

class App extends Backbone.View

	el: $('body')

	events:
		"click aside a": "clickLink"
		"submit header form": "search"


	initialize: ->
		@spinner = new Spinner().spin()
		@section = @$('section')

		$('header input').autocomplete
			source: (request, response) =>
				@suggest request.term, response

	
	suggest: (text, callback) ->
		$.ajax
			url: "http://www.google.ru/s?hl=ru&cp=2&gs_id=c&xhr=t&q=#{text}"
			complete: (resp) ->
				results = JSON.parse(resp.responseText)
				results = _.map results[1], (i) -> 'value':i[0]

				callback _.first results, 5

	search: (evt) ->
		text = evt.target.text.value

		$.ajax
			url: "http://www.google.ru/s?pq=asdasd&hl=ru&cp=4&gs_id=r&xhr=t&q=#{text}&pf=p&newwindow=1&source=hp&pbx=1&oq=&aq=&aqi=&aql=&gs_sm=&gs_upl=&bav=on.2,or.r_gc.r_pw.r_cp.,cf.osb&fp=994b03860695b560&biw=1140&bih=331&ech=7&psi=-ZDGTvujLIrtOZLU2bsP.1321636116145.1"
			complete: (resp) ->
				console.warn resp.responseText

		false
	

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