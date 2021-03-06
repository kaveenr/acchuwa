import {ConfigModel, AcchuTemplateModel, ParameterScopeEnum} from './models/config-models'
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'fs'
import {compile, registerHelper, SafeString, registerPartial} from 'handlebars'
import {join} from 'path'
import {singular, plural} from 'pluralize'
import * as _ from 'lodash'
import {BaseLogger} from 'pino'
import $RefParser from 'json-schema-ref-parser'
import {AsyncHandler} from './async-handler'
import {safeDump} from 'js-yaml'

export interface AcchuwaServiceFacade {
  generate(config: ConfigModel): boolean;
}

export class AcchuwaService implements AcchuwaServiceFacade {
    private basePath: string;

    private log: BaseLogger;

    private asyncHandler: AsyncHandler;

    constructor(basePath: string, logger: BaseLogger) {
      this.basePath = basePath
      this.asyncHandler = new AsyncHandler()
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
      registerHelper('capitalCase', text => {
        return new SafeString(_.upperFirst(_.camelCase(text)))
      })
      registerHelper('deReferenceYAML', yamlPath => {
        const id = this.asyncHandler.register(new Promise<string>(resolve => {
          $RefParser.dereference(join(this.basePath, yamlPath)).then(value => {
            resolve(safeDump(value, {
              noRefs: true,
            }))
          })
        }))
        return new SafeString(id)
      })
    }

    generate(config: ConfigModel): boolean {
      if (config.partials) {
        const partials = Object.entries(config.partials)
        this.log.info(partials.length + ' partials registered')
        for (const [partialName, partialFilePath] of partials) {
          registerPartial(partialName, this.loadTemplate(partialFilePath))
        }
      }
      for (const [templateName, template] of Object.entries(config.templates)) {
        this.log.info('Processing Acchu template ' + templateName)
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

    private async processSingleTemplate(template: AcchuTemplateModel, params: any, hbsTemplate: HandlebarsTemplateDelegate<any>, outPath: string) {
      const fileName = this.buildFilename(template.outFileTemplate, params)
      const fileContent = await this.asyncHandler.resolveTemplate(hbsTemplate(params))
      this.writeOutput(fileName, fileContent, outPath)
      this.log.info('Compiled file ' + outPath + fileName)
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
