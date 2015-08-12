import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import {propHook} from '../utils';
import {strings} from '../strings/strings';


function vrenderNav() {
  return h('nav.navbar.navbar-default', [
      h('div.container-fluid', [
        h('div.navbar-header', [
            h('a.navbar-brand', 'Timma')
        ])
      ])
  ]);
}

function vRenderServices() {
  return h('div#services.container', [
      h('div.row', [
          h('div.col-md-6', "gkaeogeokkoaegokgea"),
          h('div.col-md-6', "gkaeogeokkoaegokgea")
      ]),
      h('div.row', [
          h('div.col-md-6', "gkaeogeokkoaegokgea"),
          h('div.col-md-6', "gkaeogeokkoaegokgea")
      ])
  ]);
}

function vRenderImageSearch() {
  return h('div.jumbotron', { style: {
    'background-image': "url('../static/images/landing.jpg')"
  }}, [
    h('div.container', [
      h('h1.landing_text', strings.landing_header_1),
      h('p.landing_text', strings.landing_caption_1),
      h('div.input-group', [
        h('input.form-control', {'type':'text', 'placeholder': strings.landing_city_search_placeholder}),
        h('span.input-group-btn', [
          h('button.btn.btn-default', {'type': 'button'}, strings.search)
        ])
      ])
    ])
  ]);
  /*
  <div class="input-group">
      <input type="text" class="form-control" placeholder="Search for...">
      <span class="input-group-btn">
        <button class="btn btn-default" type="button">Go!</button>
      </span>
    </div><!-- /input-group -->
  <div class="input-group">
  <span class="input-group-addon" id="basic-addon1">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">
</div>
*/
}

export default function view(todos$) {
  return todos$.map(todos =>
      h('div.app-div', [
        vrenderNav(),
        vRenderImageSearch(),
        vRenderServices()
      ])
    );
}
