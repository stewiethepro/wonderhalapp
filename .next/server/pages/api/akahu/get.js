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
exports.id = "pages/api/akahu/get";
exports.ids = ["pages/api/akahu/get"];
exports.modules = {

/***/ "akahu":
/*!************************!*\
  !*** external "akahu" ***!
  \************************/
/***/ ((module) => {

module.exports = require("akahu");

/***/ }),

/***/ "micro":
/*!************************!*\
  !*** external "micro" ***!
  \************************/
/***/ ((module) => {

module.exports = require("micro");

/***/ }),

/***/ "(api)/./pages/api/akahu/get.js":
/*!********************************!*\
  !*** ./pages/api/akahu/get.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var micro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micro */ \"micro\");\n/* harmony import */ var micro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(micro__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils_akahu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/utils/akahu */ \"(api)/./utils/akahu.js\");\n\n\nconst handler = async (req, res)=>{\n    const request = req.query;\n    if (req.method === \"GET\") {\n        try {\n            const data = await (0,_utils_akahu__WEBPACK_IMPORTED_MODULE_1__.getAccounts)();\n            console.log(data);\n            res.status(200).json(data);\n        } catch (error) {\n            res.status(500).json({\n                error: error,\n                message: error.message\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", \"GET\");\n        res.status(405).end(\"Method Not Allowed\");\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handler);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYWthaHUvZ2V0LmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMkM7QUFDQztBQUUxQyxNQUFNSSxPQUFPLEdBQUcsT0FBT0MsR0FBRyxFQUFFQyxHQUFHLEdBQUs7SUFDbEMsTUFBTUMsT0FBTyxHQUFHRixHQUFHLENBQUNHLEtBQUs7SUFFekIsSUFBSUgsR0FBRyxDQUFDSSxNQUFNLEtBQUssS0FBSyxFQUFFO1FBQ3RCLElBQUk7WUFDQSxNQUFNQyxJQUFJLEdBQUcsTUFBTVAseURBQVcsRUFBRTtZQUNoQ1EsT0FBTyxDQUFDQyxHQUFHLENBQUNGLElBQUksQ0FBQyxDQUFDO1lBQ2xCSixHQUFHLENBQUNPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ1gsSUFBSSxDQUFDUSxJQUFJLENBQUM7U0FDN0IsQ0FBQyxPQUFPSSxLQUFLLEVBQUU7WUFDWlIsR0FBRyxDQUFDTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNYLElBQUksQ0FBQztnQkFBQ1ksS0FBSyxFQUFFQSxLQUFLO2dCQUFFQyxPQUFPLEVBQUVELEtBQUssQ0FBQ0MsT0FBTzthQUFDLENBQUM7U0FDL0Q7S0FDSixNQUFNO1FBQ0xULEdBQUcsQ0FBQ1UsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QlYsR0FBRyxDQUFDTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNJLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQzNDO0NBQ0Y7QUFFRCxpRUFBZWIsT0FBTyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGFtbGV0Ly4vcGFnZXMvYXBpL2FrYWh1L2dldC5qcz9jODAxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJ1ZmZlciwgdGV4dCwganNvbiB9IGZyb20gXCJtaWNyb1wiO1xuaW1wb3J0IHsgZ2V0QWNjb3VudHMgfSBmcm9tIFwiQC91dGlscy9ha2FodVwiO1xuICBcbiAgY29uc3QgaGFuZGxlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHJlcXVlc3QgPSByZXEucXVlcnlcblxuICAgIGlmIChyZXEubWV0aG9kID09PSBcIkdFVFwiKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZ2V0QWNjb3VudHMoKVxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbihkYXRhKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiBlcnJvciwgbWVzc2FnZTogZXJyb3IubWVzc2FnZX0pXG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkFsbG93XCIsIFwiR0VUXCIpO1xuICAgICAgcmVzLnN0YXR1cyg0MDUpLmVuZChcIk1ldGhvZCBOb3QgQWxsb3dlZFwiKTtcbiAgICB9XG4gIH07XG4gIFxuICBleHBvcnQgZGVmYXVsdCBoYW5kbGVyOyJdLCJuYW1lcyI6WyJidWZmZXIiLCJ0ZXh0IiwianNvbiIsImdldEFjY291bnRzIiwiaGFuZGxlciIsInJlcSIsInJlcyIsInJlcXVlc3QiLCJxdWVyeSIsIm1ldGhvZCIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwic3RhdHVzIiwiZXJyb3IiLCJtZXNzYWdlIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/akahu/get.js\n");

