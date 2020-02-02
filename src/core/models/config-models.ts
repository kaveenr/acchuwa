export enum ParameterScopeEnum {
    Global = 'global',
    single = 'single'
}
export interface AcchuTemplateModel {
    file: string;
    outputDirectory: string;
    outFileTemplate: string;
    parameterScope?: ParameterScopeEnum;
}

export interface ConfigModel {
    acchuwa: string;
    templates: Map<string, AcchuTemplateModel>;
    parameters: Array<any>;
}
