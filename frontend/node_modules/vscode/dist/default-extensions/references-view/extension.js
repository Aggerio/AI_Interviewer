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
exports.register = void 0;
const vscode = __webpack_require__(2);
const utils_1 = __webpack_require__(3);
const model_1 = __webpack_require__(4);
function register(tree, context) {
    const direction = new RichCallsDirection(context.workspaceState, 0 /* CallsDirection.Incoming */);
    function showCallHierarchy() {
        if (vscode.window.activeTextEditor) {
            const input = new model_1.CallsTreeInput(new vscode.Location(vscode.window.activeTextEditor.document.uri, vscode.window.activeTextEditor.selection.active), direction.value);
            tree.setInput(input);
        }
    }
    function setCallsDirection(value, anchor) {
        direction.value = value;
        let newInput;
        const oldInput = tree.getInput();
        if (anchor instanceof model_1.CallItem) {
            newInput = new model_1.CallsTreeInput(new vscode.Location(anchor.item.uri, anchor.item.selectionRange.start), direction.value);
        }
        else if (oldInput instanceof model_1.CallsTreeInput) {
            newInput = new model_1.CallsTreeInput(oldInput.location, direction.value);
        }
        if (newInput) {
            tree.setInput(newInput);
        }
    }
    context.subscriptions.push(vscode.commands.registerCommand('references-view.showCallHierarchy', showCallHierarchy), vscode.commands.registerCommand('references-view.showOutgoingCalls', (item) => setCallsDirection(1 /* CallsDirection.Outgoing */, item)), vscode.commands.registerCommand('references-view.showIncomingCalls', (item) => setCallsDirection(0 /* CallsDirection.Incoming */, item)), vscode.commands.registerCommand('references-view.removeCallItem', removeCallItem));
}
exports.register = register;
function removeCallItem(item) {
    if (item instanceof model_1.CallItem) {
        item.remove();
    }
}
class RichCallsDirection {
    constructor(_mem, _value = 1 /* CallsDirection.Outgoing */) {
        this._mem = _mem;
        this._value = _value;
        this._ctxMode = new utils_1.ContextKey('references-view.callHierarchyMode');
        const raw = _mem.get(RichCallsDirection._key);
        if (typeof raw === 'number' && raw >= 0 && raw <= 1) {
            this.value = raw;
        }
        else {
            this.value = _value;
        }
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this._ctxMode.set(this._value === 0 /* CallsDirection.Incoming */ ? 'showIncoming' : 'showOutgoing');
        this._mem.update(RichCallsDirection._key, value);
    }
}
RichCallsDirection._key = 'references-view.callHierarchyMode';


