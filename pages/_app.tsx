import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <script dangerouslySetInnerHTML={{ __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js'); }); }` }} />
    </SessionProvider>
  )
}

export default MyApp