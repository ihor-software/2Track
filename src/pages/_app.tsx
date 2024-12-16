import type { AppProps } from 'next/app'; // Import AppProps type
import '../styles/globals.css';  // Import global CSS
import { Provider } from 'react-redux';
import { store } from '../store/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
