import { setPublicPath } from 'systemjs-webpack-interop';

if ((window as any).singleSpaNavigate) {
  setPublicPath('root-config', 2);
}
