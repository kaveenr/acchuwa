import {Command, flags} from '@oclif/command'
import {getAcchuwaService} from './core'
import {readFileSync} from 'fs'
import {dirname} from 'path'
import {ConfigModel} from './core/models/config-models'

class Acchuwa extends Command {
  static description = 'Acchuwa quick and dirty templating'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'config_file'}]

  async run() {
    const {args} = this.parse(Acchuwa)

    // Load Configuration file from disk
    const configFile = readFileSync(args.config_file, 'utf-8')
    // Parse JSON into model
    const config = JSON.parse(configFile) as ConfigModel

    const service = getAcchuwaService(dirname(args.config_file))
    service.generate(config)
  }
}

export = Acchuwa
