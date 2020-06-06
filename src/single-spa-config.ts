import { registerApplication, start } from 'single-spa';

export default function singleSpaSetup() {
  registerApplication({
    name: '@vue-mf/calendar',
    app: () => (window as any).System.import('@vue-mf/calendar'),
    activeWhen: (location) => {
      return location.hash === '#/';
    },
    customProps: {},
  });

  start();
}
