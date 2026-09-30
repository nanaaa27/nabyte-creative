const App = () => {
  // State untuk mengontrol status loading
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <>
      {/* Tampilkan Preloader */}
      {isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}

      {/* Seluruh Konten Utama */}
      <div style={{ visibility: isLoading ? "hidden" : "visible" }}>
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-2"></div>
        <div className="glow-blob blob-3"></div>

        {/* Main Content */}
        <div className="container">
          <Navbar />
          <Hero />
          <Portfolio />
          <Industries />
          <Services />
          <Workflow />
          <Principles />
          <Footer />
        </div>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
