"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/openai/completion/post";
exports.ids = ["pages/api/openai/completion/post"];
exports.modules = {

/***/ "micro":
/*!************************!*\
  !*** external "micro" ***!
  \************************/
/***/ ((module) => {

module.exports = require("micro");

/***/ }),

/***/ "openai":
/*!*************************!*\
  !*** external "openai" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("openai");

/***/ }),

/***/ "(api)/./pages/api/openai/completion/post.js":
/*!*********************************************!*\
  !*** ./pages/api/openai/completion/post.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var micro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micro */ \"micro\");\n/* harmony import */ var micro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(micro__WEBPACK_IMPORTED_MODULE_0__);\n\nconst { Configuration , OpenAIApi  } = __webpack_require__(/*! openai */ \"openai\");\nconst configuration = new Configuration({\n    apiKey: process.env.OPENAI_API_KEY\n});\nconst openai = new OpenAIApi(configuration);\nconst handler = async (req, res)=>{\n    const { prompt  } = req.body;\n    console.log(\"prompt: \", prompt);\n    if (req.method === \"POST\") {\n        try {\n            const response = await openai.createCompletion({\n                model: \"text-davinci-003\",\n                prompt: prompt,\n                temperature: 1,\n                max_tokens: 200,\n                top_p: 0.3,\n                frequency_penalty: 0.5,\n                presence_penalty: 0.0\n            });\n            console.log(response);\n            res.status(200).json(response.data);\n        } catch (error) {\n            res.status(500).json({\n                error: error,\n                message: error.message\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", \"POST\");\n        res.status(405).end(\"Method Not Allowed\");\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handler);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvb3BlbmFpL2NvbXBsZXRpb24vcG9zdC5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMkM7QUFFM0MsTUFBTSxFQUFFRyxhQUFhLEdBQUVDLFNBQVMsR0FBRSxHQUFHQyxtQkFBTyxDQUFDLHNCQUFRLENBQUM7QUFDdEQsTUFBTUMsYUFBYSxHQUFHLElBQUlILGFBQWEsQ0FBQztJQUN0Q0ksTUFBTSxFQUFFQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0MsY0FBYztDQUNuQyxDQUFDO0FBQ0YsTUFBTUMsTUFBTSxHQUFHLElBQUlQLFNBQVMsQ0FBQ0UsYUFBYSxDQUFDO0FBRTNDLE1BQU1NLE9BQU8sR0FBRyxPQUFPQyxHQUFHLEVBQUVDLEdBQUcsR0FBSztJQUNsQyxNQUFNLEVBQUNDLE1BQU0sR0FBQyxHQUFHRixHQUFHLENBQUNHLElBQUk7SUFDekJDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLFVBQVUsRUFBRUgsTUFBTSxDQUFDLENBQUM7SUFFaEMsSUFBSUYsR0FBRyxDQUFDTSxNQUFNLEtBQUssTUFBTSxFQUFFO1FBQ3ZCLElBQUk7WUFDRixNQUFNQyxRQUFRLEdBQUcsTUFBTVQsTUFBTSxDQUFDVSxnQkFBZ0IsQ0FBQztnQkFDM0NDLEtBQUssRUFBRSxrQkFBa0I7Z0JBQ3pCUCxNQUFNLEVBQUVBLE1BQU07Z0JBQ2RRLFdBQVcsRUFBRSxDQUFDO2dCQUNkQyxVQUFVLEVBQUUsR0FBRztnQkFDZkMsS0FBSyxFQUFDLEdBQUc7Z0JBQ1RDLGlCQUFpQixFQUFDLEdBQUc7Z0JBQ3JCQyxnQkFBZ0IsRUFBQyxHQUFHO2FBQ3ZCLENBQUM7WUFDRlYsT0FBTyxDQUFDQyxHQUFHLENBQUNFLFFBQVEsQ0FBQyxDQUFDO1lBQ3RCTixHQUFHLENBQUNjLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzFCLElBQUksQ0FBQ2tCLFFBQVEsQ0FBQ1MsSUFBSSxDQUFDO1NBQ3BDLENBQUMsT0FBT0MsS0FBSyxFQUFFO1lBQ1poQixHQUFHLENBQUNjLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzFCLElBQUksQ0FBQztnQkFBQzRCLEtBQUssRUFBRUEsS0FBSztnQkFBRUMsT0FBTyxFQUFFRCxLQUFLLENBQUNDLE9BQU87YUFBQyxDQUFDO1NBQy9EO0tBQ0osTUFBTTtRQUNMakIsR0FBRyxDQUFDa0IsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvQmxCLEdBQUcsQ0FBQ2MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDSyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUMzQztDQUNGO0FBRUQsaUVBQWVyQixPQUFPLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oYW1sZXQvLi9wYWdlcy9hcGkvb3BlbmFpL2NvbXBsZXRpb24vcG9zdC5qcz8zNmViIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJ1ZmZlciwgdGV4dCwganNvbiB9IGZyb20gXCJtaWNyb1wiO1xuXG5jb25zdCB7IENvbmZpZ3VyYXRpb24sIE9wZW5BSUFwaSB9ID0gcmVxdWlyZShcIm9wZW5haVwiKTtcbmNvbnN0IGNvbmZpZ3VyYXRpb24gPSBuZXcgQ29uZmlndXJhdGlvbih7XG4gIGFwaUtleTogcHJvY2Vzcy5lbnYuT1BFTkFJX0FQSV9LRVksXG59KTtcbmNvbnN0IG9wZW5haSA9IG5ldyBPcGVuQUlBcGkoY29uZmlndXJhdGlvbik7XG4gIFxuY29uc3QgaGFuZGxlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICBjb25zdCB7cHJvbXB0fSA9IHJlcS5ib2R5XG4gIGNvbnNvbGUubG9nKFwicHJvbXB0OiBcIiwgcHJvbXB0KTtcblxuICBpZiAocmVxLm1ldGhvZCA9PT0gXCJQT1NUXCIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgb3BlbmFpLmNyZWF0ZUNvbXBsZXRpb24oe1xuICAgICAgICAgICAgbW9kZWw6IFwidGV4dC1kYXZpbmNpLTAwM1wiLFxuICAgICAgICAgICAgcHJvbXB0OiBwcm9tcHQsXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTogMSxcbiAgICAgICAgICAgIG1heF90b2tlbnM6IDIwMCxcbiAgICAgICAgICAgIHRvcF9wOjAuMyxcbiAgICAgICAgICAgIGZyZXF1ZW5jeV9wZW5hbHR5OjAuNSxcbiAgICAgICAgICAgIHByZXNlbmNlX3BlbmFsdHk6MC4wXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3BvbnNlLmRhdGEpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogZXJyb3IsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9KVxuICAgICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcy5zZXRIZWFkZXIoXCJBbGxvd1wiLCBcIlBPU1RcIik7XG4gICAgcmVzLnN0YXR1cyg0MDUpLmVuZChcIk1ldGhvZCBOb3QgQWxsb3dlZFwiKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlcjsiXSwibmFtZXMiOlsiYnVmZmVyIiwidGV4dCIsImpzb24iLCJDb25maWd1cmF0aW9uIiwiT3BlbkFJQXBpIiwicmVxdWlyZSIsImNvbmZpZ3VyYXRpb24iLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiT1BFTkFJX0FQSV9LRVkiLCJvcGVuYWkiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwicHJvbXB0IiwiYm9keSIsImNvbnNvbGUiLCJsb2ciLCJtZXRob2QiLCJyZXNwb25zZSIsImNyZWF0ZUNvbXBsZXRpb24iLCJtb2RlbCIsInRlbXBlcmF0dXJlIiwibWF4X3Rva2VucyIsInRvcF9wIiwiZnJlcXVlbmN5X3BlbmFsdHkiLCJwcmVzZW5jZV9wZW5hbHR5Iiwic3RhdHVzIiwiZGF0YSIsImVycm9yIiwibWVzc2FnZSIsInNldEhlYWRlciIsImVuZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/openai/completion/post.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/openai/completion/post.js"));
module.exports = __webpack_exports__;

})();