import { BaseLanguageClient, MessageTransports, LanguageClientOptions } from 'vscode-languageclient/lib/common/client.js';
export interface IConnectionProvider {
    get(encoding: string): Promise<MessageTransports>;
}
export type MonacoLanguageClientOptions = {
    name: string;
    id?: string;
    clientOptions: LanguageClientOptions;
    connectionProvider: IConnectionProvider;
};
export declare class MonacoLanguageClient extends BaseLanguageClient {
    protected readonly connectionProvider: IConnectionProvider;
    constructor({ id, name, clientOptions, connectionProvider }: MonacoLanguageClientOptions);
    protected createMessageTransports(encoding: string): Promise<MessageTransports>;
    protected getLocale(): string;
}
//# sourceMappingURL=monaco-language-client.d.ts.map