/* global jest,describe,beforeEach,it,expect */

jest.autoMockOff();
jest.dontMock('../DatagridActions');
jest.dontMock('../../../Test/RouterWrapper');
jest.setMock('react-router', {Link : require('../../Button/__mocks__/Link')});

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var DatagridActions = require('../DatagridActions');
var routerWrapper = require('../../../Test/RouterWrapper');

var Entry = require('admin-config/lib/Entry');

function getActions(entityName, listActions, entry, size=null) {
    return routerWrapper(() => {
        return <DatagridActions entityName={entityName} listActions={listActions} entry={entry} size={size} />
    });
}

describe('DatagridActions', () => {
    var myEntry;

    beforeEach(() => {
        myEntry = new Entry('posts', { 'id': 1, 'title': 'First Post' }, 1);
    });

    describe('Without actions', () => {
        it('Should not display anything', () => {
            var actions = getActions('MyEntity', [], myEntry);
            actions = React.findDOMNode(actions);

            expect(actions.childNodes.length).toEqual(0);
        });
    });

    describe('With actions', () => {
        it('Should display list of buttons with default size', () => {
            var actions = getActions('MyEntity', ['edit', 'delete'], myEntry);
            actions = React.findDOMNode(actions);

            expect(actions.childNodes.length).toEqual(2);
            expect(actions.childNodes[0].textContent).toContain('Edit');
            expect(actions.childNodes[1].textContent).toContain('Delete');
            expect(actions.childNodes[0].className).toEqual('btn btn-default');
        });

        it('Should display list of buttons with specified', () => {
            var actions = getActions('MyEntity', ['edit', 'delete'], myEntry, 'xs');
            actions = React.findDOMNode(actions);

            expect(actions.childNodes[0].className).toEqual('btn btn-default btn-xs');
        });

        it('Should display clickable button', () => {
            var actions = getActions('MyEntity', ['edit'], myEntry);
            actions = React.findDOMNode(actions);

            var edit = actions.childNodes[0];
            TestUtils.Simulate.click(edit);

            expect(edit.attributes['data-click-to'].value).toEqual('edit');
            expect(edit.attributes['data-params'].value).toEqual('{"entity":"MyEntity","id":1}');
        });
    });
});
