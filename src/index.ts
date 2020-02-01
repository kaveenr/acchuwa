import {Command, flags} from '@oclif/command'
import {getAcchuwaService, ConfigModel} from './core'
import {readFileSync} from 'fs'
import {dirname} from 'path'
import {safeLoad} from 'js-yaml'
import * as pino from 'pino'

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
    const configFile = readFileSync(filePath, 'utf-8')
    const config = safeLoad(configFile) as ConfigModel

    const service = getAcchuwaService(dirname(args.config_file), Acchuwa.logger)
    service.generate(config)
  }
}

export = Acchuwa
