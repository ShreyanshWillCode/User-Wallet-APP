interface LoadingScreenProps {
  userName?: string;
}

export function LoadingScreen({ userName }: LoadingScreenProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #09092e 0%, #1a0050 50%, #09092e 100%)',
        zIndex: 9999,
      }}
    >
      {/* GIF / Video */}
      <div
        style={{
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(124, 58, 237, 0.6)',
          marginBottom: '32px',
          border: '3px solid rgba(124, 58, 237, 0.4)',
        }}
      >
        <img
          src="/loading.gif"
          alt="Loading..."
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Welcome text */}
      {userName && (
        <p style={{ color: '#c4b5fd', fontSize: '1.1rem', marginBottom: '8px', letterSpacing: '0.05em' }}>
          Welcome back,
        </p>
      )}
      <h1
        style={{
          color: '#ffffff',
          fontSize: '1.8rem',
          fontWeight: 700,
          marginBottom: '32px',
          textAlign: 'center',
        }}
      >
        {userName || 'Loading your wallet...'}
      </h1>

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#7c3aed',
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
