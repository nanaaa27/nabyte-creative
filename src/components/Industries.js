window.Industries = () => {

  // ============================================================
  // SCROLL REVEAL — Intersection Observer (viewport, untuk header)
  // ============================================================
  const useScrollReveal = (threshold = 0.2) => {
    const ref = React.useRef(null);
    const [revealed, setRevealed] = React.useState(false);
    React.useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.unobserve(el); } },
        { threshold }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return [ref, revealed];
  };

  // Helper style — slide-up fade-in
  const revealStyle = (revealed, delay = 0) => ({
    opacity:    revealed ? 1 : 0,
    transform:  revealed ? "translateY(0px)" : "translateY(20px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s,
                 transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    willChange: "opacity, transform",
  });

  // Header refs
  const [badgeRef,   badgeRevealed]   = useScrollReveal(0.2);
  const [titleRef,   titleRevealed]   = useScrollReveal(0.2);
  const [hintRef,    hintRevealed]    = useScrollReveal(0.2);

  // ============================================================
  // CARD POP-IN — IntersectionObserver dengan root = scroll container
  // ============================================================
  const scrollRef  = React.useRef(null);   
  const cardCount  = (typeof industryData !== "undefined") ? industryData.length : 8;

  const cardEntries = Array.from({ length: cardCount }, () => {
    const ref = React.useRef(null);
    const [revealed, setRevealed] = React.useState(false);
    return { ref, revealed, setRevealed };
  });

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observers = cardEntries.map(({ ref, setRevealed }, i) => {
      const el = ref.current;
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.unobserve(el);
          }
        },
        {
          root:       container,   
          threshold:  0.25,        
          rootMargin: "0px -40px 0px 0px", 
        }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach(obs => obs && obs.disconnect());
  }, []);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <section id="industries" style={{ paddingTop: "40px", paddingBottom: "40px" }}>

      <style>{`
        .industries-scroll::-webkit-scrollbar { display: none; }
        .industries-scroll {
          -ms-overflow-style: none;
          scrollbar-width:    none;
        }

        /* Industry Card base */
        .industry-card {
          flex:             0 0 270px;
          min-height:       340px;
          scroll-snap-align: start;
          border-radius:    20px;
          padding:          24px;
          display:          flex;
          flex-direction:   column;
          justify-content:  space-between;
          position:         relative;
          overflow:         hidden;
          border:           1px solid var(--card-border);
          box-shadow:       0 8px 32px rgba(0,0,0,0.3);
          cursor:           default;

          opacity:          0;
          transform:        scale(0.88) translateY(10px);

          transition:
            opacity   0.6s cubic-bezier(0.16,1,0.3,1),
            transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
          will-change: opacity, transform;
        }

        .industry-card.is-popped {
          opacity:   1;
          transform: scale(1) translateY(0px);
        }

        /* Hover card */
        .industry-card.is-popped:hover {
          transform:   scale(1.03) translateY(-5px);
          box-shadow:  0 20px 48px rgba(0,0,0,0.45),
                       0  0  24px rgba(163,255,18,0.08);
          border-color: rgba(163,255,18,0.25);
          transition:
            transform   0.4s cubic-bezier(0.16,1,0.3,1),
            box-shadow  0.4s ease,
            border-color 0.35s ease;
        }
        .industry-card.is-popped:active {
          transform: scale(1.01) translateY(-2px);
          transition-duration: 0.12s;
        }

        .industry-card {
          transition-delay:
            calc(var(--card-i, 0) * 0.05s),   
            calc(var(--card-i, 0) * 0.05s);   
        }

        @media (hover: none) {
          .industry-card.is-popped:hover {
            transform: scale(1) translateY(0px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          }
          .industry-card.is-popped:active {
            transform:    scale(1.02) translateY(-4px) rotate(-1deg);
            border-color: rgba(163,255,18,0.3);
            box-shadow:   0 16px 36px rgba(0,0,0,0.4);
          }
        }
      `}</style>

            {/* HEADER — Scroll Reveal staggered  */}
      <div style={{ textAlign: "left", marginBottom: "24px" }}>

        <div
          ref={badgeRef}
          style={{ display: "inline-block", ...revealStyle(badgeRevealed, 0) }}
        >
          <span className="badge-pill">SIAPA YANG KAMI BANTU</span>
        </div>

        <h2
          ref={titleRef}
          className="section-title"
          style={{ marginTop: "12px", fontSize: "1.8rem", ...revealStyle(titleRevealed, 0.12) }}
        >
          12+ Industri yang Menang Lewat <br/>
          <span className="serif-italic">Kehadiran Digital</span>.
        </h2>

        <p
          ref={hintRef}
          className="subtext"
          style={{ marginBottom: "0", ...revealStyle(hintRevealed, 0.22) }}
        >
          Geser untuk melihat bagaimana kami menyesuaikan desain dan fitur interaktif untuk berbagai sektor bisnis. ➔
        </p>

      </div>

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        className="industries-scroll"
        style={{
          display:                "flex",
          gap:                    "16px",
          overflowX:              "auto",
          paddingBottom:          "20px",
          paddingLeft:            "4px",
          paddingRight:           "4px",
          scrollSnapType:         "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {industryData.map((item, idx) => {
          const entry = cardEntries[idx] || {};

          return (
            <div
              key={idx}
              ref={entry.ref}
              className={`industry-card${entry.revealed ? " is-popped" : ""}`}
              style={{
                "--card-i": idx,
                backgroundImage: `
                  linear-gradient(to bottom,
                    rgba(7,14,9,0.65) 0%,
                    rgba(7,14,9,0.95) 100%
                  ),
                  url(${item.image})
                `,
                backgroundSize:     "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Konten Atas */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{item.icon}</div>
                <span style={{
                  fontSize:        "0.7rem",
                  color:           "var(--accent-lime)",
                  fontWeight:      "700",
                  letterSpacing:   "0.5px",
                  textTransform:   "uppercase",
                  background:      "rgba(0,0,0,0.4)",
                  padding:         "4px 8px",
                  borderRadius:    "6px",
                  backdropFilter:  "blur(4px)",
                }}>
                  {item.tag}
                </span>
                <h3 style={{
                  fontSize: "1.3rem", fontWeight: "700",
                  margin: "12px 0 8px", color: "#fff",
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.85rem", lineHeight: "1.5",
                }}>
                  {item.desc}
                </p>
              </div>

             {/* Konten Bawah */}
              <div style={{
                position:   "relative",
                zIndex:     2,
                fontSize:   "0.8rem",
                color:      "var(--accent-lime)",
                fontWeight: "600",
                display:    "flex",
                alignItems: "center",
                gap:        "4px",
              }}>
                Eksplorasi Solusi ↗
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
