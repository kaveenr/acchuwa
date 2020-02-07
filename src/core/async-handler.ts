import * as uuid from 'uuid'
import {compile, registerPartial} from 'handlebars'

interface AsyncItem {
  id: string;
  item: Promise<string>;
}

interface ResolvedAsyncItem {
  id: string;
  item: string;
}

export class AsyncHandler {
    private waiter: Array<AsyncItem>

    constructor() {
      this.waiter = []
    }

    public register(data: Promise<string>): string {
      const id = uuid.v4()
      this.waiter.push({
        id: id,
        item: data,
      } as AsyncItem)
      return '{{> ' + id + '}}'
    }

    public async resolveTemplate(template: string): Promise<string> {
      const resolvedData = await Promise.all(this.waiter.map(async singleItem => {
        return {
          id: singleItem.id,
          item: await singleItem.item,
        } as ResolvedAsyncItem
      }))

      resolvedData.forEach(element => {
        registerPartial(element.id, element.item)
      })
      return compile(template)({})
    }
}
