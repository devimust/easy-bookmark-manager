/*jshint scripturl:true*/

var API_URL = window.location.origin + '/api/v1/';

(function () {
	angular.module('bookmarksApp', ['ngRoute', 'angucomplete-alt', 'ui.ace']);
}());

$(function () {
	function generateBookmarkMe() {

		function extractDomain(url) {
			var domain;
			//find & remove protocol (http, ftp, etc.) and get domain
			if (url.indexOf("://") > -1) {
				domain = url.split('/')[2];
			} else {
				domain = url.split('/')[0];
			}
			//find & remove port number
			domain = domain.split(':')[0];
			return window.location.protocol + '//' + domain + '/';
		}

		var bookmarkMeText = '';
		bookmarkMeText += '(';
		bookmarkMeText += ' function() {';
		bookmarkMeText += ' 	l="' + extractDomain(window.location.href) + '#/bookmark/add?title="+encodeURIComponent(document.title)+"&link="+encodeURIComponent(window.location.href);';
		bookmarkMeText += ' 	var e=window.open(l+"&window=1","EasyBookmarkManager","location=0,links=0,scrollbars=0,toolbar=0,width=594,height=600");';
		bookmarkMeText += ' }';
		bookmarkMeText += ')()';

		$('a.bookmark-me-link').attr('href', 'javascript:' + encodeURIComponent(bookmarkMeText));
	}

	generateBookmarkMe();
});
