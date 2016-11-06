var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    assert = chai.assert;

describe('basic functionality', function() {

    before(function() {
        browser
            .setViewportSize({
                width: 1280,
                height: 1024
            }, false)
            .url('/');
    });

    describe('basic login', function() {

        it('should have the correct page title', function () {
            browser.url('/');
            var title = browser.getTitle();
            assert.equal(title, 'Easy Bookmark Manager');
        });

        it('should not login with invalid credentials', function () {
            browser
                .setValue('#username', 'admin')
                .setValue('#password', 'badpassword')
                .submitForm('#login-form');

            // wait for page to load
            browser.pause(1000);

            assert.equal(browser.isVisible('div.bg-danger.alert'), true);
            assert.equal(browser.getText('div.bg-danger.alert ul li'), 'That username/password combo does not exist.');
        });

        it('should login with valid credentials', function () {
            browser
                .setValue('#username', 'admin')
                .setValue('#password', 'nimda')
                .submitForm('#login-form');

            // wait for page to load
            browser.pause(1000);
        });

        //it('should logout', function () {
        //
        //});

    });

    describe('visual elements', function() {

        it('should ensure the "load more..." link behavior', function () {
            assert.equal(browser.isVisible('div.categories div.panel-heading'), true);
            assert.equal(browser.getText('div.categories div.panel-heading'), 'Categories');

            //click load more works and disappearing
            assert.equal(browser.isVisible('div.categories ul li.load-more'), true);
            browser.click('div.categories ul li.load-more');
            assert.equal(browser.isVisible('div.categories ul li.load-more'), false);
        });

        it('should pass a visual regression test against the baseline', function () {
            //browser.saveScreenshot('./tests/screenshots/compare-list.png');
            //compare against baseline
        });

        it('must contain the correct number of search result items', function () {

            //contain 10 items on page
            var elems = browser.getText('div.search-results div.bs-callout');
            var count = 0;
            elems.forEach(function(elem){
                count++;
            });
            assert.equal(count, 10);

            //page number says 1/4
            assert.equal(browser.getText('p.prev-next-pages'), '1 / 4');

            //previous button hidden
            assert.equal(browser.isVisible('div.prev-next .button-previous'), false);
            //next button visible
            assert.equal(browser.isVisible('div.prev-next .button-next'), true);

            //click next 4 times should have 9 items
            browser.click('div.prev-next .button-next');
            browser.pause(200);
            browser.click('div.prev-next .button-next');
            browser.pause(200);
            browser.click('div.prev-next .button-next');
            browser.pause(200);

            //previous button visible
            assert.equal(browser.isVisible('div.prev-next .button-previous'), true);
            //next button hidden
            assert.equal(browser.isVisible('div.prev-next .button-next'), false);

            //contain 9 items on page
            var elems = browser.getText('div.search-results div.bs-callout');
            var count = 0;
            elems.forEach(function(elem){
                count++;
            });
            assert.equal(count, 9);

            //page number says 4/4
            assert.equal(browser.getText('p.prev-next-pages'), '4 / 4');
        });

        //it('must show 5 buttons on the main page', function () {
        //
        //});
        //
        //it('search api should return 2 items', function () {
        //
        //});
        //
        //it('click on clear should empty search and return 10 items', function () {
        //
        //});
        //
        //it('click on category Servers should return 4 items and unclick should return 10 items', function () {
        //
        //});
        //
        //it('click on remote should return 2 items', function () {
        //
        //});
        //
        //it('click on server should return 3 items (including clicked remote)', function () {
        //
        //});
        //
        //it('click on category design should result in 4 items (including tags)', function () {
        //
        //});
        //
        //it('edit item and save', function () {
        //
        //});
        //
        //it('create new item', function () {
        //
        //});
        //
        //it('delete item', function () {
        //
        //});

    });
});
