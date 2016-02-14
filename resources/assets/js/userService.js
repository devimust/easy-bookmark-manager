(function () {

	var userService = function ($location, $http) {

		var service = {

			model: {
				userId: '',
				token: ''
			},

			setModel: function (user) {
				this.model = user;
				this.saveState();
			},

			getModel: function () {
				this.restoreState();
				return this.model;
			},

			clearModel: function () {
				this.model = {
					userId: '',
					token: ''
				};
				this.saveState();
			},

			saveState: function () {
				if (typeof(Storage) === "undefined") {
					return;
				}
				localStorage.setItem('userService', angular.toJson(this.model));
			},

			resetAuthToken: function () {
				return $http
					.get(API_URL + 'user/resetAuthToken?' + $.param(this.model))
					.then(function (response) {
						return response.data;
					});
			},

			getDetails: function () {
				return $http
					.get(API_URL + 'user/details?' + $.param(this.model))
					.then(function (response) {
						return response.data;
					});
			},

			updateDetails: function (data) {
				return $http
					.get(API_URL + 'user/updateDetails?' + $.param(this.model) + '&' + $.param(data))
					.then(function (response) {
						return response.data;
					});
			},

			checkAuthToken: function () {
				return $http
					.get(API_URL + 'user/checkAuthToken?' + $.param(this.model))
					.then(function (response) {
						return response.data;
					});
			},

			login: function (data) {
				that = this;
				return $http
					.get(API_URL + 'login?' + $.param(data))
					.then(function (response) {
						// if (response.data.result == 'ok') {
						// 	that.setModel(response.data.data);
						// }
						return response.data;
					});
			},

			restoreState: function () {
				if (typeof(Storage) === "undefined") {
					return;
				}

				var localUser = localStorage.getItem('userService');
				if (localUser && typeof localUser !== 'undefined') {
					this.model = angular.fromJson(localUser);
				}

			}
		};

		return service;

	};

	angular.module('bookmarksApp')
		.service('userService', ['$location', '$http', userService]);

}());
