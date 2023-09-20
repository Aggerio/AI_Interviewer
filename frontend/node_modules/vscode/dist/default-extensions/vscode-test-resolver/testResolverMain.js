/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const vscode = __webpack_require__(1);
function activate(_context) {
    vscode.workspace.registerRemoteAuthorityResolver('test', {
        async resolve(_authority) {
            console.log(`Resolving ${_authority}`);
            console.log(`Activating vscode.github-authentication to simulate auth`);
            await vscode.extensions.getExtension('vscode.github-authentication')?.activate();
            return new vscode.ManagedResolvedAuthority(async () => {
                return new InitialManagedMessagePassing();
            });
        }
    });
}
exports.activate = activate;
/**
 * The initial message passing is a bit special because we need to
 * wait for the HTTP headers to arrive before we can create the
 * actual WebSocket.
 */
class InitialManagedMessagePassing {
    constructor() {
        this.dataEmitter = new vscode.EventEmitter();
        this.closeEmitter = new vscode.EventEmitter();
        this.endEmitter = new vscode.EventEmitter();
        this.onDidReceiveMessage = this.dataEmitter.event;
        this.onDidClose = this.closeEmitter.event;
        this.onDidEnd = this.endEmitter.event;
        this._actual = null;
        this._isDisposed = false;
    }
    send(d) {
        if (this._actual) {
            // we already got the HTTP headers
            this._actual.send(d);
            return;
        }
        if (this._isDisposed) {
            // got disposed in the meantime, ignore
            return;
        }
        // we now received the HTTP headers
        const decoder = new TextDecoder();
        const str = decoder.decode(d);
        // example str GET ws://localhost/oss-dev?reconnectionToken=4354a323-a45a-452c-b5d7-d8d586e1cd5c&reconnection=false&skipWebSocketFrames=true HTTP/1.1
        const match = str.match(/GET\s+(\S+)\s+HTTP/);
        if (!match) {
            console.error(`Coult not parse ${str}`);
            this.closeEmitter.fire(new Error(`Coult not parse ${str}`));
            return;
        }
        // example url ws://localhost/oss-dev?reconnectionToken=4354a323-a45a-452c-b5d7-d8d586e1cd5c&reconnection=false&skipWebSocketFrames=true
        const url = new URL(match[1]);
        // extract path and query from url using browser's URL
        const parsedUrl = new URL(url);
        this._actual = new OpeningManagedMessagePassing(parsedUrl, this.dataEmitter, this.closeEmitter, this.endEmitter);
    }
    end() {
        if (this._actual) {
            this._actual.end();
            return;
        }
        this._isDisposed = true;
    }
}
class OpeningManagedMessagePassing {
    constructor(url, dataEmitter, closeEmitter, _endEmitter) {
        this.isOpen = false;
        this.bufferedData = [];
        this.socket = new WebSocket(`ws://localhost:9888${url.pathname}${url.search.replace(/skipWebSocketFrames=true/, 'skipWebSocketFrames=false')}`);
        this.socket.addEventListener('close', () => closeEmitter.fire(undefined));
        this.socket.addEventListener('error', (e) => closeEmitter.fire(new Error(String(e))));
        this.socket.addEventListener('message', async (e) => {
            const arrayBuffer = await e.data.arrayBuffer();
            dataEmitter.fire(new Uint8Array(arrayBuffer));
        });
        this.socket.addEventListener('open', () => {
            while (this.bufferedData.length > 0) {
                const first = this.bufferedData.shift();
                this.socket.send(first);
            }
            this.isOpen = true;
            // https://tools.ietf.org/html/rfc6455#section-4
            // const requestNonce = req.headers['sec-websocket-key'];
            // const hash = crypto.createHash('sha1');
            // hash.update(requestNonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
            // const responseNonce = hash.digest('base64');
            const responseHeaders = [
                `HTTP/1.1 101 Switching Protocols`,
                `Upgrade: websocket`,
                `Connection: Upgrade`,
                `Sec-WebSocket-Accept: TODO`
            ];
            const textEncoder = new TextEncoder();
            textEncoder.encode(responseHeaders.join('\r\n') + '\r\n\r\n');
            dataEmitter.fire(textEncoder.encode(responseHeaders.join('\r\n') + '\r\n\r\n'));
        });
    }
    send(d) {
        if (!this.isOpen) {
            this.bufferedData.push(d);
            return;
        }
        this.socket.send(d);
    }
    end() {
        this.socket.close();
    }
}

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=testResolverMain.js.map