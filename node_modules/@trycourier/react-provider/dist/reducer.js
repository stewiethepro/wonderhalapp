"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.registerReducer = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var reducers = {};

var registerReducer = function registerReducer(scope, reducer) {
  if (scope === "root") {
    return;
  }

  reducers[scope] = reducer;
};

exports.registerReducer = registerReducer;

var rootReducer = function rootReducer(state, action) {
  var _action$type$split = action.type.split("/"),
      _action$type$split2 = (0, _slicedToArray2["default"])(_action$type$split, 1),
      scope = _action$type$split2[0];

  if (scope !== "root" && reducers[scope]) {
    var newState = reducers[scope](state === null || state === void 0 ? void 0 : state[scope], action);
    return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, scope, newState));
  }

  switch (action.type) {
    case "root/INIT":
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          apiUrl: action.payload.apiUrl,
          brandId: action.payload.brandId,
          clientKey: action.payload.clientKey,
          graphQLClient: action.payload.graphQLClient,
          transport: action.payload.transport,
          userId: action.payload.userId,
          userSignature: action.payload.userSignature
        });
      }

    case "root/GET_BRAND/DONE":
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          brand: action.payload
        });
      }

    default:
      {
        return state;
      }
  }
};

var _default = rootReducer;
exports["default"] = _default;