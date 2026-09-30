// 1. Helper Hook Scroll Observer
const useRevealPrinciples = (elementRef, threshold) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, threshold]);

  return isVisible;
};

// 2. Sub-Komponen Point (Emoji Pop + Typewriter + Slide Up Desc)
const PrinciplesRevealPoint = ({
  index,
  title,
  description,
  isSectionVisible,
  onDescriptionVisible,
}) => {
  const [emojiVisible, setEmojiVisible] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [typedCharacters, setTypedCharacters] = React.useState(0);
  const [descriptionVisible, setDescriptionVisible] = React.useState(false);
  const hasReportedDescription = React.useRef(false);

  React.useEffect(() => {
    if (!isSectionVisible) return undefined;

    const emojiTimer = window.setTimeout(
      () => {
        setEmojiVisible(true);
      },
      index * 720 + 180,
    );

    return () => window.clearTimeout(emojiTimer);
  }, [index, isSectionVisible]);

  React.useEffect(() => {
    if (!emojiVisible) return undefined;

    const typingTimer = window.setTimeout(() => {
      setIsTyping(true);
    }, 320);

    return () => window.clearTimeout(typingTimer);
  }, [emojiVisible]);

  React.useEffect(() => {
    if (!isTyping || typedCharacters >= title.length) return undefined;

    const typingTimer = window.setTimeout(() => {
      setTypedCharacters((currentCharacters) => currentCharacters + 1);
    }, 38);

    return () => window.clearTimeout(typingTimer);
  }, [isTyping, title.length, typedCharacters]);

  React.useEffect(() => {
    if (!isTyping || typedCharacters < title.length) return undefined;

    const descriptionTimer = window.setTimeout(() => {
      setDescriptionVisible(true);
    }, 240);

    return () => window.clearTimeout(descriptionTimer);
  }, [isTyping, title.length, typedCharacters]);

  React.useEffect(() => {
    if (!descriptionVisible || hasReportedDescription.current) return;

    hasReportedDescription.current = true;
    onDescriptionVisible(index);
  }, [descriptionVisible, index, onDescriptionVisible]);

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          color: "#ff5f56",
          fontSize: "1.1rem",
          fontWeight: "bold",
          display: "inline-block",
          opacity: emojiVisible ? 1 : 0,
          transform: emojiVisible ? "scale(1)" : "scale(0.8)",
          transformOrigin: "center",
          transition:
            "opacity 560ms ease, transform 560ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "opacity, transform",
        }}
      >
        ❌
      </span>
      <div style={{ flex: 1 }}>
        <h4
          aria-label={title}
          style={{
            fontSize: "1.05rem",
            fontWeight: "700",
            color: "#fff",
            marginBottom: "4px",
            minHeight: "1.4em",
          }}
        >
          {isTyping ? title.slice(0, typedCharacters) : ""}
          <span
            aria-hidden="true"
            style={{
              display:
                isTyping && typedCharacters < title.length
                  ? "inline-block"
                  : "none",
              width: "1px",
              height: "1em",
              marginLeft: "3px",
              verticalAlign: "-0.12em",
              background: "var(--accent-lime)",
              opacity: 0.8,
            }}
          />
        </h4>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.88rem",
            lineHeight: "1.6",
            margin: 0,
            opacity: descriptionVisible ? 1 : 0,
            transform: descriptionVisible
              ? "translateY(0)"
              : "translateY(14px)",
            transition:
              "opacity 620ms ease, transform 620ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "opacity, transform",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

// 3. Komponen Utama Principles (Terdaftar langsung di window)
window.Principles = () => {
  const sectionRef = React.useRef(null);
  const quoteRef = React.useRef(null);
  const isSectionVisible = useRevealPrinciples(sectionRef, 0.2);
  const isQuoteInView = useRevealPrinciples(quoteRef, 0.15);
  const [completedPoints, setCompletedPoints] = React.useState([]);

  const handleDescriptionVisible = React.useCallback((index) => {
    setCompletedPoints((currentPoints) =>
      currentPoints.includes(index)
        ? currentPoints
        : [...currentPoints, index],
    );
  }, []);

  const quoteVisible =
    isSectionVisible && isQuoteInView && completedPoints.length === 3;

  const points = [
    {
      title: "Bukan Asal Pasang Template Murahan",
      description:
        "Setiap baris kode dan komponen visual dirancang khusus sesuai karakter & pesan unik brand milikmu.",
    },
    {
      title: "Tanpa Istilah Teknis yang Bikin Pusing",
      description:
        "Komunikasi kita santai dan to the point. Kamu cukup fokus ke ide bisnis, teknis rumitnya kami yang selesaikan.",
    },
    {
      title: "Nggak Pake Drama Molor",
      description:
        "Eksekusi memiliki timeline yang terukur. Target launching disepakati bersama dan ditepati sejak awal.",
    },
  ];

  return (
    <section
      id="principles"
      ref={sectionRef}
      style={{ paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div
        style={{
          textAlign: "left",
          marginBottom: "28px",
          opacity: isSectionVisible ? 1 : 0,
          transform: isSectionVisible ? "translateY(0)" : "translateY(24px)",
          transition:
            "opacity 720ms ease, transform 720ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "opacity, transform",
        }}
      >
        <span className="badge-pill">STANDAR NABYTE</span>
        <h2
          className="section-title"
          style={{ marginTop: "12px", fontSize: "1.8rem" }}
        >
          Batas Yang <span className="serif-italic">Tidak Kami Lewati</span>.
        </h2>
        <p className="subtext" style={{ marginBottom: "0" }}>
          Komitmen kami untuk menjaga kualitas dan hasil akhir websitemu tetap
          di standar tertinggi.
        </p>
      </div>

      <div
        className="bento-card"
        style={{
          padding: "24px",
          borderLeft: "4px solid var(--accent-lime)",
          background: "rgba(18, 26, 20, 0.85)",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {points.map((point, index) => (
            <PrinciplesRevealPoint
              key={point.title}
              index={index}
              title={point.title}
              description={point.description}
              isSectionVisible={isSectionVisible}
              onDescriptionVisible={handleDescriptionVisible}
            />
          ))}
        </div>

        <div
          ref={quoteRef}
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "0.9rem",
            color: "var(--accent-lime)",
            fontWeight: "600",
            lineHeight: "1.6",
            fontStyle: "italic",
            opacity: quoteVisible ? 1 : 0,
            transform: quoteVisible ? "translateY(0)" : "translateY(18px)",
            transition:
              "opacity 700ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "opacity, transform",
          }}
        >
          "Kami pastikan websitemu beroperasi secara mulus dan siap menerima
          calon pelanggan sebelum kampanye manapun kamu mulai."
        </div>
      </div>
    </section>
  );
};
