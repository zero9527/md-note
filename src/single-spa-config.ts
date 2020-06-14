import { registerApplication, start } from 'single-spa';

export default function singleSpaSetup() {
  registerApplication({
    name: 'root-config',
    app: () => (window as any).System.import('root-config'),
    activeWhen: () => true,
  });

  start();
}
