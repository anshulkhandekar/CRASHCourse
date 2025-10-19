import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamic import to prevent SSR issues with Leaflet
const AggieFlowMap = dynamic(() => import('../components/AggieFlowMap'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#500000', marginBottom: '10px' }}>Loading AggieFlow...</h2>
        <p style={{ color: '#666' }}>Preparing campus traffic visualization</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <Head>
        <title>CRASHCourse - Campus Traffic Visualization</title>
        <meta name="description" content="Real-time campus traffic and congestion visualization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main style={{ margin: 0, padding: 0 }}>
        <AggieFlowMap />
      </main>
    </>
  );
}

