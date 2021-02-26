import { execFile } from 'child_process';
import { action, Action, param, PreparedAction } from './Action';
import { assertInDir } from '../util/assertInDir';
import { SCRIPTS_DIR } from '../constants';

@action('', 'Run Script')
export class RunScriptAction implements Action {
  public prepare(@param('script', 'script') script: string): PreparedAction {
    return {
      invoke: () => this.invoke(script),
    };
  }

  private async invoke(script: string): Promise<void> {
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
