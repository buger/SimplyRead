$(function ()
{
	(function ($R)
	{
		//	vars
		//	====
			$R.$win = $($R.win);
			$R.$document = $($R.document);
	
		//	local debug
		//	===========
			

		//	debug
		//	=====
			
	//	defaults to false
	if ($R.debug); else { $R.debug = false; }

	//	make it faster -- when not debugging
	//	==============
	if (!($R.debug))
	{
		$R.debugRemember = {};
		
		$R.writeLog 		= function () { return false; };
		$R.log 				= function () { return false; };
		
		$R.debugTimerStart 	= function () { return false; };
		$R.debugTimerEnd 	= function () { return false; };
		
		$R.debugPrint 		= function () { return false; };
		$R.printDebugOutput = function () { return false; };
		
		$R.debugOutline 	= function () { return false; };
	}
	else
	{
		//	remember stuff
			$R.debugRemember = {};

		//	vars
		//	====
			$R.debugStuff = [];
			$R.debugTimers = [];
			
		//	write log
		//	=========
			$R.initializeWriteLogFunction = function ()
			{
				switch (true)
				{
					case (!(!($R.win.console && $R.win.console.log))):
						$R.writeLog = function (msg) { $R.win.console.log(msg); };
						break;
						
					case (!(!($R.win.opera && $R.win.opera.postError))):
						$R.writeLog = function (msg) { $R.win.opera.postError(msg); };
						break;
						
					default:
						$R.writeLog = function (msg) {};
						break;
				}
			};
			
		//	log
		//	===
			$R.initializeWriteLogFunction();
			$R.log = function ()
			{
				for (var i=0, il=arguments.length; i<il ; i++)
					{ $R.writeLog(arguments[i]); }
					
				$R.writeLog('-----------------------------------------');
			};
		
		//	outline
		//	=======
			$R.debugOutline = function (_element, _category, _reason)
			{
				switch (true)
				{
					case (!(_element.nodeType === 1)):
					case (!(_element.tagName > '')):
					case (_element.tagName.toLowerCase() == 'onject'):
					case (_element.tagName.toLowerCase() == 'embed'):
						//	don't outline
						break;
						
					default:
						var _color = '#000';
						switch (true)
						{
							case (_category == 'target' && _reason == 'first'): 				_color = '#FF0000';	break;
							case (_category == 'target' && _reason == 'second'):				_color = '#0000FF'; break;
							case (_category == 'target' && _reason == 'next-page'):				_color = '#FF80C0'; break;
							case (_category == 'target' && _reason == 'add-above'): 			_color = '#804000'; break;
							
							case (_category == 'clean-before' && _reason == 'floating'): 		_color = '#808080'; break;
							case (_category == 'clean-after' && _reason == 'missing-density'): 	_color = '#C0C0C0'; break;
							
							case (_category == 'clean-after' || _category == 'clean-before'):	_color = '#000000'; break;
						}
						
						$(_element).css('outline','5px solid '+_color);
						$(_element).attr('readable__outline', (_category + ': ' + _reason));
						break;
				}
			};
			
		//	timers
		//	======
			$R.debugTimerStart = function (timerName)
			{
				$R.debugTimers.push({
					'name': timerName,
					'start': (new Date()).getTime()
				});
			};
			
			$R.debugTimerEnd = function ()
			{
				var _t = $R.debugTimers.pop(), _time = ((new Date()).getTime() - _t.start);
				$R.log('TIMER / '+_t.name+': ' + _time);
				return _time;
			};
		
		//	output -- will be shown in Show function
		//	======
			$R.debugPrint = function (_key, _value)
				{ $R.debugStuff[_key] = _value; };
			
			$R.printDebugOutput = function ()
			{
				//	return
					if ($R.debug); else { return; }
					if ($R.customScript) { return; }

				//	first
					var _first =
					[
						'ExploreAndGetStuff',
						'ProcessFirst',
						'ProcessSecond',
						'BuildHTML',
						'BuildHTMLPregs',
						'NextPage',
						'FirstCandidates',
						'FirstContainers',
						'FirstPieces'
					];

				//	get and clean
					_$debug = $('#debugOutput');
					_$debug.html('');
				
				//	write
					var _debug_write = function (_key, _value)
					{
						_$debug.append(''
							+ '<tr>'
							+ 	'<td class="caption">'
							+		_key
							+ 	'</td>'
							+ 	'<td class="value">'
							+		_value
							+ 	'</td>'
							+ '</tr>'	
						);
					}

				//	first
					for (var i=0, _i=_first.length; i<_i; i++)
						{ _debug_write(_first[i], $R.debugStuff[_first[i]]); delete($R.debugStuff[_first[i]]); }
				
				//	the rest
					for (var _k in $R.debugStuff)
						{ _debug_write(_k, $R.debugStuff[_k]); }
					
				//	end; stop
					$R.debugPrint = function () {};
					$R.printDebugOutput = function () {};
			};
			
		//	scriptable scrolling
			$R.debugScroll__before1 = function () { $R.win.scrollTo(0, 0); };
			$R.debugScroll__before2 = function () { $R.win.scrollTo(0, $R.$win.height()); };
			$R.debugScroll__before3 = function () { if ($($R.debugRemember['theTarget']).height() > 0) { $R.debugRemember['theTarget'].scrollIntoView(false); } else { $R.debugRemember['firstCandidate'].scrollIntoView(false); } $R.win.scrollBy(0, 50); };
			
			$R.debugScroll__after1 = function () { window.scrollTo(0, 0); };
			$R.debugScroll__after2 = function () { window.scrollTo(0, $R.$win.height()); };
			$R.debugScroll__after3 = function () { $('#page1').get(0).scrollIntoView(false); window.scrollBy(0, 50); };
	}

		
		//	environment
		//	===========
				
	//	environtment
	//	============
	
		$R.iOS = ($R.win.navigator.userAgent.match(/like Mac OS X/i) != null);
		$R.mac = (!$R.iOS && ($R.win.navigator.userAgent.match(/Macintosh/i) != null));

		
		//	RUN: outside frame
		//	==================
			
	(function ()
	{

		var 
			_document = $R.document,
			
			_html = _document.getElementsByTagName('html')[0],
			_html_identifier = (_html.id && _html.id > '' && _html.id.match(/^[a-z]/i) != null ? '#'+_html.id : 'html'),
			
			_body = _document.getElementsByTagName('body')[0],
			_body_identifier = (_body.id && _body.id > '' && _body.id.match(/^[a-z]/i) != null ? '#'+_body.id : 'body'),
			
			_cssElement = _document.createElement('style'),
			
			_cssText = ''

			//	body
			//	====
				+	_html_identifier + '.readableBeforeVisible, '
				+	'html > ' + _body_identifier + '.readableBeforeVisible, '
				+	_body_identifier + '.readableBeforeVisible '
				+	'{ '
				+		'position: static !important; '
				+	'} '

				+	_html_identifier + '.readableVisible, '
				+	'html > ' + _body_identifier + '.readableVisible, '
				+	_body_identifier + '.readableVisible '
				+	'{ '
				+		'margin: 0 !important; padding: 0 !important; border: 0 !important; '
				+		'overflow: hidden !important; overflow-x: hidden !important; overflow-y: hidden !important; '
				+	'} '
				
				
			//	objects
			//	=======
				+	_html_identifier + '.readableBeforeVisible object, '
				+	_html_identifier + '.readableBeforeVisible embed, '
				+	_html_identifier + '.readableBeforeVisible iframe, '
				+	'html > ' + _body_identifier + '.readableBeforeVisible object, '
				+	'html > ' + _body_identifier + '.readableBeforeVisible embed, '
				+	'html > ' + _body_identifier + '.readableBeforeVisible iframe, '
				+	_body_identifier + '.readableBeforeVisible object, '
				+	_body_identifier + '.readableBeforeVisible embed, '
				+	_body_identifier + '.readableBeforeVisible iframe '
				+ 	'{ '
				+		'visibility: hidden !important; '
				+	'} '
			
			//	frame
			//	=====
				+	_html_identifier + '.readableBeforeVisible #readable_iframe, '
				+	'html > ' + _body_identifier + '.readableBeforeVisible #readable_iframe, '
				+	_body_identifier + '.readableBeforeVisible #readable_iframe, '
				+	'#readable_iframe '
				+ 	'{ '
				+		'display: block !important; '
				+		'overflow: auto !important; '
				+		'visibility: visible !important; '
				+	'} '
		;

		//	css
		//	===
			_cssElement.setAttribute('id', 'readableCSS2');
			_cssElement.setAttribute('type', 'text/css');
			if (_cssElement.styleSheet) {_cssElement.styleSheet.cssText = _cssText; }
				else { _cssElement.appendChild(_document.createTextNode(_cssText)); }
			_body.appendChild(_cssElement);
			
			
		//	get frame
		//	=========
			$R.$iframe = $R.$document.find('#readable_iframe');

	})();

		//	translations
		//	============
			
	$R.translations =
	{
		'menu__close__tooltip': 			'Hide the overlay.',
		'menu__clip_to_evernote__tooltip': 	'Clip to Evernote[=evernote_account].',
		'menu__print__tooltip': 			'Print.',
		'menu__settings__tooltip': 			'Show Themes.',
		'fitts__tooltip': 					'Hide the overlay.',
		
		'rtl__main__label': 'Text direction?',
		'rtl__ltr__label': 	'Left-to-right',
		'rtl__rtl__label': 	'Right-to-left',
		
		'blank_error__heading': 'Tips for using Clearly',
		'blank_error__body': 	'Clearly is currently designed to work on <strong>article pages</strong>. An article page is any page that contains one large block of text &mdash; like, for example, a newspaper article or blog post.',
		
		'evernote_clipping': 		'Clipping...',
		'evernote_clipping_failed': 'Clipping failed.',
		
		'evernote_login__heading': 				'Sign in to Evernote',
		'evernote_login__spinner': 				'Signing in to Evernote',
		'evernote_login__create_account': 		'Create an account',
		'evernote_login__button_do__label': 	'Sign in',
		'evernote_login__button_cancel__label': 'Cancel',
		
		'evernote_login__username__label': 		'Evernote Username or Email Address',
		'evernote_login__password__label': 		'Password',
		'evernote_login__rememberMe__label': 	'Remember me',

		'evernote_login__username__error__required': 	'Username is required.',
		'evernote_login__username__error__length': 		'Username must be between 1 and 64 characters long.',
		'evernote_login__username__error__format': 		'Username contains bad characters.',
		'evernote_login__username__error__invalid': 	'Not a valid, active user.',
		
		'evernote_login__password__error__required': 	'Password is required.',
		'evernote_login__password__error__length': 		'Password must be between 6 and 64 characters long.',
		'evernote_login__password__error__format': 		'Password contains bad characters.',
		'evernote_login__password__error__invalid': 	'Username and password do not match existing user.',
		
		'evernote_login__general__error': 'Authentication failed.',
		
		'settings__theme__1': 'Newsprint',
		'settings__theme__2': 'Notable',
		'settings__theme__3': 'Night Owl',
		'settings__theme__custom': 'Custom',
		
		'settings__fontSize__small': 'small',
		'settings__fontSize__medium': 'medium',
		'settings__fontSize__large': 'large',
		
		'misc__page':	'page'
	};

	//	translate function
	$R.translate = function (_key) {
		return ((_key in $R.translations) ? $R.translations[_key] : _key);
	};	
	

		//	from extension
		//	==============
			
	//	options
	//	=======
		$R.getFromExtension__options = function ()
		{
			//	include
			
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __default_options = 
	{
		'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
		'text_size': 			__encodeURIComponentForReadable('16px'),
		'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
		'box_width': 			__encodeURIComponentForReadable('36em'),
		'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
		'color_text': 			__encodeURIComponentForReadable('#1f0909'),
		'color_links': 			__encodeURIComponentForReadable('#065588'),
		'text_align': 			__encodeURIComponentForReadable('normal'),
		'base': 				__encodeURIComponentForReadable('theme-1'),
		'footnote_links': 		__encodeURIComponentForReadable('on_print'),
		'large_graphics': 		__encodeURIComponentForReadable('hide_on_print'),
		'custom_css': 			__encodeURIComponentForReadable(''
								+ '#text blockquote { border-color: #bababa; color: #656565; }'
								+ '#text thead { background-color: #dadada; }'
								+ '#text tr:nth-child(even) { background: #e8e7e7; }'
								)
	};

		
			//	do
			$R.options = {};
			for (var _x in __default_options)
			{
				var 
					_$element = $R.$document.find('#__readable_option__'+_x),
					_value = _$element.html()
				;
				
				//	set
				$R.options[_x] = (_value > '' ? _value : __default_options[_x]);
			}
		};

		
	//	vars
	//	====
		$R.getFromExtension__vars = function ()
		{
			//	include
			
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __default_vars = 
	{
		'theme': 				__encodeURIComponentForReadable('theme-1'),
		
		'keys_activation': 		__encodeURIComponentForReadable('Control + Alt + Right Arrow'),
		'keys_clip': 			__encodeURIComponentForReadable('Control + Alt + Up Arrow'),
		'clip_tag': 			__encodeURIComponentForReadable(''),
		
		'custom_theme_options':	__encodeURIComponentForReadable('')
	};


			//	do
			$R.vars = {};
			for (var _x in __default_vars)
			{
				var 
					_$element = $R.$document.find('#__readable_var__'+_x),
					_value = _$element.html()
				;
				
				//	set
				$R.vars[_x] = __decodeURIComponentForReadable(_value > '' ? _value : __default_vars[_x]);
			}
		};
		
	
	//	translations
	//	============
		$R.getFromExtension__translations = function ()
		{
			//	include
			
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	


			for (var _x in $R.translations)
			{
				var 
					_$element = $R.$document.find('#__readable_translation__'+_x),
					_value = _$element.html()
				;
				
				//	set
				if (_value > '') { $R.translations[_x] = __decodeURIComponentForReadable(_value); }
			}
		};

			
				$R.getFromExtension__translations();
				$R.getFromExtension__vars();
				$R.getFromExtension__options();
			
		
		//	RUN: inside frame
		//	================
			
	$('#bodyContent').html(''

	+	'<div id="curtains">'

	+		($R.debug ? ''
	+		'<div id="curtain__debug" class="curtain">'
	+			'<div class="setBoxWidth"><div class="setBoxWidthInner">'
	+				'<div class="curtainCanvas">'
	+					'<table id="debugOutput"></table>'
	+				'</div>'
	+			'</div></div>'
	+			'<div class="curtainShading"></div>'
	+			'<a href="#" class="curtainCloseButton"></a>'
	+		'</div>' : '')

	+		'<div id="curtain__tips" class="curtain">'
	+			'<div class="setBoxWidth"><div class="setBoxWidthInner">'
	+				'<div class="curtainCanvas">'
	+					'<div id="curtain__tips__logo"></div>'
	+					'<div id="curtain__tips__heading">'+$R.translate('blank_error__heading')+'</div>'
	+					'<div id="curtain__tips__body">'+$R.translate('blank_error__body')+'</div>'
	+				'</div>'
	+			'</div></div>'
	+			'<div class="curtainShading"></div>'
	+			'<a href="#" class="curtainCloseButton"></a>'
	+		'</div>'

	+		'<div id="curtain__rtl" class="curtain">'
	+			'<div class="setBoxWidth"><div class="setBoxWidthInner">'
	+				'<div class="curtainCanvas">'
	+					$R.translate('rtl__main__label')
	+					'<input  id="curtain__rtl__radio__ltr" type="radio" name="curtain__rtl__radio_input" checked="checked"/>'
	+					'<label for="curtain__rtl__radio__ltr">'+$R.translate('rtl__ltr__label')+'</label>'
	+					'<input  id="curtain__rtl__radio__rtl" type="radio" name="curtain__rtl__radio_input"/>'
	+					'<label for="curtain__rtl__radio__rtl">'+$R.translate('rtl__rtl__label')+'</label>'
	+				'</div>'
	+			'</div></div>'
	+			'<div class="curtainShading"></div>'
	+			'<a href="#" class="curtainCloseButton"></a>'
	+		'</div>'

	+	'</div>'

	+	'<div id="box">'
	+		'<div id="box_inner">'
	+			'<div id="text">'
	+				'<div id="pages"></div>'
	+				'<ol id="footnotedLinks"></ol>'
	+			'</div>'
	+		'</div>'
	+	'</div>'

	+	'<div id="background"><div id="background_shading"></div></div>'
	+	'<div id="fitts" title="'+$R.translate('fitts__tooltip')+'"></div>'
	+	'<div id="loading"><div id="loading_spinner"></div></div>'
	+	'<div id="dialogs_overlay"></div>'
	+	'<div id="next_pages_container"></div>'
	
	+	'<div id="blank_error">'
	+		'<table cellspacing="0" cellpadding="0" border="0" id="blank_error__table"><tr><td id="blank_error__td">'
	+			'<div id="blank_error__text">'
	+				'<div id="blank_error__logo"></div>'
	+				'<div id="blank_error__heading">'+$R.translate('blank_error__heading')+'</div>'
	+				'<div id="blank_error__body">'+$R.translate('blank_error__body')+'</div>'
	+			'</div>'
	+		'</td></tr></table>'
	+	'</div>'
	
	+	'<div id="sidebar">'

	+		'<div id="sidebar_menu">'
	+			'<a id="sidebar_menu__close"            onclick="window.parent.$readable.menu_functions.close(); return false;"            title="'+$R.translate('menu__close__tooltip')+' (Escape'+(($R.vars && $R.vars['keys_activation'] > '') ? ', '+$R.vars['keys_activation'] : '')+')'+'" href="#"></a>'
	+			'<a id="sidebar_menu__clip_to_evernote" onclick="window.parent.$readable.menu_functions.clip_to_evernote(); return false;" title="'+$R.translate('menu__clip_to_evernote__tooltip')+(($R.vars && $R.vars['keys_clip'] > '') ? ' ('+$R.vars['keys_clip']+')' : '')+'"          href="#"></a>'
	+			'<a id="sidebar_menu__settings"         onclick="window.parent.$readable.menu_functions.settings(); return false;"         title="'+$R.translate('menu__settings__tooltip')+'"                                                                                                href="#"></a>'
	+			'<a id="sidebar_menu__print"            onclick="window.parent.$readable.menu_functions.print(); return false;"            title="'+$R.translate('menu__print__tooltip')+' ('+($R.mac ? 'Command' : 'Control')+' P)'+'"                                                          href="#"></a>'
	+		'</div>'
	
	+		'<div id="sidebar_dialogs">'
	
			//	clip notifications
			//	==================

	+			'<div class="dialog" id="dialog__clip__doing"><div class="dialog_canvas">'
	+				'<div id="dialog__clip__doing__icon"></div>'
	+				'<div id="dialog__clip__doing__label" class="theFont">'+$R.translate('evernote_clipping')+'</div>'
	+			'</div><div class="dialog_cover"></div></div>'
	
	+			'<div class="dialog" id="dialog__clip__failed"><div class="dialog_canvas">'
	+				'<div id="dialog__clip__failed__icon"></div>'
	+				'<div id="dialog__clip__failed__label" class="theFont">'+$R.translate('evernote_clipping_failed')+'</div>'
	+			'</div><div class="dialog_cover"></div></div>'

			//	clip login
			//	==========

				
	+			'<div class="dialog" id="dialog__clip__login"><div class="dialog_canvas">'
	+				'<div id="evernote_login__container" class="theFont">'
	
	+					'<a id="evernote_login__logo" href="http://www.evernote.com/" target="_blank"></a>'

	+					'<input id="evernote_login__username" class="dialogInput theFont" type="text" maxlength="64" tabindex="1" value=""/>'
	+					'<label id="evernote_login__username__label" class="dialogInput">'+$R.translate('evernote_login__username__label')+'</label>'
	+					'<div id="evernote_login__username__error" class="dialogInput dialogError"></div>'

	+					'<input id="evernote_login__password" class="dialogInput theFont" type="password" maxlength="64" tabindex="2" value=""/>'
	+					'<label id="evernote_login__password__label" class="dialogInput">'+$R.translate('evernote_login__password__label')+'</label>'
	+					'<div id="evernote_login__password__error" class="dialogInput dialogError"></div>'
	
	+					'<div id="evernote_login__rememberMe__container" class="theFont">'
	+						'<input id="evernote_login__rememberMe" type="checkbox" tabindex="3" value="1" checked="true"/>'
	+						'<label for="evernote_login__rememberMe">'+$R.translate('evernote_login__rememberMe__label')+'</label>'
	+					'</div>'

	+					'<div id="evernote_login__buttons__container" class="theFont">'
	+						'<input type="button" class="floatingButton dialogButton theFont" id="evernote_login__button_do" tabindex="4" value="'+$R.translate('evernote_login__button_do__label')+'"/>'
	+						'<a id="evernote_login__register" class="floatingButton" href="https://www.evernote.com/Registration.action?code=clearly" target="_blank">'+$R.translate('evernote_login__create_account')+'</a>'
	+					'</div>'
	
	+				'</div>'
	+			'</div></div>'
				

			//	clip frame
			//	==========
				
				

			//	settings
			//	========
	
				
	+			'<div class="dialog" id="dialog__settings__3"><div class="dialog_canvas">'
	+				'<div id="settings__3">'

	+					'<a id="settings__3__1" class="themeBox">'
	+						'<div class="themeThumbnail"></div>'
	+						'<div class="themeTitle">'+$R.translate('settings__theme__1')+'</div>'
	+					'</a>'
	+					'<a id="settings__3__2" class="themeBox">'
	+						'<div class="themeThumbnail"></div>'
	+						'<div class="themeTitle">'+$R.translate('settings__theme__2')+'</div>'
	+					'</a>'
	+					'<a id="settings__3__3" class="themeBox">'
	+						'<div class="themeThumbnail"></div>'
	+						'<div class="themeTitle">'+$R.translate('settings__theme__3')+'</div>'
	+					'</a>'

	+					'<div id="settings__3__separator" class="settingsSeparator"></div>'

	+					'<div class="fontSizeButtons" id="settings__3__fontSizeButtons">'
	+						'<a id="settings__3__fontSize__small" class="fontSizeButton fontSizeSmall">'
	+							'<div class="fontSizeLabel">'+$R.translate('settings__fontSize__small')+'</div>'
	+						'</a>'
	+						'<a id="settings__3__fontSize__medium" class="fontSizeButton fontSizeMedium">'
	+							'<div class="fontSizeLabel">'+$R.translate('settings__fontSize__medium')+'</div>'
	+						'</a>'
	+						'<a id="settings__3__fontSize__large" class="fontSizeButton fontSizeLarge">'
	+							'<div class="fontSizeLabel">'+$R.translate('settings__fontSize__large')+'</div>'
	+						'</a>'
	+					'</div>'

	+				'</div>'
	+			'</div></div>'
	
	+			'<div class="dialog" id="dialog__settings__4"><div class="dialog_canvas">'
	+				'<div id="settings__4">'

	+					'<a id="settings__4__1" class="themeBox">'
	+						'<div class="themeThumbnail"></div>'
	+						'<div class="themeTitle">'+$R.translate('settings__theme__1')+'</div>'
	+					'</a>'
	+					'<a id="settings__4__2" class="themeBox">'
	+						'<div class="themeThumbnail"></div>'
	+						'<div class="themeTitle">'+$R.translate('settings__theme__2')+'</div>'
	+					'</a>'
	+					'<a id="settings__4__3" class="themeBox">'
	+						'<div class="themeThumbnail"></div>'
	+						'<div class="themeTitle">'+$R.translate('settings__theme__3')+'</div>'
	+					'</a>'
	+					'<a id="settings__4__custom" class="themeBox">'
	+						'<div class="themeThumbnail"></div>'
	+						'<div class="themeTitle">'+$R.translate('settings__theme__custom')+'</div>'
	+					'</a>'

	+					'<div id="settings__4__separator" class="settingsSeparator"></div>'

	+					'<div class="fontSizeButtons" id="settings__4__fontSizeButtons">'
	+						'<a id="settings__4__fontSize__small" class="fontSizeButton fontSizeSmall">'
	+							'<div class="fontSizeLabel">'+$R.translate('settings__fontSize__small')+'</div>'
	+						'</a>'
	+						'<a id="settings__4__fontSize__medium" class="fontSizeButton fontSizeMedium">'
	+							'<div class="fontSizeLabel">'+$R.translate('settings__fontSize__medium')+'</div>'
	+						'</a>'
	+						'<a id="settings__4__fontSize__large" class="fontSizeButton fontSizeLarge">'
	+							'<div class="fontSizeLabel">'+$R.translate('settings__fontSize__large')+'</div>'
	+						'</a>'
	+					'</div>'

	+				'</div>'
	+			'</div></div>'
				
	
	+		'</div>'
	+	'</div>'
	);

	
	//	get vars
	//	========
		$R.$box = $('#box');
		$R.$fitts = $('#fitts');
		$R.$background = $('#background');
		$R.$backgroundShading = $('#background_shading');
		$R.$loading = $('#loading');
		$R.$dialogsOverlay = $('#dialogs_overlay');
		$R.$nextPages = $('#next_pages_container');
		$R.$sidebar = $('#sidebar');
		
		$R.$iframeText = $('#text');
		$R.$pages = $('#pages');
		$R.$footnotedLinks = $('#footnotedLinks');

		
		//	options
		//	======
			
	//	var
	//	===

		//	$R.options holds the options to be applied
		//	$R.appliedOptions holds the options currently applied
		//	_optionsToApply holds the decoded options that will actually be applied
		//	$R.loadedGoogleFonts holds the  currently loaded Google fonts URLs

		$R.appliedOptions = {};
		$R.loadedGoogleFonts = {};
		
	//	apply options
	//	=============
		$R.applyOptions__fonts = function () {};
		$R.applyOptions = function ()
		{
			//	include defaults
			//	================
				
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

				
	//	__encodeURIComponentForReadable must be defined

	var __default_options = 
	{
		'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
		'text_size': 			__encodeURIComponentForReadable('16px'),
		'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
		'box_width': 			__encodeURIComponentForReadable('36em'),
		'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
		'color_text': 			__encodeURIComponentForReadable('#1f0909'),
		'color_links': 			__encodeURIComponentForReadable('#065588'),
		'text_align': 			__encodeURIComponentForReadable('normal'),
		'base': 				__encodeURIComponentForReadable('theme-1'),
		'footnote_links': 		__encodeURIComponentForReadable('on_print'),
		'large_graphics': 		__encodeURIComponentForReadable('hide_on_print'),
		'custom_css': 			__encodeURIComponentForReadable(''
								+ '#text blockquote { border-color: #bababa; color: #656565; }'
								+ '#text thead { background-color: #dadada; }'
								+ '#text tr:nth-child(even) { background: #e8e7e7; }'
								)
	};


				
			//	null or blank
			//	=============
				if ($R.options); else { $R.options = {}; }
				
				for (var _option in __default_options)
				{
					switch (true)
					{
						case (!(_option in $R.options)):
						case (!($R.options[_option] > '')):
							$R.options[_option] = __default_options[_option];
							break;
					}
				}
			
			
			//	what to do
			//	==========
			
				var 
					_resetOptions = false, 
					_resetBase = false,
					_optionsToApply = {}
				;

				//	set _resetBase
				switch (true)
				{
					case (!('base' in  $R.appliedOptions)):
					case (!($R.options['base'] == $R.appliedOptions['base'])):
						_resetBase = true;
						break;
				}
			
				//	set _resetOptions
				for (var _option in __default_options)
				{
					switch (true)
					{
						case (!(_option in $R.appliedOptions)):
						case (!($R.options[_option] == $R.appliedOptions[_option])):
							_resetOptions = true;
							break;
					}
					
					//	stop
					if (_resetOptions) { break; }
				}	

				
			//	set appliedOptions
			//	set optionToApply
			//	=================
				for (var _option in __default_options)
				{
					$R.appliedOptions[_option] = $R.options[_option];
					_optionsToApply[_option] = __decodeURIComponentForReadable($R.options[_option]);
				}

				
			//	apply base
			//	==========
				if (_resetBase)
				{
					//	remove old
					$('#baseCSS').remove();
					
					//	add new
					if (_optionsToApply['base'] > '')
					{
						$('head').append(''
							+ '<link id="baseCSS" href="'
							+ $R.paths['main']+'css/base--'+_optionsToApply['base']+'-'+$R.versioning['compile_time']+'.css'
							+ '" rel="stylesheet" type="text/css" />'
						);
					}
				}
				
				
			//	set the css
			//	===========
				if (_resetOptions)
				{
					
	function __options__get_css (_options)
	{
		var _cssText = (''
		+	'#body { '
		+		'font-family: [=text_font]; '
		+		'font-size: [=text_size]; '
		+		'line-height: [=text_line_height]; '
		+		'color: [=color_text]; '
		+		'text-align: '+(_options['text_align'] == 'justified' ? 'justify' : 'left')+'; '
		+	'} '
		
		+	'#background { background-color: [=color_background]; } '
		
		+	'.setTextColorAsBackgroundColor { background-color: [=color_text]; } '
		+	'.setBackgroundColorAsTextColor { color: [=color_background]; } '
		
		+	'#box, .setBoxWidth { width: [=box_width]; } '
		
		+	'a { color: [=color_links]; } '
		+	'a:visited { color: [=color_text]; } '

		+	'@media print { body.footnote_links__on_print a, body.footnote_links__on_print a:hover { color: [=color_text] !important; text-decoration: none !important; } } '
		+	'body.footnote_links__always a, body.footnote_links__always a:hover { color: [=color_text] !important; text-decoration: none !important; } '
		
		+	'img { border-color: [=color_text]; } '
		+	'a img { border-color: [=color_links]; } '
		+	'a:visited img { border-color: [=color_text]; } '

		+	'h1 a, h2 a, a h1, a h2 { color: [=color_text]; } '
		+	'h1, h2, h3, h4, h5, h6 { font-family: [=text_font_header]; } '

		+	'pre { background-color: [=color_background]; } '
		+	'pre, code { font-family: [=text_font_monospace]; } '
		+	'hr { border-color: [=color_text]; } '

		+	'#rtl_box { background-color: [=color_text]; color: [=color_background]; } '
		+	'#rtl_box a { color: [=color_background]; } '

		+	'html.rtl #body #text { text-align: ' + (_options['text_align'] == 'justified' ? 'justify' : 'right')+' !important; } '
		+	'h1, h2, h3, h4, h5, h6 { text-align: left; } '
		+	'html.rtl h1, html.rtl h2, html.rtl h3, html.rtl h4, html.rtl h5, html.rtl h6 { text-align: right !important; } '

		+	'[=custom_css] '
		).replace(
			/\[=([a-z_]+?)\]/gi,
			function (_match, _key) { return _options[_key]; }
		);
		
		return _cssText;
	}
					var _cssText = __options__get_css(_optionsToApply);
				
					//	remove old
					//	==========
						$('#optionsCSS').remove();
					
					//	new
					//	===
						var _cssElement = document.createElement('style');
							_cssElement.setAttribute('type', 'text/css');
							_cssElement.setAttribute('id', 'optionsCSS');
							
						if (_cssElement.styleSheet) { _cssElement.styleSheet.cssText = _cssText; }
							else { _cssElement.appendChild(document.createTextNode(_cssText)); }
					
						$('head').append(_cssElement);
						
					//	body classes
					//	============
						$('body')
							.removeClass('footnote_links__on_print footnote_links__always footnote_links__never')
							.removeClass('large_graphics__do_nothing large_graphics__hide_on_print large_graphics__hide_always')
							.addClass('footnote_links__'+_optionsToApply['footnote_links'])
							.addClass('large_graphics__'+_optionsToApply['large_graphics'])
						;
				}	
				
				
			//	google fonts
			//	============
				var _fontsFunction = function ()
				{
					//	skip?
					if (_resetOptions); else { return; }

					//	get
					
	function __options__get_google_fonts (_options)
	{
		
	var 
		__google_fonts_index = {},
		__google_fonts_array =
		[
			'Arvo',
			'Bentham',
			'Cardo',
			'Copse',
			'Corben',
			'Crimson Text',
			'Droid Serif',
			'Goudy Bookletter 1911',
			'Gruppo',
			'IM Fell',
			'Josefin Slab',
			'Kreon',
			'Meddon',
			'Merriweather',
			'Neuton',
			'OFL Sorts Mill Goudy TT',
			'Old Standard TT',
			'Philosopher',
			'PT Serif',
			'Radley',
			'Tinos',
			'Vollkorn',
			
			'Allerta',
			'Anton',
			'Arimo',
			'Bevan',
			'Buda',
			'Cabin',
			'Cantarell',
			'Coda',
			'Cuprum',
			'Droid Sans',
			'Geo',
			'Josefin Sans',
			'Lato',
			'Lekton',
			'Molengo',
			'Nobile',
			'Orbitron',
			'PT Sans',
			'Puritan',
			'Raleway',
			'Syncopate',
			'Ubuntu',
			'Yanone Kaffeesatz',
			
			'Anonymous Pro',
			'Cousine',
			'Droid Sans Mono',
			'Inconsolata'
		];

	//	create index
	for (var i=0, ii=__google_fonts_array.length; i<ii; i++){
		__google_fonts_index[__google_fonts_array[i]] = 1;
	}

		
		var 
			_fonts = {},
			_fonts_urls = [],
			_check_font = function (_match, _font)
				{ if (_font in __google_fonts_index) { _fonts[_font] = 1; } }
		;
		
		//	body
		//	====
			_options['text_font'].replace(/"([^",]+)"/gi, _check_font);
			_options['text_font'].replace(/([^",\s]+)/gi, _check_font);				
		
		//	headers
		//	=======
			_options['text_font_header'].replace(/"([^",]+)"/gi, _check_font);
			_options['text_font_header'].replace(/([^",\s]+)/gi, _check_font);				
		
		//	monospace
		//	=========
			_options['text_font_monospace'].replace(/"([^",]+)"/gi, _check_font);
			_options['text_font_monospace'].replace(/([^",\s]+)/gi, _check_font);				

		//	custom css
		//	==========
			_options['custom_css'].replace(/font-family: "([^",]+)"/gi, _check_font);
			_options['custom_css'].replace(/font-family: ([^",\s]+)/gi, _check_font);
	
	
		//	return
		//	======
		
			//	transform to array
			for (var _font in _fonts)
			{
				_fonts_urls.push(''
					+ 'http://fonts.googleapis.com/css?family='
					+ _font.replace(/\s+/g, '+')
					+ ':regular,bold,italic'
				);
			}
		
			//	return
			return _fonts_urls;
	}

					var _fonts_urls = __options__get_google_fonts(_optionsToApply);

					//	apply
					for (var i=0,_i=_fonts_urls.length; i<_i; i++)
					{
						//	loaded?
						if ($R.loadedGoogleFonts[_fonts_urls[i]]) { continue; }
						
						//	load
						$('head').append('<link href="'+_fonts_urls[i]+'" rel="stylesheet" type="text/css" />');
					
						//	mark
						$R.loadedGoogleFonts[_fonts_urls[i]] = 1;
					}
				};

				$R.applyOptions__fonts = function () { _fontsFunction.call(); };
		};

		
		//	dialogs
		//	=======
				
	//	vars
	//	====
		$R.openDialogID = false;
	
	//	show
	//	====
		$R.showDialog = function (_dialog_id)
		{
			$R.hideOpenDialog();

			$R.$dialogsOverlay.show();
			$('#dialog__'+_dialog_id).show();
			
			$R.openDialogID = _dialog_id;
		};
	
	//	hide
	//	====
		$R.hideDialog = function (_dialog_id)
		{
			//	the dialog
			$('#dialog__'+_dialog_id).hide();
			
			//	the overlay
			$R.$dialogsOverlay.hide();
			
			//	if current, unset
			$R.openDialogID = ($R.openDialogID == _dialog_id ? '' : $R.openDialogID);
		};
		
	
	//	hide open
	//	=========
		$R.hideOpenDialog = function ()
		{
			if ($R.openDialogID > ''); else { return; }

			//	hide
			$R.hideDialog($R.openDialogID);
			
			//	clear current
			$R.openDialogID = '';
		};
	
	
	//	events
	//	======
	
		//	overlay hide current
		$R.$dialogsOverlay.click(function ()
		{
			$R.hideOpenDialog();
			return false;
		});

		//	small dialogs -- hide on click
		$('#dialog__clip__doing div.dialog_cover, #dialog__clip__failed div.dialog_cover').click(function ()
		{
			$R.hideOpenDialog();
			return false;
		});
		
		
	//	curtains
	//	========
		$('#curtains a.curtainCloseButton').click(function(){
			$(this.parentNode).hide();
		});
		
			
			
	//	events
	//	======

		//	click labls => show inputs
		$('#evernote_login__username__label').click(function () { $('#evernote_login__username__label').hide(); $('#evernote_login__username').get(0).focus(); return false; });
		$('#evernote_login__password__label').click(function () { $('#evernote_login__password__label').hide(); $('#evernote_login__password').get(0).focus(); return false; });
	
		//	leave input => show labels
		$('#evernote_login__username').blur(function () { if ($('#evernote_login__username').val() == '') { $('#evernote_login__username__label').show(); } return false; });
		$('#evernote_login__password').blur(function () { if ($('#evernote_login__password').val() == '') { $('#evernote_login__password__label').show(); } return false; });

		//	click errors => show inputs
		$('#evernote_login__username__error').click(function () { $('#evernote_login__container').removeClass('showUsernameError'); $('#evernote_login__username__label').hide(); $('#evernote_login__username').get(0).focus(); return false; });
		$('#evernote_login__password__error').click(function () { $('#evernote_login__container').removeClass('showPasswordError'); $('#evernote_login__password__label').hide(); $('#evernote_login__password').get(0).focus(); return false; });

		//	click button
		$('#evernote_login__button_do').click(function() { $R.evernoteLogin__submit(); return false; });
		
		//	enter to submit
		$('#evernote_login__username, #evernote_login__password').keydown(function (_event)	{ if (_event.keyCode == '13'); else { return; } $R.evernoteLogin__submit(); return false; });
		
		//	tab to password
		$('#evernote_login__username').keydown(function (_event) { if (_event.keyCode == '9'); else { return; } $('#evernote_login__container').removeClass('showPasswordError'); $('#evernote_login__password__label').hide(); $('#evernote_login__password').get(0).focus(); return false; });
		
		
	//	submit
	//	======
		$R.evernoteLogin__submit = function ()
		{
			var 
				_username = $('#evernote_login__username').val(),
				_password = $('#evernote_login__password').val()
			;

			//	remove errors
			$('#evernote_login__container').removeClass('showUsernameError showPasswordError');

			// check username
			switch (true)
			{
				case (!(_username.length >= 1)):
					$('#evernote_login__username__error').html($R.translate('evernote_login__username__error__required'));
					$('#evernote_login__container').addClass('showUsernameError');
					return;
					
				case (!(_username.length <= 64)):
					$('#evernote_login__username__error').html($R.translate('evernote_login__username__error__length'));
					$('#evernote_login__container').addClass('showUsernameError');
					return;
					
				case (!(/^[a-z0-9]([a-z0-9_-]{0,62}[a-z0-9])?$/gi.test(_username))):
					//	using email instead
					if (_username.indexOf('@') > -1 && _username.indexOf(' ') == -1) { break; }
					
					//	do error
					$('#evernote_login__username__error').html($R.translate('evernote_login__username__error__format'));
					$('#evernote_login__container').addClass('showUsernameError');
					return;
			}

			// check password
			switch (true)
			{		
				case (!(_password.length >= 1)):
					$('#evernote_login__password__error').html($R.translate('evernote_login__password__error__required'));
					$('#evernote_login__container').addClass('showPasswordError');
					return;

				case (!(_password.length >= 6)):
				case (!(_password.length <= 64)):
					$('#evernote_login__password__error').html($R.translate('evernote_login__password__error__length'));
					$('#evernote_login__container').addClass('showPasswordError');
					return;
					
				case (!(/^[A-Za-z0-9!#$%&'()*+,.\/:;<=>?@^_`{|}~\[\]\\-]{6,64}$/gi.test(_password))):
					$('#evernote_login__password__error').html($R.translate('evernote_login__password__error__format'));
					$('#evernote_login__container').addClass('showPasswordError');
					return;
			}
			
			//	spinner
			$('#evernote_login__container').addClass('showSpinner');
		
			//	event
			$R.customEvents.dispatch(
				$R.customEvents.names_to_objects['to-extension--evernote-login'], 
				$R.document, 
				$R.win
			);
		};

			
	//	select theme
	//	============
		var __select_theme_from_menu = function (_theme_id)
		{
			//	the themes
			
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __the_themes = 
	{
		'theme-1':
		{
			'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
			'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
			'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
			'text_size': 			__encodeURIComponentForReadable('16px'),
			'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
			'box_width': 			__encodeURIComponentForReadable('36em'),
			'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
			'color_text': 			__encodeURIComponentForReadable('#1f0909'),
			'color_links': 			__encodeURIComponentForReadable('#065588'),
			'text_align': 			__encodeURIComponentForReadable('normal'),
			'base': 				__encodeURIComponentForReadable('theme-1'),
			'footnote_links': 		__encodeURIComponentForReadable('on_print'),
			'large_graphics': 		__encodeURIComponentForReadable('hide_on_print'),
			'custom_css': 			__encodeURIComponentForReadable(''
									+ '#text blockquote { border-color: #bababa; color: #656565; }'
									+ '#text thead { background-color: #dadada; }'
									+ '#text tr:nth-child(even) { background: #e8e7e7; }'
									+ '#text hr { border-color: #c5c5c5; }'
									)
		},
		
		'theme-2':
		{
			'text_font': 			__encodeURIComponentForReadable('Helvetica, Arial'),
			'text_font_header': 	__encodeURIComponentForReadable('Helvetica, Arial'),
			'text_font_monospace': 	__encodeURIComponentForReadable('"Droid Sans Mono"'),
			'text_size': 			__encodeURIComponentForReadable('14px'),
			'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
			'box_width': 			__encodeURIComponentForReadable('42em'),
			'color_background': 	__encodeURIComponentForReadable('#fff'),
			'color_text': 			__encodeURIComponentForReadable('#333'),
			'color_links': 			__encodeURIComponentForReadable('#090'),
			'text_align': 			__encodeURIComponentForReadable('normal'),
			'base': 				__encodeURIComponentForReadable('theme-2'),
			'footnote_links': 		__encodeURIComponentForReadable('on_print'),
			'large_graphics': 		__encodeURIComponentForReadable('hide_on_print'),
			'custom_css': 			__encodeURIComponentForReadable(''
									+ '#text h1 { color: #000; }'
									+ '#text h2, #text h3, #text h4, #text h5, #text h6 { color: #444; }'
									+ '#text blockquote { border-color: #d1d1d1; }'
									+ '#text thead { background-color: #444; color: #fff; }'
									+ '#text tr:nth-child(even) { background: #d1d1d1; }'
									+ '#text hr { border-color: #000; }'
									)
		},
		
		'theme-3':
		{
			'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
			'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
			'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
			'text_size': 			__encodeURIComponentForReadable('16px'),
			'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
			'box_width': 			__encodeURIComponentForReadable('36em'),
			'color_background': 	__encodeURIComponentForReadable('#2d2d2d'),
			'color_text': 			__encodeURIComponentForReadable('#e3e3e3'),
			'color_links': 			__encodeURIComponentForReadable('#e3e3e3'),
			'text_align': 			__encodeURIComponentForReadable('normal'),
			'base': 				__encodeURIComponentForReadable('theme-3'),
			'footnote_links': 		__encodeURIComponentForReadable('on_print'),
			'large_graphics': 		__encodeURIComponentForReadable('hide_on_print'),
			'custom_css': 			__encodeURIComponentForReadable(''
									+ '#text a:link { -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; -o-transition: all 0.3s ease; }'
									+ '#text a:hover, #text a:active {	color: #44bde8; }'
									+ '#text blockquote { color: #c1bfbf; border-color: #c1bfbf; }'
									+ '#text thead { background-color: #4f4f4f; }'
									+ '#text tr:nth-child(even) { background: #404040; }'
									+ '#text hr { border-color: #c5c5c5; }'
									)
		}
	};
		
			//	set var
			$R.vars['theme'] = _theme_id;

			//	event
			$R.customEvents.dispatch(
				$R.customEvents.names_to_objects['to-extension--select-'+_theme_id], 
				$R.document, 
				$R.win
			);
			
			//	set theme
			for (var _v in __the_themes[_theme_id])
				{ $R.options[_v] = __the_themes[_theme_id][_v];	}
			
			//	apply options
			$R.applyOptions();
			
			//	deselect all -- will be selected for each item
			$('#settings__3 a.themeBox, #settings__4 a.themeBox').removeClass('selected');
			
			//	deselct font size; select medium
			$('#settings__3__fontSizeButtons a.fontSizeButton, #settings__4__fontSizeButtons a.fontSizeButton').removeClass('selected');
			$('#settings__3__fontSize__medium, #settings__4__fontSize__medium').addClass('selected');			
		};
		
		var __select_theme_from_menu__custom = function ()
		{
			//	the themes
			
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __the_themes = 
	{
		'theme-1':
		{
			'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
			'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
			'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
			'text_size': 			__encodeURIComponentForReadable('16px'),
			'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
			'box_width': 			__encodeURIComponentForReadable('36em'),
			'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
			'color_text': 			__encodeURIComponentForReadable('#1f0909'),
			'color_links': 			__encodeURIComponentForReadable('#065588'),
			'text_align': 			__encodeURIComponentForReadable('normal'),
			'base': 				__encodeURIComponentForReadable('theme-1'),
			'footnote_links': 		__encodeURIComponentForReadable('on_print'),
			'large_graphics': 		__encodeURIComponentForReadable('hide_on_print'),
			'custom_css': 			__encodeURIComponentForReadable(''
									+ '#text blockquote { border-color: #bababa; color: #656565; }'
									+ '#text thead { background-color: #dadada; }'
									+ '#text tr:nth-child(even) { background: #e8e7e7; }'
									+ '#text hr { border-color: #c5c5c5; }'
									)
		},
		
		'theme-2':
		{
			'text_font': 			__encodeURIComponentForReadable('Helvetica, Arial'),
			'text_font_header': 	__encodeURIComponentForReadable('Helvetica, Arial'),
			'text_font_monospace': 	__encodeURIComponentForReadable('"Droid Sans Mono"'),
			'text_size': 			__encodeURIComponentForReadable('14px'),
			'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
			'box_width': 			__encodeURIComponentForReadable('42em'),
			'color_background': 	__encodeURIComponentForReadable('#fff'),
			'color_text': 			__encodeURIComponentForReadable('#333'),
			'color_links': 			__encodeURIComponentForReadable('#090'),
			'text_align': 			__encodeURIComponentForReadable('normal'),
			'base': 				__encodeURIComponentForReadable('theme-2'),
			'footnote_links': 		__encodeURIComponentForReadable('on_print'),
			'large_graphics': 		__encodeURIComponentForReadable('hide_on_print'),
			'custom_css': 			__encodeURIComponentForReadable(''
									+ '#text h1 { color: #000; }'
									+ '#text h2, #text h3, #text h4, #text h5, #text h6 { color: #444; }'
									+ '#text blockquote { border-color: #d1d1d1; }'
									+ '#text thead { background-color: #444; color: #fff; }'
									+ '#text tr:nth-child(even) { background: #d1d1d1; }'
									+ '#text hr { border-color: #000; }'
									)
		},
		
		'theme-3':
		{
			'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
			'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
			'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
			'text_size': 			__encodeURIComponentForReadable('16px'),
			'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
			'box_width': 			__encodeURIComponentForReadable('36em'),
			'color_background': 	__encodeURIComponentForReadable('#2d2d2d'),
			'color_text': 			__encodeURIComponentForReadable('#e3e3e3'),
			'color_links': 			__encodeURIComponentForReadable('#e3e3e3'),
			'text_align': 			__encodeURIComponentForReadable('normal'),
			'base': 				__encodeURIComponentForReadable('theme-3'),
			'footnote_links': 		__encodeURIComponentForReadable('on_print'),
			'large_graphics': 		__encodeURIComponentForReadable('hide_on_print'),
			'custom_css': 			__encodeURIComponentForReadable(''
									+ '#text a:link { -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; -o-transition: all 0.3s ease; }'
									+ '#text a:hover, #text a:active {	color: #44bde8; }'
									+ '#text blockquote { color: #c1bfbf; border-color: #c1bfbf; }'
									+ '#text thead { background-color: #4f4f4f; }'
									+ '#text tr:nth-child(even) { background: #404040; }'
									+ '#text hr { border-color: #c5c5c5; }'
									)
		}
	};
		
			//	set var
			$R.vars['theme'] = 'custom';

			//	event
			$R.customEvents.dispatch(
				$R.customEvents.names_to_objects['to-extension--select-theme-custom'], 
				$R.document, 
				$R.win
			);
			
			//	set theme
			$R.vars['custom_theme_options'].replace
			(
				/\[\[=(.*?)\]\[=(.*?)\]\]/gi,
				function (_match, _name, _value) { $R.options[_name] = _value; }
			);

			//	apply options
			$R.applyOptions();
			
			//	deselect all -- will be selected for each item
			$('#settings__3 a.themeBox, #settings__4 a.themeBox').removeClass('selected');

			//	deselct font size; select medium
			$('#settings__3__fontSizeButtons a.fontSizeButton, #settings__4__fontSizeButtons a.fontSizeButton').removeClass('selected');
		};

		
	//	select size
	//	===========
		var __select_size_from_menu = function (_size)
		{
			//	the sizes
			
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

			
	var __the_sizes = 
	{
		'small':
		{
			'theme-1': '12px',
			'theme-2': '12px',
			'theme-3': '12px',
			'custom':  '12px'
		},
	
		'medium':
		{
			'theme-1': '16px',
			'theme-2': '16px',
			'theme-3': '16px',
			'custom':  '16px'
		},
		
		'large':
		{
			'theme-1': '20px',
			'theme-2': '20px',
			'theme-3': '20px',
			'custom':  '20px'
		}
	};


			//	event
			$R.customEvents.dispatch(
				$R.customEvents.names_to_objects['to-extension--select-size-'+_size], 
				$R.document, 
				$R.win
			);
			
			//	apply size
			$R.options['text_size'] = __the_sizes[_size][$R.vars['theme']];
			$R.applyOptions();
			
			//	deselect all
			//	will be selected for each item
			$('#settings__3__fontSizeButtons a.fontSizeButton, #settings__4__fontSizeButtons a.fontSizeButton').removeClass('selected');
		};
		

	//	events
	//	======
	
		//	theme boxes		
		$('#settings__3__1, #settings__4__1').click(function () { __select_theme_from_menu('theme-1'); $('#settings__3__1, #settings__4__1').addClass('selected'); });
		$('#settings__3__2, #settings__4__2').click(function () { __select_theme_from_menu('theme-2'); $('#settings__3__2, #settings__4__2').addClass('selected'); });
		$('#settings__3__3, #settings__4__3').click(function () { __select_theme_from_menu('theme-3'); $('#settings__3__3, #settings__4__3').addClass('selected'); });	

		$('#settings__4__custom').click(function () { __select_theme_from_menu__custom(); $('#settings__4__custom').addClass('selected'); });
		
		//	size buttons
		$('#settings__3__fontSize__small, #settings__4__fontSize__small').click(function ()  { __select_size_from_menu('small');  $('#settings__3__fontSize__small, #settings__4__fontSize__small').addClass('selected'); });
		$('#settings__3__fontSize__medium, #settings__4__fontSize__medium').click(function () { __select_size_from_menu('medium'); $('#settings__3__fontSize__medium, #settings__4__fontSize__medium').addClass('selected'); });
		$('#settings__3__fontSize__large, #settings__4__fontSize__large').click(function ()  { __select_size_from_menu('large');  $('#settings__3__fontSize__large, #settings__4__fontSize__large').addClass('selected'); });

		
	//	initially selected
	//	==================
		(function()
		{
			//	the sizes
			
	var __the_sizes = 
	{
		'small':
		{
			'theme-1': '12px',
			'theme-2': '12px',
			'theme-3': '12px',
			'custom':  '12px'
		},
	
		'medium':
		{
			'theme-1': '16px',
			'theme-2': '16px',
			'theme-3': '16px',
			'custom':  '16px'
		},
		
		'large':
		{
			'theme-1': '20px',
			'theme-2': '20px',
			'theme-3': '20px',
			'custom':  '20px'
		}
	};


			//	theme
			switch ($R.vars['theme'])
			{
				case 'theme-1': $('#settings__3__1, #settings__4__1').addClass('selected'); break;
				case 'theme-2': $('#settings__3__2, #settings__4__2').addClass('selected'); break;
				case 'theme-3': $('#settings__3__3, #settings__4__3').addClass('selected'); break;
				case 'custom':  $('#settings__4__custom').addClass('selected'); break;
			}
			
			//	size
			switch ($R.options['text_size'])
			{
				case __the_sizes['small'][$R.vars['theme']]:  $('#settings__3__fontSize__small, #settings__4__fontSize__small').addClass('selected');   break;
				case __the_sizes['medium'][$R.vars['theme']]: $('#settings__3__fontSize__medium, #settings__4__fontSize__medium').addClass('selected'); break;
				case __the_sizes['large'][$R.vars['theme']]:  $('#settings__3__fontSize__large, #settings__4__fontSize__large').addClass('selected');   break;
			}
		})();


		//	menu
		//	====
			
	//	var
	//	===
		$R.menu_functions = {};
	
	
	//	general
	//	=======
		$R.menu_functions['close'] = function () { $R.hide(); return false; };
		$R.menu_functions['print'] = function () { window.print(); return false; };

		
	//	by target -- overriden by boomarklet and extension code
	//	=========
		$R.menu_functions['settings'] = function () { };
		$R.menu_functions['clip_to_evernote'] = function () { };

			
	$R.menu_functions['settings'] = function ()
	{
		$R.showDialog(($R.vars['custom_theme_options'] > '' ? 'settings__4' : 'settings__3'));
		return false;
	};
	
	$R.menu_functions['clip_to_evernote'] = function ()
	{
		//	waiting
		$R.showDialog('clip__doing');

		//	event
		$R.customEvents.dispatch(
			$R.customEvents.names_to_objects['to-extension--evernote-clip'], 
			$R.document, 
			$R.win
		);
		
		return false;
	};

			
		
		//	custom events
		//	=============
			
	(function()
	{
		//	include events
			
	/*
		first three variables will be defined
	*/

	var 
		__custom_events__names_to_keys = {},
		__custom_events__keys_to_names = {},
		__custom_events__names_to_objects = {},
		
		__custom_events =
		[
			['to-extension--open-settings', 				'click-110-120-130-140-1-1-1'],
			['to-extension--open-settings-advanced', 		'click-111-121-131-141-1-1-1'],
			
			['to-extension--evernote-clip', 				'click-210-220-230-240-1-1-1'],
			['to-extension--evernote-login', 				'click-310-320-330-340-1-1-1'],

			['to-extension--select-theme-1', 				'click-511-521-531-541-1-1-1'],
			['to-extension--select-theme-2', 				'click-512-522-532-542-1-1-1'],
			['to-extension--select-theme-3', 				'click-513-523-533-543-1-1-1'],
			['to-extension--select-theme-custom', 			'click-514-524-534-544-1-1-1'],

			['to-extension--select-size-small', 			'click-611-621-631-641-1-1-1'],
			['to-extension--select-size-medium', 			'click-612-622-632-642-1-1-1'],
			['to-extension--select-size-large', 			'click-613-623-633-643-1-1-1'],
			
			['to-browser--evernote-login-show', 			'click-411-421-431-441-1-1-1'],
			['to-browser--evernote-login-failed', 			'click-412-422-432-442-1-1-1'],
			['to-browser--evernote-login-failed--username', 'click-413-423-433-443-1-1-1'],
			['to-browser--evernote-login-failed--password', 'click-414-424-434-444-1-1-1'],
			['to-browser--evernote-login-successful', 		'click-415-425-435-445-1-1-1'],

			['to-browser--evernote-clip-successful', 		'click-711-721-731-741-1-1-1'],
			['to-browser--evernote-clip-failed', 			'click-712-722-732-742-1-1-1']
		]
	;

	for (var i=0,_i=__custom_events.length,e=false,k=false; i<_i; i++)
	{
		e = __custom_events[i];
		k = e[1].split('-');
		
		__custom_events__names_to_keys[e[0]] = e[1];
		__custom_events__keys_to_names[e[1]] = e[0];
		__custom_events__names_to_objects[e[0]] =
		{
			'_1': k[1],
			'_2': k[2],
			'_3': k[3],
			'_4': k[4],
			'_5': (k[5] == 1 ? true : false),
			'_6': (k[6] == 1 ? true : false),
			'_7': (k[7] == 1 ? true : false)
		};
	}
	
	var __custom_events__get_key = function (_event)
	{
		return 'click'
			+'-'+_event.screenX
			+'-'+_event.screenY
			+'-'+_event.clientX
			+'-'+_event.clientY
			+'-'+(_event.ctrlKey ? 1 : 0)
			+'-'+(_event.altKey ? 1 : 0)
			+'-'+(_event.shiftKey ? 1 : 0)
		;
	};
	
	var __custom_events__dispatch = function (_custom_event_object, _document, _window)
	{
		var _e = _document.createEvent("MouseEvents");
		
		_e.initMouseEvent(
			"click", true, true, _window, 0, 
			_custom_event_object['_1'], _custom_event_object['_2'], _custom_event_object['_3'], _custom_event_object['_4'], 
			_custom_event_object['_5'], _custom_event_object['_6'], _custom_event_object['_7'], 
			false, 0, null
		);
		
		_document.dispatchEvent(_e);
	};
	

		//	set custom events
		$R.customEvents = {
			'names_to_keys': __custom_events__names_to_keys,
			'keys_to_names': __custom_events__keys_to_names,
			'names_to_objects': __custom_events__names_to_objects,
			'get_key': __custom_events__get_key,
			'dispatch':  __custom_events__dispatch
		};
	})();
	
	//	listen for events -- on click
	$R.document.addEventListener('click', function(_event)
	{
		var 
			_event_key = $R.customEvents.get_key(_event),
			_event_name = $R.customEvents.keys_to_names[_event_key],
			_stop = false
		;
		
		switch (_event_name)
		{
			case 'to-browser--evernote-login-show':
				
				//	clear login
				$('#evernote_login__container').removeClass('showSpinner showUsernameError showPasswordError');

				//	clear fields
				$('#evernote_login__username').val('');
				$('#evernote_login__username').blur();
				$('#evernote_login__password').val('');
				$('#evernote_login__password').blur();
				
				// show login
				$R.showDialog('clip__login');
				
				//	end
				_stop = true;
				break;
			
			
			case 'to-browser--evernote-login-failed':
				
				//	set error
				$('#evernote_login__password__error').html($R.translate('evernote_login__general__error'));
				
				//	show error
				$('#evernote_login__container').removeClass('showSpinner').addClass('showPasswordError');
				
				//	end
				_stop = true;
				break;
			
			
			case 'to-browser--evernote-login-failed--username':
				
				//	set error
				$('#evernote_login__username__error').html($R.translate('evernote_login__username__error__invalid'));
				
				//	show error
				$('#evernote_login__container').removeClass('showSpinner').addClass('showUsernameError');
				
				//	end
				_stop = true;
				break;
			
			
			case 'to-browser--evernote-login-failed--password':
				
				//	set error
				$('#evernote_login__password__error').html($R.translate('evernote_login__password__error__invalid'));
				
				//	show error
				$('#evernote_login__container').removeClass('showSpinner').addClass('showPasswordError');
				
				//	end
				_stop = true;
				break;
			
			
			case 'to-browser--evernote-login-successful':
				
				//	waiting
				$R.showDialog('clip__doing');
				
				//	event
				$R.customEvents.dispatch(
					$R.customEvents.names_to_objects['to-extension--evernote-clip'], 
					$R.document, 
					$R.win
				);
				
				//	end
				_stop = true;
				break;
			
			
			case 'to-browser--evernote-clip-successful':

				//	notify
				window.setTimeout(function ()
				{
					$('#dialog__clip__doing').fadeOut(500, 
						function () {
							$R.$sidebar.addClass('clipDone');
						}
					); 
				}, 1000);
				
				//	end
				_stop = true;
				break;
		}
	
		if (_stop)
		{
			_event.stopPropagation();
			_event.preventDefault();
		}
	
	}, true);


		//	misc ux
		//	=======
			
	//	good ux
	//	=======
		$R.$fitts.click(function(){ $R.hide(); return false; });
		$R.$background.dblclick(function(){ $R.hide(); return false; });

	
	//	Keys, on Readable window
	//	========================
		$(window).keydown(function (_event)
		{
			//	Readable visible?
			if ($R.visible); else { return; }

			//	include key combo detection
				
	/*
		_event must be defined
		_key_combo and _key_code will be defined at end of code
	*/

	var _key_code = 'NONE';
	switch (true)
	{
		case (_event.keyCode && (_event.keyCode >= 65 && _event.keyCode <= 90)):
			_key_code = String.fromCharCode(_event.keyCode).toUpperCase();
			break;
			
		case (_event.keyCode == 27):	_key_code = 'Escape';		break;
		case (_event.keyCode == 37):	_key_code = 'Left Arrow';	break;
		case (_event.keyCode == 39):	_key_code = 'Right Arrow';	break;
		case (_event.keyCode == 38):	_key_code = 'Up Arrow';		break;
		case (_event.keyCode == 40):	_key_code = 'Down Arrow';	break;
	}

	//	get
	//	===
		var _modifierKeys = (_event.originalEvent ? _event.originalEvent : _event);
		//	jQuery screws up -- fucks up the metaKey property badly
		
		var _key_combo = ''
			+ (_modifierKeys.ctrlKey ? 'Control + ' : '')
			+ (_modifierKeys.shiftKey ? 'Shift + ' : '')
			+ (_modifierKeys.altKey ? 'Alt + ' : '')
			+ (_modifierKeys.metaKey ? 'Command + ' : '')
			+ _key_code
		;

	//	needs a modifier -- if not just Escape key
	//	================
		if ((_key_code != 'Escape') && (_key_code == _key_combo))
		{
			_key_code = 'NONE';
			_key_combo = 'NONE';
		}

			
			//	stop
			var _stop = false;
			
			//	which?
			switch (true)
			{
				//	print
				case (_key_combo == 'Control + P' || _key_combo == 'Command + P'):
					window.print();
					_stop = true;
					break;
					
				//	hide
				case (_key_combo == 'Escape'):
				case ($R.vars && (_key_combo == $R.vars['keys_activation'])):
				case (_key_combo == 'Control + Alt + Left Arrow'):
				case (_key_combo == 'Control + Command + Left Arrow'):
					$R.hide();
					_stop = true;
					break;
					
				//	clip
				case ($R.vars && (_key_combo == $R.vars['keys_clip'])):
					$R.menu_functions['clip_to_evernote'].call();
					_stop = true;
					break;
			}
			
			//	stop
			if (_stop)
			{
				_event.preventDefault();
				_event.stopPropagation();
			}
		});
	
	
	//	scroll-back
	//	===========
		$R.scrollPosition = 0;
		$R.goToNamedAnchor = function (_anchor)
		{
			var _$e = $("[id='"+_anchor+"'], [name='"+_anchor+"']");
			if (_$e.length > 0); else { return; }
			
			$R.scrollPosition = $(window).scrollTop();
			$('#bottom_scroll_back').show();
			
			$(window).scrollTop(_$e.offset().top);
		};
	

		//	rtl
		//	===
			
	//	var
	//	===
		$R.rtl = false;
	

	//	functions
	//	=========
		$R.makeRTL = function ()
		{
			$('#curtain__rtl__radio__rtl').get(0).checked = true;
			$('#curtain__rtl__radio__ltr').get(0).checked = false;
			
			$R.rtl = true;
			$('html')
				.attr('dir', 'rtl')
				.addClass('couldBeRTL')
				.addClass('rtl');
		};
		
		$R.makeNotRTL = function ()
		{
			$('#curtain__rtl__radio__rtl').get(0).checked = false;
			$('#curtain__rtl__radio__ltr').get(0).checked = true;

			$R.rtl = false;
			$('html')
				.attr('dir', '')
				.removeClass('rtl');
		};

		
	//	detect
	//	======
		(function ()
		{
			//	definitely rtl
			$R.$document.find('html, body').each(function (_i, _e)
			{
				switch (true) {
					case ($(_e).attr('dir') == 'rtl'):
					case ($(_e).css('direction') == 'rtl'):

					case ($(_e).attr('lang') == 'he'):
					case ($(_e).attr('lang') == 'he-il'):
					case ($(_e).attr('lang') == 'ar'):
					case ($(_e).attr('lang') == 'ur'):

						$R.makeRTL();
						return false;
				}
			});
		
			//	maybe rtl
			if ((!$R.rtl) && $R.$document.find("div[dir='rtl'], table[dir='rtl'], td[dir='rtl']").length > 0)
				{ $('html').addClass('couldBeRTL'); }
		})();
		
		
	//	events
	//	======
		$('#curtain__rtl__radio__rtl').change(function(){ $R.makeRTL(); return false; });
		$('#curtain__rtl__radio__ltr').change(function(){ $R.makeNotRTL(); return false; });

		
		//	measure text
		//	============
			
	//	asian languages
	//	===============
	//	http://msdn.microsoft.com/en-us/goglobal/bb688158
	//	http://en.wikipedia.org/wiki/Japanese_punctuation
	//	http://en.wikipedia.org/wiki/Japanese_typographic_symbols
	//	http://unicode.org/charts/PDF/U3000.pdf
	//	CJK: Chnese, Japanese, Korean -- HAN

	//	length
	//	======
		$R.measureText__getTextLength = function (_the_text)
		{
			var _text = _the_text;
			
				_text = _text.replace(/[\s\n\r]+/gi, '');
				//_text = _text.replace(/\d+/, '');
				
			return _text.length;
		};
	
	
	//	word count
	//	==========
		$R.measureText__getWordCount = function (_the_text)
		{
			var _text = _the_text;
			
			//	do stuff
			//	========
			
				_text = _text.replace(/[\s\n\r]+/gi, ' ');

				_text = _text.replace(/([.,?!:;()\[\]'""-])/gi, ' $1 ');
				
				_text = _text.replace(/([\u3000])/gi, 				'[=words(1)]');
				_text = _text.replace(/([\u3001])/gi, 				'[=words(2)]');
				_text = _text.replace(/([\u3002])/gi, 				'[=words(4)]');
				_text = _text.replace(/([\u301C])/gi, 				'[=words(2)]');
				_text = _text.replace(/([\u2026|\u2025])/gi, 		'[=words(2)]');
				_text = _text.replace(/([\u30FB\uFF65])/gi, 		'[=words(1)]');
				_text = _text.replace(/([\u300C\u300D])/gi, 		'[=words(1)]');
				_text = _text.replace(/([\u300E\u300F])/gi,			'[=words(1)]');
				_text = _text.replace(/([\u3014\u3015])/gi,			'[=words(1)]');
				_text = _text.replace(/([\u3008\u3009])/gi,			'[=words(1)]');
				_text = _text.replace(/([\u300A\u300B])/gi, 		'[=words(1)]');
				_text = _text.replace(/([\u3010\u3011])/gi, 		'[=words(1)]');
				_text = _text.replace(/([\u3016\u3017])/gi, 		'[=words(1)]');
				_text = _text.replace(/([\u3018\u3019])/gi, 		'[=words(1)]');
				_text = _text.replace(/([\u301A\u301B])/gi, 		'[=words(1)]');
				_text = _text.replace(/([\u301D\u301E\u301F])/gi, 	'[=words(1)]');
				_text = _text.replace(/([\u30A0])/gi, 				'[=words(1)]');

				
			//	count
			//	=====
				
				var 
					_count = 0,
					_words_match = _text.match(/([^\s\d]{3,})/gi)
				;	
			
				//	add match
				_count += (_words_match != null ? _words_match.length : 0);
			
				//	add manual count
				_text.replace(/\[=words\((\d)\)\]/, function (_match, _plus) { _count += (5 * parseInt(_plus)); });
			
				//$R.log(_count);
			
			//	return
			//	======
				return _count;
		};

		
		//	content
		//	=======
			
	$R.footnotedLinksCount = 0;
	
	$R.getContent = function ()
	{
		//	homepage?
		if ($R.win.location.href == ($R.win.location.protocol + '//' + $R.win.location.host + '/'))
			{ $('html').addClass('showTips'); }
		
		//	selection or whole
		switch (true)
		{
			case ($R.getContent__manualSelection()):
			case ($R.getContent__find()):
				break;
				
			default:
				break;
		}

		//	debug
		$R.printDebugOutput();

		//	show content
		$R.showContent();
	};

			
	//	options
	//	=======
		$R.parsingOptions =
		{
			'_elements_ignore': 			'|button|input|select|textarea|optgroup|command|datalist|--|frame|frameset|noframes|--|style|link|script|noscript|--|canvas|applet|map|--|marquee|area|base|',
			'_elements_ignore_tag': 		'|form|fieldset|details|dir|--|center|font|span|',
			'_elements_self_closing': 		'|br|hr|--|img|--|col|--|source|--|embed|param|--|iframe|',
			'_elements_visible': 			'|article|section|--|ul|ol|li|dd|--|table|tr|td|--|div|--|h1|h2|h3|h4|h5|h6|',
			'_elements_too_much_content': 	'|b|i|em|strong|--|h1|h2|h3|h4|h5|--|td|',
			'_elements_container': 			'|body|--|article|section|--|div|--|td|--|li|dd|',
			'_elements_link_density':		'|div|--|table|ul|ol|--|section|aside|header|',
			'_elements_floating':			'|div|--|table|',
			'_elements_above_target':		'|br|--|ul|ol|dl|',
			'_elements_keep_attributes':
			{
				'a': 		['href', 'title', 'name'],
				'img': 		['src', 'width', 'height', 'alt', 'title'],

				'video': 	['src', 'width', 'height', 'poster', 'audio', 'preload', 'autoplay', 'loop', 'controls'],
				'audio': 	['src', 'preload', 'autoplay', 'loop', 'controls'],		 
				'source': 	['src', 'type'],
					 
				'object': 	['data', 'type', 'width', 'height', 'classid', 'codebase', 'codetype'],						
				'param': 	['name', 'value'],
				'embed': 	['src', 'type', 'width', 'height', 'flashvars', 'allowscriptaccess', 'allowfullscreen', 'bgcolor'],
					
				'iframe':	['src', 'width', 'height', 'frameborder', 'scrolling'],
					
				'td':		['colspan', 'rowspan'],			
				'th':		['colspan', 'rowspan']
			}
		};

		
	//	next page keywords -- (?? charCodeAt() > 127)
	//	==================
		$R.nextPage__captionKeywords = 
		[
			/* english */
			'next page', 'next',
			
			/* german */
			'vorw&#228;rts', 'weiter',

			/* japanese */
			'&#27425;&#12408;'
		];

		$R.nextPage__captionKeywords__not =
		[
			/* english */
			'article', 'story', 'post', 'comment', 'section', 'chapter'
			
			
		];
		
		
	//	skip links
	//	==========
		$R.skipStuffFromDomains__links = 
		[
			'doubleclick.net',
			'adbrite.com',
			'adbureau.net',
			'admob.com',
			'bannersxchange.com',
			'buysellads.com',
			'impact-ad.jp',
			'atdmt.com',
			'advertising.com'
		];
		
		
	//	skip images
	//	===========
		$R.skipStuffFromDomain__images = 
		[
			'googlesyndication.com',
			'.2mdn.net',
			'de17a.com',
			'content.aimatch.com',
			'bannersxchange.com',
			'buysellads.com',
			'impact-ad.jp',
			'atdmt.com',
			'advertising.com'
		];

		
	//	keep video
	//	==========
	
		$R.keepStuffFromDomain__video = 
		[
			'youtube.com',
			'vimeo.com',
			'hulu.com',
			'yahoo.com',
			'flickr.com',
			'newsnetz.ch'
		];


			
	$R.getContent__exploreNodeAndGetStuff = function (_nodeToExplore, _justExploring)
	{
		var	
			_global__element_index = 0,
			
			_global__inside_link = false,
			_global__inside_link__element_index = 0,
			
			_global__length__above_plain_text = 0,
			_global__count__above_plain_words = 0,
			_global__length__above_links_text = 0,
			_global__count__above_links_words = 0,
			_global__above__plain_text = '',
			_global__above__links_text = '',
			
			_return__containers = [],
			_return__candidates = [],
			_return__links = []
		;
		
		//	recursive function
		//	==================
		var _recursive = function (_node)
		{
			//	increment index
			//	starts with 1
			_global__element_index++;
		
			var 
				_tag_name = (_node.nodeType === 3 ? '#text' : ((_node.nodeType === 1 && _node.tagName && _node.tagName > '') ? _node.tagName.toLowerCase() : '#invalid')),
				_result =
				{
					'__index': _global__element_index, 
					'__node': _node, 
					
					
					'_is__container': 		($R.parsingOptions._elements_container.indexOf('|'+_tag_name+'|') > -1),
					'_is__candidate': 		false,
					'_is__text': 			false,
					'_is__link': 			false,
					'_is__link_skip': 		false,
					'_is__image_small': 	false,
					'_is__image_medium': 	false,
					'_is__image_large': 	false,
					'_is__image_skip': 		false,
					
					'_debug__above__plain_text': _global__above__plain_text,
					'_debug__above__links_text': _global__above__links_text,
					
					
					'_length__above_plain_text': _global__length__above_plain_text,
					'_count__above_plain_words': _global__count__above_plain_words,
					
					'_length__above_links_text': _global__length__above_links_text,
					'_count__above_links_words': _global__count__above_links_words,
				
					'_length__above_all_text': 	(_global__length__above_plain_text + _global__length__above_links_text),
					'_count__above_all_words': 	(_global__count__above_plain_words + _global__count__above_links_words),
				
					'_length__plain_text': 0,
					'_count__plain_words': 0,
					
					'_length__links_text': 0,
					'_count__links_words': 0,
					
					'_length__all_text': 0,
					'_count__all_words': 0,

					
					'_count__containers': 0,
					'_count__candidates': 0,

					'_count__links': 0,
					'_count__links_skip': 0,
					
					'_count__images_small': 0,
					'_count__images_medium': 0,
					'_count__images_large': 0,
					'_count__images_skip': 0
				};

				
			//	fast return
			//	===========
				switch (true)
				{
					case ((_tag_name == '#invalid')):
					case (($R.parsingOptions._elements_ignore.indexOf('|'+_tag_name+'|') > -1)):
						return;
						
					case (($R.parsingOptions._elements_visible.indexOf('|'+_tag_name+'|') > -1)):
							
	//	included inline
	//	_node must be defined
	//	will return, if node is hidden

	switch (true)
	{
		case (_node.offsetWidth > 0):
		case (_node.offsetHeight > 0):
			break;
			
		default:
			switch (true)
			{
				case (_node.offsetLeft > 0):
				case (_node.offsetTop > 0):
					break;
					
				default:
					return;
			}
			break;
	}

						break;
					
					//	self-closing -- with some exceptions
					case ($R.parsingOptions._elements_self_closing.indexOf('|'+_tag_name+'|') > -1):
						switch (true)
						{
							case ((_tag_name == 'img')): break;
							default: return;
						}
						break;
				}
			
			
			//	do stuff
			//	========
				switch (true)
				{
					//	text node
					//	=========
						case ((_tag_name == '#text')):
							//	mark
							_result._is__text = true;
						
							//	get
							var _nodeText = _node.nodeValue;
							
							//	result
							_result._length__plain_text = $R.measureText__getTextLength(_nodeText);
							_result._count__plain_words = $R.measureText__getWordCount(_nodeText);
							
							if (_global__inside_link)
							{
								_global__length__above_links_text += _result._length__plain_text;
								_global__count__above_links_words += _result._count__plain_words;					
								if (false && $R.debug) { _global__above__links_text += ' ' + _nodeText; }
							}
							else
							{
								_global__length__above_plain_text += _result._length__plain_text;
								_global__count__above_plain_words += _result._count__plain_words;					
								if (false && $R.debug) { _global__above__plain_text += ' ' + _nodeText; }
							}
							
							//	return text
							return _result;
				
				
					//	link
					//	====
						case (_tag_name == 'a'):
							var _href = _node.href;
							
							//	sanity
							if (_href > ''); else { break; }
							if (_href.indexOf); else { break; }
							
							_result._is__link = true;

							//	skip
							for (var i=0, _i=$R.skipStuffFromDomains__links.length; i<_i; i++)
							{
								if (_node.href.indexOf($R.skipStuffFromDomains__links[i]) > -1)
									{ _result._is__link_skip = true; break; }
							}
							
							//	inside link
							if (_global__inside_link); else
							{
								_global__inside_link = true;
								_global__inside_link__element_index = _result.__index;
							}
							
							//	done
							_return__links.push(_result);
							break;
						
						
					//	image
					//	=====
						case (_tag_name == 'img'):

							//	skip
							//	====
								if (_node.src && _node.src.indexOf)
								{
									for (var i=0, _i=$R.skipStuffFromDomain__images.length; i<_i; i++)
									{
										if (_node.src.indexOf($R.skipStuffFromDomain__images[i]) > -1)
											{ _result._is__image_skip = true; break; }
									}
								}

							//	size
							//	====
								var	_width = $(_node).width(), _height = $(_node).height();
								switch (true)
								{
									case ((_width * _height) >= 50000):
									case ((_width >= 350) && _height >= 75):
										_result._is__image_large = true;
										break;
									
									case ((_width * _height) >= 20000):
									case ((_width >= 150) && (_height >= 150)):
										_result._is__image_medium = true;
										break;
								
									case ((_width <= 5) && (_height <= 5)):
										_result._is__image_skip = true;
										break;

									default:
										_result._is__image_small = true;
										break;
								}
							
							break;
				}
			
		
			//	child nodes
			//	===========
				for (var i=0, _i=_node.childNodes.length; i<_i; i++)
				{
					var 
						_child = _node.childNodes[i],
						_child_result = _recursive(_child)
					;
					
					//	if false, continue
					//	==================
						if (_child_result); else { continue; }

					
					//	add to result
					//	=============
						_result._count__links += 			_child_result._count__links + 			(_child_result._is__link ? 1 : 0);
						_result._count__links_skip += 		_child_result._count__links_skip + 		(_child_result._is__link_skip ? 1 : 0);
						
						_result._count__images_small += 	_child_result._count__images_small + 	(_child_result._is__image_small ? 1 : 0);
						_result._count__images_medium += 	_child_result._count__images_medium + 	(_child_result._is__image_medium ? 1 : 0);
						_result._count__images_large += 	_child_result._count__images_large + 	(_child_result._is__image_large ? 1 : 0);
						_result._count__images_skip += 		_child_result._count__images_skip + 	(_child_result._is__image_skip ? 1 : 0);
			
						_result._count__containers += 		_child_result._count__containers + 		(_child_result._is__container ? 1 : 0);
						_result._count__candidates += 		_child_result._count__candidates + 		(_child_result._is__candidate ? 1 : 0);

						_result._length__all_text += 		_child_result._length__plain_text + 	_child_result._length__links_text;
						_result._count__all_words += 		_child_result._count__plain_words + 	_child_result._count__links_words;

						//	plain text / link text
						//	======================
							switch (true)
							{
								case (_child_result._is__link):
									//	no text to add
									_result._length__links_text += (_child_result._length__plain_text + _child_result._length__links_text);
									_result._count__links_words += (_child_result._count__plain_words + _child_result._count__links_words);
									break;
									
								default:
									_result._length__plain_text += 			_child_result._length__plain_text;
									_result._count__plain_words += 			_child_result._count__plain_words;
									_result._length__links_text += 			_child_result._length__links_text;
									_result._count__links_words += 			_child_result._count__links_words;
									break;
							}
				}

			
			//	after child nodes
			//	=================
			
				//	mark as not in link anymore
				//	===========================
					if (true
						&& (_result._is__link) 
						&& (_global__inside_link__element_index == _result.__index)
					) {
						_global__inside_link = false;
						_global__inside_link__element_index = 0;
					}
			
			
			//	add to containers
			//	=================
				if (_result._is__container || ((_result.__index == 1) && (_justExploring == true)))
				{
					//	add to containers
					_return__containers.push(_result);
				
					//	add to candidates
					if (_justExploring); else
					{
						switch (true)
						{
							case (_result._length__plain_text == 0): 							/* no text */
							case (_result._count__plain_words == 0):
							case ((_result._count__links * 2) >= _result._count__plain_words):
							case ((_result._length__plain_text / 65 / 3) < 1):					/* paragrahs of 3 lines */
							case ((_result._count__plain_words / 50) < 0.75):					/* paragraphs of 50 words */
								//	not a valid candidate
								break;
								
							default:
								//	good candidate
								_result._is__candidate = true;
								_return__candidates.push(_result);
								break;
						}
						
						//	special case for body -- if it was just skipped
						//	=====================
							if ((_result.__index == 1) && !(_result._is__candidate))
							{
								_result._is__candidate = true;
								_result._is__bad = true;
								_return__candidates.push(_result);
							}
					}
				}

				
			//	return
			//	======
				return _result;
		};

		
		//	actually do it
		//	==============
			_recursive(_nodeToExplore);

		//	just exploring -- return first thing
		//	==============
			if (_justExploring) { return _return__containers.pop(); }
		
		//	return containers list
		//	======================
			return {
				'_containers': 	_return__containers,
				'_candidates': 	_return__candidates,
				'_links': 		_return__links
			};
	};


			
	$R.getContent__processCandidates = function (_candidatesToProcess)
	{
		//	process this var
		//	================
			var _candidates = _candidatesToProcess;
		
		
		//	sort _candidates -- the lower in the dom, the closer to position 0
		//	================
			_candidates.sort(function (a, b)
			{
				switch (true)
				{
					case (a.__index < b.__index): return -1;
					case (a.__index > b.__index): return 1;
					default: return 0;
				}
			});
		
		
		//	get first
		//	=========
			var	_main = _candidates[0]
			if ($R.debug) { $R.log('should be body', _main, _main.__node); }

		
		//	pieces of text
		//	and points computation
		//	======================
			for (var i=0, _i=_candidates.length; i<_i; i++)
			{
				//	pieces
				//	======
					var 
						_count__pieces = 0,
						_array__pieces = []
					;
				
					for (var k=i, _k=_candidates.length; k<_k; k++)
					{
						if (_candidates[k]._count__candidates > 0) { continue; }
						if ($.contains(_candidates[i].__node, _candidates[k].__node)); else { continue; }
						
						//	store piece, if in debug mode
						if ($R.debug) { _array__pieces.push(_candidates[k]); }
						
						//	incement pieces count
						_count__pieces++;
					}

				
				//	candidate details
				//	=================
					_candidates[i]['__candidate_details'] = $R.getContent__computeDetailsForCandidate(_candidates[i], _main);
				

				//	pieces -- do this here because _main doesn't yet have a pieces count
				//	======

					//	set pieces
					_candidates[i]['_count__pieces'] = _count__pieces;
					_candidates[i]['_array__pieces'] = _array__pieces;

					//	pieces ratio
					_candidates[i]['__candidate_details']['_ratio__count__pieces_to_total_pieces'] = (_count__pieces / (_candidates[0]._count__pieces + 1));
				
				
				//	points
				//	======
					_candidates[i].__points_history = $R.getContent__computePointsForCandidate(_candidates[i]);
					_candidates[i].__points = _candidates[i].__points_history[0];
			}

		
		//	sort _candidates -- the more points, the closer to position 0
		//	================
			_candidates.sort(function (a, b)
			{
				switch (true)
				{
					case (a.__points > b.__points): return -1;
					case (a.__points < b.__points): return 1;
					default: return 0;
				}
			});
			
		
		//	return
		//	======
			return _candidates;	
	};

			
	$R.getContent__computeDetailsForCandidate = function (_e, _main)
	{
		var _r = {};
		
		
		//	bad candidate
		//	=============
			if (_e._is__bad) { return _r; }
		
		
		//	paragraphs
		//	==========
			_r['_count__lines_of_65_characters'] = 							(_e._length__plain_text / 65);
			_r['_count__paragraphs_of_3_lines'] = 							(_r._count__lines_of_65_characters / 3);
			_r['_count__paragraphs_of_5_lines'] = 							(_r._count__lines_of_65_characters / 5);

			_r['_count__paragraphs_of_50_words'] = 							(_e._count__plain_words / 50);
			_r['_count__paragraphs_of_80_words'] = 							(_e._count__plain_words / 80);


		//	total text
		//	==========
			_r['_ratio__length__plain_text_to_total_plain_text'] = 			(_e._length__plain_text / _main._length__plain_text);
			_r['_ratio__count__plain_words_to_total_plain_words'] =			(_e._count__plain_words / _main._count__plain_words);

		
		//	links
		//	=====
			//_r['_ratio__length__links_text_to_plain_text'] =				((_e._length__plain_text > _e._length__links_text) ? (_e._length__links_text / _e._length__plain_text) : 1);
			//_r['_ratio__count__links_words_to_plain_words'] = 			((_e._count__plain_words > _e._count__links_words) ? (_e._count__links_words / _e._count__plain_words) : 1);

			_r['_ratio__length__links_text_to_plain_text'] =				(_e._length__links_text / _e._length__plain_text);
			_r['_ratio__count__links_words_to_plain_words'] = 				(_e._count__links_words / _e._count__plain_words);

			_r['_ratio__length__links_text_to_all_text'] =					(_e._length__links_text / _e._length__all_text);
			_r['_ratio__count__links_words_to_all_words'] = 				(_e._count__links_words / _e._count__all_words);

			_r['_ratio__length__links_text_to_total_links_text'] = 			(_e._length__links_text / (_main._length__links_text + 1));
			_r['_ratio__count__links_words_to_total_links_words'] = 		(_e._count__links_words / (_main._count__links_words + 1));
			
			_r['_ratio__count__links_to_total_links'] = 					(_e._count__links / (_main._count__links + 1));
			_r['_ratio__count__links_to_plain_words'] = 					((_e._count__links * 2) / _e._count__plain_words);
		

		//	text above
		//	==========
			_r['_ratio__length__above_plain_text_to_total_plain_text'] = 	(_e._length__above_plain_text / _main._length__plain_text);
			_r['_ratio__count__above_plain_words_to_total_plain_words'] = 	(_e._count__above_plain_words / _main._count__plain_words);

		
		//	candidates
		//	==========
			_r['_ratio__count__candidates_to_total_candidates'] = 			(_e._count__candidates / (_main._count__candidates + 1));
			_r['_ratio__count__containers_to_total_containers'] = 			(_e._count__containers / (_main._count__containers + 1));
		
	
		//	return
		//	======
			return _r;
	};

			
	$R.getContent__computePointsForCandidate = function (_e)
	{
		var 
			_details = _e.__candidate_details,
			_points = 0,
			_points_history = []
		;
	
		//	bad candidate
		if (_e._is__bad) { return [0]; }
	
	
		//	the basics
		//	==========
			_points = ((0
				+ (_details._count__paragraphs_of_3_lines)
				+ (_details._count__paragraphs_of_5_lines * 1.5)
				+ (_details._count__paragraphs_of_50_words)
				+ (_details._count__paragraphs_of_80_words * 1.5)
				+ (_e._count__images_large * 2.5)
				- ((_e._count__images_skip + _e._count__images_small) * 0.5)
			));
			_points_history.unshift((_points * 1000));

		
		//	points function
		//	===============
			var _do_points = function (_ratio, _ratio_remaining, _power)
			{
				var 
					_power = (_power > 0 ? _power : 1),
					_ratio_remaining = ((_ratio_remaining >= 0 && _ratio_remaining < 1) ? _ratio_remaining : 0.5),
					
					_points_remaining = (_points_history[0] * _ratio_remaining),
					
					_points_computed = (_points_history[0] * (1 - _ratio_remaining)),
					_points_computed = (_points_computed * Math.pow(_ratio, _power)),
					
					_points_return = (_points_remaining + _points_computed)
				;
				
				//	add
				_points_history.unshift(_points_return);
			};

		
		//	total text
		//	==========
			_do_points((1 - (1 - _details._ratio__length__plain_text_to_total_plain_text)), 0);
			_do_points((1 - (1 - _details._ratio__count__plain_words_to_total_plain_words)), 0);

			
		//	text above
		//	==========
			_do_points((1 - _details._ratio__length__above_plain_text_to_total_plain_text), 0.5, 5);
			_do_points((1 - _details._ratio__count__above_plain_words_to_total_plain_words), 0.5, 5);
		
		
		//	links
		//	=====
			_do_points((1 - _details._ratio__length__links_text_to_plain_text), 0.5);
			_do_points((1 - _details._ratio__count__links_words_to_plain_words), 0.5);

			_do_points((1 - _details._ratio__length__links_text_to_all_text), 0.5);
			_do_points((1 - _details._ratio__count__links_words_to_all_words), 0.5);

			_do_points((1 - _details._ratio__length__links_text_to_total_links_text), 0.5);
			_do_points((1 - _details._ratio__count__links_words_to_total_links_words), 0.5);
			
			_do_points((1 - _details._ratio__count__links_to_total_links), 0.5);
			_do_points((1 - _details._ratio__count__links_to_plain_words), 0.5);

			
		//	candidates, pieces
		//	==================
			_do_points((1 - _details._ratio__count__candidates_to_total_candidates), 0.75);
			_do_points((1 - _details._ratio__count__pieces_to_total_pieces), 0.75);
		
		
		//	return -- will get [0] as the actual final points
		//	======
			return _points_history;
	};


			
	$R.getContent__processCandidatesSecond = function (_processedCandidates)
	{
		var 
			_candidates = _processedCandidates,
			_main = _candidates[0]
		;

		//	only get children of target
		//	===========================
			_candidates = $.map(_candidates, function (_element, _index)
			{
				switch (true)
				{
					case (!(_index > 0)):
					case (!($.contains(_main.__node, _element.__node))):
						return null;
						
					default:
						return _element;
				}
			});
			_candidates.unshift(_main);
			
			
		//	sort _candidates -- the lower in the dom, the closer to position 0
		//	================
			_candidates.sort(function (a, b)
			{
				switch (true)
				{
					case (a.__index < b.__index): return -1;
					case (a.__index > b.__index): return 1;
					default: return 0;
				}
			});
		
		
		//	second candidate computation
		//	============================
			for (var i=0, _i=_candidates.length; i<_i; i++)
			{
				//	additional numbers
				//	==================
					_candidates[i].__second_length__above_plain_text = (_candidates[i]._length__above_plain_text - _main._length__above_plain_text);
					_candidates[i].__second_count__above_plain_words = (_candidates[i]._count__above_plain_words - _main._count__above_plain_words);
	
				//	candidate details
				//	=================
					_candidates[i]['__candidate_details_second'] = $R.getContent__computeDetailsForCandidateSecond(_candidates[i], _main);
					
				//	check some more
				//	===============
					switch (true)
					{
						case (!(_candidates[i]['__candidate_details_second']['_ratio__count__above_plain_words_to_total_plain_words'] < 0.1)):
						case (!(_candidates[i]['__candidate_details_second']['_ratio__length__above_plain_text_to_total_plain_text'] < 0.1)):
						case (!(_candidates[i]['__candidate_details_second']['_ratio__count__plain_words_to_total_plain_words'] > 0.05)):
						case (!(_candidates[i]['__candidate_details_second']['_ratio__length__plain_text_to_total_plain_text'] > 0.05)):
							_candidates[i]._is__bad = true;
							//	wil set points to 0, in points computation function
							break;
					}
					
				//	points
				//	======
					_candidates[i].__points_history_second = $R.getContent__computePointsForCandidateSecond(_candidates[i]);
					_candidates[i].__points_second = _candidates[i].__points_history_second[0];
			}
		
			
		//	sort _candidates -- the more points, the closer to position 0
		//	================
			_candidates.sort(function (a, b)
			{
				switch (true)
				{
					case (a.__points_second > b.__points_second): return -1;
					case (a.__points_second < b.__points_second): return 1;
					default: return 0;
				}
			});
			
		
		//	return
		//	======
			return _candidates;	
	};

			
	$R.getContent__computeDetailsForCandidateSecond = function (_e, _main)
	{
		var _r = {};

		
		//	bad candidate
		//	=============
			if (_e._is__bad) { return _r; }
		
		
		//	total text
		//	==========
			_r['_ratio__length__plain_text_to_total_plain_text'] = 	(_e._length__plain_text / _main._length__plain_text);
			_r['_ratio__count__plain_words_to_total_plain_words'] = (_e._count__plain_words / _main._count__plain_words);

			
		//	links
		//	=====
			_r['_ratio__length__links_text_to_all_text'] =	(_e._length__links_text / _e._length__all_text);
			_r['_ratio__count__links_words_to_all_words'] = (_e._count__links_words / _e._count__all_words);

			_r['_ratio__length__links_text_to_total_links_text'] = 	(_e._length__links_text / (_main._length__links_text + 1));
			_r['_ratio__count__links_words_to_total_links_words'] = (_e._count__links_words / (_main._count__links_words + 1));
				
			_r['_ratio__count__links_to_total_links'] = (_e._count__links / (_main._count__links + 1));
			_r['_ratio__count__links_to_plain_words'] = ((_e._count__links * 2) / _e._count__plain_words);

			
		//	text above
		//	==========
		
			_r['_ratio__length__above_plain_text_to_total_plain_text'] = 	(_e.__second_length__above_plain_text / _main._length__plain_text);
			_r['_ratio__count__above_plain_words_to_total_plain_words'] = 	(_e.__second_count__above_plain_words / _main._count__plain_words);
		
		
		//	candidates
		//	==========
			_r['_ratio__count__candidates_to_total_candidates'] = (Math.max(0, (_e._count__candidates - (_main._count__candidates * 0.25))) / (_main._count__candidates + 1));
			_r['_ratio__count__containers_to_total_containers'] = (Math.max(0, (_e._count__containers - (_main._count__containers * 0.25))) / (_main._count__containers + 1));
	
		
		//	return
		//	======
			return _r;
	};

			
	$R.getContent__computePointsForCandidateSecond = function (_e)
	{
		var 
			_details = _e.__candidate_details,
			_details_second = _e.__candidate_details_second,
			_points = 0,
			_points_history = []
		;
	
		//	bad candidate
		if (_e._is__bad) { return [0]; }
	
	
		//	get initial points
		//	==================
			_points = _e.__points_history[(_e.__points_history.length-1)];
			_points_history.unshift(_points);

		
		//	points function
		//	===============
			var _do_points = function (_ratio, _ratio_remaining, _power)
			{
				var 
					_power = (_power > 0 ? _power : 1),
					_ratio_remaining = ((_ratio_remaining >= 0 && _ratio_remaining < 1) ? _ratio_remaining : 0.5),
					
					_points_remaining = (_points_history[0] * _ratio_remaining),
					
					_points_computed = (_points_history[0] * (1 - _ratio_remaining)),
					_points_computed = (_points_computed * Math.pow(_ratio, _power)),
					
					_points_return = (_points_remaining + _points_computed)
				;
				
				//	add
				_points_history.unshift(_points_return);
			};

		
		//	total text
		//	==========
			_do_points((1 - (1 - _details_second._ratio__length__plain_text_to_total_plain_text)), 0.5);
			_do_points((1 - (1 - _details_second._ratio__count__plain_words_to_total_plain_words)), 0.5);

			
		//	links
		//	=====
			_do_points((1 - _details._ratio__length__links_text_to_plain_text), 0.5);
			_do_points((1 - _details._ratio__count__links_words_to_plain_words), 0.5);

			_do_points((1 - _details_second._ratio__length__links_text_to_all_text), 0.5);
			_do_points((1 - _details_second._ratio__count__links_words_to_all_words), 0.5);

			_do_points((1 - _details_second._ratio__length__links_text_to_total_links_text), 0.5);
			_do_points((1 - _details_second._ratio__count__links_words_to_total_links_words), 0.5);
			
			_do_points((1 - _details_second._ratio__count__links_to_total_links), 0.5);
			_do_points((1 - _details_second._ratio__count__links_to_plain_words), 0.5);
		

		//	candidates, pieces
		//	==================
			_do_points((1 - _details_second._ratio__count__candidates_to_total_candidates), 0, 2);
			_do_points((1 - _details_second._ratio__count__containers_to_total_containers), 0, 2);

		
		//	text above
		//	==========
			_do_points((1 - _details_second._ratio__length__above_plain_text_to_total_plain_text), 0, 4);
			_do_points((1 - _details_second._ratio__count__above_plain_words_to_total_plain_words), 0, 4);
		
		
		//	return -- will get [0] as the actual final points
		//	======
			return _points_history;
	};


			
	$R.getContent__buildHTMLForNode = function (_nodeToBuildHTMLFor, _custom_mode)
	{
		var 
			_global__element_index = 0,
			_global__the_html = '',
			_global__exploreNodeToBuildHTMLFor = $R.getContent__exploreNodeAndGetStuff(_nodeToBuildHTMLFor, true)
		;

		//	custom
		//	======
		switch (_custom_mode)
		{
			case 'above-the-target':
				_global__exploreNodeToBuildHTMLFor = false;
				break;
		}
		
		//	recursive function
		//	==================
		var _recursive = function (_node)
		{
			//	increment index -- starts with 1
			//	===============
				_global__element_index++;

			//	vars
			//	====
				var 
					_explored = false,
					_tag_name = (_node.nodeType === 3 ? '#text' : ((_node.nodeType === 1 && _node.tagName && _node.tagName > '') ? _node.tagName.toLowerCase() : '#invalid')),
					_pos__start__before = 0,
					_pos__start__after = 0,
					_pos__end__before = 0,
					_pos__end__after = 0
				;

			//	fast return
			//	===========
				switch (true)
				{
					case ((_tag_name == '#invalid')):
					case (($R.parsingOptions._elements_ignore.indexOf('|'+_tag_name+'|') > -1)):
						return;
						
					case (_tag_name == '#text'):
						_global__the_html += _node.nodeValue
							.replace(/</gi, '&lt;')
							.replace(/>/gi, '&gt;')
						;
						return;
				}
			
			//	hidden
			//	======
				if ($R.parsingOptions._elements_visible.indexOf('|'+_tag_name+'|') > -1)
					{ 	
	//	included inline
	//	_node must be defined
	//	will return, if node is hidden

	switch (true)
	{
		case (_node.offsetWidth > 0):
		case (_node.offsetHeight > 0):
			break;
			
		default:
			switch (true)
			{
				case (_node.offsetLeft > 0):
				case (_node.offsetTop > 0):
					break;
					
				default:
					return;
			}
			break;
	}
 }
			
			//	clean -- before
			//	=====
					
	//	just a return will skip the whol element
	//	including children

	//	objects, embeds, iframes
	//	========================
		switch (_tag_name)
		{
			case ('object'):
			case ('embed'):
			case ('iframe'):
				var 
					_src = (_tag_name == 'object' ? $(_node).find("param[name='movie']").attr('value') : $(_node).attr('src')),
					_skip = ((_src > '') ? false : true)
				;
				
				if (_skip); else
				{
					//	default skip
					_skip = true;
					
					//	loop
					for (var i=0, _i=$R.keepStuffFromDomain__video.length; i<_i; i++)
						{ if (_src.indexOf($R.keepStuffFromDomain__video[i]) > -1) { _skip = false; break; } }
				}

				//	skip?
				if (_skip)
					{ $R.debugOutline(_node, 'clean-before', 'object-embed-iframe'); return; }
				
				break;
		}
		
	//	skipped link
	//	============
		if (_tag_name == 'a')
		{
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true)
			{
				case (_explored._is__link_skip):
				case (((_explored._count__images_small + _explored._count__images_skip) > 0) && (_explored._length__plain_text < 65)):
					$R.debugOutline(_node, 'clean-before', 'skip-link');
					return;
			}
		}
	
	//	link density
	//	============
		if ($R.parsingOptions._elements_link_density.indexOf('|'+_tag_name+'|') > -1)
		{
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true)
			{
				case (!(_explored._count__links > 0)):
				case (_global__exploreNodeToBuildHTMLFor && (_explored._length__plain_text / _global__exploreNodeToBuildHTMLFor._length__plain_text) > 0.5):
				case (_global__exploreNodeToBuildHTMLFor && (_explored._count__plain_words / _global__exploreNodeToBuildHTMLFor._count__plain_words) > 0.5):
				case ((_explored._length__plain_text == 0) && (_explored._count__links == 1) && (_explored._length__links_text < 65)):
				case ((_explored._length__plain_text < 25) && ((_explored._count__images_large + _explored._count__images_medium) > 0)):
					break;

				case ((_explored._length__links_text / _explored._length__all_text) < 0.5):
					if (_explored._count__links > 0); else { break; }
					if (_explored._count__links_skip > 0); else { break; }
					if (((_explored._count__links_skip / _explored._count__links) > 0.25) && (_explored._length__links_text / _explored._length__all_text) < 0.05) { break; }
					
				default:
					$R.debugOutline(_node, 'clean-before', 'link-density');
					return;
			}
		}	

	//	floating
	//	========
		if ($R.parsingOptions._elements_floating.indexOf('|'+_tag_name+'|') > -1)
		{
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true)
			{
				case (_global__exploreNodeToBuildHTMLFor && (_explored._length__plain_text / _global__exploreNodeToBuildHTMLFor._length__plain_text) > 0.25):
				case (_global__exploreNodeToBuildHTMLFor && (_explored._count__plain_words / _global__exploreNodeToBuildHTMLFor._count__plain_words) > 0.25):
				case ((_explored._length__plain_text < 25) && (_explored._length__links_text < 25) && ((_explored._count__images_large + _explored._count__images_medium) > 0)):
					break;
					
				default:
					var _float = $(_node).css('float');
					if (_float == 'left' || _float == 'right'); else { break; }
					if ((_explored._length__links_text == 0) && ((_explored._count__images_large + _explored._count__images_medium) > 0)) { break; }

					$R.debugOutline(_node, 'clean-before', 'floating');
					return;
			}
		}
	
	//	above target
	//	============
		if (_custom_mode == 'above-the-target')
		{
			if ($R.parsingOptions._elements_above_target.indexOf('|'+_tag_name+'|') > -1)
				{ $R.debugOutline(_node, 'clean-before', 'above-target'); return; }
				
			if (_tag_name == 'img')
			{
				_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
				if (_explored._is__image_large); else
					{ $R.debugOutline(_node, 'clean-before', 'above-target'); return; }
			}
		}

				
			//	start tag
			//	=========
				if ($R.parsingOptions._elements_ignore_tag.indexOf('|'+_tag_name+'|') > -1); else
				{
					/* mark */	_pos__start__before = _global__the_html.length;
					/* add */	_global__the_html += '<'+_tag_name;
					
					//	attributes
					//	==========
						
	//	allowed attributes
	//	==================
		if (_tag_name in $R.parsingOptions._elements_keep_attributes)
		{
			for (var i=0, _i=$R.parsingOptions._elements_keep_attributes[_tag_name].length; i<_i; i++)
			{
				var 
					_attribute_name = $R.parsingOptions._elements_keep_attributes[_tag_name][i],
					_attribute_value = _node.getAttribute(_attribute_name)
				;
				
				//	if present
				if (_attribute_value > '')
					{ _global__the_html += ' '+_attribute_name+'="'+(_attribute_value)+'"'; }
			}
		}
	
	//	keep ID for all elements
	//	========================
		var _id_attribute = _node.getAttribute('id');
		if (_id_attribute > '')
			{ _global__the_html += ' id="'+_id_attribute+'"'; }

	//	links target NEW
	//	================
		if (_tag_name == 'a')
			{ _global__the_html += ' target="_blank"'; }
		
					
					//	close start
					//	===========
						if ($R.parsingOptions._elements_self_closing.indexOf('|'+_tag_name+'|') > -1) { _global__the_html += ' />'; }
						else { _global__the_html += '>';}
					
					/* mark */ _pos__start__after = _global__the_html.length;
				}
			
			//	child nodes
			//	===========
				if ($R.parsingOptions._elements_self_closing.indexOf('|'+_tag_name+'|') > -1); else
				{
					for (var i=0, _i=_node.childNodes.length; i<_i; i++)
						{ _recursive(_node.childNodes[i]); }
				}

			//	end tag
			//	=======
				switch (true)
				{
					case (($R.parsingOptions._elements_ignore_tag.indexOf('|'+_tag_name+'|') > -1)):
						return;
						
					case (($R.parsingOptions._elements_self_closing.indexOf('|'+_tag_name+'|') > -1)):
						/* mark */ 	_pos__end__before = _global__the_html.length;
						/* mark */ 	_pos__end__after = _global__the_html.length;
						break;
						
					default:
						/* mark */ 	_pos__end__before = _global__the_html.length;
						/* end */ 	_global__the_html += '</'+_tag_name+'>';
						/* mark */ 	_pos__end__after = _global__the_html.length;
						break;
				}

			//	clean -- after
			//	=====
				
	//	we need to actually cut things out of 
	//	"_global__the_html", for stuff to not be there


	//	largeObject classes
	//	===================
		if (_tag_name == 'iframe' || _tag_name == 'embed' || _tag_name == 'object')
		{
			_global__the_html = ''
				+ _global__the_html.substr(0, _pos__start__before)
				+ '<div class="readableLargeObjectContainer">'
				+ 	_global__the_html.substr(_pos__start__before, (_pos__end__after - _pos__start__before))
				+ '</div>'
			;
			return;
		}

	//	add image classes
	//	=================
		if (_tag_name == 'img')
		{
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true)
			{
				case (_explored._is__image_skip):
					$R.debugOutline(_node, 'clean-after', 'skip-img');
					_global__the_html = _global__the_html.substr(0, _pos__start__before);
					return;
					
				case (_explored._is__image_large):
					_global__the_html = ''
						+ _global__the_html.substr(0, _pos__start__before)
						+ '<div class="readableLargeImageContainer'
						+ 	(($(_node).width() <= 250) && ($(_node).height() >= 250) ? ' float' : '')
						+ '">'
						+ 	_global__the_html.substr(_pos__start__before, (_pos__end__after - _pos__start__before))
						+ '</div>'
					;
					return;
			}
		}
		
	//	large images in links
	//	=====================
		if (_tag_name == 'a')
		{
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true)
			{
				case (_explored._count__images_large == 1):
					_global__the_html = ''
						+ _global__the_html.substr(0, _pos__start__after-1)
						+ ' class="readableLinkWithLargeImage">'
						+ 	_global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after))
						+ '</a>'
					;
					return;
					
				case (_explored._count__images_medium == 1):
					_global__the_html = ''
						+ _global__the_html.substr(0, _pos__start__after-1)
						+ ' class="readableLinkWithMediumImage">'
						+ 	_global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after))
						+ '</a>'
					;
					return;
			}		
		}
		
	//	too much content
	//	================
		if ($R.parsingOptions._elements_too_much_content.indexOf('|'+_tag_name+'|') > -1)
		{
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			switch (true)
			{
				case (_tag_name == 'h1' && (_explored._length__all_text > (65 * 2))):
				case (_tag_name == 'h2' && (_explored._length__all_text > (65 * 2 * 3))):
				case ((_tag_name.match(/^h(3|4|5|6)$/) != null) && (_explored._length__all_text > (65 * 2 * 5))):
				case ((_tag_name.match(/^(b|i|em|strong)$/) != null) && (_explored._length__all_text > (65 * 5 * 5))):
					$R.debugOutline(_node, 'clean-after', 'too-much-content');
					_global__the_html = ''
						+ _global__the_html.substr(0, _pos__start__before)
						+ _global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after))
					;
					return;
			}
		}		
		
	//	empty elements
	//	==============
		switch (true)
		{
			case (($R.parsingOptions._elements_self_closing.indexOf('|'+_tag_name+'|') > -1)):
			case (($R.parsingOptions._elements_ignore_tag.indexOf('|'+_tag_name+'|') > -1)):
			case (_tag_name == 'td'):
				break;
				
			default:
				var _contents = _global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after));
					_contents = _contents.replace(/(<br \/>)/gi, '');
					_contents = _contents.replace(/(<hr \/>)/gi, '');
				var _contentsLength = $R.measureText__getTextLength(_contents);

				switch (true)
				{
					case (_contentsLength == 0 && _tag_name == 'p'):
						_global__the_html = _global__the_html.substr(0, _pos__start__before) + '<br /><br />';
						return;
						
					case (_contentsLength == 0):
					case ((_contentsLength < 5) && ($R.parsingOptions._elements_visible.indexOf('|'+_tag_name+'|') > -1)):
						$R.debugOutline(_node, 'clean-after', 'blank');
						_global__the_html = _global__the_html.substr(0, _pos__start__before);
						return;
				}
				break;
		}

	//	too much missing
	//	================
		if ($R.parsingOptions._elements_link_density.indexOf('|'+_tag_name+'|') > -1)
		{
			_explored = (_explored || $R.getContent__exploreNodeAndGetStuff(_node, true));
			var
				_contents = _global__the_html
							.substr(_pos__start__after, (_pos__end__before - _pos__start__after))
								.replace(/(<([^>]+)>)/gi, ''),
				_contentsLength = $R.measureText__getTextLength(_contents),
				_initialLength = 0
					+ _explored._length__all_text 
					+ (_explored._count__images_small 					* 10)
					+ (_explored._count__images_skip 					* 10)
					+ (_node.getElementsByTagName('iframe').length 		* 10)
					+ (_node.getElementsByTagName('object').length 		* 10)
					+ (_node.getElementsByTagName('embed').length 		* 10)
					+ (_node.getElementsByTagName('button').length 		* 10)
					+ (_node.getElementsByTagName('input').length 		* 10)
					+ (_node.getElementsByTagName('select').length 		* 10)
					+ (_node.getElementsByTagName('textarea').length 	* 10)
			;

			//	too much missing
			switch (true)
			{
				case (!(_contentsLength > 0)):
				case (!(_initialLength > 0)):
				case (!((_contentsLength / _initialLength) < 0.5)):
				case ((_global__exploreNodeToBuildHTMLFor && ((_explored._length__plain_text / _global__exploreNodeToBuildHTMLFor._length__plain_text) > 0.25))):
					break;
					
				default:
					$R.debugOutline(_node, 'clean-after', 'missing-density');
					_global__the_html = _global__the_html.substr(0, _pos__start__before);
					return;
			}
		}

				
			//	return
				return;
		};
		
		//	actually do it
		_recursive(_nodeToBuildHTMLFor);
		
		//	return html
		return _global__the_html;
	};


			
	$R.getContent__manualSelection = function ()
	{
		var 
			_selection = $R.sel.getSelection($R.win),
			_range = $R.sel.getRange(_selection),
			_html = $R.sel.getRangeHTML(_range),
			_text = $R.sel.getRangeText(_range)
		;
		
		if (_html > '' && _text > ''); else
		{
			_html = null;
			_text = null;
			
			$R.$document.find('frame, iframe').each(function (_i, _e)
			{
				if (_e.getAttribute('id') == 'readable_iframe') { return; }
				
				try
				{
					var
						__doc = $(_e).contents().get(0),
						__win = $R.sel.getWindowFromDocument(__doc),
						__selection = $R.sel.getSelection(__win),
						__range = $R.sel.getRange(__selection),
						__html = $R.sel.getRangeHTML(__range),
						__text = $R.sel.getRangeText(__range)
					;
						
					if (__html > '' && __text > '')
					{
						_html = __html;
						_text = __text;
						
						// stop the each
						return false;
					}
				}
				catch(e) { }
			});
		}
		
		//	haven't found anything		
		if (_html > '' && _text > ''); else { return false; }

		//	probably selected something by mistake
		if ($R.measureText__getTextLength(_text) > (65 * 3 * 1.5)); else { return false; }
		
		//	display
		//	=======
			$R.$pages.html('');
			$R.displayPageHTML(_html, 1);

		//	return true
		return true;
	};
	
	
//	functions
//	=========
	
	$R.sel = {};

	$R.sel.getWindowFromDocument = function (theDocument)
	{
		if (theDocument); else { return null; }
		
		if ('defaultView' in theDocument) {
			arguments.calee = function (theDocument) {
				if (theDocument); else { return null; }
				return theDocument.defaultView;
			};
		}
		else if ('parentWindow' in theDocument) {
			arguments.calee = function (theDocument) {
				if (theDocument); else { return null; }
				return theDocument.parentWindow;
			};
		}
		else {
			arguments.calee = function (theDocument) {
				return null;
			};
		}
		
		return arguments.calee(theDocument);
	};


	$R.sel.getSelection = function (theWindow)
	{
		if (theWindow); else { return null; }
	
		if ('getSelection' in theWindow) {
			arguments.calee = function (theWindow) {
				if (theWindow); else { return null; }
				return theWindow.getSelection();
			};
		}
		else if ('selection' in theWindow.document) {
			arguments.calee = function (theWindow) {
				if (theWindow); else { return null; }
				return theWindow.document.selection;
			};
		}
		else {
			arguments.calee = function (theWindow) {
				return null;
			};
		}
		
		return arguments.calee(theWindow);
	};


	$R.sel.getRange = function (selection)
	{
		if (selection); else { return null; }
	
		if ('getRangeAt' in selection) {
			arguments.calee = function (selection) {
				if (selection); else { return null; }
				if (selection.rangeCount > 0) { return selection.getRangeAt(0); }
				else { return null; }
				//	doesn't work in old versions of safari 
				//	... I don't care
			};
		}
		else if ('createRange' in selection) {
			arguments.calee = function (selection) {
				if (selection); else { return null; }
				return selection.createRange();
			};
		}
		else {
			arguments.calee = function (selection) {
				return null;
			};
		}
		
		return arguments.calee(selection);
	};


	$R.sel.getRangeHTML = function (range)
	{
		if (range); else { return null; }
		
		if ('htmlText' in range) {
			arguments.calee = function (range) {
				if (range); else { return null; }
				return range.htmlText;
			};
		}
		else if ('surroundContents' in range) {
			arguments.calee = function (range) {
				if (range); else { return null; }
				var dummy = range.commonAncestorContainer.ownerDocument.createElement("div");
				dummy.appendChild(range.cloneContents());
				return dummy.innerHTML;
			};
		}
		else {
			arguments.calee = function (range) {
				return null;
			};
		}
		
		return arguments.calee(range);
	};


	$R.sel.getRangeText = function (range)
	{
		if (range); else { return null; }
		
		if ('text' in range) {
			arguments.calee = function (range) {
				if (range); else { return null; }
				return range.text;
			};
		}
		else if ('surroundContents' in range) {
			arguments.calee = function (range) {
				if (range); else { return null; }
				var dummy = range.commonAncestorContainer.ownerDocument.createElement("div");
				dummy.appendChild(range.cloneContents());
				return dummy.textContent;
			};
		}
		else {
			arguments.calee = function (range) {
				return null;
			};
		}
		
		return arguments.calee(range);
	};


			
	$R.getContent__find = function ()
	{
		//	get content
		//	===========
			var 
				_found = $R.getContent__findInPage($R.win),
				_targetNode = _found._targetCandidate.__node,
				_$targetNode = $(_targetNode)
			;

		//	RTL
		//	===
			switch (true)
			{
				case (_$targetNode.attr('dir') == 'rtl'):
				case (_$targetNode.css('direction') == 'rtl'):
					$R.makeRTL();
					break;
			}
			
			
		//	prev html => to fist target
		//	=========
			
			var 
				_foundHTML = 	_found._html,
				_prevNode = 	_found._targetCandidate.__node,
				_prevHTML = 	'',
				_foundTitle = false
			;

			(function ()
			{
				while (true)
				{
					switch (true)
					{
						case ((_prevNode.tagName && _prevNode.tagName.toLowerCase() == 'body')):
						case ((_found._firstCandidate.__node != _found._targetCandidate.__node) && (_prevNode == _found._firstCandidate.__node)):
							return;
					}
						
					//	do it
					if (_prevNode.previousSibling)
					{
						//	previous
						_prevNode = _prevNode.previousSibling;

						//	get html
						var _h = $R.getContent__buildHTMLForNode(_prevNode, 'above-the-target');
						_prevHTML = _h + _prevHTML;
						_foundHTML = _h + _foundHTML;
						
						//	outline
						if ($R.debug && $R.measureText__getTextLength(_h.replace(/<[^>]+?>/gi, '')) > 0)
							{ $R.debugOutline(_prevNode, 'target', 'add-above'); }
						
						//	finished?
						if ($R.measureText__getTextLength(_prevHTML.replace(/<[^>]+?>/gi, '')) > (65 * 3 * 3)) { return; }
						
						//	found heading
						var _headingStartPos = _foundHTML.indexOf('<h1');
							_headingStartPos = (_headingStartPos > -1 ? _headingStartPos : _foundHTML.indexOf('<h2'));
							_headingStartPos = (_headingStartPos > -1 ? _headingStartPos : _foundHTML.indexOf('<h3'));
							
						if (_headingStartPos > -1)
						{						
							var _toHeadingLength = $R.measureText__getTextLength(_foundHTML.substr(0, _headingStartPos).replace(/<[^>]+?>/gi, ''));
							if (_toHeadingLength < (65 * 3 * 2))
								{ _foundTitle = true; return; }
						}
					}
					else
					{
						_prevNode = _prevNode.parentNode;
					}
				}
			})();

			
		//	get document title
		//	==================
			if (_foundTitle); else
			{
				if ($R.document.title > '')
				{
					var
						_the_title = '',
						_doc_title = $R.document.title,
						_doc_title_parts = [],
						_doc_title_pregs =
						[
							/( [-][-] |( [-] )|( [>][>] )|( [<][<] )|( [|] )|( [\/] ))/i,
							/(([:] ))/i
						]
					;
	
					//	loop through pregs
					for (var i =0, _i=_doc_title_pregs.length; i<_i; i++)
					{
						//	split
						_doc_title_parts = _doc_title.split(_doc_title_pregs[i]);
						
						//	break if we managed a split
						if (_doc_title_parts.length > 1) { break; }
					}
			
					//	sort title parts
					//	longer goes higher up -- i.e. towards 0
					_doc_title_parts.sort(function (a, b)
					{
						switch (true)
						{
							case (a.length > b.length): return -1;
							case (a.length < b.length): return 1;
							default: return 0;
						}
					});
		
					//	more than one word?
					_the_title = (_doc_title_parts[0].split(/\s+/i).length > 1 ? _doc_title_parts[0] : _doc_title);

					//	add
					_foundHTML = '<h1>'+_the_title+'</h1>' + _foundHTML;
				}
			}
			
		
		//	display
		//	=======
			$R.$pages.html('');
			$R.displayPageHTML(_foundHTML, 1);

			
		//	remember
		//	========
			$R.debugRemember['theTarget'] = _found._targetCandidate.__node;
			$R.debugRemember['firstCandidate'] = _found._firstCandidate.__node;
			
		//	next
		//	====
			$R.getContent__nextPage__find($R.win, _found._links);
			
		//	return
		return true;
	};
	
			
	$R.getContent__findInPage = function (_pageWindow)
	{
		//	calculations
		//	============

			var
				_firstCandidate = false,
				_secondCandidate = false,
				_targetCandidate = false
			;

			$R.debugTimerStart('ExploreAndGetStuff');
				var	_stuff = $R.getContent__exploreNodeAndGetStuff(_pageWindow.document.body);
			$R.debugPrint('ExploreAndGetStuff', $R.debugTimerEnd()+'ms');
			
			$R.debugTimerStart('ProcessFirst');
				var _processedCandidates = $R.getContent__processCandidates(_stuff._candidates);
				_firstCandidate = _processedCandidates[0];
				_targetCandidate = _firstCandidate;
			$R.debugPrint('ProcessFirst', $R.debugTimerEnd()+'ms');
			
			//$.each(_processedCandidates, function (_index, _element) { $R.log(_element.__node, _element); })
			
			switch (true)
			{
				case (!(_firstCandidate._count__containers > 0)):
				case (!(_firstCandidate._count__candidates > 0)):
				case (!(_firstCandidate._count__pieces > 0)):
				case (!(_firstCandidate._count__containers > 75)):
				case ((_firstCandidate._count__candidates - _firstCandidate._count__pieces) <= 3):
					//	don't do second
					break;
					
				default:
					$R.debugTimerStart('ProcessSecond');
						var _processedCandidatesSecond = $R.getContent__processCandidatesSecond(_processedCandidates);
						_secondCandidate = _processedCandidatesSecond[0];
						_targetCandidate = _secondCandidate;
					$R.debugPrint('ProcessSecond', $R.debugTimerEnd()+'ms');
					break;
			}

			
		//	debug
		//	=====
			if ($R.debug)
			{
				//	mark
				if (_firstCandidate) 	{ $R.debugOutline(_firstCandidate.__node, 'target', 'first'); }
				if (_secondCandidate) 	{ $R.debugOutline(_secondCandidate.__node, 'target', 'second'); }

				//	log
				$R.log('first candidate', _firstCandidate, (_firstCandidate ? _firstCandidate.__node : false));
				$R.log('second candidate', _secondCandidate, (_secondCandidate ? _secondCandidate.__node : false));

				//	print
				$R.debugPrint('FirstCandidates', _firstCandidate._count__candidates);
				$R.debugPrint('FirstContainers', _firstCandidate._count__containers);
				$R.debugPrint('FirstPieces', _firstCandidate._count__pieces);
			}
		
		
		//	get html
		//	========
			$R.debugTimerStart('BuildHTML');
				var _html = $R.getContent__buildHTMLForNode(_targetCandidate.__node, 'the-target');
					_html = _html.substr((_html.indexOf('>')+1), _html.lastIndexOf('<'));
			$R.debugPrint('BuildHTML', $R.debugTimerEnd()+'ms');

			$R.debugTimerStart('BuildHTMLPregs');
				_html = _html.replace(/<(blockquote|div|p|td|li)([^>]*)>(\s*<br \/>)+/gi, '<$1$2>');
				_html = _html.replace(/(<br \/>\s*)+<\/(blockquote|div|p|td|li)>/gi, '</$2>');
				_html = _html.replace(/(<br \/>\s*)+<(blockquote|div|h\d|ol|p|table|ul|li)([^>]*)>/gi, '<$2$3>');
				_html = _html.replace(/<\/(blockquote|div|h\d|ol|p|table|ul|li)>(\s*<br \/>)+/gi, '</$1>');
				_html = _html.replace(/(<hr \/>\s*<hr \/>\s*)+/gi, '<hr />');
				_html = _html.replace(/(<br \/>\s*<br \/>\s*)+/gi, '<br /><br />');
			$R.debugPrint('BuildHTMLPregs', $R.debugTimerEnd()+'ms');
					
			
			
		//	return
		//	======
			return {
				'_html': _html,
				'_links': _stuff._links,
				'_targetCandidate': _targetCandidate,
				'_firstCandidate': _firstCandidate
			};
	};

			
			
	//	found pages -- page var
	//	===========
		$R.nextPage__loadedPages = [$R.win.location.href];
	
	//	find
	//	====
		$R.getContent__nextPage__find = function (_currentPageWindow, _linksInCurrentPage)
		{
			//	page id
				var _pageNr = ($R.nextPage__loadedPages.length + 1);
		
			//	get
			//	===
				var _possible = [];
				if (_possible.length > 0); else { _possible = $R.getContent__nextPage__find__possible(_currentPageWindow, _linksInCurrentPage, 0.5); }
				//if (_possible.length > 0); else { _possible = $R.getContent__nextPage__find__possible(_currentPageWindow, _linksInCurrentPage, 0.50); }

				//	none
				if (_possible.length > 0); else
					{ if ($R.debug) { $R.log('no next link found'); } return; }
				
				$R.log('possible next', _possible);
				
			//	the one
			//	=======
				var _nextLink = false;

			//	next keyword?
			//	=============
				(function ()
				{
					if (_nextLink) { return; }

					for (var i=0, _i=_possible.length; i<_i; i++)
					{
						for (var j=0, _j=$R.nextPage__captionKeywords.length; j<_j; j++)
						{
							if (_possible[i]._caption.indexOf($R.nextPage__captionKeywords[j]) > -1)
							{
								//	not keywords
								//	============
									for (var z=0, _z=$R.nextPage__captionKeywords__not.length; z<_z; z++)
									{
										if (_possible[i]._caption.indexOf($R.nextPage__captionKeywords__not[z]) > -1)
											{ _nextLink = false; return; }
									}
							
								//	got it
								_nextLink = _possible[i];
								return;
							}
						}
					}
				})();	

			//	caption matched page number
			//	===========================
				(function ()
				{
					if (_nextLink) { return; }

					for (var i=0, _i=_possible.length; i<_i; i++)
					{
						if (_possible[i]._caption == (''+_pageNr))
							{ _nextLink = _possible[i]; return; }
					}
				})();

			//	next keyword in title
			//	=====================
				(function ()
				{
					if (_nextLink) { return; }

					for (var i=0, _i=_possible.length; i<_i; i++)
					{
						//	sanity
						if (_possible[i]._title > ''); else { continue; }
						if ($R.measureText__getTextLength(_possible[i]._caption) <= 2); else { continue; }
						
						for (var j=0, _j=$R.nextPage__captionKeywords.length; j<_j; j++)
						{
							if (_possible[i]._title.indexOf($R.nextPage__captionKeywords[j]) > -1)
							{
								//	not keywords
								//	============
									for (var z=0, _z=$R.nextPage__captionKeywords__not.length; z<_z; z++)
									{
										if (_possible[i]._title.indexOf($R.nextPage__captionKeywords__not[z]) > -1)
											{ _nextLink = false; return; }
									}
							
								//	got it
								_nextLink = _possible[i];
								return;
							}
						}
					}
				})();

			//	return?
			//	=======
				if (_nextLink); else { return; }
			
			//	mark
			//	====
				$R.debugPrint('NextPage', 'true');
				
				if ($R.debug)
				{
					$R.debugOutline(_nextLink._node, 'target', 'next-page');
					$R.log('NextPage Link', _nextLink, _nextLink._node);
				}
			
			//	process page
			//	============
				$R.getContent__nextPage__loadToFrame(_pageNr, _nextLink._href);
				$R.nextPage__loadedPages.push(_nextLink._href);
		};

		
	//	find with similarity
	//	====================
		$R.getContent__nextPage__find__possible = function (_currentPageWindow, _linksInCurrentPage, _distanceFactor)
		{
			var 
				_mainPageHref = $R.win.location.href,
				_mainPageDomain = $R.getContent__nextPage__find__getLinkDomain(_mainPageHref),
				_mainPagePath = $R.getContent__nextPage__find__getLinkPath(_mainPageHref)
			;
			
			var _links = $.map
			(
				_linksInCurrentPage,
				function (_element, _index)
				{
					var 
						_href = _element.__node.href,
						_path = $R.getContent__nextPage__find__getLinkPath(_href),
						_title = (_element.__node.title > '' ? _element.__node.title.toLowerCase() : ''),
						_caption = _element.__node.innerHTML.replace(/<[^>]+?>/gi, '').replace(/\&[^\&\s;]{1,10};/gi, '').replace(/\s+/gi, ' ').replace(/^ /, '').replace(/ $/, '').toLowerCase(),
						_distance = levenshteinForReadable(_mainPagePath, _path)
					;
					
					var _caption2 = '';
					for (var i=0, _i=_caption.length, _code=0; i<_i; i++)
					{
						_code = _caption.charCodeAt(i);
						_caption2 += (_code > 127 ? ('&#'+_code+';') : _caption.charAt(i));
					}
					_caption = _caption2;
					
					switch (true)
					{
						case (!(_href > '')):
						case (_mainPageHref.length > _href.length):
						case (_mainPageDomain != $R.getContent__nextPage__find__getLinkDomain(_href)):
						case (_href.substr(_mainPageHref.length).substr(0, 1) == '#'):
						case (_distance > Math.ceil(_distanceFactor * _path.length)):
							return null;
							
						default:
							//	skip if already loaded as next page
							for (var i=0, _i=$R.nextPage__loadedPages.length; i<_i; i++)
								{ if ($R.nextPage__loadedPages[i] == _href) { return null; } }

							//	return
							return {
								'_node': _element.__node,
								'_href': _href,
								'_title': _title,
								'_caption': _caption,
								'_distance': _distance
							};
					}
				}
			);
			
			//	sort -- the less points, the closer to position 0
			//	====
				_links.sort(function (a, b)
				{
					switch (true)
					{
						case (a._distance < b._distance): return -1;
						case (a._distance > b._distance): return 1;
						default: return 0;
					}
				});
			
			
			//	return
				return _links;
		};

	
		$R.getContent__nextPage__find__getLinkPath = function (_href)
		{
			return _href.substr(_href.indexOf('/', 9));
		};

		$R.getContent__nextPage__find__getLinkDomain = function (_href)
		{
			var 
				_firstSlash = _href.indexOf('/', 9),
				_theDomain = _href.substr(0, _firstSlash)
			;
			
			return _theDomain;
		};
	
	
	//	levenshtein
	//	===========	
		function levenshteinForReadable(str1, str2)
		{
			var l1 = str1.length, l2 = str2.length;
			if (Math.min(l1, l2) === 0)
				{ return Math.max(l1, l2); }
			
			var i = 0, j = 0, d = [];
			for (i = 0 ; i <= l1 ; i++)
			{
				d[i] = [];
				d[i][0] = i;
			}
			
			for (j = 0 ; j <= l2 ; j++)
				{ d[0][j] = j; }
			
			for (i = 1 ; i <= l1 ; i++)
			{
				for (j = 1 ; j <= l2 ; j++)
				{
					d[i][j] = Math.min
					(
						d[i - 1][j] + 1,
						d[i][j - 1] + 1, 
						d[i - 1][j - 1] + (str1.charAt(i - 1) === str2.charAt(j - 1) ? 0 : 1)
					);
				}
			}
			return d[l1][l2];
		}

			
	//	load to frame
	//	=============
		$R.getContent__nextPage__loadToFrame = function (_pageNr, _nextPageURL)
		{
			//	do ajax
			//	=======
				$.ajax
				({
					'url' : _nextPageURL,

					'type' : 'GET',
					'dataType' : 'html',
					'async' : true,
					'timeout': (10 * 1000),

					'success' : function (_response, _textStatus, _xhr)	{ $R.getContent__nextPage__ajaxComplete(_pageNr, _response, _textStatus, _xhr); },
					'error' : 	function (_xhr, _textStatus, _error)	{ $R.getContent__nextPage__ajaxError(_pageNr, _xhr, _textStatus, _error); }
				});
		};

		
	//	ajax calbacks
	//	=============
		$R.getContent__nextPage__ajaxError = function (_pageNr, _xhr, _textStatus, _error)
		{
		};
	
		$R.getContent__nextPage__ajaxComplete = function (_pageNr, _response, _textStatus, _xhr)
		{
			//	valid?
			//	======
				if (_response > ''); else { return; }

			//	script
			//	======
				var _script = ''
					+ '<script type="text/javascript">'
					+ ' function __this_page_loaded()'
					+ '	{'
					+ ' 	window.setTimeout('
					+ ' 		function () { window.parent.parent.$readable.getContent__nextPage__loadedInFrame("'+_pageNr+'", window); }, '
					+ ' 		250'
					+ ' 	);'
					+ ' } '
					
					+ ' if (document.readyState); else { __this_page_loaded(); } '
					
					+ ' function __this_page_loaded_ready(delayedNrTimes)'
					+ ' {'
					+ ' 	if (document.readyState != "complete" && delayedNrTimes < 30)'
					+ '			{ setTimeout(function () { __this_page_loaded_ready(delayedNrTimes+1); }, 100); return; }'
					
					+ ' 	__this_page_loaded();'
					+ ' }'
					
					+ ' __this_page_loaded_ready(0);'
					+ '</script>'
				;
				
			//	get html
			//	========
				var _html = _response;
					
				//	normalize
				//	=========
					_html = _html.replace(/<\s+/gi, '<');
					_html = _html.replace(/\s+>/gi, '>');
					_html = _html.replace(/\s+\/>/gi, '/>');

				//	remove
				//	======
					_html = _html.replace(/<script[^>]*?>([\s\S]*?)<\/script>/gi, '');
					_html = _html.replace(/<script[^>]*?\/>/gi, '');
					_html = _html.replace(/<noscript[^>]*?>([\s\S]*?)<\/noscript>/gi, '');
					
				//	add load handler
				//	================
					_html = _html.replace(/<\/body/i, _script+'</body');

					
			//	append frame
			//	============
				$R.$nextPages.append(''
					+ '<iframe'
					+ ' id="nextPageFrame__'+_pageNr+'"'
					+ ' scrolling="no" frameborder="0"'
					+ '></iframe>'
				);		

			//	write to frame
			//	==============
				var _doc = $('#nextPageFrame__'+_pageNr).contents().get(0);
					_doc.open();
					_doc.write(_html);
					_doc.close();
		};

	
	//	loaded in frame
	//	===============
		$R.getContent__nextPage__loadedInFrame = function (_pageNr, _pageWindow)
		{
			//	find
			//	====
				var _found = $R.getContent__findInPage(_pageWindow);

			//	display
			//	=======
				$R.displayPageHTML(_found._html, _pageNr);

			//	next
			//	====
				$R.getContent__nextPage__find(_pageWindow, _found._links);
		};
	

		//	display HTML
		//	============
			
	$R.displayPageHTML = function (_processedPageHTML, _pageNr)
	{
		//	separator
		//	=========
			if (_pageNr > 1)
			{
				$R.$pages.append(''
					+ '<div class="pageSeparator">'
					+	'<div class="pageSeparatorLine setTextColorAsBackgroundColor"></div>'
					+ 	'<div class="pageSeparatorLabel"><span>'+$R.translate('misc__page')+' '+_pageNr+'</span></div>'
					+ '</div>'
				);
			}
	
		//	display processed
		//	=================
			$R.$pages.append(''
				+ '<div class="page" id="page'+_pageNr+'">'
				+ 	_processedPageHTML
				+ '</div>'
			);

		//	links as footnotes
		//	==================
			$('#page'+_pageNr).find('a').each(function (_index, _element)
			{
				//	check
				var _href = _element.href;
				if (_href > ''); else { return; }
				if (_href.indexOf); else { return; }
				if (_href.indexOf('#') > -1) { return; }
				
				//	count
				var _nr = ++$R.footnotedLinksCount;
				
				//	add
				$(_element).append(' <sup class="readableLinkFootnote">['+_nr+']</sup>');
				$R.$footnotedLinks.append('<li>'+_href+'</li>');
			});
	};


		//	appear
		//	======
			
	//	var
	//	===
		$R.visible = false;

	//	content
	//	=======	
		$R.hideContent = function () { $R.$box.hide(); $R.$loading.hide(); };
		$R.showContent = function () { $R.$box.show(); $R.$loading.hide(); $R.scrolledWindowWhileReadableVisible(); }
	
	//	show
	//	====
		$R.show = function (_endFunction)
		{
			//	bind scroll
			//	===========
				$R.$document.bind('scroll', $R.scrolledWindowWhileReadableVisible);

			//	get specs
			//	=========
				var _width = $R.$iframe.width();
				
			//	prepare
			//	=======
				$R.$document.find('body, html').addClass('readableBeforeVisible');
				$R.hideContent();
				
				$R.$sidebar.addClass('belowBackground withoutShading');
				$R.$sidebar.css({'right': '-100px'});

				$R.$backgroundShading.show();
				$R.$background.css({'right': _width+'px'});
				
			//	scroll
			//	======
				window.scrollTo(0, 0);
				$R.win.scrollTo(0, 0);

			//	show frame
			//	==========
				$R.$iframe.css({'top': '0px', 'left': '0px'});

			//	slide background
			//	================
				$R.$background.animate
				(
					{'right': '50px'}, 
					500,
					'readableEasingBackgroundShow',
					function ()
					{
						$R.$loading.show();
						$R.$sidebar.css({'right': '50px'});
						
						//	slide sidebar
						//	=============
							$R.$sidebar.animate
							(
								{'right': '0px'}, 
								500,
								'readableEasingSidebarShow',
								function ()
								{
									//	end animation
									//	=============
										$R.$sidebar.removeClass('belowBackground withoutShading');
										$R.$document.find('body, html').addClass('readableVisible');
										$('html').addClass('readableVisible');
										$R.$background.css({'right': '0px'});

									//	focus
									//	=====
										if (window.focus) { window.focus(); }
							
									//	finished
									//	========
										$R.visible = true;
									
									//	end function
									//	============
										if (_endFunction && _endFunction.call)
											{ _endFunction.call(); }
								}
							);	
					}
				);
		};		

		
	//	hide
	//	====
		$R.hide = function (_endFunction)
		{
			//	get specs
			//	=========
				var _width = $R.$iframe.width();
		
			//	hide dialog
			//	===========
				$R.hideOpenDialog();
				
			//	unbind scroll
				$R.$document.unbind('scroll', $R.scrolledWindowWhileReadableVisible);

			//	prepare
				$R.$background.css({'right': '50px'});
				$R.$sidebar.addClass('belowBackground withoutShading');
				$R.$backgroundShading.show();
				
			//	inverse
				$R.hideContent();
				$('html').removeClass('readableVisible');
				$R.$document.find('body, html').removeClass('readableVisible');

			//	slide sidebar
			//	=============
				$R.$sidebar.animate
				(
					{'right': '50px'}, 
					100,
					'readableEasingSidebarHide',
					function ()
					{
						$R.$sidebar.css({'right': '-100px'});

						//	slide background
						//	================
							$R.$background.animate
							(
								{'right': _width+'px'}, 
								500,
								'readableEasingBackgroundHide',
								function ()
								{
									//	end animation
									//	=============
										$R.$document.find('body, html').removeClass('readableBeforeVisible');
								
									//	show frame
									//	==========
										$R.$iframe.css({'top': '-100%', 'left': '-100%'});
								
									//	focus
									//	=====
										if ($R.win.focus) { $R.win.focus(); }
									
									//	finished
									//	========
										$R.visible = false;

									//	end function
									//	============
										if (_endFunction && _endFunction.call)
											{ _endFunction.call(); }
								}
							);	
					}
				);
				
		};


	//	scrolled
	//	========	
		$R.scrolledWindowWhileReadableVisible = function ()
		{
			//	in case main window somehow gets scrolled, 
			//	scroll it back
			
			$R.win.scrollTo(0, 0);
		};

		
	//	custom easing -- http://timotheegroleau.com/Flash/experiments/easing_function_generator.htm
	//	=============
		
		$.easing['readableEasingBackgroundShow'] = function (x, t, b, c, d)
		{
			/* out cubic :: variation */
			var ts=(t/=d)*t;
			var tc=ts*t;
			return b+c*(-2.5*tc*ts + 10*ts*ts + -14*tc + 7*ts + 0.5*t);
		};
			
		$.easing['readableEasingSidebarShow'] = function (x, t, b, c, d)
		{
			/* out elastic (small) :: variation */
			var ts=(t/=d)*t;
			var tc=ts*t;
			return b+c*(20.05*tc*ts + -65.25*ts*ts + 79.7*tc + -44.6*ts + 11.1*t);
		};
	
		$.easing['readableEasingBackgroundHide'] = function (x, t, b, c, d)
		{
			/* out cubic :: variation */
			var ts=(t/=d)*t;
			var tc=ts*t;
			return b+c*(-2.5*tc*ts + 10*ts*ts + -14*tc + 7*ts + 0.5*t);
		};
			
		$.easing['readableEasingSidebarHide'] = function (x, t, b, c, d)
		{
			/* out cubic :: variation */
			var ts=(t/=d)*t;
			var tc=ts*t;
			return b+c*(-2.5*tc*ts + 10*ts*ts + -14*tc + 7*ts + 0.5*t);
		};
	
		
		//	launch
		//	======
			
	//	clicked
	//	=======
		$R.bookmarkletClicked = function ()
		{
			//	log -- console might not have been activated on first run
			//	===
				if ($R.debug) { $R.initializeWriteLogFunction(); }

				
			//	blank page -- mini show
			//	==========
				switch (true)
				{
					case (window.parent.location.href.indexOf('chrome:') === 0):
					case (window.parent.location.href.indexOf('about:') === 0):
					
						$R.$document.find('body, html').addClass('readableBeforeVisible readableVisible');
						$('html').addClass('readableVisible');

						window.scrollTo(0, 0);
						$R.win.scrollTo(0, 0);

						$('#blank_error').show();
						
						$R.$iframe.css({'top': '0px', 'left': '0px'});

						return;
				}

				
			//	already visible? -- hide
			//	================
				if ($R.visible)
				{
					$R.hide(function() { $R.bookmarkletTimer = false; });
					return;
				}

				
			//	show -- apply options; load fonts; get content
			//	====
			
				//	get options -- in case they changed
				
					$R.getFromExtension__options();
				
			
				//	apply options -- in case they changed
				$R.applyOptions();

				//	show -> get content
				$R.show(function ()
				{
					$R.applyOptions__fonts();
					$R.getContent();
					
					if ($R.clipOnFirstLaunch && $R.clipOnFirstLaunch == true)
					{
						$R.clipOnFirstLaunch = false;
						$R.menu_functions['clip_to_evernote'].call();
					}
					
					$R.bookmarkletTimer = false;
				});
		};

		
	//	fix flash
	//	=========
		$R.$document.find("param[name='wmode']").attr('value', 'opaque');
		$R.$document.find("embed").attr('wmode', 'opaque');

		
	//	custom hook
	//	===========
		if ($R.beforeLaunchHook) { $R.beforeLaunchHook(); }

		
	//	auto-launch
	//	===========
		$R.bookmarkletClicked();


	})(window.parent.$readable);
});