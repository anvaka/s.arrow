# s.arrow

SVG arrow for simplesvg. I noticed I was duplicating code a lot, so extracted
this into a module.

# usage

General case:

``` js
var arrow = require('s.arrow');
// svgRoot is a parent dom element.
var ui = arrow(svgRoot);
ui.stoke('orangered');
var from = {x: 0, y: 0};
var to = { x: 42, y: 42};
ui.render(from, to);
```

Usage with [ngraph.svg](https://github.com/anvaka/ngraph.svg):

```
var render = require('ngraph.svg');
var arrow = require('s.arrow');
var svg = render.svg;
var renderer = render(graph);

// use circles for nodes:
renderer.node(createNode).placeNode(placeNode);
// render arrows, and stop precisely at intersection with circle:
renderer.link(createLink).placeLink(placeLink);

function createNode() {
  var ui = svg('circle', {
    r: 10, // radius 10, we will use later
    fill: 'deepskyblue'
  });
  return ui;
}

function placeNode(ui, pos) {
  ui.attr('transform', 'translate(' + pos.x + ',' + pos.y + ')');
}

function createLink() {
  var ui = arrow(renderer.svgRoot);
  ui.stroke('#5A5D6E');
  return ui;
}

function placeLink(ui, from, to, link) {
  ui.render(
    arrow.intersectCircle(from, to, 10), // from
    arrow.intersectCircle(to, from, 10) // to
  );
}
```

I know, it's too much code. Please let me know how would you make it simpler.

# install

With [npm](https://npmjs.org) do:

```
npm install s.arrow
```

# license

MIT
