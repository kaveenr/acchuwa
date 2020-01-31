export interface IAcchuTemplateModel {
    name?: string,
    file: string, 
    outputDirectory: string, 
    outFileTemplate: string
}

export interface IAcchuModel {
    template: IAcchuTemplateModel,
    parameters: Array<Object>
}

export interface IConfigModel {
    acchuwaVersion: string,
    templates: Array<IAcchuModel>
}