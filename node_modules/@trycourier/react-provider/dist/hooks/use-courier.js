"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _ = require("../");

function useCourier() {
  return (0, _react.useContext)(_.CourierContext);
}

var _default = useCourier;
exports["default"] = _default;