(function () {

    var englishTranslations = {
        'user.update': 'update user',
        'user.logout' : 'logout',
        'export.bookmarks' : 'export bookmarks',
        'import.bookmarks' : 'Import bookmarks',
        'new.bookmark' : 'New bookmark',
        'search.bookmark' : 'Refine search'
    };

    var frenchTranslations = {
        "user.update": "Paramètres",
        'user.logout' : 'Déconnexion',
        'export.bookmarks' : 'Exporter favoris',
        'import.bookmarks' : 'Importer favoris',
        'new.bookmark' : 'Nouveau favoris',
        'search.bookmark' : 'Chercher parmis les favoris'
    };

    angular.module('bookmarksApp').config(function ($translateProvider) {
        $translateProvider.translations('en', englishTranslations);

        $translateProvider.translations('fr', frenchTranslations);
        $translateProvider.determinePreferredLanguage();
    })

}());
