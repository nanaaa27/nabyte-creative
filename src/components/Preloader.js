/**
 * Nabyte editorial preloader.
 *
 * Komponen ini menggunakan global React object agar dapat digunakan
 * pada setup browser seperti implementasi sebelumnya:
 *
 * window.Preloader = ({ onComplete }) => ...
 *
 * onComplete akan dipanggil setelah overlay selesai menghilang.
 */

window.Preloader = function Preloader({
  onComplete,
  duration = 1900,
  pause = 280,
  exitDuration = 820,
}) {
  const [progress, setProgress] = React.useState(0);
  const [isExiting, setIsExiting] = React.useState(false);

  const completeRef = React.useRef(onComplete);

  const instanceId = React.useRef(
    `nabyte-preloader-${Math.random().toString(36).slice(2, 10)}`,
  );

  React.useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  React.useEffect(() => {
    let frameId;
    let pauseId;
    let exitId;
    let startTime;

    // Ease-out halus untuk menghindari gerakan progress yang terasa mekanis.
    const easeOut = (value) => 1 - Math.pow(1 - value, 5);

    const animate = (time) => {
      if (!startTime) {
        startTime = time;
      }

      const elapsed = time - startTime;
      const fraction = Math.min(elapsed / duration, 1);

      setProgress(Math.round(easeOut(fraction) * 100));

      if (fraction < 1) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      // Jeda kecil setelah progress mencapai 100%.
      pauseId = window.setTimeout(() => {
        setIsExiting(true);

        // Tunggu exit transition selesai sebelum menampilkan halaman utama.
        exitId = window.setTimeout(() => {
          if (completeRef.current) {
            completeRef.current();
          }
        }, exitDuration);
      }, pause);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(pauseId);
      window.clearTimeout(exitId);
    };
  }, [duration, exitDuration, pause]);

  const safeProgress = Math.max(0, Math.min(progress, 100));

  // Tinggi area mask berdasarkan progress.
  const fillHeight = 128 * (safeProgress / 100);

  const maskId = `${instanceId.current}-fill-mask`;
  const titleId = `${instanceId.current}-title`;

  return (
    <div
      className={`nabyte-preloader${
        isExiting ? " nabyte-preloader--exit" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${safeProgress}%`}
    >
      <style>{`
        .nabyte-preloader {
          --nabyte-background: var(--color-background, #0a0d0b);
          --nabyte-ink: var(--color-foreground, #f2f1eb);
          --nabyte-accent: var(--accent-lime, #a7b891);

          position: fixed;
          inset: 0;
          z-index: 99999;

          display: grid;
          place-items: center;

          overflow: hidden;
          background: var(--nabyte-background);
          color: var(--nabyte-ink);

          opacity: 1;
          pointer-events: auto;

          transition:
            opacity ${exitDuration}ms cubic-bezier(0.76, 0, 0.24, 1),
            visibility 0s linear 0s;
        }

        .nabyte-preloader--exit {
          visibility: hidden;
          opacity: 0;
          pointer-events: none;

          transition:
            opacity ${exitDuration}ms cubic-bezier(0.76, 0, 0.24, 1),
            visibility 0s linear ${exitDuration}ms;
        }

        .nabyte-preloader__content {
          display: flex;
          flex-direction: column;
          align-items: center;

          width: min(88vw, 720px);

          transform: translateY(0);

          transition:
            transform ${exitDuration}ms cubic-bezier(0.76, 0, 0.24, 1);
        }

        .nabyte-preloader--exit .nabyte-preloader__content {
          transform: translateY(-18px);
        }

        .nabyte-preloader__mark {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .nabyte-preloader__wordmark {
          font-family: var(--font-sans, "Arial", sans-serif);
          font-size: 112px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .nabyte-preloader__base {
          fill: var(--nabyte-ink);
          opacity: 0.19;
        }

        .nabyte-preloader__fill {
          fill: var(--nabyte-accent);
        }

        .nabyte-preloader__progress {
          margin-top: 17px;

          color: var(--nabyte-ink);

          font-family:
            var(
              --font-mono,
              "SFMono-Regular",
              Consolas,
              "Liberation Mono",
              monospace
            );

          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          line-height: 1;
          opacity: 0.56;

          font-variant-numeric: tabular-nums;
        }

        @media (max-width: 600px) {
          .nabyte-preloader__content {
            width: min(88vw, 440px);
          }

          .nabyte-preloader__wordmark {
            font-size: 112px;
          }

          .nabyte-preloader__progress {
            margin-top: 14px;
            font-size: 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nabyte-preloader,
          .nabyte-preloader__content {
            transition-duration: 1ms;
          }
        }
      `}</style>

      <div className="nabyte-preloader__content">
        <svg
          className="nabyte-preloader__mark"
          viewBox="0 0 720 160"
          preserveAspectRatio="xMidYMid meet"
          aria-labelledby={titleId}
        >
          <title id={titleId}>Nabyte</title>

          <defs>
            <mask
              id={maskId}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="720"
              height="160"
            >
              {/* Rectangular mask menjaga garis fill tetap horizontal sempurna */}
              <rect
                x="0"
                y={160 - fillHeight}
                width="720"
                height={fillHeight}
                fill="white"
              />
            </mask>
          </defs>

          {/* Teks dasar yang subtle */}
          <text
            x="360"
            y="95"
            textAnchor="middle"
            dominantBaseline="middle"
            className="nabyte-preloader__wordmark nabyte-preloader__base"
          >
            NABYTE.
          </text>

          {/* Teks aksen yang diisi dari bawah ke atas */}
          <text
            x="360"
            y="95"
            textAnchor="middle"
            dominantBaseline="middle"
            className="nabyte-preloader__wordmark nabyte-preloader__fill"
            mask={`url(#${maskId})`}
          >
            NABYTE.
          </text>
        </svg>

        <span className="nabyte-preloader__progress">
          {safeProgress}%
        </span>
      </div>
    </div>
  );
};