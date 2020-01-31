import { IConfigModel } from "./models/ConfigModels";

interface IAcchuwaService {
    generate(config: IConfigModel): boolean
}

export {IAcchuwaService}