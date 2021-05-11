'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Tooltip = require('@material-ui/core/Tooltip');
var SimpleDecorator = require('draft-js-simpledecorator');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Tooltip__default = /*#__PURE__*/_interopDefaultLegacy(Tooltip);
var SimpleDecorator__default = /*#__PURE__*/_interopDefaultLegacy(SimpleDecorator);

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

var unique = function unique(value, index, arr) {
  return arr.indexOf(value) === index;
};

var Fragmenter = /*#__PURE__*/function () {
  function Fragmenter(styles) {
    this.data = void 0;
    this.tooltip = void 0;
    this.data = Object.keys(styles).reduce(function (acc, key) {
      acc[key] = [];
      return acc;
    }, {});
    this.tooltip = {};
  }

  var _proto = Fragmenter.prototype;

  _proto.getDecoratedRanges = function getDecoratedRanges() {
    var result = [];
    var ranges = this.getAbsoluteRanges();

    for (var _iterator = _createForOfIteratorHelperLoose(ranges), _step; !(_step = _iterator()).done;) {
      var range = _step.value;
      result.push(this.getStylesForRange(range));
    }

    return result;
  };

  _proto.isMultiply = function isMultiply() {
    var _this = this;

    return Object.keys(this.data).reduce(function (acc, key) {
      acc += _this.data[key].length > 0 ? 1 : 0;
      return acc;
    }, 0) > 1;
  };

  _proto.getSimpleRanges = function getSimpleRanges() {
    for (var _i = 0, _Object$keys = Object.keys(this.data); _i < _Object$keys.length; _i++) {
      var _key = _Object$keys[_i];

      if (this.data[_key].length > 0) {
        return {
          range: this.data[_key],
          style: _key,
          tooltip: this.tooltip
        };
      }
    }
  };

  _proto.add = function add(nick, range, label) {
    if (!this.data[nick]) {
      throw Error("Style " + nick + " is undefined");
    }

    this.data[nick].push(range);

    if (label) {
      this.tooltip[nick] = label;
    }
  };

  _proto.getAbsoluteRanges = function getAbsoluteRanges() {
    var merged = [];

    for (var _i2 = 0, _Object$keys2 = Object.keys(this.data); _i2 < _Object$keys2.length; _i2++) {
      var _merged;

      var _key2 = _Object$keys2[_i2];
      merged = (_merged = merged).concat.apply(_merged, this.data[_key2]);
    }

    var ranges = merged.filter(unique).sort(function (a, b) {
      return a - b;
    });
    var result = [];

    for (var i = 0; i < ranges.length - 1; i++) {
      result.push([ranges[i], ranges[i + 1]]);
    }

    return result;
  };

  _proto.getStylesForRange = function getStylesForRange(range) {
    var start = range[0];
    var end = range[1];
    var styles = [];

    for (var _i3 = 0, _Object$keys3 = Object.keys(this.data); _i3 < _Object$keys3.length; _i3++) {
      var _key3 = _Object$keys3[_i3];

      if (this.data[_key3]) {
        for (var _iterator2 = _createForOfIteratorHelperLoose(this.data[_key3]), _step2; !(_step2 = _iterator2()).done;) {
          var r = _step2.value;

          if (r.length !== 2) {
            continue;
          }

          if (start >= r[0] && end <= r[1] || r[0] >= start && r[1] <= end) {
            styles.push(_key3);
            break;
          }
        }
      }
    }

    return {
      range: [start, end],
      styles: styles,
      tooltip: this.tooltip
    };
  };

  return Fragmenter;
}();

function escapeRegExp(s) {
  return s.replace(/[.*+\-?^${}()|[\]\\]/gi, "\\$&");
}

function getProperties(t) {
  return _extends({}, t);
}