/***/ }),

/***/ "(api)/./utils/akahu.js":
/*!************************!*\
  !*** ./utils/akahu.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getAccounts\": () => (/* binding */ getAccounts)\n/* harmony export */ });\n/* harmony import */ var akahu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! akahu */ \"akahu\");\n/* harmony import */ var akahu__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(akahu__WEBPACK_IMPORTED_MODULE_0__);\n\n// Replace appToken with your App Token\nconst appToken = \"app_token_clavh3qsg000108mtewhc26rn\";\n// Replace with an OAuth user access token. See note below for details.\nconst userToken = \"user_token_clavh3qsg000208mta17o4vgk\";\n// Create an instance of the AkahuClient and fetch some information\nconst akahu = new akahu__WEBPACK_IMPORTED_MODULE_0__.AkahuClient({\n    appToken\n});\nasync function getAccounts() {\n    return new Promise((resolve)=>{\n        (async ()=>{\n            try {\n                const user = await akahu.users.get(userToken);\n                const accounts = await akahu.accounts.list(userToken);\n                // Let's have a look at what we got back\n                console.log(`${user.email} has linked ${accounts.length} accounts:`);\n                for (const account of accounts){\n                    const { connection , name , formatted_account , balance  } = account;\n                    console.log(`  ${connection.name} account \"${name}\" (${formatted_account}) ` + `with available balance $${balance.available}.`);\n                }\n                resolve({\n                    user,\n                    accounts\n                });\n            } catch (error) {\n                console.log(\"error: \", error);\n                resolve(error);\n            }\n        })();\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi91dGlscy9ha2FodS5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBb0M7QUFFcEMsdUNBQXVDO0FBQ3ZDLE1BQU1DLFFBQVEsR0FBRyxxQ0FBcUM7QUFDdEQsdUVBQXVFO0FBQ3ZFLE1BQU1DLFNBQVMsR0FBRyxzQ0FBc0M7QUFFeEQsbUVBQW1FO0FBQ25FLE1BQU1DLEtBQUssR0FBRyxJQUFJSCw4Q0FBVyxDQUFDO0lBQUVDLFFBQVE7Q0FBRSxDQUFDO0FBRXBDLGVBQWVHLFdBQVcsR0FBRztJQUNoQyxPQUFPLElBQUlDLE9BQU8sQ0FBQ0MsQ0FBQUEsT0FBTyxHQUFJO1FBQzFCLENBQUMsVUFBWTtZQUNiLElBQUk7Z0JBQ0EsTUFBTUMsSUFBSSxHQUFHLE1BQU1KLEtBQUssQ0FBQ0ssS0FBSyxDQUFDQyxHQUFHLENBQUNQLFNBQVMsQ0FBQztnQkFDN0MsTUFBTVEsUUFBUSxHQUFHLE1BQU1QLEtBQUssQ0FBQ08sUUFBUSxDQUFDQyxJQUFJLENBQUNULFNBQVMsQ0FBQztnQkFFckQsd0NBQXdDO2dCQUN4Q1UsT0FBTyxDQUFDQyxHQUFHLENBQUMsQ0FBQyxFQUFFTixJQUFJLENBQUNPLEtBQUssQ0FBQyxZQUFZLEVBQUVKLFFBQVEsQ0FBQ0ssTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBRXJFLEtBQUssTUFBTUMsT0FBTyxJQUFJTixRQUFRLENBQUU7b0JBQ2hDLE1BQU0sRUFBRU8sVUFBVSxHQUFFQyxJQUFJLEdBQUVDLGlCQUFpQixHQUFFQyxPQUFPLEdBQUUsR0FBR0osT0FBTztvQkFFaEVKLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFSSxVQUFVLENBQUNDLElBQUksQ0FBQyxVQUFVLEVBQUVBLElBQUksQ0FBQyxHQUFHLEVBQUVDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxHQUNoRSxDQUFDLHdCQUF3QixFQUFFQyxPQUFPLENBQUNDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1RDtnQkFFRGYsT0FBTyxDQUFDO29CQUFDQyxJQUFJO29CQUFFRyxRQUFRO2lCQUFDLENBQUM7YUFDNUIsQ0FBQyxPQUFPWSxLQUFLLEVBQUU7Z0JBQ1pWLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLFNBQVMsRUFBRVMsS0FBSyxDQUFDLENBQUM7Z0JBQzlCaEIsT0FBTyxDQUFDZ0IsS0FBSyxDQUFDO2FBQ2pCO1NBQ0EsQ0FBQyxFQUFFO0tBQ1AsQ0FBQztDQUNMIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGFtbGV0Ly4vdXRpbHMvYWthaHUuanM/ODk0OSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBa2FodUNsaWVudCB9IGZyb20gJ2FrYWh1JztcblxuLy8gUmVwbGFjZSBhcHBUb2tlbiB3aXRoIHlvdXIgQXBwIFRva2VuXG5jb25zdCBhcHBUb2tlbiA9ICdhcHBfdG9rZW5fY2xhdmgzcXNnMDAwMTA4bXRld2hjMjZybic7XG4vLyBSZXBsYWNlIHdpdGggYW4gT0F1dGggdXNlciBhY2Nlc3MgdG9rZW4uIFNlZSBub3RlIGJlbG93IGZvciBkZXRhaWxzLlxuY29uc3QgdXNlclRva2VuID0gJ3VzZXJfdG9rZW5fY2xhdmgzcXNnMDAwMjA4bXRhMTdvNHZnayc7XG5cbi8vIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiB0aGUgQWthaHVDbGllbnQgYW5kIGZldGNoIHNvbWUgaW5mb3JtYXRpb25cbmNvbnN0IGFrYWh1ID0gbmV3IEFrYWh1Q2xpZW50KHsgYXBwVG9rZW4gfSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBY2NvdW50cygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgYWthaHUudXNlcnMuZ2V0KHVzZXJUb2tlbik7XG4gICAgICAgICAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IGFrYWh1LmFjY291bnRzLmxpc3QodXNlclRva2VuKTtcblxuICAgICAgICAgICAgLy8gTGV0J3MgaGF2ZSBhIGxvb2sgYXQgd2hhdCB3ZSBnb3QgYmFja1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7dXNlci5lbWFpbH0gaGFzIGxpbmtlZCAke2FjY291bnRzLmxlbmd0aH0gYWNjb3VudHM6YCk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgYWNjb3VudCBvZiBhY2NvdW50cykge1xuICAgICAgICAgICAgY29uc3QgeyBjb25uZWN0aW9uLCBuYW1lLCBmb3JtYXR0ZWRfYWNjb3VudCwgYmFsYW5jZSB9ID0gYWNjb3VudDtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coYCAgJHtjb25uZWN0aW9uLm5hbWV9IGFjY291bnQgXCIke25hbWV9XCIgKCR7Zm9ybWF0dGVkX2FjY291bnR9KSBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGB3aXRoIGF2YWlsYWJsZSBiYWxhbmNlICQke2JhbGFuY2UuYXZhaWxhYmxlfS5gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzb2x2ZSh7dXNlciwgYWNjb3VudHN9KVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjogXCIsIGVycm9yKTtcbiAgICAgICAgICAgIHJlc29sdmUoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgICAgfSkoKVxuICAgIH0pXG59Il0sIm5hbWVzIjpbIkFrYWh1Q2xpZW50IiwiYXBwVG9rZW4iLCJ1c2VyVG9rZW4iLCJha2FodSIsImdldEFjY291bnRzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ1c2VyIiwidXNlcnMiLCJnZXQiLCJhY2NvdW50cyIsImxpc3QiLCJjb25zb2xlIiwibG9nIiwiZW1haWwiLCJsZW5ndGgiLCJhY2NvdW50IiwiY29ubmVjdGlvbiIsIm5hbWUiLCJmb3JtYXR0ZWRfYWNjb3VudCIsImJhbGFuY2UiLCJhdmFpbGFibGUiLCJlcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./utils/akahu.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/akahu/get.js"));
module.exports = __webpack_exports__;

})();