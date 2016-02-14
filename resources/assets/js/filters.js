(function () {

	var filterByTags = function () {
		return function (items, tags, categories) {
			var filtered = [];

			(items || []).forEach(function (item) {

				var tagExist = false;
				(item.tags || []).forEach(function (itemTag) {
					if (tags.indexOf(itemTag) != -1) {
						tagExist = true;
					}
				});

				var categoryExist = false;

				if (categories.indexOf(item.category) != -1) {
					categoryExist = true;
				}

				if (categories.length === 0 && tags.length === 0) {
					filtered.push(item);
				} else if (tags.length === 0 && categoryExist) {
					filtered.push(item);
				} else if (categories.length === 0 && tagExist) {
					filtered.push(item);
				} else if (categoryExist && tagExist) {
					filtered.push(item);
				}

			});
			return filtered;
		};
	};

	var cut = function () {
		return function (value, wordwise, max, tail) {
			if (!value) return '';

			max = parseInt(max, 10);
			if (!max) return value;
			if (value.length <= max) return value;

			value = value.substr(0, max);
			if (wordwise) {
				var lastspace = value.lastIndexOf(' ');
				if (lastspace != -1) {
					value = value.substr(0, lastspace);
				}
			}

			return value + (tail || ' …');
		};
	};

	angular.module('bookmarksApp')
		.filter('filterByTags', filterByTags);

	angular.module('bookmarksApp')
		.filter('cut', cut);

}());
