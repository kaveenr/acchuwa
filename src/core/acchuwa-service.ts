import {ConfigModel, AcchuModel} from './models/config-models'
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'fs'
import {compile, registerHelper, SafeString} from 'handlebars'
import {join} from 'path'
import {singular, plural} from 'pluralize'

export interface AcchuwaServiceFacade {
  generate(config: ConfigModel): boolean;
}

export class AcchuwaService implements AcchuwaServiceFacade {
    private basePath: string;

    constructor(basePath: string) {
      this.basePath = basePath
      registerHelper('singular', text => {
        return new SafeString(singular(text))
      })
      registerHelper('plural', text => {
        return new SafeString(plural(text))
      })
    }

    generate(config: ConfigModel): boolean {
      for (const singleTemplate of config.templates) {
        this.processTemplate(singleTemplate)
      }
      return true
    }

    private processTemplate(template: AcchuModel) {
      const hbsTemplate: HandlebarsTemplateDelegate = compile(
        this.loadTemplate(template.template.file)
      )

      // Output directory
      const outPath = join(this.basePath, template.template.outputDirectory)
      if (!existsSync(outPath)) {
        mkdirSync(outPath)
      }

      for (const params of template.parameters) {
        const fileName = this.buildFilename(template.template.outFileTemplate, params)
        const fileContent = hbsTemplate(params)

        this.writeOutput(fileName, fileContent, outPath)
      }
    }

    private writeOutput(fileName: string, fileContent: string, outputDirectory: string) {
      writeFileSync(outputDirectory + fileName, fileContent)
    }

    private buildFilename(fileTemplate: string, context: Record<string, any>) {
      const fileName = compile(fileTemplate)
      return fileName(context)
    }

    private loadTemplate(path: string): string {
      try {
        return readFileSync(join(this.basePath, path), 'utf-8')
      } catch (error) {
        throw new Error(error)
      }
    }
}
