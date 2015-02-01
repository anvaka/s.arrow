module.exports = arrow;
var svg = require('simplesvg');

function arrow(root) {
  if (!root) {
    throw new Error('Arrow expects a `root` object: parent element where all defs will be defined');
  }
  var dom = svg('path');
  var defs;

  // svg element should have <defs> with all strokes defined in there.
  var knownStrokes = root.arrowStroke;
  if (!root.arrowStroke) {
    knownStrokes = root.arrowStroke = {};
  }

  // we are augmenting svg DOM element with our API. Is this really bad? ಠ_ಠ
  dom.stroke = stroke;
  dom.render = render;

  return dom;

  function render(from, to) {
    dom.attr('d', 'M ' + from.x + ' ' + from.y + ' L ' + to.x + ' ' + to.y);
  }

  function stroke(color) {
    if (typeof color !== 'string' && typeof color !== 'number') {
      throw new Error('Storke color is expected to be a string or a number');
    }

    var strokeDef = knownStrokes[color];
    if (!strokeDef) {
      knownStrokes[color] = strokeDef = defineStroke(color);
    }

    dom.attr('marker-end', 'url(#' + strokeDef + ')').attr('stroke', color);
  }

  function defineStroke(color) {
    if (!defs) {
      defs = root.getElementsByTagName('defs')[0] || createDefs();
    }

    var id = 'triangle_' + normalizeColor(color);
    var marker = svg.compile([
      '<marker id="' + id + '"',
      '        viewBox="0 0 10 10"',
      '        refX="8" refY="5"',
      '        markerUnits="strokeWidth"',
      '        markerWidth="10" markerHeight="5"',
      '        orient="auto" style="fill: ' + color + '">',
      '  <path d="M 0 0 L 10 5 L 0 10 z"></path>',
      '</marker>'
    ].join('\n'));

    defs.appendChild(marker);

    return id;
  }

  function createDefs() {
    defs = svg('defs');
    root.appendChild(defs);
    return defs;
  }
}

function normalizeColor(color) {
  if (typeof color === 'number') {
    return color.toString(16);
  } else if (color[0] === '#') {
    return color.substr(1);
  }
}

// returns position of intersection with circle of radius `circleRadius`
// in the `end` position;
arrow.intersectCircle = function (start, end, circleRadius) {
  var width = end.x - start.x;
  var height = end.y - start.y;
  var angle = Math.atan2(height, width);
  var dx = Math.cos(angle) * circleRadius;
  var dy = Math.sin(angle) * circleRadius;
  return {
    x: end.x - dx,
    y: end.y - dy
  };
};
