function Error({ statusCode }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#000', color: '#fff', flexDirection: 'column', gap: '1rem' }}>
            <h1 style={{ fontSize: '4rem', color: '#1fdf64', fontWeight: 'bold' }}>{statusCode}</h1>
            <p style={{ color: '#959595' }}>{statusCode === 404 ? 'Page not found' : 'An error occurred'}</p>
            <a href="/" style={{ color: '#1fdf64', textDecoration: 'underline' }}>Go Home</a>
        </div>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
