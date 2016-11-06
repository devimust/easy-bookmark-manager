import { expect } from 'chai';
import { ClientFunction } from 'testcafe';
import { Selector } from 'testcafe';

/**
 * Helper function to return elements by reference (#id, tagname and/or .classname)
 */
const getElementByRef = Selector(ref => document.querySelector(ref));

/**
 * Helper method to return the page title.
 */
const getPageTitle = ClientFunction(() => document.title);

/**
 * Helper method to expect the correct type (e.g. div, li, ul)
 * and child element count.
 */
const snapshotElement = (el, type, childElementCount) => {
    expect(el.hasChildNodes).to.be.true;
    expect(el.tagName).eql(type);
    expect(el.childElementCount).eql(childElementCount);
    expect(el.hasChildElements).to.be.true;
    expect(el.visible).to.be.true;
    expect(el.hasChildNodes).to.be.true;
    return null;
}

/**
 * Helper method to return element by id.
 */
const getElementById = Selector(id => document.getElementById(id));

/**
 * Helper method to return element(s) by classnames.
 */
const getElementsByClassName = Selector(className => document.getElementsByClassName(className));

module.exports = {
    getElementByRef: getElementByRef,
    getPageTitle: getPageTitle,
    snapshotElement: snapshotElement,
    getElementById: getElementById,
    getElementsByClassName: getElementsByClassName
}
