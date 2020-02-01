import {AcchuwaService, AcchuwaServiceFacade} from './acchuwa-service'

export {AcchuwaServiceFacade}

export function getAcchuwaService(basePath: string): AcchuwaServiceFacade {
  return new AcchuwaService(basePath)
}
