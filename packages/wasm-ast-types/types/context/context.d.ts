import { JSONSchema } from "../types";
import { UtilMapping } from "./imports";
export interface ReactQueryOptions {
    enabled?: boolean;
    optionalClient?: boolean;
    version?: 'v3' | 'v4';
    mutations?: boolean;
    camelize?: boolean;
    queryKeys?: boolean;
    queryFactory?: boolean;
}
export interface TSClientOptions {
    enabled?: boolean;
    execExtendsQuery?: boolean;
    noImplicitOverride?: boolean;
}
export interface MessageComposerOptions {
    enabled?: boolean;
}
export interface MessageBuilderOptions {
    enabled?: boolean;
}
export interface RecoilOptions {
    enabled?: boolean;
}
export interface TSTypesOptions {
    enabled?: boolean;
    aliasExecuteMsg?: boolean;
    aliasEntryPoints?: boolean;
}
interface KeyedSchema {
    [key: string]: JSONSchema;
}
export interface IDLObject {
    contract_name: string;
    contract_version: string;
    idl_version: string;
    instantiate: JSONSchema;
    execute: JSONSchema;
    query: JSONSchema;
    migrate: JSONSchema;
    sudo: JSONSchema;
    responses: KeyedSchema;
}
export interface ContractInfo {
    schemas: JSONSchema[];
    responses?: Record<string, JSONSchema>;
    idlObject?: IDLObject;
}
export interface RenderOptions {
    enabled?: boolean;
    types?: TSTypesOptions;
    recoil?: RecoilOptions;
    messageComposer?: MessageComposerOptions;
    messageBuilder?: MessageBuilderOptions;
    client?: TSClientOptions;
    reactQuery?: ReactQueryOptions;
}
export interface ProviderInfo {
    classname: string;
    filename: string;
    basename: string;
}
export interface IContext {
    refLookup($ref: string): any;
    addUtil(util: string): any;
    getImports(registeredUtils?: UtilMapping, filepath?: string): any;
}
export interface IRenderContext<TOpt = RenderOptions> extends IContext {
    contract: ContractInfo;
    options: TOpt;
    addProviderInfo(contractName: string, type: string, classname: string, filename: string): void;
    getProviderInfos(): {
        [key: string]: {
            [key: string]: ProviderInfo;
        };
    };
}
export declare const defaultOptions: RenderOptions;
export declare const getDefinitionSchema: (schemas: JSONSchema[]) => JSONSchema;
export declare class BuilderContext {
    providers: {
        [key: string]: {
            [key: string]: ProviderInfo;
        };
    };
    addProviderInfo(contractName: string, type: string, classname: string, filename: string): void;
    getProviderInfos(): {
        [key: string]: {
            [key: string]: ProviderInfo;
        };
    };
}
/**
 * context object for generating code.
 * only mergeDefaultOpt needs to implementing for combine options and default options.
 * @param TOpt option type
 */
export declare abstract class RenderContextBase<TOpt = RenderOptions> implements IRenderContext<TOpt> {
    builderContext: BuilderContext;
    contract: ContractInfo;
    utils: string[];
    schema: JSONSchema;
    options: TOpt;
    constructor(contract: ContractInfo, options?: TOpt, builderContext?: BuilderContext);
    /**
     * merge options and default options
     * @param options
     */
    abstract mergeDefaultOpt(options: TOpt): TOpt;
    refLookup($ref: string): JSONSchema;
    addUtil(util: string): void;
    addProviderInfo(contractName: string, type: string, classname: string, filename: string): void;
    getProviderInfos(): {
        [key: string]: {
            [key: string]: ProviderInfo;
        };
    };
    getImports(registeredUtils?: UtilMapping, filepath?: string): any;
}
export declare class RenderContext extends RenderContextBase {
    mergeDefaultOpt(options: RenderOptions): RenderOptions;
}
export {};
