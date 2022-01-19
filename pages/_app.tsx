import type { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import 'tailwindcss/tailwind.css';
import Global from '../components/common/Global';
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Global>
        <Component {...pageProps} />
      </Global>
    </RecoilRoot>
  );
}
export default MyApp;
