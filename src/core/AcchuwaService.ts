import { IAcchuwaService } from "./IAcchuwaService";
import { IConfigModel, IAcchuModel, IAcchuTemplateModel } from "./models/ConfigModels";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { compile, registerHelper, SafeString } from "handlebars";
import { join } from "path";
import { singular, plural } from "pluralize";

export class AcchuwaService implements IAcchuwaService {

    private basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
        registerHelper("singular", (text) => {
            return new SafeString(singular(text))
        })
        registerHelper("plural", (text) => {
            return new SafeString(plural(text))
        })
    }

    generate(config: IConfigModel): boolean {

        for (let singleTemplate of config.templates) {
            this.processTemplate(singleTemplate);
        }
        return true;
    }

    private processTemplate(template: IAcchuModel) {
        
        const hbsTemplate: HandlebarsTemplateDelegate = compile(
            this.loadTemplate(template.template.file)
        );

        // Output directory
        let outPath = join(this.basePath, template.template.outputDirectory);
        if (!existsSync(outPath)){
            mkdirSync(outPath)
        }

        for (const params of template.parameters) {

            let fileName = this.buildFilename(template.template.outFileTemplate, params);
            let fileContent = hbsTemplate(params);

            this.writeOutput(fileName, fileContent, outPath);
        }

    }
    private writeOutput(fileName: string, fileContent: string, outputDirectory: string) {
    
        writeFileSync(outputDirectory + fileName, fileContent);
    }

    private buildFilename(fileTemplate: string, context: Object) {
        
        const fileName = compile(fileTemplate)
        return fileName(context);
    }

    private loadTemplate(path: string) : string {
        try {
            return readFileSync(join(this.basePath, path), "utf-8");
        } catch (e) {
            throw Error(e);
        }
    }
}