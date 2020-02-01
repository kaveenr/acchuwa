export interface AcchuTemplateModel {
    name?: string;
    file: string;
    outputDirectory: string;
    outFileTemplate: string;
}

export interface AcchuModel {
    template: AcchuTemplateModel;
    parameters: Array<Record<string, any>>;
}

export interface ConfigModel {
    acchuwaVersion: string;
    templates: Array<AcchuModel>;
}
