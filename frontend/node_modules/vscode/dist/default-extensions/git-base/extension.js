/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerAPICommands = exports.ApiImpl = void 0;
const vscode_1 = __webpack_require__(2);
const remoteSource_1 = __webpack_require__(3);
class ApiImpl {
    constructor(_model) {
        this._model = _model;
    }
    pickRemoteSource(options) {
        return (0, remoteSource_1.pickRemoteSource)(this._model, options);
    }
    getRemoteSourceActions(url) {
        return (0, remoteSource_1.getRemoteSourceActions)(this._model, url);
    }
    registerRemoteSourceProvider(provider) {
        return this._model.registerRemoteSourceProvider(provider);
    }
}
exports.ApiImpl = ApiImpl;
function registerAPICommands(extension) {
    const disposables = [];
    disposables.push(vscode_1.commands.registerCommand('git-base.api.getRemoteSources', (opts) => {
        if (!extension.model) {
            return;
        }
        return (0, remoteSource_1.pickRemoteSource)(extension.model, opts);
    }));
    return vscode_1.Disposable.from(...disposables);
}
exports.registerAPICommands = registerAPICommands;


/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pickRemoteSource = exports.getRemoteSourceActions = void 0;
const vscode_1 = __webpack_require__(2);
const decorators_1 = __webpack_require__(4);
async function getQuickPickResult(quickpick) {
    const result = await new Promise(c => {
        quickpick.onDidAccept(() => c(quickpick.selectedItems[0]));
        quickpick.onDidHide(() => c(undefined));
        quickpick.show();
    });
    quickpick.hide();
    return result;
}
class RemoteSourceProviderQuickPick {
    constructor(provider) {
        this.provider = provider;
    }
    ensureQuickPick() {
        if (!this.quickpick) {
            this.quickpick = vscode_1.window.createQuickPick();
            this.quickpick.ignoreFocusOut = true;
            if (this.provider.supportsQuery) {
                this.quickpick.placeholder = this.provider.placeholder ?? vscode_1.l10n.t('Repository name (type to search)');
                this.quickpick.onDidChangeValue(this.onDidChangeValue, this);
            }
            else {
                this.quickpick.placeholder = this.provider.placeholder ?? vscode_1.l10n.t('Repository name');
            }
        }
    }
    onDidChangeValue() {
        this.query();
    }
    async query() {
        try {
            this.ensureQuickPick();
            this.quickpick.busy = true;
            this.quickpick.show();
            const remoteSources = await this.provider.getRemoteSources(this.quickpick?.value) || [];
            if (remoteSources.length === 0) {
                this.quickpick.items = [{
                        label: vscode_1.l10n.t('No remote repositories found.'),
                        alwaysShow: true
                    }];
            }
            else {
                this.quickpick.items = remoteSources.map(remoteSource => ({
                    label: remoteSource.icon ? `$(${remoteSource.icon}) ${remoteSource.name}` : remoteSource.name,
                    description: remoteSource.description || (typeof remoteSource.url === 'string' ? remoteSource.url : remoteSource.url[0]),
                    detail: remoteSource.detail,
                    remoteSource,
                    alwaysShow: true
                }));
            }
        }
        catch (err) {
            this.quickpick.items = [{ label: vscode_1.l10n.t('{0} Error: {1}', '$(error)', err.message), alwaysShow: true }];
            console.error(err);
        }
        finally {
            this.quickpick.busy = false;
        }
    }
    async pick() {
        await this.query();
        const result = await getQuickPickResult(this.quickpick);
        return result?.remoteSource;
    }
}
__decorate([
    (0, decorators_1.debounce)(300)
], RemoteSourceProviderQuickPick.prototype, "onDidChangeValue", null);
__decorate([
    decorators_1.throttle
], RemoteSourceProviderQuickPick.prototype, "query", null);
async function getRemoteSourceActions(model, url) {
    const providers = model.getRemoteProviders();
    const remoteSourceActions = [];
    for (const provider of providers) {
        const providerActions = await provider.getRemoteSourceActions?.(url);
        if (providerActions?.length) {
            remoteSourceActions.push(...providerActions);
        }
    }
    return remoteSourceActions;
}
exports.getRemoteSourceActions = getRemoteSourceActions;
async function pickRemoteSource(model, options = {}) {
    const quickpick = vscode_1.window.createQuickPick();
    quickpick.title = options.title;
    if (options.providerName) {
        const provider = model.getRemoteProviders()
            .filter(provider => provider.name === options.providerName)[0];
        if (provider) {
            return await pickProviderSource(provider, options);
        }
    }
    const remoteProviders = model.getRemoteProviders()
        .map(provider => ({ label: (provider.icon ? `$(${provider.icon}) ` : '') + (options.providerLabel ? options.providerLabel(provider) : provider.name), alwaysShow: true, provider }));
    const recentSources = [];
    if (options.showRecentSources) {
        for (const { provider } of remoteProviders) {
            const sources = (await provider.getRecentRemoteSources?.() ?? []).map((item) => {
                return {
                    ...item,
                    label: (item.icon ? `$(${item.icon}) ` : '') + item.name,
                    url: typeof item.url === 'string' ? item.url : item.url[0],
                };
            });
            recentSources.push(...sources);
        }
    }
    const items = [
        { kind: vscode_1.QuickPickItemKind.Separator, label: vscode_1.l10n.t('remote sources') },
        ...remoteProviders,
        { kind: vscode_1.QuickPickItemKind.Separator, label: vscode_1.l10n.t('recently opened') },
        ...recentSources.sort((a, b) => b.timestamp - a.timestamp)
    ];
    quickpick.placeholder = options.placeholder ?? (remoteProviders.length === 0
        ? vscode_1.l10n.t('Provide repository URL')
        : vscode_1.l10n.t('Provide repository URL or pick a repository source.'));
    const updatePicks = (value) => {
        if (value) {
            const label = (typeof options.urlLabel === 'string' ? options.urlLabel : options.urlLabel?.(value)) ?? vscode_1.l10n.t('URL');
            quickpick.items = [{
                    label: label,
                    description: value,
                    alwaysShow: true,
                    url: value
                },
                ...items
            ];
        }
        else {
            quickpick.items = items;
        }
    };
    quickpick.onDidChangeValue(updatePicks);
    updatePicks();
    const result = await getQuickPickResult(quickpick);
    if (result) {
        if (result.url) {
            return result.url;
        }
        else if (result.provider) {
            return await pickProviderSource(result.provider, options);
        }
    }
    return undefined;
}
exports.pickRemoteSource = pickRemoteSource;
async function pickProviderSource(provider, options = {}) {
    const quickpick = new RemoteSourceProviderQuickPick(provider);
    const remote = await quickpick.pick();
    let url;
    if (remote) {
        if (typeof remote.url === 'string') {
            url = remote.url;
        }
        else if (remote.url.length > 0) {
            url = await vscode_1.window.showQuickPick(remote.url, { ignoreFocusOut: true, placeHolder: vscode_1.l10n.t('Choose a URL to clone from.') });
        }
    }
    if (!url || !options.branch) {
        return url;
    }
    if (!provider.getBranches) {
        return { url };
    }
    const branches = await provider.getBranches(url);
    if (!branches) {
        return { url };
    }
    const branch = await vscode_1.window.showQuickPick(branches, {
        placeHolder: vscode_1.l10n.t('Branch name')
    });
    if (!branch) {
        return { url };
    }
    return { url, branch };
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.throttle = exports.debounce = void 0;
const util_1 = __webpack_require__(5);
function debounce(delay) {
    return decorate((fn, key) => {
        const timerKey = `$debounce$${key}`;
        return function (...args) {
            clearTimeout(this[timerKey]);
            this[timerKey] = setTimeout(() => fn.apply(this, args), delay);
        };
    });
}
exports.debounce = debounce;
exports.throttle = decorate(_throttle);
function _throttle(fn, key) {
    const currentKey = `$throttle$current$${key}`;
    const nextKey = `$throttle$next$${key}`;
    const trigger = function (...args) {
        if (this[nextKey]) {
            return this[nextKey];
        }
        if (this[currentKey]) {
            this[nextKey] = (0, util_1.done)(this[currentKey]).then(() => {
                this[nextKey] = undefined;
                return trigger.apply(this, args);
            });
            return this[nextKey];
        }
        this[currentKey] = fn.apply(this, args);
        const clear = () => this[currentKey] = undefined;
        (0, util_1.done)(this[currentKey]).then(clear, clear);
        return this[currentKey];
    };
    return trigger;
}
function decorate(decorator) {
    return (_target, key, descriptor) => {
        let fnKey = null;
        let fn = null;
        if (typeof descriptor.value === 'function') {
            fnKey = 'value';
            fn = descriptor.value;
        }
        else if (typeof descriptor.get === 'function') {
            fnKey = 'get';
            fn = descriptor.get;
        }
        if (!fn || !fnKey) {
            throw new Error('not supported');
        }
        descriptor[fnKey] = decorator(fn, key);
    };
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Versions = exports.done = exports.toDisposable = void 0;
function toDisposable(dispose) {
    return { dispose };
}
exports.toDisposable = toDisposable;
function done(promise) {
    return promise.then(() => undefined);
}
exports.done = done;
var Versions;
(function (Versions) {
    function compare(v1, v2) {
        if (typeof v1 === 'string') {
            v1 = fromString(v1);
        }
        if (typeof v2 === 'string') {
            v2 = fromString(v2);
        }
        if (v1.major > v2.major) {
            return 1;
        }
        if (v1.major < v2.major) {
            return -1;
        }
        if (v1.minor > v2.minor) {
            return 1;
        }
        if (v1.minor < v2.minor) {
            return -1;
        }
        if (v1.patch > v2.patch) {
            return 1;
        }
        if (v1.patch < v2.patch) {
            return -1;
        }
        if (v1.pre === undefined && v2.pre !== undefined) {
            return 1;
        }
        if (v1.pre !== undefined && v2.pre === undefined) {
            return -1;
        }
        if (v1.pre !== undefined && v2.pre !== undefined) {
            return v1.pre.localeCompare(v2.pre);
        }
        return 0;
    }
    Versions.compare = compare;
    function from(major, minor, patch, pre) {
        return {
            major: typeof major === 'string' ? parseInt(major, 10) : major,
            minor: typeof minor === 'string' ? parseInt(minor, 10) : minor,
            patch: patch === undefined || patch === null ? 0 : typeof patch === 'string' ? parseInt(patch, 10) : patch,
            pre: pre,
        };
    }
    Versions.from = from;
    function fromString(version) {
        const [ver, pre] = version.split('-');
        const [major, minor, patch] = ver.split('.');
        return from(major, minor, patch, pre);
    }
    Versions.fromString = fromString;
})(Versions || (exports.Versions = Versions = {}));


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitBaseExtensionImpl = void 0;
const vscode_1 = __webpack_require__(2);
const api1_1 = __webpack_require__(1);
class GitBaseExtensionImpl {
    set model(model) {
        this._model = model;
        const enabled = !!model;
        if (this.enabled === enabled) {
            return;
        }
        this.enabled = enabled;
        this._onDidChangeEnablement.fire(this.enabled);
    }
    get model() {
        return this._model;
    }
    constructor(model) {
        this.enabled = false;
        this._onDidChangeEnablement = new vscode_1.EventEmitter();
        this.onDidChangeEnablement = this._onDidChangeEnablement.event;
        this._model = undefined;
        if (model) {
            this.enabled = true;
            this._model = model;
        }
    }
    getAPI(version) {
        if (!this._model) {
            throw new Error('Git model not found');
        }
        if (version !== 1) {
            throw new Error(`No API version ${version} found.`);
        }
        return new api1_1.ApiImpl(this._model);
    }
}
exports.GitBaseExtensionImpl = GitBaseExtensionImpl;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Model = void 0;
const vscode_1 = __webpack_require__(2);
const util_1 = __webpack_require__(5);
class Model {
    constructor() {
        this.remoteSourceProviders = new Set();
        this._onDidAddRemoteSourceProvider = new vscode_1.EventEmitter();
        this.onDidAddRemoteSourceProvider = this._onDidAddRemoteSourceProvider.event;
        this._onDidRemoveRemoteSourceProvider = new vscode_1.EventEmitter();
        this.onDidRemoveRemoteSourceProvider = this._onDidRemoveRemoteSourceProvider.event;
    }
    registerRemoteSourceProvider(provider) {
        this.remoteSourceProviders.add(provider);
        this._onDidAddRemoteSourceProvider.fire(provider);
        return (0, util_1.toDisposable)(() => {
            this.remoteSourceProviders.delete(provider);
            this._onDidRemoveRemoteSourceProvider.fire(provider);
        });
    }
    getRemoteProviders() {
        return [...this.remoteSourceProviders.values()];
    }
}
exports.Model = Model;


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
const api1_1 = __webpack_require__(1);
const extension_1 = __webpack_require__(6);
const model_1 = __webpack_require__(7);
function activate(context) {
    const apiImpl = new extension_1.GitBaseExtensionImpl(new model_1.Model());
    context.subscriptions.push((0, api1_1.registerAPICommands)(apiImpl));
    return apiImpl;
}
exports.activate = activate;

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=extension.js.map