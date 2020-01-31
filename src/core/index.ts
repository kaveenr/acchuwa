import { IAcchuwaService } from './IAcchuwaService';
import { AcchuwaService } from './AcchuwaService';

export { IAcchuwaService };

export function getAcchuwaService(basePath: string): IAcchuwaService {
    return new AcchuwaService(basePath);
}