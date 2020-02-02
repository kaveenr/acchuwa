import {ConfigModel, AcchuTemplateModel, ParameterScopeEnum} from './models/config-models'
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'fs'
import {compile, registerHelper, SafeString} from 'handlebars'
import {join} from 'path'
import {singular, plural} from 'pluralize'
import * as _ from 'lodash'
import {BaseLogger} from 'pino'

export interface AcchuwaServiceFacade {
  generate(config: ConfigModel): boolean;
}

export class AcchuwaService implements AcchuwaServiceFacade {
    private basePath: string;

    private log: BaseLogger;

    constructor(basePath: string, logger: BaseLogger) {
      this.basePath = basePath
      this.log = logger

      registerHelper('singular', text => {
        return new SafeString(singular(text))
      })
      registerHelper('plural', text => {
        return new SafeString(plural(text))
      })
      registerHelper('capitalize', text => {
        return new SafeString(_.capitalize(text))
      })
      registerHelper('kebabCase', text => {
        return new SafeString(_.kebabCase(text))
      })
      registerHelper('snakeCase', text => {
        return new SafeString(_.snakeCase(text))
      })
      registerHelper('camelCase', text => {
        return new SafeString(_.camelCase(text))
      })
    }

    generate(config: ConfigModel): boolean {
      for (const [templateName, template] of Object.entries(config.templates)) {
        this.log.info('Procesing Acchu template ' + templateName)
        this.processTemplate(template, config.parameters)
      }
      return true
    }

    private processTemplate(template: AcchuTemplateModel, parameters: Array<any>) {
      const hbsTemplate: HandlebarsTemplateDelegate = compile(
        this.loadTemplate(template.file)
      )

      const outPath = join(this.basePath, template.outputDirectory)
      if (!existsSync(outPath)) {
        this.log.info('Path ' + outPath + ' doesn\'t exist, creating path')
        mkdirSync(outPath, {recursive: true})
      }

      if (template.parameterScope && template.parameterScope === ParameterScopeEnum.Global) {
        this.processSingleTemplate(template, parameters, hbsTemplate, outPath)
      } else {
        for (const params of parameters) {
          this.processSingleTemplate(template, params, hbsTemplate, outPath)
        }
      }
      this.log.info('Processed ' + parameters.length + ' parameters for template')
    }

    private processSingleTemplate(template: AcchuTemplateModel, params: any, hbsTemplate: HandlebarsTemplateDelegate<any>, outPath: string) {
      const fileName = this.buildFilename(template.outFileTemplate, params)
      const fileContent = hbsTemplate(params)
      this.writeOutput(fileName, fileContent, outPath)
      this.log.info('Compiled file ' + fileName)
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
