import {Command, flags} from '@oclif/command'
import {getAcchuwaService, ConfigModel} from './core'
import {dirname} from 'path'
import pino from 'pino'
import $RefParser from "json-schema-ref-parser";

class Acchuwa extends Command {
  static description = 'Acchuwa quick and dirty templating'

  static logger = pino({
    name: 'Acchuwa CLI',
    level: 'info',
    prettyPrint: true,
  })

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'config_file'}]

  async run() {
    const {args} = this.parse(Acchuwa)

    const filePath = args.config_file
    const configFile = await $RefParser.dereference(filePath)
    const config = configFile as ConfigModel

    const service = getAcchuwaService(dirname(args.config_file), Acchuwa.logger)
    service.generate(config)
  }
}

export = Acchuwa
