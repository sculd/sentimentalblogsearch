var GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1?parameters';
var GOOGLE_SEARCH_API_KEY = 'AIzaSyARh47_jyY81ForlXXdEA8cip3TfIXqomQ';
var GOOGLE_SEARCH_CX = '010918738988146953241:uwygbqmwtmi';
var ANALYZER_URL = '/analyzesentiment/analyzeurl/';

// Selectors
var SELECTOR_KEYWORD_INPUT = '#keyword';

var NUM_PER_SEARCH = 3;
var page = 1;
var isDuringUpdate = false;
var ITEM_CSS_CLASS = 'thumbnail row col-xs-10 col-xs-offset-1';

var onSearchResponse = function(response) {
	var i = 0;
	// for loop stalls the layout update so this is the right practice
	var process = function() {
		if (i === response.items.length) {
			isDuringUpdate = false;
			return;
		}

		var item = response.items[i];
		i++;
		// in production code, item.htmlTitle should have the HTML entities escaped.
		var div = $('<div></div>');
		div.html('<a href="' + item.link + '">' + item.htmlTitle + '</a>');
		/*
		var parser = new DOMParser()
		$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(item.link) + '&callback=?', 
			function(data){ console.log(data.contents); });
		*/

		var res = $.ajax({
			async: false, 
			type: 'GET', 
			url: ANALYZER_URL, 
			data: {url: item.link} // item.htmlSnippet
		});
		div.append('<blockquote><p>' + item.htmlSnippet + '</p></blockquote>');
		div.append('<p>' + JSON.stringify(JSON.parse(JSON.stringify(res.responseJSON)),null,2) + '</p>');

		var contentDiv = $('<div>')
		//var content = $.get('/analyzesentiment/urlContent?url=' + item.link)
		//contentDiv.append(content);
		div.append(contentDiv)

		//div.append('<p><a class="various" data-fancybox-type="iframe" href="' + item.link + '">Iframe</a></p>');
		//div.append('<p><a class="various fancybox.iframe" href="http://www.yahoo.com">yahoo</a></p>');
		
		div.addClass(ITEM_CSS_CLASS);
		$('#content').append(div);
		setTimeout(process, 0);

	};

	process();
};

var nextPage = function() {
	page += NUM_PER_SEARCH;
	search();	
}

var search = function(keyword) {
    if ( typeof search.keyword == 'undefined' ) {
        search.keyword = keyword;
    }

	var param = {
		key: GOOGLE_SEARCH_API_KEY, 
		cx: GOOGLE_SEARCH_CX, 
		q: 'allintext:' + search.keyword,
		num: NUM_PER_SEARCH,
		start: page,
	};
	var res = $.get(GOOGLE_SEARCH_URL, param, onSearchResponse);
	console.log(res);
};

$('document').ready(function(){
	// search
    $(SELECTOR_KEYWORD_INPUT).keypress(function(e) {
        // ENTER_KEY_VAL (13) is for enter key
        var KEY_VAL_ENTER = 13;
		if (e.which == KEY_VAL_ENTER) {
			e.preventDefault();
			search($(SELECTOR_KEYWORD_INPUT).val());
		}
    });	

	//$('#select-sentiment').selectize({maxItems: 3});

	// when scrolled to botton, search more
	$(window).scroll(function() {
	   if(!isDuringUpdate && $(window).scrollTop() + $(window).height() == $(document).height()) {
	       console.log("at the bottom");
	       isDuringUpdate = true;
	       nextPage();
	   }
	});	
});

