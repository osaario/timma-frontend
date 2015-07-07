import {Rx} from '@cycle/core';
import {h} from '@cycle/web';
import {propHook} from '../utils';
import OfficesMap from '../widgets/googlemap-widget'


function vrenderMainSection(todosData) {
  return h('section#main', {
    style: {'display': ''}
  }, [
    new OfficesMap(0.5),
    h('ul.list-group',
    _.chain(todosData)
    .groupBy(x => x.customerId)
    .map(todoData =>
      h('li.list-group-item', [
        h('div.row', [
          h('div.col-sm-3', [
            h('a.thumbnail', [
              h('img', {"src": todoData[0].lastMinuteInfo.imageUrl})
            ]),
          ]),
          h('div.col-sm-9', [
            h('h3', todoData[0].lastMinuteInfo.customerName),
            h('div', todoData[0].lastMinuteInfo.district)
          ]),
        ])
      ])
    ).value()
    )
  ])
}

/*
function vrenderFooter(todosData) {
  let amountCompleted = todosData.list
    .filter(todoData => todoData.completed)
    .length;
  let amountActive = todosData.list.length - amountCompleted;
  return h('footer#footer', {
    style: {'display': todosData.list.length ? '' : 'none'}
  }, [
    h('span#todo-count', [
      h('strong', String(amountActive)),
      ' item' + (amountActive !== 1 ? 's' : '') + ' left'
    ]),
    h('ul#filters', [
      h('li', [
        h('a' + (todosData.filter === '' ? '.selected' : ''), {
          attributes: {'href': '#/'}
        }, 'All')
      ]),
      h('li', [
        h('a' + (todosData.filter === 'active' ? '.selected' : ''), {
          attributes: {'href': '#/active'}
        }, 'Active')
      ]),
      h('li', [
        h('a' + (todosData.filter === 'completed' ? '.selected' : ''), {
          attributes: {'href': '#/completed'}
        }, 'Completed')
      ])
    ]),
    (amountCompleted > 0 ?
      h('button#clear-completed', 'Clear completed (' + amountCompleted + ')')
      : null
    )
  ])
}
*/

export default function view(todos$) {
  return {
    DOM: todos$.map(todos =>
      h('div', [
        vrenderMainSection(todos)
        //vrenderFooter(todos)
      ])
    )
  };
};
