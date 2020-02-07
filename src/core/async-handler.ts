import * as uuid from "uuid"
import {compile, registerHelper, SafeString, registerPartial} from 'handlebars'
import {safeDump} from 'js-yaml';

export class AsyncHandler {
    
    private waiter:Map<string, Promise<any>>

    constructor(){
        this.waiter = new Map();
    }

    public register(data: Promise<any>): string{
        const id = uuid.v4();
        this.waiter.set(id, data);
        return "{{> " + id + "}}";
    }

    public async resolveTemplate(template:string): Promise<string> {
        for (const [id, data] of this.waiter) {
            const compiled = await data;
            registerPartial(id, safeDump(compiled, {
                noRefs: true
            }))
        }
        return compile(template)({})
    }

}