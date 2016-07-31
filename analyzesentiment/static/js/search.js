var GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1?parameters';
var GOOGLE_SEARCH_API_KEY = 'AIzaSyARh47_jyY81ForlXXdEA8cip3TfIXqomQ';
var GOOGLE_SEARCH_CX = '010918738988146953241:uwygbqmwtmi';
var ANALYZER_URL = '/analyzesentiment/analyzeurl/';

// Selectors
var SELECTOR_KEYWORD_INPUT = '#keyword';

var NUM_PER_SEARCH = 6;
var page = 1;
var isDuringUpdate = false;
var ITEM_CSS_CLASS = 'thumbnail row col-xs-10 col-xs-offset-1';

var onAnalyze = function(responseJSON) {
	var getIconHtml = function(name, score) {
		var em = 0.70 + 0.3 + parseFloat(score) * 2.0;
		var opacity = 0.4 + parseFloat(score) * 0.6;
		var fontColor = 'black'
		if (name === 'Sad') {
			fontColor = 'blue';
		} else if (name === 'Joyful') {
			fontColor = 'green';
		} else if (name === 'Angry') {
			fontColor = 'red';
		} else if (name === 'Surprised') {
			fontColor = 'black';
		} else if (name === 'Fearful') {
			fontColor = 'purple';
		}
		return '<span style="opacity: ' + opacity + ';"><span style="color:' + fontColor + '; font-size: ' + em + 'em; margin: 6px 0px;">' + name + '</span>' +
			   '<span style="display:inline-block; margin-left: 10px;"></span>' + '</span>';
	}

	var div = $('<div></div>');
	div.html('<p class="lead"> <a href="' + this.indexValue.url + '"> ' + this.indexValue.title + '</a></p>');
	div.append('<blockquote><p>' + this.indexValue.snippet + '</p></blockquote>');
	//div.append('<p>' + JSON.stringify(JSON.parse(JSON.stringify(res.responseJSON)),null,2) + '</p>');

	div.append(getIconHtml('Sad', responseJSON['sadness']));
	div.append(getIconHtml('Joyful', responseJSON['joy']));
	div.append(getIconHtml('Angry', responseJSON['anger']));
	div.append(getIconHtml('Surprised', responseJSON['surprise']));
	div.append(getIconHtml('Fearful', responseJSON['fear']));
	// sadness, joy, anger, surprise, fear

	var contentDiv = $('<div>')
	//var content = $.get('/analyzesentiment/urlContent?url=' + item.link)
	//contentDiv.append(content);
	div.append(contentDiv)

	div.addClass(ITEM_CSS_CLASS);
	$('#content').append(div);	
}

var onSearchResponse = function(response) {
	var i = 0;
	// for loop stalls the layout update so this is the right practice
	var process = function() {
		if (i === response.items.length) {
			isDuringUpdate = false;
			$('.spin').hide();
			return;
		}

		var item = response.items[i];
		i++;
		// in production code, item.htmlTitle should have the HTML entities escaped.
		var div = $('<div></div>');
		div.html('<p class="lead"> <a href="' + item.link + '"> ' + item.htmlTitle + '</a></p>');
		/*
		var parser = new DOMParser()
		$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(item.link) + '&callback=?', 
			function(data){ console.log(data.contents); });
		*/

		var res = $.ajax({
			type: 'GET', 
			url: ANALYZER_URL, 
			indexValue: {url: item.link, title: item.htmlTitle, snippet: item.htmlSnippet},
			data: {url: item.link, title: item.htmlTitle, snippet: item.htmlSnippet}, // item.htmlSnippet
			success: onAnalyze,
		});
		/*
		div.append('<blockquote><p>' + item.htmlSnippet + '</p></blockquote>');
		//div.append('<p>' + JSON.stringify(JSON.parse(JSON.stringify(res.responseJSON)),null,2) + '</p>');
		div.append(getIconHtml('Sad', res.responseJSON['sadness']));
		div.append(getIconHtml('Joyful', res.responseJSON['joy']));
		div.append(getIconHtml('Angry', res.responseJSON['anger']));
		div.append(getIconHtml('Surprised', res.responseJSON['surprise']));
		div.append(getIconHtml('Fearful', res.responseJSON['fear']));
		// sadness, joy, anger, surprise, fear

		var contentDiv = $('<div>')
		//var content = $.get('/analyzesentiment/urlContent?url=' + item.link)
		//contentDiv.append(content);
		div.append(contentDiv)

		div.addClass(ITEM_CSS_CLASS);
		$('#content').append(div);
		//*/
		setTimeout(process, 0);

	};

	process();
};

var nextPage = function() {
	page += NUM_PER_SEARCH;
	search(null, true);	
}

var search = function(keyword, keep) {
    if ( typeof search.keyword == 'undefined' ) {
        search.keyword = keyword;
    }

	if (!keep) {
		$('#content').html('');
	}

	var param = {
		key: GOOGLE_SEARCH_API_KEY, 
		cx: GOOGLE_SEARCH_CX, 
		q: 'allintext:' + search.keyword,
		num: NUM_PER_SEARCH,
		start: page,
	};
	var res = $.get(GOOGLE_SEARCH_URL, param, onSearchResponse);
	$('.spin').show();
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

