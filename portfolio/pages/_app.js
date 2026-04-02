import '../styles/globals.css'
import { useState } from 'react'
import Layout from '../components/Layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import CustomCursor from '../components/CustomCursor'
import PageLoader from '../components/Common/PageLoader'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())
  const [loading, setLoading] = useState(false)
  const [destination, setDestination] = useState('')
  const router = useRouter()

  useEffect(() => {
    const start = (url) => { setDestination(url); setLoading(true); }
    const done = () => setTimeout(() => setLoading(false), 1500)
    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', done)
    router.events.on('routeChangeError', done)
    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', done)
      router.events.off('routeChangeError', done)
    }
  }, [router])

  return (
    <QueryClientProvider client={queryClient}>
      <CustomCursor />
      <AnimatePresence>
        {loading && <PageLoader key="loader" destination={destination} />}
      </AnimatePresence>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  )
}
