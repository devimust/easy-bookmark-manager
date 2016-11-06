import { expect } from 'chai';

import { getElementByRef, getPageTitle, snapshotElement, getElementById, getElementsByClassName } from './helpers';


fixture `Easy bookmark manager test`
    .page('http://localhost:8000/');


test('Ensure the page has the correct page title', async t => {
    // Use the Selector function to get access to the article header
    const pageTitle = await getPageTitle();

    // Use the assertion to
    // check if the actual page title is equal to the expected one
    expect(pageTitle).to.equal('Easy Bookmark Manager');
});

test('Prevent login with invalid credentials', async t => {
    await t
        .typeText('#username', 'admin')
        .typeText('#password', 'badpassword')
        .click('#submit-button')
        .wait(1000);

    const visible = (await t.select(() => document.querySelector('div.bg-danger.alert'))).visible;
    expect(visible).to.be.true;

    const message = (await t.select(() => document.querySelector('div.bg-danger.alert ul li'))).innerText;
    expect(message).to.equal('That username/password combo does not exist.');
});

test('Ensure all default elements display correctly after correctly logging in', async t => {
    await t
       .typeText('#username', 'admin')
       .typeText('#password', 'nimda')
       .click('#submit-button')
       .wait(1000);

    // Expect 8 child elements on the ul ref object
    snapshotElement(await getElementByRef('#categories ul'), 'ul', 8);

    // Check if panel heading match
    expect((await getElementByRef('#categories div.panel-heading')).innerText).eql('Categories');

    // Expect 37 child elements on the ul ref object
    snapshotElement(await getElementByRef('#tagcloud ul'), 'ul', 37);

    // Check if panel heading match
    expect((await getElementByRef('#tags div.panel-heading')).innerText).eql('Tags');

    // Expect 11 child elements on the div ref object
    snapshotElement(await getElementByRef('#search div.search-results'), 'div', 11);
});
