window.Portfolio = () => {

  // ============================================================
  // SCROLL REVEAL — Intersection Observer hook
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

  // Header refs
  const [badgeRef,   badgeRevealed]   = useScrollReveal(0.2);
  const [titleRef,   titleRevealed]   = useScrollReveal(0.2);
  const [subtextRef, subtextRevealed] = useScrollReveal(0.2);

  // Card refs
  const cardCount = (typeof portfolioData !== "undefined") ? portfolioData.length : 6;
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
  // TILT HOVER — track posisi mouse/touch di dalam card
  // Setiap card punya state tilt { x, y } dan isHovered
  // ============================================================
  const [tilts, setTilts] = React.useState(
    Array.from({ length: cardCount }, () => ({ x: 0, y: 0, hovered: false }))
  );

  const handleMouseMove = (e, index) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    // Posisi kursor relatif terhadap pusat card (range -1 … 1)
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

  // Touch support
  const handleTouchMove = (e, index) => {
    const touch = e.touches[0];
    const card  = e.currentTarget;
    const rect  = card.getBoundingClientRect();
    const cx    = ((touch.clientX - rect.left) / rect.width  - 0.5) * 2;
    const cy    = ((touch.clientY - rect.top)  / rect.height - 0.5) * 2;
    setTilts(prev => prev.map((t, i) =>
      i === index ? { x: cx, y: cy, hovered: true } : t
    ));
  };

  const handleTouchEnd = (index) => {
    // Kembalikan ke posisi netral perlahan
    setTimeout(() => {
      setTilts(prev => prev.map((t, i) =>
        i === index ? { x: 0, y: 0, hovered: false } : t
      ));
    }, 300);
  };

  // Hitung inline transform per card berdasarkan tilt state
  const cardTransform = (tilt, revealed, delay, cardIndex) => {
    const MAX_ROTATE = 8;   // derajat rotasi maksimal mengikuti kursor
    const LIFT       = tilt.hovered ? -18 : 0; // px mengambang saat hover

    // Arah base tilt saat hover tanpa gerakan kursor:
    // card ganjil → miring kiri (-2deg), genap → miring kanan (+2deg)
    const baseTilt  = cardIndex % 2 === 0 ? -2 : 2;

    const rotateY   = tilt.hovered ? tilt.x * MAX_ROTATE : 0;
    const rotateX   = tilt.hovered ? -tilt.y * (MAX_ROTATE * 0.6) : 0;
    const rotateFix = tilt.hovered ? baseTilt : 0;

    // Gabungkan dengan reveal transform
    const revealedY = revealed ? 0 : 24;
    const revealedO = revealed ? 1 : 0;

    return {
      opacity:    revealedO,
      transform:  `
        perspective(900px)
        translateY(${revealedY + LIFT}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY + rotateFix}deg)
        scale(${tilt.hovered ? 1.025 : 1})
      `,
      transition: tilt.hovered
        // Saat hover: response cepat mengikuti kursor
        ? `transform 0.12s ease, box-shadow 0.35s ease, border-color 0.35s ease`
        // Saat lepas: kembali elastis
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
    <section id="portfolio" style={{ paddingTop: "40px", paddingBottom: "40px" }}>

      <style>{`

        /* Wrapper dengan perspective agar 3D tilt terlihat di semua anak */
        .card-perspective-wrap {
          perspective: 900px;
        }

        /* Base card */
        .portfolio-card {
          position:         relative;
          cursor:           pointer;
          border:           1px solid rgba(163, 255, 18, 0.12);
          transform-origin: center center;
          transform-style:  preserve-3d;
        }

        /* Glow border saat hover (diatur via inline style, ini fallback) */
        .portfolio-card.is-hovered {
          border-color: rgba(163, 255, 18, 0.45);
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.55),
            0  8px 24px rgba(0, 0, 0, 0.35),
            0  0  32px rgba(163, 255, 18, 0.10),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        /* Shadow default (idle) */
        .portfolio-card.is-idle {
          box-shadow:
            0  6px 20px rgba(0, 0, 0, 0.30),
            0  2px  6px rgba(0, 0, 0, 0.20);
        }

        /* Active/press — kesan ditekan */
        .portfolio-card:active {
          transform: perspective(900px) translateY(-4px) rotateX(2deg) scale(0.99) !important;
          transition: transform 0.1s ease !important;
          box-shadow:
            0 10px 28px rgba(0, 0, 0, 0.5),
            0  0  18px rgba(163, 255, 18, 0.15) !important;
        }

        /* Shine overlay — muncul saat hover */
        .portfolio-card::before {
          content:        "";
          position:       absolute;
          inset:          0;
          border-radius:  inherit;
          background:     linear-gradient(
                            135deg,
                            rgba(255, 255, 255, 0.07) 0%,
                            transparent 50%,
                            rgba(163, 255, 18, 0.03) 100%
                          );
          opacity:        0;
          transition:     opacity 0.35s ease;
          pointer-events: none;
          z-index:        1;
        }
        .portfolio-card.is-hovered::before { opacity: 1; }

        /* Pastikan konten card di atas shine */
        .portfolio-card > *:not(style) { position: relative; z-index: 2; }

        /* Image wrapper — clip + zoom */
        .portfolio-card .card-img-wrap {
          overflow:      hidden;
          border-radius: 12px;
          border:        1px solid rgba(255, 255, 255, 0.08);
          transition:    border-color 0.35s ease;
        }
        .portfolio-card.is-hovered .card-img-wrap {
          border-color: rgba(163, 255, 18, 0.2);
        }

        .portfolio-card .card-img-wrap img {
          width:      100%;
          height:     100%;
          object-fit: cover;
          display:    block;
          transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
        }
        .portfolio-card.is-hovered .card-img-wrap img {
          transform: scale(1.07);
        }

        /* Touch device: sederhanakan ke translateY + tilt tetap */
        @media (hover: none) {
          .portfolio-card:active {
            transform: perspective(900px) translateY(-10px) rotate(-2deg) scale(1.015) !important;
            border-color: rgba(163, 255, 18, 0.5) !important;
            box-shadow:
              0 20px 48px rgba(0, 0, 0, 0.5),
              0  0  28px rgba(163, 255, 18, 0.15) !important;
            transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1) !important;
          }
        }

      `}</style>

      {/* ── HEADER SECTION ── */}
      <div style={{ textAlign: "left", marginBottom: "32px" }}>
        <div ref={badgeRef} style={{ display: "inline-block", ...revealStyle(badgeRevealed, 0) }}>
          <span className="badge-pill">SELECTED WORKS</span>
        </div>
        <h2
          ref={titleRef}
          className="section-title"
          style={{ marginTop: "12px", fontSize: "1.8rem", ...revealStyle(titleRevealed, 0.12) }}
        >
          Karya yang <span className="serif-italic">Bicara</span>.
        </h2>
        <p
          ref={subtextRef}
          className="subtext"
          style={{ marginBottom: "0", ...revealStyle(subtextRevealed, 0.22) }}
        >
          Bukti nyata hasil kolaborasi Nabyte bersama brand yang berani tampil beda.
        </p>
      </div>

      {/* ── CARDS ── */}
      {portfolioData.map((item, index) => {
        const { ref, revealed } = cardRefs[index] || {};
        const tilt      = tilts[index] || { x: 0, y: 0, hovered: false };
        const cardDelay = index * 0.12;
        const tiltStyle = cardTransform(tilt, revealed, cardDelay, index);

        return (
          <div
            key={item.id}
            ref={ref}
            className={`bento-card portfolio-card ${tilt.hovered ? "is-hovered" : "is-idle"}`}
            style={{ marginBottom: "28px", padding: "20px", ...tiltStyle }}
            onMouseMove={e  => handleMouseMove(e, index)}
            onMouseLeave={  () => handleMouseLeave(index)}
            onTouchMove={e  => handleTouchMove(e, index)}
            onTouchEnd={    () => handleTouchEnd(index)}
          >
            {/* Kategori */}
            <div style={{
              fontSize: "0.8rem", fontWeight: "700",
              color: "var(--accent-lime)", marginBottom: "6px", letterSpacing: "1px",
            }}>
              {item.id} — {item.category}
            </div>

            {/* Judul */}
            <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "8px" }}>
              {item.title}
            </h3>

            {/* Deskripsi */}
            <p style={{
              color: "var(--text-muted)", fontSize: "0.88rem",
              lineHeight: "1.6", marginBottom: "16px",
            }}>
              {item.desc}
            </p>

            {/* Image */}
            <div className="card-img-wrap" style={{ width: "100%", height: "200px", marginBottom: "16px" }}>
              <img src={item.image} alt={item.title} />
            </div>

            {/* CTA */}
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
              style={{ padding: "10px 18px", fontSize: "0.85rem", width: "auto", display: "inline-block" }}
              onClick={e => e.stopPropagation()}
            >
              Concept Only 
            </a>
          </div>
        );
      })}

    </section>
  );
};
