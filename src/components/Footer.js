window.Footer = () => {
  // 1. SCROLL REVEAL OBSERVER
  const sectionRef = React.useRef(null);
  const [isRevealed, setIsRevealed] = React.useState(false);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. DYNAMIC ROTATING TEXT DATA (3 Variasi Teks)
    const contentVariations = [
    {
      titleMain: "Ready to Elevate",
      titleItalic: "Your Digital Presence?",
      subtext: "Baik untuk nuansa aesthetic maupun clean corporate, mari diskusikan goals bisnismu. Let us build the perfect digital storefront for you."
    },
    {
      titleMain: "Zero-Complexity",
      titleItalic: "Guarantee.",
      subtext: "Fokus kembangkan bisnismu. Untuk urusan teknis, dari seamless performance hingga smart integrations, let our studio handle the rest."
    },
    {
      titleMain: "Stand Out from",
      titleItalic: "The Competition.",
      subtext: "Hadirkan website yang fully responsive, fast-loading, dan siap mengonversi prospek bisnismu 24/7 tanpa kendala teknis."
    }
  ];


  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [fadeState, setFadeState] = React.useState("fade-in");

  // 3. EFFECT ROTATING TEXT
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("fade-out");
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % contentVariations.length);
        setFadeState("fade-in");
      }, 400); 

    }, 3500); 

    return () => clearInterval(interval);
  }, [contentVariations.length]);

  const currentContent = contentVariations[currentIndex];

  return (
    <footer 
      id="contact" 
      ref={sectionRef}
      style={{
        paddingTop: '50px', 
        paddingBottom: '40px', 
        textAlign: 'center',
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'opacity, transform',
        overflow: 'hidden' 
      }}
    >
      <style>{`
        /* =========================================
           1. ANIMASI ROTATING TEXT
        ========================================= */
        .rotating-text-container {
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .rotating-text-container.fade-in {
          opacity: 1;
          transform: translateY(0px);
        }
        .rotating-text-container.fade-out {
          opacity: 0;
          transform: translateY(-8px);
        }

        /* =========================================
           2. EXTENDED FOOTER GRID
        ========================================= */
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr; 
          gap: 40px 20px;
          text-align: left; /* Teks grid rata kiri */
        }

        .col-about {
          grid-column: 1 / -1; 
        }
        
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr;
            gap: 40px;
          }
          .col-about {
            grid-column: 1 / 2; 
            max-width: 320px; 
          }
        }

        /* =========================================
           3. STYLING KONTEN & TIPOGRAFI
        ========================================= */
        .footer-col-title {
          font-size: 0.75rem;
          letter-spacing: 2px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 24px;
          font-weight: 600;
        }

        .footer-info-text {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .location-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
          font-size: 0.85rem;
          letter-spacing: 1px;
          white-space: nowrap; 
        }

        .footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px; 
        }

        .footer-link {
          color: #fff;
          text-decoration: none;
          font-size: 1.05rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .footer-link:hover {
          color: var(--accent-lime, #a3ff12);
          transform: translateX(6px);
        }

        /* =========================================
           4. MEGA LOGO 
        ========================================= */
        .mega-footer-logo {
          margin-top: 80px;
          margin-bottom: -5px; 
          font-size: 16vw; 
          font-weight: 900;
          line-height: 0.85; 
          letter-spacing: -0.02em;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .mega-footer-logo {
            font-size: 9vw; 
          }
        }

        .mega-text-solid {
          color: #fff;
        }

        .mega-dot {
          color: var(--accent-lime, #a3ff12);
        }

        .mega-text-outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        }

        /* =========================================
           5. COPYRIGHT BAR BAWAH
        ========================================= */
        .footer-bottom-bar {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-bottom-bar {
            flex-direction: row;
            text-align: left;
          }
        }
      `}</style>

      {/* -------------------------------------------------------------
          1. BENTO CARD (100% DIKEMBALIKAN KE KODE AWAL TANPA WRAPPER)
      ------------------------------------------------------------- */}
      <div 
        className="bento-card" 
        style={{
          padding: '36px 20px', 
          background: 'linear-gradient(180deg, rgba(163,255,18,0.05) 0%, rgba(18,26,20,0.8) 100%)', 
          border: '1px solid var(--accent-lime)'
        }}
      >
        <span className="badge-pill" style={{marginBottom: '16px', display: 'inline-block'}}>
          START A PROJECT
        </span>
        
        <div className={`rotating-text-container ${fadeState}`}>
          <h2 className="section-title" style={{fontSize: '1.8rem', marginTop: '10px', marginBottom: '14px'}}>
            {currentContent.titleMain} <br />
            <span className="serif-italic">{currentContent.titleItalic}</span>
          </h2>
          
          <p style={{
            color: 'var(--text-muted)', 
            fontSize: '0.9rem', 
            lineHeight: '1.7', 
            marginBottom: '24px', 
            maxWidth: '400px', 
            margin: '0 auto 24px'
          }}>
            {currentContent.subtext}
          </p>
        </div>

        <a 
          href="https://wa.me/" 
          target="_blank" 
          rel="noreferrer" 
          className="btn-primary"
          style={{display: 'inline-block', width: 'auto', padding: '12px 28px', fontSize: '0.95rem'}}
        >
          Diskusi via WhatsApp ↗
        </a>
      </div>

      {/* -------------------------------------------------------------
          2. EXTENDED FOOTER
      ------------------------------------------------------------- */}
      <div style={{ marginTop: '60px', paddingTop: '60px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        
        <div className="footer-grid">
          <div className="col-about">
            <div className="footer-col-title">Tentang Nabyte</div>
            <p className="footer-info-text">
              Web development studio yang berfokus pada desain UI/UX eksklusif berkinerja tinggi. Kami membangun website yang tak hanya indah, tapi juga mengonversi secara optimal.
            </p>
            <div className="location-badge">
              <span style={{color: 'var(--accent-lime)'}}>●</span> INDONESIA • REMOTE-FIRST
            </div>
          </div>

          <div>
            <div className="footer-col-title">Menu Utama</div>
            <ul className="footer-link-list">
              <li><a href="#services" className="footer-link">Layanan</a></li>
              <li><a href="#portfolio" className="footer-link">Portfolio</a></li>
              <li><a href="#industries" className="footer-link">Industri</a></li>
              <li><a href="#workflow" className="footer-link">Alur Kerja</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Hubungi Kami</div>
            <ul className="footer-link-list">
              <li><a href="#" target="_blank" rel="noreferrer" className="footer-link">WhatsApp ↗</a></li>
              <li><a href="#" target="_blank" rel="noreferrer" className="footer-link">Instagram ↗</a></li>
              <li><a href="#" className="footer-link">Email Us ↗</a></li>
              <li><a href="#form" className="footer-link">Form Proyek ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="mega-footer-logo">
          <div className="mega-text-solid">NABYTE<span className="mega-dot">.</span></div>
          <div className="mega-text-outline">CREATIVE</div>
        </div>

        <div className="footer-bottom-bar">
          <div>© {new Date().getFullYear()} Nabyte Creative. All rights reserved.</div>
          <div style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
            FASTER THAN <s style={{ opacity: 0.4 }}>YOUR DEADLINE</s>.
          </div>
        </div>
      </div>
      
    </footer>
  );
};
