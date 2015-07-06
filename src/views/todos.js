import {Rx} from '@cycle/core';
import {h} from '@cycle/web';
import {propHook} from '../utils';

function vrenderHeader(todosData) {
  return h('header#header', [
    h('h1', 'timma')
  /*  h('input#new-todo', {
      type: 'text',
      value: propHook(elem => { elem.value = todosData.input; }),
      attributes: {
        placeholder: 'Shit needs to be done'
      },
      autofocus: true,
      name: 'newTodo'
    })*/
  ]);
}

function vrenderMainSection(todosData) {
  return h('section#main', {
    style: {'display': ''}
  }, [
    h('input#toggle-all', {
      type: 'checkbox',
      checked: true
    }),
    h('ul#todo-list', todosData
      .map(todoData =>
        h('todo-item.todo-item', {
          key: todoData.id,
          todoid: todoData.id,
          content: todoData.lastMinuteInfo.customerName,
          completed: todoData.completed
        })
      )
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
        vrenderHeader(todos),
        vrenderMainSection(todos)
        //vrenderFooter(todos)
      ])
    )
  };
};
