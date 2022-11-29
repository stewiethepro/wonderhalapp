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
exports.id = "pages/api/gocardless/webhooks";
exports.ids = ["pages/api/gocardless/webhooks"];
exports.modules = {

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("body-parser");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "gocardless-nodejs/webhooks":
/*!*********************************************!*\
  !*** external "gocardless-nodejs/webhooks" ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("gocardless-nodejs/webhooks");

/***/ }),

/***/ "(api)/./pages/api/gocardless/webhooks.js":
/*!******************************************!*\
  !*** ./pages/api/gocardless/webhooks.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const webhooks = __webpack_require__(/*! gocardless-nodejs/webhooks */ \"gocardless-nodejs/webhooks\");\nconst express = __webpack_require__(/*! express */ \"express\");\nconst bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\nconst app = express();\n// parse incoming body of Content-Type of application/json to return it as a plain string which needs to be passed into the webhooks.parse method\napp.use(bodyParser.text({\n    type: \"application/json\"\n}));\nconst webhookEndpointSecret = process.env.GO_CARDLESS_WEBHOOK_SECRET;\nconst processMandate = (event)=>{\n    /*\n   You should keep some kind of record of what events have been processed\n   to avoid double-processing, checking if the event already exists\n   before processing it.\n\n   You should perform processing steps asynchronously to avoid timing out\n   if you receive many events at once. To do this, you could use a\n   queueing system like\n   # Bull https://github.com/OptimalBits/bull\n\n   Once you've performed the actions you want to perform for an event, you\n   should make a record to avoid accidentally processing the same one twice\n */ switch(event.action){\n        case \"cancelled\":\n            return `Mandate ${event.links.mandate} has been cancelled.\\n`;\n        default:\n            return `Do not know how to process an event with action ${event.action}`;\n    }\n};\nconst processEvent = (event)=>{\n    switch(event.resource_type){\n        case \"mandates\":\n            return processMandate(event);\n        default:\n            return `Do not know how to process an event with resource_type ${event.resource_type}`;\n    }\n};\napp.post(\"/\", async (req, res)=>{\n    const eventsRequestBody = req.body;\n    const signatureHeader = req.headers[\"Webhook-Signature\"];\n    // Handle the incoming Webhook and check its signature.\n    const parseEvents = (eventsRequestBody, signatureHeader // From webhook header\n    )=>{\n        try {\n            return webhooks.parse(eventsRequestBody, webhookEndpointSecret, signatureHeader);\n        } catch (error) {\n            if (error instanceof webhooks.InvalidSignatureError) {\n                console.log(\"invalid signature, look out!\");\n            }\n        }\n    };\n    try {\n        const events = parseEvents(eventsRequestBody, signatureHeader);\n        let responseBody = \"\";\n        for (const event of events){\n            responseBody += processEvent(event);\n        }\n        res.send(responseBody);\n    } catch (error) {\n        res.status(400).send({\n            error: error.message\n        });\n    }\n});\napp.listen(process.env.PORT, ()=>{\n    console.log(`server started on port: ${process.env.PORT}`);\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZ29jYXJkbGVzcy93ZWJob29rcy5qcy5qcyIsIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxRQUFRLEdBQUdDLG1CQUFPLENBQUMsOERBQTRCLENBQUM7QUFDdEQsTUFBTUMsT0FBTyxHQUFHRCxtQkFBTyxDQUFDLHdCQUFTLENBQUM7QUFDbEMsTUFBTUUsVUFBVSxHQUFHRixtQkFBTyxDQUFDLGdDQUFhLENBQUM7QUFFekMsTUFBTUcsR0FBRyxHQUFHRixPQUFPLEVBQUU7QUFDckIsaUpBQWlKO0FBQ2pKRSxHQUFHLENBQUNDLEdBQUcsQ0FBQ0YsVUFBVSxDQUFDRyxJQUFJLENBQUM7SUFBQ0MsSUFBSSxFQUFFLGtCQUFrQjtDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXJELE1BQU1DLHFCQUFxQixHQUFHQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0MsMEJBQTBCO0FBRXBFLE1BQU1DLGNBQWMsR0FBRyxDQUFDQyxLQUFLLEdBQUs7SUFDaEM7Ozs7Ozs7Ozs7OztHQVlDLENBRUQsT0FBT0EsS0FBSyxDQUFDQyxNQUFNO1FBQ2pCLEtBQUssV0FBVztZQUNkLE9BQU8sQ0FBQyxRQUFRLEVBQUVELEtBQUssQ0FBQ0UsS0FBSyxDQUFDQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNoRTtZQUNFLE9BQU8sQ0FBQyxnREFBZ0QsRUFBRUgsS0FBSyxDQUFDQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQzdFO0NBQ0Q7QUFFRCxNQUFNRyxZQUFZLEdBQUcsQ0FBQ0osS0FBSyxHQUFLO0lBQzlCLE9BQU9BLEtBQUssQ0FBQ0ssYUFBYTtRQUN4QixLQUFLLFVBQVU7WUFDYixPQUFPTixjQUFjLENBQUNDLEtBQUssQ0FBQyxDQUFDO1FBQy9CO1lBQ0UsT0FBTyxDQUFDLHVEQUF1RCxFQUFFQSxLQUFLLENBQUNLLGFBQWEsQ0FBQyxDQUFDLENBQUM7S0FDMUY7Q0FDRjtBQUVEZCxHQUFHLENBQUNlLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBT0MsR0FBRyxFQUFFQyxHQUFHLEdBQUs7SUFDaEMsTUFBTUMsaUJBQWlCLEdBQUdGLEdBQUcsQ0FBQ0csSUFBSTtJQUNsQyxNQUFNQyxlQUFlLEdBQUdKLEdBQUcsQ0FBQ0ssT0FBTyxDQUFDLG1CQUFtQixDQUFDO0lBRXhELHVEQUF1RDtJQUN2RCxNQUFNQyxXQUFXLEdBQUcsQ0FDbEJKLGlCQUFpQixFQUNqQkUsZUFBZSxDQUFDLHNCQUFzQjtPQUNuQztRQUNILElBQUk7WUFDRixPQUFPeEIsUUFBUSxDQUFDMkIsS0FBSyxDQUNuQkwsaUJBQWlCLEVBQ2pCZCxxQkFBcUIsRUFDckJnQixlQUFlLENBQ2hCLENBQUM7U0FDSCxDQUFDLE9BQU9JLEtBQUssRUFBRTtZQUNkLElBQUlBLEtBQUssWUFBWTVCLFFBQVEsQ0FBQzZCLHFCQUFxQixFQUFFO2dCQUNuREMsT0FBTyxDQUFDQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQzthQUM3QztTQUNGO0tBQ0Y7SUFFRCxJQUFJO1FBQ0YsTUFBTUMsTUFBTSxHQUFHTixXQUFXLENBQUNKLGlCQUFpQixFQUFFRSxlQUFlLENBQUM7UUFDOUQsSUFBSVMsWUFBWSxHQUFHLEVBQUU7UUFDckIsS0FBSSxNQUFNcEIsS0FBSyxJQUFJbUIsTUFBTSxDQUFFO1lBQ3pCQyxZQUFZLElBQUloQixZQUFZLENBQUNKLEtBQUssQ0FBQztTQUNwQztRQUVEUSxHQUFHLENBQUNhLElBQUksQ0FBQ0QsWUFBWSxDQUFDLENBQUM7S0FDeEIsQ0FBQyxPQUFNTCxLQUFLLEVBQUU7UUFDYlAsR0FBRyxDQUFDYyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNELElBQUksQ0FBQztZQUFDTixLQUFLLEVBQUVBLEtBQUssQ0FBQ1EsT0FBTztTQUFDLENBQUMsQ0FBQztLQUM5QztDQUNGLENBQUM7QUFFRmhDLEdBQUcsQ0FBQ2lDLE1BQU0sQ0FBQzVCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDNEIsSUFBSSxFQUFFLElBQU07SUFDakNSLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQUMsd0JBQXdCLEVBQUV0QixPQUFPLENBQUNDLEdBQUcsQ0FBQzRCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUM1RCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGFtbGV0Ly4vcGFnZXMvYXBpL2dvY2FyZGxlc3Mvd2ViaG9va3MuanM/NjgxMSJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB3ZWJob29rcyA9IHJlcXVpcmUoXCJnb2NhcmRsZXNzLW5vZGVqcy93ZWJob29rc1wiKTtcbmNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5jb25zdCBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKVxuXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG4vLyBwYXJzZSBpbmNvbWluZyBib2R5IG9mIENvbnRlbnQtVHlwZSBvZiBhcHBsaWNhdGlvbi9qc29uIHRvIHJldHVybiBpdCBhcyBhIHBsYWluIHN0cmluZyB3aGljaCBuZWVkcyB0byBiZSBwYXNzZWQgaW50byB0aGUgd2ViaG9va3MucGFyc2UgbWV0aG9kXG5hcHAudXNlKGJvZHlQYXJzZXIudGV4dCh7dHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nfSkpO1xuXG5jb25zdCB3ZWJob29rRW5kcG9pbnRTZWNyZXQgPSBwcm9jZXNzLmVudi5HT19DQVJETEVTU19XRUJIT09LX1NFQ1JFVDtcblxuY29uc3QgcHJvY2Vzc01hbmRhdGUgPSAoZXZlbnQpID0+IHtcbiAgLypcbiAgIFlvdSBzaG91bGQga2VlcCBzb21lIGtpbmQgb2YgcmVjb3JkIG9mIHdoYXQgZXZlbnRzIGhhdmUgYmVlbiBwcm9jZXNzZWRcbiAgIHRvIGF2b2lkIGRvdWJsZS1wcm9jZXNzaW5nLCBjaGVja2luZyBpZiB0aGUgZXZlbnQgYWxyZWFkeSBleGlzdHNcbiAgIGJlZm9yZSBwcm9jZXNzaW5nIGl0LlxuXG4gICBZb3Ugc2hvdWxkIHBlcmZvcm0gcHJvY2Vzc2luZyBzdGVwcyBhc3luY2hyb25vdXNseSB0byBhdm9pZCB0aW1pbmcgb3V0XG4gICBpZiB5b3UgcmVjZWl2ZSBtYW55IGV2ZW50cyBhdCBvbmNlLiBUbyBkbyB0aGlzLCB5b3UgY291bGQgdXNlIGFcbiAgIHF1ZXVlaW5nIHN5c3RlbSBsaWtlXG4gICAjIEJ1bGwgaHR0cHM6Ly9naXRodWIuY29tL09wdGltYWxCaXRzL2J1bGxcblxuICAgT25jZSB5b3UndmUgcGVyZm9ybWVkIHRoZSBhY3Rpb25zIHlvdSB3YW50IHRvIHBlcmZvcm0gZm9yIGFuIGV2ZW50LCB5b3VcbiAgIHNob3VsZCBtYWtlIGEgcmVjb3JkIHRvIGF2b2lkIGFjY2lkZW50YWxseSBwcm9jZXNzaW5nIHRoZSBzYW1lIG9uZSB0d2ljZVxuICovXG5cbiAgc3dpdGNoKGV2ZW50LmFjdGlvbikge1xuICAgIGNhc2UgXCJjYW5jZWxsZWRcIjpcbiAgICAgIHJldHVybiBgTWFuZGF0ZSAke2V2ZW50LmxpbmtzLm1hbmRhdGV9IGhhcyBiZWVuIGNhbmNlbGxlZC5cXG5gO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYERvIG5vdCBrbm93IGhvdyB0byBwcm9jZXNzIGFuIGV2ZW50IHdpdGggYWN0aW9uICR7ZXZlbnQuYWN0aW9ufWA7XG4gfVxufVxuXG5jb25zdCBwcm9jZXNzRXZlbnQgPSAoZXZlbnQpID0+IHtcbiAgc3dpdGNoKGV2ZW50LnJlc291cmNlX3R5cGUpIHtcbiAgICBjYXNlIFwibWFuZGF0ZXNcIjogXG4gICAgICByZXR1cm4gcHJvY2Vzc01hbmRhdGUoZXZlbnQpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYERvIG5vdCBrbm93IGhvdyB0byBwcm9jZXNzIGFuIGV2ZW50IHdpdGggcmVzb3VyY2VfdHlwZSAke2V2ZW50LnJlc291cmNlX3R5cGV9YDtcbiAgfVxufVxuXG5hcHAucG9zdChcIi9cIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gIGNvbnN0IGV2ZW50c1JlcXVlc3RCb2R5ID0gcmVxLmJvZHk7XG4gIGNvbnN0IHNpZ25hdHVyZUhlYWRlciA9IHJlcS5oZWFkZXJzWydXZWJob29rLVNpZ25hdHVyZSddO1xuXG4gIC8vIEhhbmRsZSB0aGUgaW5jb21pbmcgV2ViaG9vayBhbmQgY2hlY2sgaXRzIHNpZ25hdHVyZS5cbiAgY29uc3QgcGFyc2VFdmVudHMgPSAoXG4gICAgZXZlbnRzUmVxdWVzdEJvZHksXG4gICAgc2lnbmF0dXJlSGVhZGVyIC8vIEZyb20gd2ViaG9vayBoZWFkZXJcbiAgKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB3ZWJob29rcy5wYXJzZShcbiAgICAgICAgZXZlbnRzUmVxdWVzdEJvZHksXG4gICAgICAgIHdlYmhvb2tFbmRwb2ludFNlY3JldCxcbiAgICAgICAgc2lnbmF0dXJlSGVhZGVyXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiB3ZWJob29rcy5JbnZhbGlkU2lnbmF0dXJlRXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnZhbGlkIHNpZ25hdHVyZSwgbG9vayBvdXQhXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB0cnkge1xuICAgIGNvbnN0IGV2ZW50cyA9IHBhcnNlRXZlbnRzKGV2ZW50c1JlcXVlc3RCb2R5LCBzaWduYXR1cmVIZWFkZXIpO1xuICAgIGxldCByZXNwb25zZUJvZHkgPSBcIlwiXG4gICAgZm9yKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgcmVzcG9uc2VCb2R5ICs9IHByb2Nlc3NFdmVudChldmVudClcbiAgICB9XG4gIFxuICAgIHJlcy5zZW5kKHJlc3BvbnNlQm9keSk7XG4gIH0gY2F0Y2goZXJyb3IpIHtcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCh7ZXJyb3I6IGVycm9yLm1lc3NhZ2V9KTtcbiAgfVxufSlcblxuYXBwLmxpc3Rlbihwcm9jZXNzLmVudi5QT1JULCAoKSA9PiB7XG4gIGNvbnNvbGUubG9nKGBzZXJ2ZXIgc3RhcnRlZCBvbiBwb3J0OiAke3Byb2Nlc3MuZW52LlBPUlR9YCk7XG59KVxuIl0sIm5hbWVzIjpbIndlYmhvb2tzIiwicmVxdWlyZSIsImV4cHJlc3MiLCJib2R5UGFyc2VyIiwiYXBwIiwidXNlIiwidGV4dCIsInR5cGUiLCJ3ZWJob29rRW5kcG9pbnRTZWNyZXQiLCJwcm9jZXNzIiwiZW52IiwiR09fQ0FSRExFU1NfV0VCSE9PS19TRUNSRVQiLCJwcm9jZXNzTWFuZGF0ZSIsImV2ZW50IiwiYWN0aW9uIiwibGlua3MiLCJtYW5kYXRlIiwicHJvY2Vzc0V2ZW50IiwicmVzb3VyY2VfdHlwZSIsInBvc3QiLCJyZXEiLCJyZXMiLCJldmVudHNSZXF1ZXN0Qm9keSIsImJvZHkiLCJzaWduYXR1cmVIZWFkZXIiLCJoZWFkZXJzIiwicGFyc2VFdmVudHMiLCJwYXJzZSIsImVycm9yIiwiSW52YWxpZFNpZ25hdHVyZUVycm9yIiwiY29uc29sZSIsImxvZyIsImV2ZW50cyIsInJlc3BvbnNlQm9keSIsInNlbmQiLCJzdGF0dXMiLCJtZXNzYWdlIiwibGlzdGVuIiwiUE9SVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/gocardless/webhooks.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/gocardless/webhooks.js"));
module.exports = __webpack_exports__;

})();