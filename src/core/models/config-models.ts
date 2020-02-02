export interface AcchuTemplateModel {
    file: string;
    outputDirectory: string;
    outFileTemplate: string;
}

export interface ConfigModel {
    acchuwa: string;
    templates: Map<string, AcchuTemplateModel>;
    parameters: Array<any>;
    partials?: Map<string, string>;
}
