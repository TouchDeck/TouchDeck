import { singleton } from '../Injector';
import listFiles from '../util/listFiles';
import { SCRIPTS_DIR } from '../constants';

@singleton
export class ScriptsApi {
  public constructor() {
    this.getScripts = this.getScripts.bind(this);
  }

  public async getScripts(): Promise<string[]> {
    return listFiles(SCRIPTS_DIR);
  }
}