function LengthMatcher(fragmenter, length, style, contentBlock, tooltip) {
  var text = contentBlock.getText();
  var wordsLongerThan = text.split(" ").filter(function (word) {
    return word.length > length;
  });
  wordsLongerThan.forEach(function (word) {
    var start = text.indexOf(word);
    var end = start + word.length;

    if (start !== -1) {
      fragmenter.add(style, [start, end], tooltip);
    }
  });
}
function WordMatcher(fragmenter, items, style, contentBlock, tooltip) {
  var text = contentBlock.getText();

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var regex = new RegExp("\\b" + escapeRegExp(item) + "[a-zA-Z]*\\b", "ig");
    var matchArr = null;

    while ((matchArr = regex.exec(text)) !== null) {
      var match = matchArr[0];
      var start = matchArr.index;
      var end = start + match.length;
      fragmenter.add(style, [start, end], tooltip);
    }
  }
}
function ExactWordMatcher(fragmenter, items, style, contentBlock, tooltip) {
  var text = contentBlock.getText();

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var regex = new RegExp("\\b" + escapeRegExp(item) + "\\b", "ig");
    var matchArr = null;

    while ((matchArr = regex.exec(text)) !== null) {
      var match = matchArr[0];
      var start = matchArr.index;
      var end = start + match.length;
      fragmenter.add(style, [start, end], tooltip);
    }
  }
}
function SentenceMatcher(fragmenter, items, style, contentBlock, tooltip) {
  var text = contentBlock.getText();

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var start = text.toLowerCase().indexOf(item.toLowerCase());
    var end = start + item.length;

    if (start === -1) {
      continue;
    }

    fragmenter.add(style, [start, end], tooltip);
  }
}
function MultiHighlightDecorator(config) {
  var allowedSpanStyles = ["color", "backgroundColor", "borderBottomWidth", "borderBottomColor", "borderBottomStyle", "display"];
  return new SimpleDecorator__default['default'](function strategy(contentBlock, callback) {
    var fragments = new Fragmenter(config.styles);

    for (var _iterator = _createForOfIteratorHelperLoose(config.rules), _step; !(_step = _iterator()).done;) {
      var rule = _step.value;

      if (rule.length) {
        rule.matcher(fragments, rule.length, rule.style, contentBlock, rule.tooltip);
      } else {
        rule.matcher(fragments, rule.content, rule.style, contentBlock, rule.tooltip);
      }
    }

    if (fragments.isMultiply()) {
      var ranges = fragments.getDecoratedRanges();
      console.log("MULTI RANGE");
      console.log(ranges);

      var _loop = function _loop() {
        var range = _step2.value;
        var style = {};

        for (var _iterator3 = _createForOfIteratorHelperLoose(range.styles), _step3; !(_step3 = _iterator3()).done;) {
          var s = _step3.value;
          style = _extends({}, style, getProperties(config.styles[s]));
        }

        callback(range.range[0], range.range[1], {
          styling: style,
          tooltip: range.styles.length <= 1 ? range.tooltip[range.styles[0]] : range.styles.map(function (style) {
            return range.tooltip[style];
          }).join(", ")
        });
      };

      for (var _iterator2 = _createForOfIteratorHelperLoose(ranges), _step2; !(_step2 = _iterator2()).done;) {
        _loop();
      }
    } else {
      var singleRanges = fragments.getSimpleRanges();

      if (singleRanges) {
        for (var _iterator4 = _createForOfIteratorHelperLoose(singleRanges.range), _step4; !(_step4 = _iterator4()).done;) {
          var range = _step4.value;
          callback(range[0], range[1], {
            styling: config.styles[singleRanges.style],
            tooltip: singleRanges.tooltip[singleRanges.style]
          });
        }
      }
    }
  }, function component(_ref) {
    var styling = _ref.styling,
        tooltip = _ref.tooltip,
        children = _ref.children;
    var styles = {};

    for (var _iterator5 = _createForOfIteratorHelperLoose(allowedSpanStyles), _step5; !(_step5 = _iterator5()).done;) {
      var s = _step5.value;

      if (styling[s] !== undefined) {
        styles[s] = styling[s];
      }
    }

    return tooltip ? /*#__PURE__*/React__default['default'].createElement(Tooltip__default['default'], {
      title: tooltip,
      placement: "right"
    }, /*#__PURE__*/React__default['default'].createElement("span", {
      style: styles
    }, children)) : /*#__PURE__*/React__default['default'].createElement("span", {
      style: styles
    }, children);
  });
}

exports.ExactWordMatcher = ExactWordMatcher;
exports.LengthMatcher = LengthMatcher;
exports.MultiHighlightDecorator = MultiHighlightDecorator;
exports.SentenceMatcher = SentenceMatcher;
exports.WordMatcher = WordMatcher;
