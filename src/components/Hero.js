window.Hero = () => {
  // ============================================================
  // DATA: 3 Variasi Copywriting Text Rotator
  // ============================================================
    const textVariants = [
    {
      before:  "Crafting Websites that are ",
      accent:  "High-Performing",
      after:   " & True to Your Brand.",
      subtext: "Dari visual aesthetic yang soft hingga clean corporate look. Kami merancang custom web design yang 100% merepresentasikan identitas bisnismu.",
    },
    {
      before:  "Turn Your Visitors into ",
      accent:  "Qualified Leads",
      after:   ".",
      subtext: "Bukan sekadar halaman statis. Kami mengintegrasikan interactive elements, smart forms, dan seamless user experience untuk konversi yang maksimal.",
    },
    {
      before:  "Built with Precision & ",
      accent:  "AI-Powered Efficiency",
      after:   ".",
      subtext: "Menggabungkan clean code structure dengan workflow AI. Menghasilkan website fast-loading, bebas bug, dan siap beroperasi. Zero complexity untukmu.",
    },
  ];


  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isVisible,   setIsVisible]   = React.useState(true);

  React.useEffect(() => {
    const DISPLAY_DURATION  = 4500;
    const FADE_OUT_DURATION =  500;
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setActiveIndex(prev => (prev + 1) % textVariants.length);
        setIsVisible(true);
      }, FADE_OUT_DURATION);
    }, DISPLAY_DURATION);
    return () => clearInterval(timer);
  }, []);

  const current = textVariants[activeIndex];

  const animatedStyle = {
    opacity:    isVisible ? 1 : 0,
    transform:  isVisible ? "translateY(0px)" : "translateY(12px)",
    transition: "opacity 0.5s ease, transform 0.5s ease",
    willChange: "opacity, transform",
  };
  const animatedStyleDelayed = {
    ...animatedStyle,
    transition: "opacity 0.5s ease 0.07s, transform 0.5s ease 0.07s",
  };

  const brandLetters = [
    { char: "N", isAccent: false },
    { char: "A", isAccent: false },
    { char: "B", isAccent: false },
    { char: "Y", isAccent: false },
    { char: "T", isAccent: false },
    { char: "E", isAccent: false },
    { char: ".", isAccent: true  },
  ];
  const STAGGER_DELAY   = 0.06;
  const BASE_DELAY      = 0.1;
  const LETTER_DURATION = 0.75;

  const useScrollReveal = (threshold = 0.18) => {
    const ref = React.useRef(null);
    const [revealed, setRevealed] = React.useState(false);

    React.useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(el);
          }
        },
        { threshold }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    return [ref, revealed];
  };

  const revealStyle = (revealed, delay = 0) => ({
    opacity:    revealed ? 1 : 0,
    transform:  revealed ? "translateY(0px)" : "translateY(22px)",
    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s,
                 transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    willChange: "opacity, transform",
  });

  const [whyRef,   whyRevealed]   = useScrollReveal(0.2);
  const [whyH2Ref, whyH2Revealed] = useScrollReveal(0.2);
  const [whyPRef,  whyPRevealed]  = useScrollReveal(0.2);

  return (
    <div>
      <style>{`
        @keyframes letter-up {
          0%   { transform: translateY(110%); opacity: 0.2; }
          100% { transform: translateY(0%);   opacity: 1;   }
        }
        .letter-slot {
          display: inline-block;
          overflow: hidden;
          padding-bottom: 6px;
          margin-bottom: -6px;
          vertical-align: bottom;
          line-height: 1;
        }
        .letter-inner {
          display: inline-block;
          animation: letter-up ${LETTER_DURATION}s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes pulse-glow {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0   rgba(163, 255, 18, 0.75); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 8px rgba(163, 255, 18, 0);    }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0   rgba(163, 255, 18, 0);    }
        }
        .pulse-dot { animation: pulse-glow 2s infinite; }

        @keyframes fade-in-badge {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        .badge-reveal {
          animation: fade-in-badge 0.5s ease both;
          animation-delay: 0.05s;
        }
      `}</style>

      {/* HERO SECTION DIPERBAIKI */}
      <section
        style={{
          minHeight:      "100vh",
          width:          "100%",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center", 
          alignItems:     "flex-start",
          paddingTop:     "80px",
          paddingBottom:  "40px",
          boxSizing:      "border-box",
        }}
      >
        <span className="badge-pill badge-reveal">✦ Web Dev & UI/UX Studio</span>

        <div style={{ marginTop: "12px", marginBottom: "4px" }}>
          <h1
            style={{
              fontSize: "3.4rem", fontWeight: "900", letterSpacing: "3px",
              color: "#fff", margin: 0, lineHeight: 1,
              display: "flex", alignItems: "flex-end",
            }}
          >
            {brandLetters.map((item, i) => (
              <span key={i} className="letter-slot">
                <span
                  className="letter-inner"
                  style={{
                    animationDelay: `${BASE_DELAY + i * STAGGER_DELAY}s`,
                    color: item.isAccent ? "var(--accent-lime)" : "#fff",
                  }}
                >
                  {item.char}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div style={{ minHeight: "200px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
          <h2
            className="hero-title"
            style={{ marginTop: "16px", fontSize: "1.75rem", lineHeight: "1.25", ...animatedStyle }}
          >
            {current.before}
            <span className="serif-italic">{current.accent}</span>
            {current.after}
          </h2>
          <p className="subtext" style={{ marginTop: "12px", marginBottom: "0", ...animatedStyleDelayed }}>
            {current.subtext}
          </p>
        </div>

        <div style={{ width: "100%", marginTop: "28px", marginBottom: "20px" }}>
          <a href="#why-us" className="btn-primary" style={{ display: "block", textAlign: "center", width: "100%" }}>
            Explore Services ↓
          </a>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          fontSize: "0.78rem", color: "var(--text-muted)",
          background: "rgba(255,255,255,0.03)", padding: "8px 14px",
          borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <span className="pulse-dot" style={{
            width: "8px", height: "8px", borderRadius: "50%",
            backgroundColor: "var(--accent-lime)", display: "inline-block", flexShrink: 0,
          }}></span>
          <span>Available for new projects • Fast turnarounds</span>
        </div>
      </section>

      {/* WHY IT MATTERS SECTION */}
      <section
        id="why-us"
        style={{ paddingTop: "80px", paddingBottom: "40px", textAlign: "center" }}
      >
        <div ref={whyRef} style={{ display: "inline-block", marginBottom: "16px", ...revealStyle(whyRevealed, 0) }}>
          <span className="badge-pill">WHY IT MATTERS</span>
        </div>

        <h2
          ref={whyH2Ref}
          className="section-title"
          style={{
            fontSize: "1.75rem", marginTop: "12px", marginBottom: "16px", lineHeight: "1.3",
            ...revealStyle(whyH2Revealed, 0.12),
          }}
        >
          Sebelum Beli, Klien Pasti <br />
          <span className="serif-italic">Riset Dulu.</span>
        </h2>

        <p
          ref={whyPRef}
          style={{
            color: "var(--text-muted)", fontSize: "0.95rem",
            lineHeight: "1.8", maxWidth: "540px", margin: "0 auto",
            ...revealStyle(whyPRevealed, 0.24),
          }}
        >
          Di era digital, website adalah kantor sekaligus{" "}
          <i>sales representative</i> 24/7 milikmu. Kalau tampilan websitemu
          terlihat kurang terpercaya atau lambat, calon klien akan langsung
          berpaling ke kompetitor sebelum kamu sempat menyapa.
        </p>
      </section>
    </div>
  );
};
