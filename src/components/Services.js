window.Services = () => {

  // ============================================================
  // SCROLL REVEAL — Intersection Observer hook
  // (identik dengan Portfolio.js)
  // ============================================================
  const useScrollReveal = (threshold = 0.15) => {
    const ref = React.useRef(null);
    const [revealed, setRevealed] = React.useState(false);
    React.useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { setRevealed(true); observer.unobserve(el); }
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
    transform:  revealed ? "translateY(0px)" : "translateY(24px)",
    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s,
                 transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    willChange: "opacity, transform",
  });

  // ── Header refs ──
  const [badgeRef,   badgeRevealed]   = useScrollReveal(0.2);
  const [titleRef,   titleRevealed]   = useScrollReveal(0.2);
  const [subtextRef, subtextRevealed] = useScrollReveal(0.2);

  // ── Features box ref ──
  const [featRef, featRevealed] = useScrollReveal(0.15);

  // ── Card refs (scroll reveal per card) ──
  const cardCount = (typeof servicesData !== "undefined") ? servicesData.length : 4;
  const cardRefs  = Array.from({ length: cardCount }, () => {
    const ref = React.useRef(null);
    const [revealed, setRevealed] = React.useState(false);
    return { ref, revealed, setRevealed };
  });

  React.useEffect(() => {
    const observers = cardRefs.map(({ ref, setRevealed }) => {
      const el = ref.current;
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.unobserve(el); } },
        { threshold: 0.12 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(obs => obs && obs.disconnect());
  }, []);

  // ============================================================
  // TILT HOVER — identik dengan Portfolio.js
  // ============================================================
  const [tilts, setTilts] = React.useState(
    Array.from({ length: cardCount }, () => ({ x: 0, y: 0, hovered: false }))
  );

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const cy = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    setTilts(prev => prev.map((t, i) =>
      i === index ? { x: cx, y: cy, hovered: true } : t
    ));
  };

  const handleMouseLeave = (index) => {
    setTilts(prev => prev.map((t, i) =>
      i === index ? { x: 0, y: 0, hovered: false } : t
    ));
  };

  const handleTouchMove = (e, index) => {
    const touch = e.touches[0];
    const rect  = e.currentTarget.getBoundingClientRect();
    const cx = ((touch.clientX - rect.left) / rect.width  - 0.5) * 2;
    const cy = ((touch.clientY - rect.top)  / rect.height - 0.5) * 2;
    setTilts(prev => prev.map((t, i) =>
      i === index ? { x: cx, y: cy, hovered: true } : t
    ));
  };

  const handleTouchEnd = (index) => {
    setTimeout(() => {
      setTilts(prev => prev.map((t, i) =>
        i === index ? { x: 0, y: 0, hovered: false } : t
      ));
    }, 300);
  };

  // cardTransform — identik dengan Portfolio.js
  const cardTransform = (tilt, revealed, delay, cardIndex) => {
    const MAX_ROTATE = 8;
    const LIFT       = tilt.hovered ? -18 : 0;
    const baseTilt   = cardIndex % 2 === 0 ? -2 : 2;
    const rotateY    = tilt.hovered ? tilt.x * MAX_ROTATE : 0;
    const rotateX    = tilt.hovered ? -tilt.y * (MAX_ROTATE * 0.6) : 0;
    const rotateFix  = tilt.hovered ? baseTilt : 0;
    const revealedY  = revealed ? 0 : 24;
    const revealedO  = revealed ? 1 : 0;

    return {
      opacity:   revealedO,
      transform: `
        perspective(900px)
        translateY(${revealedY + LIFT}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY + rotateFix}deg)
        scale(${tilt.hovered ? 1.025 : 1})
      `,
      transition: tilt.hovered
        ? `transform 0.12s ease, box-shadow 0.35s ease, border-color 0.35s ease`
        : `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s,
           transform 0.65s cubic-bezier(0.34,1.56,0.64,1),
           box-shadow 0.55s ease, border-color 0.45s ease`,
      willChange: "transform, opacity",
    };
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <section id="services" style={{ paddingTop: "40px", paddingBottom: "40px" }}>

      {/* ── CSS — identik struktur Portfolio, class diganti "service-card" ── */}
      <style>{`

        /* Base card paket */
        .service-card {
          position:         relative;
          cursor:           pointer;
          transform-origin: center center;
          transform-style:  preserve-3d;
        }

        /* Glow border saat hover */
        .service-card.is-hovered {
          border-color: rgba(163, 255, 18, 0.5) !important;
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.55),
            0  8px 24px rgba(0, 0, 0, 0.35),
            0  0  36px rgba(163, 255, 18, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        /* Card populer saat hover — glow lebih intens */
        .service-card.is-popular.is-hovered {
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.55),
            0  8px 24px rgba(0, 0, 0, 0.35),
            0  0  48px rgba(163, 255, 18, 0.22),
            inset 0 1px 0 rgba(163, 255, 18, 0.1);
        }

        /* Shadow default idle */
        .service-card.is-idle {
          box-shadow:
            0  6px 20px rgba(0, 0, 0, 0.30),
            0  2px  6px rgba(0, 0, 0, 0.20);
        }

        /* Active/press */
        .service-card:active {
          transform: perspective(900px) translateY(-4px) rotateX(2deg) scale(0.99) !important;
          transition: transform 0.1s ease !important;
          box-shadow:
            0 10px 28px rgba(0, 0, 0, 0.5),
            0  0  18px rgba(163, 255, 18, 0.18) !important;
        }

        /* Shine overlay diagonal — muncul saat hover */
        .service-card::before {
          content:        "";
          position:       absolute;
          inset:          0;
          border-radius:  inherit;
          background:     linear-gradient(
                            135deg,
                            rgba(255, 255, 255, 0.07) 0%,
                            transparent 50%,
                            rgba(163, 255, 18, 0.04) 100%
                          );
          opacity:        0;
          transition:     opacity 0.35s ease;
          pointer-events: none;
          z-index:        1;
        }
        .service-card.is-hovered::before { opacity: 1; }

        /* Konten card selalu di atas shine layer */
        .service-card > *:not(style) { position: relative; z-index: 2; }

        /* Touch device */
        @media (hover: none) {
          .service-card:active {
            transform:    perspective(900px) translateY(-10px) rotate(-1.5deg) scale(1.015) !important;
            border-color: rgba(163, 255, 18, 0.5) !important;
            box-shadow:
              0 20px 48px rgba(0, 0, 0, 0.5),
              0  0  28px rgba(163, 255, 18, 0.18) !important;
            transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1) !important;
          }
        }

      `}</style>

      {/* ── HEADER — Scroll Reveal staggered ── */}
      <div style={{ textAlign: "left", marginBottom: "32px" }}>

        <div
          ref={badgeRef}
          style={{ display: "inline-block", ...revealStyle(badgeRevealed, 0) }}
        >
          <span className="badge-pill">PAKET & SCOPE</span>
        </div>

        <h2
          ref={titleRef}
          className="section-title"
          style={{ marginTop: "12px", fontSize: "1.8rem", ...revealStyle(titleRevealed, 0.12) }}
        >
          Tentukan Kebutuhanmu. <br />
          <span className="serif-italic">Kami Eksekusi Selebihnya.</span>
        </h2>

        <p
          ref={subtextRef}
          className="subtext"
          style={{ marginBottom: "0", ...revealStyle(subtextRevealed, 0.22) }}
        >
          Pilihan paket yang transparan dan fleksibel. Budget fleksibel tanpa mengorbankan kualitas.
        </p>

      </div>

      {/* ── CARDS PAKET — Tilt Hover + Scroll Reveal ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {servicesData.map((pkg, index) => {
          const { ref, revealed } = cardRefs[index] || {};
          const tilt      = tilts[index] || { x: 0, y: 0, hovered: false };
          const cardDelay = index * 0.12;
          const tiltStyle = cardTransform(tilt, revealed, cardDelay, index);

          return (
            <div
              key={pkg.id}
              ref={ref}
              className={[
                "bento-card",
                "service-card",
                pkg.popular ? "is-popular" : "",
                tilt.hovered ? "is-hovered" : "is-idle",
              ].join(" ")}
              style={{
                marginBottom: "0",
                // Styling khusus paket populer dipertahankan
                border:      pkg.popular
                               ? "1px solid var(--accent-lime)"
                               : "1px solid var(--card-border)",
                background:  pkg.popular
                               ? "rgba(163, 255, 18, 0.05)"
                               : "var(--card-bg)",
                ...tiltStyle,
              }}
              onMouseMove={e => handleMouseMove(e, index)}
              onMouseLeave={  () => handleMouseLeave(index)}
              onTouchMove={e => handleTouchMove(e, index)}
              onTouchEnd={    () => handleTouchEnd(index)}
            >

              {/* Badge RECOMMENDED — hanya untuk paket populer */}
              {pkg.popular && (
                <div style={{
                  position:     "absolute",
                  top:          "-12px",
                  right:        "20px",
                  background:   "var(--accent-lime)",
                  color:        "#000",
                  fontSize:     "0.65rem",
                  fontWeight:   "800",
                  padding:      "4px 12px",
                  borderRadius: "20px",
                  letterSpacing: "0.5px",
                  zIndex:        3,
                }}>
                  RECOMMENDED
                </div>
              )}

              {/* Label badge paket (mis. "PALING BANYAK DIPILIH") */}
              <span style={{
                fontSize:      "0.7rem",
                color:         "var(--accent-lime)",
                fontWeight:    "700",
                letterSpacing: "0.5px",
              }}>
                {pkg.badge}
              </span>

              {/* Judul paket */}
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "8px 0" }}>
                {pkg.title}
              </h3>

              {/* Deskripsi */}
              <p style={{
                color:        "var(--text-muted)",
                fontSize:     "0.9rem",
                lineHeight:   "1.6",
                marginBottom: "20px",
              }}>
                {pkg.desc}
              </p>

              {/* Footer: harga + tombol CTA */}
              <div style={{
                display:       "flex",
                justifyContent: "space-between",
                alignItems:    "center",
                paddingTop:    "16px",
                borderTop:     "1px solid rgba(255,255,255,0.08)",
              }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    ESTIMASI INVESTASI
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#fff" }}>
                    {pkg.price}
                  </div>
                </div>

                <a
                  href="#contact"
                  className={pkg.popular ? "btn-primary" : "btn-outline"}
                  style={{
                    width:        "auto",
                    padding:      "8px 16px",
                    fontSize:     "0.8rem",
                    borderRadius: "30px",
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  Concept Only
                </a>
              </div>

            </div>
          );
        })}
      </div>

      {/* ── INCLUDED FEATURES BOX — Scroll Reveal ── */}
      <div
        ref={featRef}
        className="bento-card"
        style={{
          marginTop:  "28px",
          padding:    "24px",
          background: "rgba(255,255,255,0.02)",
          ...revealStyle(featRevealed, 0.1),
        }}
      >
        <h4 style={{
          fontSize:     "1.1rem",
          fontWeight:   "700",
          marginBottom: "16px",
          color:        "#fff",
        }}>
          ✨ Semua paket sudah termasuk:
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {(typeof includedFeatures !== "undefined" ? includedFeatures : []).map((feat, idx) => (
            <div
              key={idx}
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        "10px",
                fontSize:   "0.88rem",
                color:      "var(--text-muted)",
              }}
            >
              <span style={{ color: "var(--accent-lime)", fontWeight: "bold" }}>✓</span>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