/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getThemeIcon = exports.WordAnchor = exports.ContextKey = exports.getPreviewChunks = exports.isValidRequestPosition = exports.asResourceUrl = exports.tail = exports.del = void 0;
const vscode = __webpack_require__(2);
function del(array, e) {
    const idx = array.indexOf(e);
    if (idx >= 0) {
        array.splice(idx, 1);
    }
}
exports.del = del;
function tail(array) {
    return array[array.length - 1];
}
exports.tail = tail;
function asResourceUrl(uri, range) {
    return uri.with({ fragment: `L${1 + range.start.line},${1 + range.start.character}-${1 + range.end.line},${1 + range.end.character}` });
}
exports.asResourceUrl = asResourceUrl;
async function isValidRequestPosition(uri, position) {
    const doc = await vscode.workspace.openTextDocument(uri);
    let range = doc.getWordRangeAtPosition(position);
    if (!range) {
        range = doc.getWordRangeAtPosition(position, /[^\s]+/);
    }
    return Boolean(range);
}
exports.isValidRequestPosition = isValidRequestPosition;
function getPreviewChunks(doc, range, beforeLen = 8, trim = true) {
    const previewStart = range.start.with({ character: Math.max(0, range.start.character - beforeLen) });
    const wordRange = doc.getWordRangeAtPosition(previewStart);
    let before = doc.getText(new vscode.Range(wordRange ? wordRange.start : previewStart, range.start));
    const inside = doc.getText(range);
    const previewEnd = range.end.translate(0, 331);
    let after = doc.getText(new vscode.Range(range.end, previewEnd));
    if (trim) {
        before = before.replace(/^\s*/g, '');
        after = after.replace(/\s*$/g, '');
    }
    return { before, inside, after };
}
exports.getPreviewChunks = getPreviewChunks;
class ContextKey {
    constructor(name) {
        this.name = name;
    }
    async set(value) {
        await vscode.commands.executeCommand('setContext', this.name, value);
    }
    async reset() {
        await vscode.commands.executeCommand('setContext', this.name, undefined);
    }
}
exports.ContextKey = ContextKey;
class WordAnchor {
    constructor(_doc, _position) {
        this._doc = _doc;
        this._position = _position;
        this._version = _doc.version;
        this._word = this._getAnchorWord(_doc, _position);
    }
    _getAnchorWord(doc, pos) {
        const range = doc.getWordRangeAtPosition(pos) || doc.getWordRangeAtPosition(pos, /[^\s]+/);
        return range && doc.getText(range);
    }
    guessedTrackedPosition() {
        // funky entry
        if (!this._word) {
            return this._position;
        }
        // no changes
        if (this._version === this._doc.version) {
            return this._position;
        }
        // no changes here...
        const wordNow = this._getAnchorWord(this._doc, this._position);
        if (this._word === wordNow) {
            return this._position;
        }
        // changes: search _word downwards and upwards
        const startLine = this._position.line;
        let i = 0;
        let line;
        let checked;
        do {
            checked = false;
            // nth line down
            line = startLine + i;
            if (line < this._doc.lineCount) {
                checked = true;
                const ch = this._doc.lineAt(line).text.indexOf(this._word);
                if (ch >= 0) {
                    return new vscode.Position(line, ch);
                }
            }
            i += 1;
            // nth line up
            line = startLine - i;
            if (line >= 0) {
                checked = true;
                const ch = this._doc.lineAt(line).text.indexOf(this._word);
                if (ch >= 0) {
                    return new vscode.Position(line, ch);
                }
            }
        } while (i < 100 && checked);
        // fallback
        return this._position;
    }
}
exports.WordAnchor = WordAnchor;
// vscode.SymbolKind.File === 0, Module === 1, etc...
const _themeIconIds = [
    'symbol-file', 'symbol-module', 'symbol-namespace', 'symbol-package', 'symbol-class', 'symbol-method',
    'symbol-property', 'symbol-field', 'symbol-constructor', 'symbol-enum', 'symbol-interface',
    'symbol-function', 'symbol-variable', 'symbol-constant', 'symbol-string', 'symbol-number', 'symbol-boolean',
    'symbol-array', 'symbol-object', 'symbol-key', 'symbol-null', 'symbol-enum-member', 'symbol-struct',
    'symbol-event', 'symbol-operator', 'symbol-type-parameter'
];
function getThemeIcon(kind) {
    const id = _themeIconIds[kind];
    return id ? new vscode.ThemeIcon(id) : undefined;
}
exports.getThemeIcon = getThemeIcon;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CallItem = exports.CallsTreeInput = void 0;
const vscode = __webpack_require__(2);
const utils_1 = __webpack_require__(3);
class CallsTreeInput {
    constructor(location, direction) {
        this.location = location;
        this.direction = direction;
        this.contextValue = 'callHierarchy';
        this.title = direction === 0 /* CallsDirection.Incoming */
            ? vscode.l10n.t('Callers Of')
            : vscode.l10n.t('Calls From');
    }
    async resolve() {
        const items = await Promise.resolve(vscode.commands.executeCommand('vscode.prepareCallHierarchy', this.location.uri, this.location.range.start));
        const model = new CallsModel(this.direction, items ?? []);
        const provider = new CallItemDataProvider(model);
        if (model.roots.length === 0) {
            return;
        }
        return {
            provider,
            get message() { return model.roots.length === 0 ? vscode.l10n.t('No results.') : undefined; },
            navigation: model,
            highlights: model,
            dnd: model,
            dispose() {
                provider.dispose();
            }
        };
    }
    with(location) {
        return new CallsTreeInput(location, this.direction);
    }
}
exports.CallsTreeInput = CallsTreeInput;
class CallItem {
    constructor(model, item, parent, locations) {
        this.model = model;
        this.item = item;
        this.parent = parent;
        this.locations = locations;
    }
    remove() {
        this.model.remove(this);
    }
}
exports.CallItem = CallItem;
class CallsModel {
    constructor(direction, items) {
        this.direction = direction;
        this.roots = [];
        this._onDidChange = new vscode.EventEmitter();
        this.onDidChange = this._onDidChange.event;
        this.roots = items.map(item => new CallItem(this, item, undefined, undefined));
    }
    async _resolveCalls(call) {
        if (this.direction === 0 /* CallsDirection.Incoming */) {
            const calls = await vscode.commands.executeCommand('vscode.provideIncomingCalls', call.item);
            return calls ? calls.map(item => new CallItem(this, item.from, call, item.fromRanges.map(range => new vscode.Location(item.from.uri, range)))) : [];
        }
        else {
            const calls = await vscode.commands.executeCommand('vscode.provideOutgoingCalls', call.item);
            return calls ? calls.map(item => new CallItem(this, item.to, call, item.fromRanges.map(range => new vscode.Location(call.item.uri, range)))) : [];
        }
    }
    async getCallChildren(call) {
        if (!call.children) {
            call.children = await this._resolveCalls(call);
        }
        return call.children;
    }
    // -- navigation
    location(item) {
        return new vscode.Location(item.item.uri, item.item.range);
    }
    nearest(uri, _position) {
        return this.roots.find(item => item.item.uri.toString() === uri.toString()) ?? this.roots[0];
    }
    next(from) {
        return this._move(from, true) ?? from;
    }
    previous(from) {
        return this._move(from, false) ?? from;
    }
    _move(item, fwd) {
        if (item.children?.length) {
            return fwd ? item.children[0] : (0, utils_1.tail)(item.children);
        }
        const array = this.roots.includes(item) ? this.roots : item.parent?.children;
        if (array?.length) {
            const idx = array.indexOf(item);
            const delta = fwd ? 1 : -1;
            return array[idx + delta + array.length % array.length];
        }
    }
    // --- dnd
    getDragUri(item) {
        return (0, utils_1.asResourceUrl)(item.item.uri, item.item.range);
    }
    // --- highlights
    getEditorHighlights(item, uri) {
        if (!item.locations) {
            return item.item.uri.toString() === uri.toString() ? [item.item.selectionRange] : undefined;
        }
        return item.locations
            .filter(loc => loc.uri.toString() === uri.toString())
            .map(loc => loc.range);
    }
    remove(item) {
        const isInRoot = this.roots.includes(item);
        const siblings = isInRoot ? this.roots : item.parent?.children;
        if (siblings) {
            (0, utils_1.del)(siblings, item);
            this._onDidChange.fire(this);
        }
    }
}
class CallItemDataProvider {
    constructor(_model) {
        this._model = _model;
        this._emitter = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._emitter.event;
        this._modelListener = _model.onDidChange(e => this._emitter.fire(e instanceof CallItem ? e : undefined));
    }
    dispose() {
        this._emitter.dispose();
        this._modelListener.dispose();
    }
    getTreeItem(element) {
        const item = new vscode.TreeItem(element.item.name);
        item.description = element.item.detail;
        item.tooltip = item.label && element.item.detail ? `${item.label} - ${element.item.detail}` : item.label ? `${item.label}` : element.item.detail;
        item.contextValue = 'call-item';
        item.iconPath = (0, utils_1.getThemeIcon)(element.item.kind);
        let openArgs;
        if (element.model.direction === 1 /* CallsDirection.Outgoing */) {
            openArgs = [element.item.uri, { selection: element.item.selectionRange.with({ end: element.item.selectionRange.start }) }];
        }
        else {
            // incoming call -> reveal first call instead of caller
            let firstLoctionStart;
            if (element.locations) {
                for (const loc of element.locations) {
                    if (loc.uri.toString() === element.item.uri.toString()) {
                        firstLoctionStart = firstLoctionStart?.isBefore(loc.range.start) ? firstLoctionStart : loc.range.start;
                    }
                }
            }
            if (!firstLoctionStart) {
                firstLoctionStart = element.item.selectionRange.start;
            }
            openArgs = [element.item.uri, { selection: new vscode.Range(firstLoctionStart, firstLoctionStart) }];
        }
        item.command = {
            command: 'vscode.open',
            title: vscode.l10n.t('Open Call'),
            arguments: openArgs
        };
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        return item;
    }
    getChildren(element) {
        return element
            ? this._model.getCallChildren(element)
            : this._model.roots;
    }
    getParent(element) {
        return element.parent;
    }
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.register = void 0;
const vscode = __webpack_require__(2);
const model_1 = __webpack_require__(6);
function register(tree, context) {
    function findLocations(title, command) {
        if (vscode.window.activeTextEditor) {
            const input = new model_1.ReferencesTreeInput(title, new vscode.Location(vscode.window.activeTextEditor.document.uri, vscode.window.activeTextEditor.selection.active), command);
            tree.setInput(input);
        }
    }
    context.subscriptions.push(vscode.commands.registerCommand('references-view.findReferences', () => findLocations('References', 'vscode.executeReferenceProvider')), vscode.commands.registerCommand('references-view.findImplementations', () => findLocations('Implementations', 'vscode.executeImplementationProvider')), 
    // --- legacy name
    vscode.commands.registerCommand('references-view.find', (...args) => vscode.commands.executeCommand('references-view.findReferences', ...args)), vscode.commands.registerCommand('references-view.removeReferenceItem', removeReferenceItem), vscode.commands.registerCommand('references-view.copy', copyCommand), vscode.commands.registerCommand('references-view.copyAll', copyAllCommand), vscode.commands.registerCommand('references-view.copyPath', copyPathCommand));
    // --- references.preferredLocation setting
    let showReferencesDisposable;
    const config = 'references.preferredLocation';
    function updateShowReferences(event) {
        if (event && !event.affectsConfiguration(config)) {
            return;
        }
        const value = vscode.workspace.getConfiguration().get(config);
        showReferencesDisposable?.dispose();
        showReferencesDisposable = undefined;
        if (value === 'view') {
            showReferencesDisposable = vscode.commands.registerCommand('editor.action.showReferences', async (uri, position, locations) => {
                const input = new model_1.ReferencesTreeInput(vscode.l10n.t('References'), new vscode.Location(uri, position), 'vscode.executeReferenceProvider', locations);
                tree.setInput(input);
            });
        }
    }
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(updateShowReferences));
    context.subscriptions.push({ dispose: () => showReferencesDisposable?.dispose() });
    updateShowReferences();
}
exports.register = register;
const copyAllCommand = async (item) => {
    if (item instanceof model_1.ReferenceItem) {
        copyCommand(item.file.model);
    }
    else if (item instanceof model_1.FileItem) {
        copyCommand(item.model);
    }
};
function removeReferenceItem(item) {
    if (item instanceof model_1.FileItem) {
        item.remove();
    }
    else if (item instanceof model_1.ReferenceItem) {
        item.remove();
    }
}
async function copyCommand(item) {
    let val;
    if (item instanceof model_1.ReferencesModel) {
        val = await item.asCopyText();
    }
    else if (item instanceof model_1.ReferenceItem) {
        val = await item.asCopyText();
    }
    else if (item instanceof model_1.FileItem) {
        val = await item.asCopyText();
    }
    if (val) {
        await vscode.env.clipboard.writeText(val);
    }
}
async function copyPathCommand(item) {
    if (item instanceof model_1.FileItem) {
        if (item.uri.scheme === 'file') {
            vscode.env.clipboard.writeText(item.uri.fsPath);
        }
        else {
            vscode.env.clipboard.writeText(item.uri.toString(true));
        }
    }
}


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReferenceItem = exports.FileItem = exports.ReferencesModel = exports.ReferencesTreeInput = void 0;
const vscode = __webpack_require__(2);
const utils_1 = __webpack_require__(3);
class ReferencesTreeInput {
    constructor(title, location, _command, _result) {
        this.title = title;
        this.location = location;
        this._command = _command;
        this._result = _result;
        this.contextValue = _command;
    }
    async resolve() {
        let model;
        if (this._result) {
            model = new ReferencesModel(this._result);
        }
        else {
            const resut = await Promise.resolve(vscode.commands.executeCommand(this._command, this.location.uri, this.location.range.start));
            model = new ReferencesModel(resut ?? []);
        }
        if (model.items.length === 0) {
            return;
        }
        const provider = new ReferencesTreeDataProvider(model);
        return {
            provider,
            get message() { return model.message; },
            navigation: model,
            highlights: model,
            dnd: model,
            dispose() {
                provider.dispose();
            }
        };
    }
    with(location) {
        return new ReferencesTreeInput(this.title, location, this._command);
    }
}
exports.ReferencesTreeInput = ReferencesTreeInput;
class ReferencesModel {
    constructor(locations) {
        this._onDidChange = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChange.event;
        this.items = [];
        let last;
        for (const item of locations.sort(ReferencesModel._compareLocations)) {
            const loc = item instanceof vscode.Location
                ? item
                : new vscode.Location(item.targetUri, item.targetRange);
            if (!last || ReferencesModel._compareUriIgnoreFragment(last.uri, loc.uri) !== 0) {
                last = new FileItem(loc.uri.with({ fragment: '' }), [], this);
                this.items.push(last);
            }
            last.references.push(new ReferenceItem(loc, last));
        }
    }
    static _compareUriIgnoreFragment(a, b) {
        const aStr = a.with({ fragment: '' }).toString();
        const bStr = b.with({ fragment: '' }).toString();
        if (aStr < bStr) {
            return -1;
        }
        else if (aStr > bStr) {
            return 1;
        }
        return 0;
    }
    static _compareLocations(a, b) {
        const aUri = a instanceof vscode.Location ? a.uri : a.targetUri;
        const bUri = b instanceof vscode.Location ? b.uri : b.targetUri;
        if (aUri.toString() < bUri.toString()) {
            return -1;
        }
        else if (aUri.toString() > bUri.toString()) {
            return 1;
        }
        const aRange = a instanceof vscode.Location ? a.range : a.targetRange;
        const bRange = b instanceof vscode.Location ? b.range : b.targetRange;
        if (aRange.start.isBefore(bRange.start)) {
            return -1;
        }
        else if (aRange.start.isAfter(bRange.start)) {
            return 1;
        }
        else {
            return 0;
        }
    }
    // --- adapter
    get message() {
        if (this.items.length === 0) {
            return vscode.l10n.t('No results.');
        }
        const total = this.items.reduce((prev, cur) => prev + cur.references.length, 0);
        const files = this.items.length;
        if (total === 1 && files === 1) {
            return vscode.l10n.t('{0} result in {1} file', total, files);
        }
        else if (total === 1) {
            return vscode.l10n.t('{0} result in {1} files', total, files);
        }
        else if (files === 1) {
            return vscode.l10n.t('{0} results in {1} file', total, files);
        }
        else {
            return vscode.l10n.t('{0} results in {1} files', total, files);
        }
    }
    location(item) {
        return item instanceof ReferenceItem
            ? item.location
            : new vscode.Location(item.uri, item.references[0]?.location.range ?? new vscode.Position(0, 0));
    }
    nearest(uri, position) {
        if (this.items.length === 0) {
            return;
        }
        // NOTE: this.items is sorted by location (uri/range)
        for (const item of this.items) {
            if (item.uri.toString() === uri.toString()) {
                // (1) pick the item at the request position
                for (const ref of item.references) {
                    if (ref.location.range.contains(position)) {
                        return ref;
                    }
                }
                // (2) pick the first item after or last before the request position
                let lastBefore;
                for (const ref of item.references) {
                    if (ref.location.range.end.isAfter(position)) {
                        return ref;
                    }
                    lastBefore = ref;
                }
                if (lastBefore) {
                    return lastBefore;
                }
                break;
            }
        }
        // (3) pick the file with the longest common prefix
        let best = 0;
        const bestValue = ReferencesModel._prefixLen(this.items[best].toString(), uri.toString());
        for (let i = 1; i < this.items.length; i++) {
            const value = ReferencesModel._prefixLen(this.items[i].uri.toString(), uri.toString());
            if (value > bestValue) {
                best = i;
            }
        }
        return this.items[best].references[0];
    }
    static _prefixLen(a, b) {
        let pos = 0;
        while (pos < a.length && pos < b.length && a.charCodeAt(pos) === b.charCodeAt(pos)) {
            pos += 1;
        }
        return pos;
    }
    next(item) {
        return this._move(item, true) ?? item;
    }
    previous(item) {
        return this._move(item, false) ?? item;
    }
    _move(item, fwd) {
        const delta = fwd ? +1 : -1;
        const _move = (item) => {
            const idx = (this.items.indexOf(item) + delta + this.items.length) % this.items.length;
            return this.items[idx];
        };
        if (item instanceof FileItem) {
            if (fwd) {
                return _move(item).references[0];
            }
            else {
                return (0, utils_1.tail)(_move(item).references);
            }
        }
        if (item instanceof ReferenceItem) {
            const idx = item.file.references.indexOf(item) + delta;
            if (idx < 0) {
                return (0, utils_1.tail)(_move(item.file).references);
            }
            else if (idx >= item.file.references.length) {
                return _move(item.file).references[0];
            }
            else {
                return item.file.references[idx];
            }
        }
    }
    getEditorHighlights(_item, uri) {
        const file = this.items.find(file => file.uri.toString() === uri.toString());
        return file?.references.map(ref => ref.location.range);
    }
    remove(item) {
        if (item instanceof FileItem) {
            (0, utils_1.del)(this.items, item);
            this._onDidChange.fire(undefined);
        }
        else {
            (0, utils_1.del)(item.file.references, item);
            if (item.file.references.length === 0) {
                (0, utils_1.del)(this.items, item.file);
                this._onDidChange.fire(undefined);
            }
            else {
                this._onDidChange.fire(item.file);
            }
        }
    }
    async asCopyText() {
        let result = '';
        for (const item of this.items) {
            result += `${await item.asCopyText()}\n`;
        }
        return result;
    }
    getDragUri(item) {
        if (item instanceof FileItem) {
            return item.uri;
        }
        else {
            return (0, utils_1.asResourceUrl)(item.file.uri, item.location.range);
        }
    }
}
exports.ReferencesModel = ReferencesModel;
class ReferencesTreeDataProvider {
    constructor(_model) {
        this._model = _model;
        this._onDidChange = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChange.event;
        this._listener = _model.onDidChangeTreeData(() => this._onDidChange.fire(undefined));
    }
    dispose() {
        this._onDidChange.dispose();
        this._listener.dispose();
    }
    async getTreeItem(element) {
        if (element instanceof FileItem) {
            // files
            const result = new vscode.TreeItem(element.uri);
            result.contextValue = 'file-item';
            result.description = true;
            result.iconPath = vscode.ThemeIcon.File;
            result.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            return result;
        }
        else {
            // references
            const { range } = element.location;
            const doc = await element.getDocument(true);
            const { before, inside, after } = (0, utils_1.getPreviewChunks)(doc, range);
            const label = {
                label: before + inside + after,
                highlights: [[before.length, before.length + inside.length]]
            };
            const result = new vscode.TreeItem(label);
            result.collapsibleState = vscode.TreeItemCollapsibleState.None;
            result.contextValue = 'reference-item';
            result.command = {
                command: 'vscode.open',
                title: vscode.l10n.t('Open Reference'),
                arguments: [
                    element.location.uri,
                    { selection: range.with({ end: range.start }) }
                ]
            };
            return result;
        }
    }
    async getChildren(element) {
        if (!element) {
            return this._model.items;
        }
        if (element instanceof FileItem) {
            return element.references;
        }
        return undefined;
    }
    getParent(element) {
        return element instanceof ReferenceItem ? element.file : undefined;
    }
}
class FileItem {
    constructor(uri, references, model) {
        this.uri = uri;
        this.references = references;
        this.model = model;
    }
    // --- adapter
    remove() {
        this.model.remove(this);
    }
    async asCopyText() {
        let result = `${vscode.workspace.asRelativePath(this.uri)}\n`;
        for (const ref of this.references) {
            result += `  ${await ref.asCopyText()}\n`;
        }
        return result;
    }
}
exports.FileItem = FileItem;
class ReferenceItem {
    constructor(location, file) {
        this.location = location;
        this.file = file;
    }
    async getDocument(warmUpNext) {
        if (!this._document) {
            this._document = vscode.workspace.openTextDocument(this.location.uri);
        }
        if (warmUpNext) {
            // load next document once this document has been loaded
            const next = this.file.model.next(this.file);
            if (next instanceof FileItem && next !== this.file) {
                vscode.workspace.openTextDocument(next.uri);
            }
            else if (next instanceof ReferenceItem) {
                vscode.workspace.openTextDocument(next.location.uri);
            }
        }
        return this._document;
    }
    // --- adapter
    remove() {
        this.file.model.remove(this);
    }
    async asCopyText() {
        const doc = await this.getDocument();
        const chunks = (0, utils_1.getPreviewChunks)(doc, this.location.range, 21, false);
        return `${this.location.range.start.line + 1}, ${this.location.range.start.character + 1}: ${chunks.before + chunks.inside + chunks.after}`;
    }
}
exports.ReferenceItem = ReferenceItem;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymbolsTree = void 0;
const vscode = __webpack_require__(2);
const highlights_1 = __webpack_require__(8);
const navigation_1 = __webpack_require__(9);
const utils_1 = __webpack_require__(3);
class SymbolsTree {
    constructor() {
        this.viewId = 'references-view.tree';
        this._ctxIsActive = new utils_1.ContextKey('reference-list.isActive');
        this._ctxHasResult = new utils_1.ContextKey('reference-list.hasResult');
        this._ctxInputSource = new utils_1.ContextKey('reference-list.source');
        this._history = new TreeInputHistory(this);
        this._provider = new TreeDataProviderDelegate();
        this._dnd = new TreeDndDelegate();
        this._tree = vscode.window.createTreeView(this.viewId, {
            treeDataProvider: this._provider,
            showCollapseAll: true,
            dragAndDropController: this._dnd
        });
        this._navigation = new navigation_1.Navigation(this._tree);
    }
    dispose() {
        this._history.dispose();
        this._tree.dispose();
        this._sessionDisposable?.dispose();
    }
    getInput() {
        return this._input;
    }
    async setInput(input) {
        if (!await (0, utils_1.isValidRequestPosition)(input.location.uri, input.location.range.start)) {
            this.clearInput();
            return;
        }
        this._ctxInputSource.set(input.contextValue);
        this._ctxIsActive.set(true);
        this._ctxHasResult.set(true);
        vscode.commands.executeCommand(`${this.viewId}.focus`);
        const newInputKind = !this._input || Object.getPrototypeOf(this._input) !== Object.getPrototypeOf(input);
        this._input = input;
        this._sessionDisposable?.dispose();
        this._tree.title = input.title;
        this._tree.message = newInputKind ? undefined : this._tree.message;
        const modelPromise = Promise.resolve(input.resolve());
        // set promise to tree data provider to trigger tree loading UI
        this._provider.update(modelPromise.then(model => model?.provider ?? this._history));
        this._dnd.update(modelPromise.then(model => model?.dnd));
        const model = await modelPromise;
        if (this._input !== input) {
            return;
        }
        if (!model) {
            this.clearInput();
            return;
        }
        this._history.add(input);
        this._tree.message = model.message;
        // navigation
        this._navigation.update(model.navigation);
        // reveal & select
        const selection = model.navigation?.nearest(input.location.uri, input.location.range.start);
        if (selection && this._tree.visible) {
            await this._tree.reveal(selection, { select: true, focus: true, expand: true });
        }
        const disposables = [];
        // editor highlights
        let highlights;
        if (model.highlights) {
            highlights = new highlights_1.EditorHighlights(this._tree, model.highlights);
            disposables.push(highlights);
        }
        // listener
        if (model.provider.onDidChangeTreeData) {
            disposables.push(model.provider.onDidChangeTreeData(() => {
                this._tree.title = input.title;
                this._tree.message = model.message;
                highlights?.update();
            }));
        }
        if (typeof model.dispose === 'function') {
            disposables.push(new vscode.Disposable(() => model.dispose()));
        }
        this._sessionDisposable = vscode.Disposable.from(...disposables);
    }
    clearInput() {
        this._sessionDisposable?.dispose();
        this._input = undefined;
        this._ctxHasResult.set(false);
        this._ctxInputSource.reset();
        this._tree.title = vscode.l10n.t('References');
        this._tree.message = this._history.size === 0
            ? vscode.l10n.t('No results.')
            : vscode.l10n.t('No results. Try running a previous search again:');
        this._provider.update(Promise.resolve(this._history));
    }
}
exports.SymbolsTree = SymbolsTree;
class TreeDataProviderDelegate {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChange.event;
    }
    update(provider) {
        this._sessionDispoables?.dispose();
        this._sessionDispoables = undefined;
        this._onDidChange.fire(undefined);
        this.provider = provider;
        provider.then(value => {
            if (this.provider === provider && value.onDidChangeTreeData) {
                this._sessionDispoables = value.onDidChangeTreeData(this._onDidChange.fire, this._onDidChange);
            }
        }).catch(err => {
            this.provider = undefined;
            console.error(err);
        });
    }
    async getTreeItem(element) {
        this._assertProvider();
        return (await this.provider).getTreeItem(element);
    }
    async getChildren(parent) {
        this._assertProvider();
        return (await this.provider).getChildren(parent);
    }
    async getParent(element) {
        this._assertProvider();
        const provider = await this.provider;
        return provider.getParent ? provider.getParent(element) : undefined;
    }
    _assertProvider() {
        if (!this.provider) {
            throw new Error('MISSING provider');
        }
    }
}
// --- tree dnd
class TreeDndDelegate {
    constructor() {
        this.dropMimeTypes = [];
        this.dragMimeTypes = ['text/uri-list'];
    }
    update(delegate) {
        this._delegate = undefined;
        delegate.then(value => this._delegate = value);
    }
    handleDrag(source, data) {
        if (this._delegate) {
            const urls = [];
            for (const item of source) {
                const uri = this._delegate.getDragUri(item);
                if (uri) {
                    urls.push(uri.toString());
                }
            }
            if (urls.length > 0) {
                data.set('text/uri-list', new vscode.DataTransferItem(urls.join('\r\n')));
            }
        }
    }
    handleDrop() {
        throw new Error('Method not implemented.');
    }
}
// --- history
class HistoryItem {
    constructor(key, word, anchor, input) {
        this.key = key;
        this.word = word;
        this.anchor = anchor;
        this.input = input;
        this.description = `${vscode.workspace.asRelativePath(input.location.uri)} • ${input.title.toLocaleLowerCase()}`;
    }
}
class TreeInputHistory {
    constructor(_tree) {
        this._tree = _tree;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._disposables = [];
        this._ctxHasHistory = new utils_1.ContextKey('reference-list.hasHistory');
        this._inputs = new Map();
        this._disposables.push(vscode.commands.registerCommand('references-view.clear', () => _tree.clearInput()), vscode.commands.registerCommand('references-view.clearHistory', () => {
            this.clear();
            _tree.clearInput();
        }), vscode.commands.registerCommand('references-view.refind', (item) => {
            if (item instanceof HistoryItem) {
                this._reRunHistoryItem(item);
            }
        }), vscode.commands.registerCommand('references-view.refresh', () => {
            const item = Array.from(this._inputs.values()).pop();
            if (item) {
                this._reRunHistoryItem(item);
            }
        }), vscode.commands.registerCommand('_references-view.showHistoryItem', async (item) => {
            if (item instanceof HistoryItem) {
                const position = item.anchor.guessedTrackedPosition() ?? item.input.location.range.start;
                await vscode.commands.executeCommand('vscode.open', item.input.location.uri, { selection: new vscode.Range(position, position) });
            }
        }), vscode.commands.registerCommand('references-view.pickFromHistory', async () => {
            const entries = await this.getChildren();
            const picks = entries.map(item => ({
                label: item.word,
                description: item.description,
                item
            }));
            const pick = await vscode.window.showQuickPick(picks, { placeHolder: vscode.l10n.t('Select previous reference search') });
            if (pick) {
                this._reRunHistoryItem(pick.item);
            }
        }));
    }
    dispose() {
        vscode.Disposable.from(...this._disposables).dispose();
        this._onDidChangeTreeData.dispose();
    }
    _reRunHistoryItem(item) {
        this._inputs.delete(item.key);
        const newPosition = item.anchor.guessedTrackedPosition();
        let newInput = item.input;
        // create a new input when having a tracked position which is
        // different than the original position.
        if (newPosition && !item.input.location.range.start.isEqual(newPosition)) {
            newInput = item.input.with(new vscode.Location(item.input.location.uri, newPosition));
        }
        this._tree.setInput(newInput);
    }
    async add(input) {
        const doc = await vscode.workspace.openTextDocument(input.location.uri);
        const anchor = new utils_1.WordAnchor(doc, input.location.range.start);
        const range = doc.getWordRangeAtPosition(input.location.range.start) ?? doc.getWordRangeAtPosition(input.location.range.start, /[^\s]+/);
        const word = range ? doc.getText(range) : '???';
        const item = new HistoryItem(JSON.stringify([range?.start ?? input.location.range.start, input.location.uri, input.title]), word, anchor, input);
        // use filo-ordering of native maps
        this._inputs.delete(item.key);
        this._inputs.set(item.key, item);
        this._ctxHasHistory.set(true);
    }
    clear() {
        this._inputs.clear();
        this._ctxHasHistory.set(false);
        this._onDidChangeTreeData.fire(undefined);
    }
    get size() {
        return this._inputs.size;
    }
    // --- tree data provider
    getTreeItem(item) {
        const result = new vscode.TreeItem(item.word);
        result.description = item.description;
        result.command = { command: '_references-view.showHistoryItem', arguments: [item], title: vscode.l10n.t('Rerun') };
        result.collapsibleState = vscode.TreeItemCollapsibleState.None;
        result.contextValue = 'history-item';
        return result;
    }
    getChildren() {
        return Promise.all([...this._inputs.values()].reverse());
    }
    getParent() {
        return undefined;
    }
}


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditorHighlights = void 0;
const vscode = __webpack_require__(2);
class EditorHighlights {
    constructor(_view, _delegate) {
        this._view = _view;
        this._delegate = _delegate;
        this._decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
            overviewRulerLane: vscode.OverviewRulerLane.Center,
            overviewRulerColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
        });
        this.disposables = [];
        this._ignore = new Set();
        this.disposables.push(vscode.workspace.onDidChangeTextDocument(e => this._ignore.add(e.document.uri.toString())), vscode.window.onDidChangeActiveTextEditor(() => _view.visible && this.update()), _view.onDidChangeVisibility(e => e.visible ? this._show() : this._hide()), _view.onDidChangeSelection(() => {
            if (_view.visible) {
                this.update();
            }
        }));
        this._show();
    }
    dispose() {
        vscode.Disposable.from(...this.disposables).dispose();
        for (const editor of vscode.window.visibleTextEditors) {
            editor.setDecorations(this._decorationType, []);
        }
    }
    _show() {
        const { activeTextEditor: editor } = vscode.window;
        if (!editor || !editor.viewColumn) {
            return;
        }
        if (this._ignore.has(editor.document.uri.toString())) {
            return;
        }
        const [anchor] = this._view.selection;
        if (!anchor) {
            return;
        }
        const ranges = this._delegate.getEditorHighlights(anchor, editor.document.uri);
        if (ranges) {
            editor.setDecorations(this._decorationType, ranges);
        }
    }
    _hide() {
        for (const editor of vscode.window.visibleTextEditors) {
            editor.setDecorations(this._decorationType, []);
        }
    }
    update() {
        this._hide();
        this._show();
    }
}
exports.EditorHighlights = EditorHighlights;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Navigation = void 0;
const vscode = __webpack_require__(2);
const utils_1 = __webpack_require__(3);
class Navigation {
    constructor(_view) {
        this._view = _view;
        this._disposables = [];
        this._ctxCanNavigate = new utils_1.ContextKey('references-view.canNavigate');
        this._disposables.push(vscode.commands.registerCommand('references-view.next', () => this.next(false)), vscode.commands.registerCommand('references-view.prev', () => this.previous(false)));
    }
    dispose() {
        vscode.Disposable.from(...this._disposables).dispose();
    }
    update(delegate) {
        this._delegate = delegate;
        this._ctxCanNavigate.set(Boolean(this._delegate));
    }
    _anchor() {
        if (!this._delegate) {
            return undefined;
        }
        const [sel] = this._view.selection;
        if (sel) {
            return sel;
        }
        if (!vscode.window.activeTextEditor) {
            return undefined;
        }
        return this._delegate.nearest(vscode.window.activeTextEditor.document.uri, vscode.window.activeTextEditor.selection.active);
    }
    _open(loc, preserveFocus) {
        vscode.commands.executeCommand('vscode.open', loc.uri, {
            selection: new vscode.Selection(loc.range.start, loc.range.start),
            preserveFocus
        });
    }
    previous(preserveFocus) {
        if (!this._delegate) {
            return;
        }
        const item = this._anchor();
        if (!item) {
            return;
        }
        const newItem = this._delegate.previous(item);
        const newLocation = this._delegate.location(newItem);
        if (newLocation) {
            this._view.reveal(newItem, { select: true, focus: true });
            this._open(newLocation, preserveFocus);
        }
    }
    next(preserveFocus) {
        if (!this._delegate) {
            return;
        }
        const item = this._anchor();
        if (!item) {
            return;
        }
        const newItem = this._delegate.next(item);
        const newLocation = this._delegate.location(newItem);
        if (newLocation) {
            this._view.reveal(newItem, { select: true, focus: true });
            this._open(newLocation, preserveFocus);
        }
    }
}
exports.Navigation = Navigation;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.register = void 0;
const vscode = __webpack_require__(2);
const utils_1 = __webpack_require__(3);
const model_1 = __webpack_require__(11);
function register(tree, context) {
    const direction = new RichTypesDirection(context.workspaceState, "subtypes" /* TypeHierarchyDirection.Subtypes */);
    function showTypeHierarchy() {
        if (vscode.window.activeTextEditor) {
            const input = new model_1.TypesTreeInput(new vscode.Location(vscode.window.activeTextEditor.document.uri, vscode.window.activeTextEditor.selection.active), direction.value);
            tree.setInput(input);
        }
    }
    function setTypeHierarchyDirection(value, anchor) {
        direction.value = value;
        let newInput;
        const oldInput = tree.getInput();
        if (anchor instanceof model_1.TypeItem) {
            newInput = new model_1.TypesTreeInput(new vscode.Location(anchor.item.uri, anchor.item.selectionRange.start), direction.value);
        }
        else if (anchor instanceof vscode.Location) {
            newInput = new model_1.TypesTreeInput(anchor, direction.value);
        }
        else if (oldInput instanceof model_1.TypesTreeInput) {
            newInput = new model_1.TypesTreeInput(oldInput.location, direction.value);
        }
        if (newInput) {
            tree.setInput(newInput);
        }
    }
    context.subscriptions.push(vscode.commands.registerCommand('references-view.showTypeHierarchy', showTypeHierarchy), vscode.commands.registerCommand('references-view.showSupertypes', (item) => setTypeHierarchyDirection("supertypes" /* TypeHierarchyDirection.Supertypes */, item)), vscode.commands.registerCommand('references-view.showSubtypes', (item) => setTypeHierarchyDirection("subtypes" /* TypeHierarchyDirection.Subtypes */, item)), vscode.commands.registerCommand('references-view.removeTypeItem', removeTypeItem));
}
exports.register = register;
function removeTypeItem(item) {
    if (item instanceof model_1.TypeItem) {
        item.remove();
    }
}
class RichTypesDirection {
    constructor(_mem, _value = "subtypes" /* TypeHierarchyDirection.Subtypes */) {
        this._mem = _mem;
        this._value = _value;
        this._ctxMode = new utils_1.ContextKey('references-view.typeHierarchyMode');
        const raw = _mem.get(RichTypesDirection._key);
        if (typeof raw === 'string') {
            this.value = raw;
        }
        else {
            this.value = _value;
        }
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this._ctxMode.set(value);
        this._mem.update(RichTypesDirection._key, value);
    }
}
RichTypesDirection._key = 'references-view.typeHierarchyMode';


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeItem = exports.TypesTreeInput = void 0;
const vscode = __webpack_require__(2);
const utils_1 = __webpack_require__(3);
class TypesTreeInput {
    constructor(location, direction) {
        this.location = location;
        this.direction = direction;
        this.contextValue = 'typeHierarchy';
        this.title = direction === "supertypes" /* TypeHierarchyDirection.Supertypes */
            ? vscode.l10n.t('Supertypes Of')
            : vscode.l10n.t('Subtypes Of');
    }
    async resolve() {
        const items = await Promise.resolve(vscode.commands.executeCommand('vscode.prepareTypeHierarchy', this.location.uri, this.location.range.start));
        const model = new TypesModel(this.direction, items ?? []);
        const provider = new TypeItemDataProvider(model);
        if (model.roots.length === 0) {
            return;
        }
        return {
            provider,
            get message() { return model.roots.length === 0 ? vscode.l10n.t('No results.') : undefined; },
            navigation: model,
            highlights: model,
            dnd: model,
            dispose() {
                provider.dispose();
            }
        };
    }
    with(location) {
        return new TypesTreeInput(location, this.direction);
    }
}
exports.TypesTreeInput = TypesTreeInput;
class TypeItem {
    constructor(model, item, parent) {
        this.model = model;
        this.item = item;
        this.parent = parent;
    }
    remove() {
        this.model.remove(this);
    }
}
exports.TypeItem = TypeItem;
class TypesModel {
    constructor(direction, items) {
        this.direction = direction;
        this.roots = [];
        this._onDidChange = new vscode.EventEmitter();
        this.onDidChange = this._onDidChange.event;
        this.roots = items.map(item => new TypeItem(this, item, undefined));
    }
    async _resolveTypes(currentType) {
        if (this.direction === "supertypes" /* TypeHierarchyDirection.Supertypes */) {
            const types = await vscode.commands.executeCommand('vscode.provideSupertypes', currentType.item);
            return types ? types.map(item => new TypeItem(this, item, currentType)) : [];
        }
        else {
            const types = await vscode.commands.executeCommand('vscode.provideSubtypes', currentType.item);
            return types ? types.map(item => new TypeItem(this, item, currentType)) : [];
        }
    }
    async getTypeChildren(item) {
        if (!item.children) {
            item.children = await this._resolveTypes(item);
        }
        return item.children;
    }
    // -- dnd
    getDragUri(item) {
        return (0, utils_1.asResourceUrl)(item.item.uri, item.item.range);
    }
    // -- navigation
    location(currentType) {
        return new vscode.Location(currentType.item.uri, currentType.item.range);
    }
    nearest(uri, _position) {
        return this.roots.find(item => item.item.uri.toString() === uri.toString()) ?? this.roots[0];
    }
    next(from) {
        return this._move(from, true) ?? from;
    }
    previous(from) {
        return this._move(from, false) ?? from;
    }
    _move(item, fwd) {
        if (item.children?.length) {
            return fwd ? item.children[0] : (0, utils_1.tail)(item.children);
        }
        const array = this.roots.includes(item) ? this.roots : item.parent?.children;
        if (array?.length) {
            const idx = array.indexOf(item);
            const delta = fwd ? 1 : -1;
            return array[idx + delta + array.length % array.length];
        }
    }
    // --- highlights
    getEditorHighlights(currentType, uri) {
        return currentType.item.uri.toString() === uri.toString() ? [currentType.item.selectionRange] : undefined;
    }
    remove(item) {
        const isInRoot = this.roots.includes(item);
        const siblings = isInRoot ? this.roots : item.parent?.children;
        if (siblings) {
            (0, utils_1.del)(siblings, item);
            this._onDidChange.fire(this);
        }
    }
}
class TypeItemDataProvider {
    constructor(_model) {
        this._model = _model;
        this._emitter = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._emitter.event;
        this._modelListener = _model.onDidChange(e => this._emitter.fire(e instanceof TypeItem ? e : undefined));
    }
    dispose() {
        this._emitter.dispose();
        this._modelListener.dispose();
    }
    getTreeItem(element) {
        const item = new vscode.TreeItem(element.item.name);
        item.description = element.item.detail;
        item.contextValue = 'type-item';
        item.iconPath = (0, utils_1.getThemeIcon)(element.item.kind);
        item.command = {
            command: 'vscode.open',
            title: vscode.l10n.t('Open Type'),
            arguments: [
                element.item.uri,
                { selection: element.item.selectionRange.with({ end: element.item.selectionRange.start }) }
            ]
        };
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        return item;
    }
    getChildren(element) {
        return element
            ? this._model.getTypeChildren(element)
            : this._model.roots;
    }
    getParent(element) {
        return element.parent;
    }
}


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
const calls = __webpack_require__(1);
const references = __webpack_require__(5);
const tree_1 = __webpack_require__(7);
const types = __webpack_require__(10);
function activate(context) {
    const tree = new tree_1.SymbolsTree();
    references.register(tree, context);
    calls.register(tree, context);
    types.register(tree, context);
    function setInput(input) {
        tree.setInput(input);
    }
    function getInput() {
        return tree.getInput();
    }
    return { setInput, getInput };
}
exports.activate = activate;

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=extension.js.map