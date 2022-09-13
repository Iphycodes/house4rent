// import '../styles/globals.css'
// import type { AppProps } from 'next/app'

// function MyApp({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />
// }

// export default MyApp


import '../styles/globals.css'
// import 'remixicon/fonts/remixicon.css';

import type { AppProps } from 'next/app'
import { ThemeContextProvider } from '@/context'
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { MainLayoutContainer } from '../src/container';
import { wrapper } from '@/store';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type MyAppProps = AppProps & {
  Component: NextPageWithLayout;
};
function MyApp({ Component, pageProps }: MyAppProps) {

  const getLayout = Component.getLayout || ((page: ReactNode) => {
    return  <MainLayoutContainer>
              {page}
            </MainLayoutContainer>
  });

  return  <ThemeContextProvider>
              {getLayout(<Component {...pageProps} />)}
          </ThemeContextProvider>
  
}



// export default MyApp;
export default wrapper.withRedux(MyApp);

