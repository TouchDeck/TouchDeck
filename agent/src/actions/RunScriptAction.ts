import { execFile } from 'child_process';
import { action, Action, param, PreparedAction } from './Action';
import { assertInDir } from '../util/assertInDir';
import { SCRIPTS_DIR } from '../constants';

@action('', 'Run Script')
export class RunScriptAction implements Action {
  public prepare(
    @param('script') script: string,
    @param('arguments') args: string
  ): PreparedAction {
    return {
      invoke: () => this.invoke(script, args),
    };
  }

  private async invoke(script: string, args: string): Promise<void> {
    const path = assertInDir(SCRIPTS_DIR, script);
    const child = execFile(path);

    return new Promise((resolve, reject) => {
      child.once('exit', (code, signal) => {
        if (code === 0) {
          resolve();
        } else if (code) {
          reject(new Error(`Process returned exit code ${code}`));
        } else {
          reject(new Error(`Process terminated with ${signal}`));
        }
      });
    });
  }
}
