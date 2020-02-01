import {AcchuwaService, AcchuwaServiceFacade} from './acchuwa-service'
import {ConfigModel} from './models/config-models'
import {BaseLogger} from 'pino'

export {AcchuwaServiceFacade, ConfigModel}

export function getAcchuwaService(basePath: string, logger: BaseLogger): AcchuwaServiceFacade {
  return new AcchuwaService(basePath, logger)
}
