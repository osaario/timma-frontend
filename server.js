
'use strict';
let Cycle = require('@cycle/core');
let express = require('express');
let browserify = require('browserify');
let serialize = require('serialize-javascript');
let {Rx} = Cycle;
let {h, makeHTMLDriver} = require('@cycle/dom');
let {makeHTTPDriver} = require('@cycle/http');
let {app, components} = require('./src/app');

/*
var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic(__dirname)).listen(8080);
*/


function wrapVTreeWithHTMLBoilerplate(vtree, context, clientBundle) {
  return h('html', [
    h('head', [
      h('title', 'Timma'),
      h('link', { href:'http://fonts.googleapis.com/css?family=Open+Sans', rel:'stylesheet', type:'text/css' }),
      h('link', { href:"static/bootstrap/dist/css/bootstrap.min.css",
       rel:'stylesheet', type:'text/css' }),
      h('link', { href:'static/timma.css', rel:'stylesheet', type:'text/css' })
    ]),
    h('body', [
      h('div.app-container', [vtree]),
      h('script', `window.appContext = ${serialize(context)};`),
      h('script', {type:'text/javascript',
       src:'https://maps.googleapis.com/maps/api/js?key=AIzaSyBm46fZQLUDMQVGMHPX4hBOq-pitEa6x6g'}),
      h('script', clientBundle)
    ])
  ]);
}

function prependHTML5Doctype(html) {
  return `<!doctype html>${html}`;
}

function wrapAppResultWithBoilerplate(appFn, context$, bundle$) {
  return function wrappedAppFn(ext) {
    let app = appFn(ext);
    let vtree$ = app.DOM;
    let http$ = app.HTTP;
    let wrappedVTree$ = Rx.Observable.combineLatest(vtree$, context$, bundle$,
      wrapVTreeWithHTMLBoilerplate
    );
    return {
      DOM: wrappedVTree$,
      HTTP: http$
    };
  };
}

let clientBundle$ = (() => {
  let replaySubject = new Rx.ReplaySubject(1);
  let bundleString = '';
  let bundleStream = browserify()
    .transform('babelify')
    //.transform({global: true}, 'uglifyify')
    .add('./client.js')
    .bundle();
  bundleStream.on('data', function (data) {
    bundleString += data;
  });
  bundleStream.on('end', function () {
    replaySubject.onNext(bundleString);
    replaySubject.onCompleted();
    console.log('Client bundle successfully compiled.');
  });
  return replaySubject;
})();

let server = express();


server.use('/static', express.static('public'));
server.use('/static', express.static('node_modules'));
server.use('/static', express.static('styles'));

server.use(function (req, res) {
  // Ignore favicon requests
  if(req.url === '/null') return;
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'});
    res.end();
    return;
  }

  console.log(`req: ${req.method} ${req.url}`);
  /*
  let httpDriver = makeHTTPDriver();
  var response$$ = httpDriver(services_req$);
       response$$.mergeAll().subscribe(
         _ => console.log(_)
       );
       */


  let context$ = Rx.Observable.just(req.url);
  let wrappedAppFn = wrapAppResultWithBoilerplate(app, context$, clientBundle$);
  let [requests, responses] = Cycle.run(wrappedAppFn, {
    DOM: makeHTMLDriver(components()),
    route: () => context$,
    HTTP: makeHTTPDriver()
  });
  let html$ = responses.DOM.get(':root').map(prependHTML5Doctype);
  html$.subscribe(html => res.send(html));
});

let port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port ${port}');
