(function () {

    angular.module('bookmarksApp')
        .config(['$translateProvider', function ($translateProvider) {

        var availableLanguages = [ "en", "fr" ];

        // we used a native language detector approach as some browsers like Edge and IE
        // return en-EN instead of en on Firefox or Chrome

        var userLang = navigator.language || navigator.userLanguage;
        userLang = userLang.split('-')[0];

        // if not in available languages, default to english.
        if (availableLanguages.indexOf(userLang) == -1) {
            userLang = 'en';
        }

        $translateProvider.useUrlLoader('/lang/' + userLang + '.json');
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.preferredLanguage(userLang);

    }]);

}());
