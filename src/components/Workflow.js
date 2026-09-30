window.Workflow = () => {
  const { useState, useEffect, useRef } = React;

  // ── Scroll Reveal Hook (TETAP SAMA) ────────────────────────────
  const useScrollReveal = (options = {}) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
        { threshold: 0.15, ...options }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return [ref, visible];
  };


  const useItemReveal = (count) => {
    const refs = useRef([]);
    const [visibles, setVisibles] = useState(Array(count).fill(false));
    useEffect(() => {
      refs.current.forEach((el, i) => {
        if (!el) return;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibles(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
              observer.disconnect();
            }
          },
          { threshold: 0.2 }
        );
        observer.observe(el);
      });
      return () => {};
    }, []);
    return [refs, visibles];
  };

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.2 });
  const [cardRefs, cardVisibles] = useItemReveal(workflowData.length);

  // ── CSS keyframes injected once  ───────────────────
  useEffect(() => {
    const id = 'workflow-anim-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes wf-slideUp {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes wf-slideInRight {
        from { opacity: 0; transform: translateX(40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes wf-slideInLeft {
        from { opacity: 0; transform: translateX(-40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);


  const headerItemStyle = (delay) => ({
    opacity: 0,
    ...(headerVisible && {
      animation: `wf-slideUp 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s both`,
    }),
  });

  const cardStyle = (index, visible) => {
    const isFromRight = index % 2 === 0; // 0,2 → right; 1,3 → left
    const animName = isFromRight ? 'wf-slideInRight' : 'wf-slideInLeft';
    return {
      opacity: 0,
      ...(visible && {
        animation: `${animName} 0.8s cubic-bezier(0.16,1,0.3,1) both`,
      }),
    };
  };

  return (
    /* Wrapper (Full Bleed Edge-to-Edge) */
    <div 
      style={{ 
        width: '100vw', 
        position: 'relative', 
        left: '50%', 
        right: '50%', 
        marginLeft: '-50vw', 
        marginRight: '-50vw',
        marginTops: '40px',
        marginBottom: '40px',
        overflowX: 'hidden',
        backgroundColor: '#e2f8b9'
      }}
    >
      <section 
        id="workflow" 
        style={{ 
          maxWidth: '500px',
          margin: '0 auto',
          paddingTop: '56px', 
          paddingBottom: '56px',
          paddingLeft: '24px',
          paddingRight: '24px',
          color: '#0D140C'
        }}
      >

        {/* ── Header ── */}
        <div ref={headerRef} style={{ textAlign: 'left', marginBottom: '32px' }}>
          <span 
            className="badge-pill" 
            style={{ 
              backgroundColor: '#0D140C', 
              color: '#A3FF12', 
              borderColor: 'transparent',
              fontWeight: '700',
              ...headerItemStyle(0) 
            }}
          >
            ALUR KERJA
          </span>
                    <h2
            className="section-title"
            style={{ 
              marginTop: '16px', 
              fontSize: '1.8rem', 
              color: '#0D140C',
              lineHeight: '1.3',
              ...headerItemStyle(0.12) 
            }}
          >
            Dari Konsep Menjadi Karya, <br />
            <span 
              className="serif-italic" 
              style={{ 
                fontStyle: 'italic', 
                fontWeight: '600', 
                color: '#1B4332'
              }}
            >
              Cepat & Terstruktur.
            </span>
          </h2>
          <p 
            className="subtext" 
            style={{ 
              marginBottom: '0', 
              color: '#2A3A22', 
              fontSize: '0.92rem',
              lineHeight: '1.6',
              ...headerItemStyle(0.24) 
            }}
          >
            Proses kolaborasi yang dirancang efisien tanpa membebani aspek teknis. Fokus penuh pada hasil nyata untuk bisnismu.
          </p>
        </div>

        {/* ── Step Timeline (Card Box) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {workflowData.map((item, index) => (
            <div
              key={item.step}
              ref={el => cardRefs.current[index] = el}
              style={{
                marginBottom: '0',
                padding: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                backgroundColor: '#f5fde8', 
                borderRadius: '16px',
                border: '1px solid rgba(27, 67, 50, 0.12)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
                ...cardStyle(index, cardVisibles[index]),
              }}
            >
              {/* Step Badge Number */}
              <div style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: '#A3FF12',
                background: '#0D140C',
                padding: '6px 12px',
                borderRadius: '8px',
                flexShrink: 0,
              }}>
                {item.step}
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px', color: '#0D140C' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#405038', fontSize: '0.88rem', lineHeight: '1.6', margin: '0' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
};
