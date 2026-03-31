import '../styles/globals.css'
import { useState } from 'react'
import Layout from '../components/Layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import CustomCursor from '../components/CustomCursor'

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <CustomCursor />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  )
}
