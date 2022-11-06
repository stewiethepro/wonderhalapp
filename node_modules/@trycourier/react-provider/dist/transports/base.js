"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transport = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Transport = function Transport() {
  var _this = this;

  (0, _classCallCheck2["default"])(this, Transport);

  this.emit = function (courierEvent) {
    if (!_this.listeners.length) {
      console.warn("No Listeners Registered");
      return;
    }

    var _iterator = _createForOfIteratorHelper(_this.listeners),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var listener = _step.value.listener;
        listener(courierEvent);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  this.listen = function (listener) {
    var didReplaceListener = false;
    _this.listeners = _this.listeners.map(function (l) {
      if (l.id === listener.id) {
        didReplaceListener = true;
        return listener;
      }

      return l;
    });

    if (didReplaceListener) {
      return;
    }

    _this.listeners.push(listener);
  };

  this.intercept = function (cb) {
    _this.interceptor = cb;
  };

  this.listeners = [];
  this.interceptor = undefined;
}
/** Callback for emitted events  */
;

exports.Transport = Transport;