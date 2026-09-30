window.Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuLinks = [
    { label: "Home", href: "#" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Industries", href: "#industries" },
    { label: "Workflow", href: "#workflow" }
  ];

  return (
    <>
      <style>{`
        /* =========================================
           1. HEADER & LOGO
        ========================================= */
        .navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 24px;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          background: linear-gradient(
  to bottom, 
  rgba(10, 10, 10, 0.95) 0%, 
  rgba(10, 10, 10, 0.85) 45%, 
  rgba(10, 10, 10, 0.4) 75%, 
  rgba(10, 10, 10, 0) 100%
);


        }

        .logo-text {
          font-weight: 800;
          font-size: 1.25rem;
          color: #fff;
          letter-spacing: 1px;
          text-decoration: none;
          z-index: 1001; 
          position: relative;
        }
        .logo-text span {
          color: var(--accent-lime, #a3ff12);
        }

        /* =========================================
           2. HAMBURGER BUTTON
        ========================================= */
        .menu-toggle {
          background: var(--accent-lime, #a3ff12);
          border: 1px solid var(--accent-lime, #a3ff12);
          border-radius: 8px; 
          width: 50px;
          height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          z-index: 1001; 
          gap: 5px;
          transition: all 0.4s ease;
        }
        
        .menu-toggle.open {
          background: transparent;
        }

        .hamburger-line {
          width: 22px;
          height: 2px;
          background-color: #0a190f; 
          border-radius: 2px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center;
        }
        
        .menu-toggle.open .hamburger-line {
          background-color: var(--accent-lime, #a3ff12);
        }

        .menu-toggle.open .hamburger-line:nth-child(1) {
          transform: translateY(3.5px) rotate(45deg);
        }
        .menu-toggle.open .hamburger-line:nth-child(2) {
          transform: translateY(-3.5px) rotate(-45deg);
        }

        /* =========================================
           3. OVERLAY MENU 
        ========================================= */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #0b1410; 
          z-index: 999;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 24px;
          box-sizing: border-box;
          
          clip-path: circle(0px at calc(100% - 49px) 45px);
          transition: clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1);
        }

        .menu-overlay.open {
          clip-path: circle(150% at calc(100% - 49px) 45px);
        }

        /* =========================================
           4. CARD MENU LINKS
        ========================================= */
        .menu-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .menu-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: clamp(1.4rem, 5vw, 1.8rem); 
          font-weight: 500;
          color: #fff;
          text-decoration: none;
          padding: 16px 24px;
          
          /* (Glassmorphism) */
          background-color: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(12px);
          border-radius: 8px; 
          transform: translateY(30px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.6s ease, 
                      background-color 0.3s ease,
                      border-color 0.3s ease;
        }
        
        .menu-link:hover, .menu-link:active {
          color: var(--accent-lime, #a3ff12);
          background-color: rgba(255, 255, 255, 0.08);
          border-color: rgba(163, 255, 18, 0.3);
        }

        /* Ikon panah */
        .menu-link-arrow {
          font-size: 1.2rem;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }
        
        .menu-link:hover .menu-link-arrow, .menu-link:active .menu-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .menu-overlay.open .menu-link {
          transform: translateY(0);
          opacity: 1;
        }
        
        .menu-overlay.open .menu-link:nth-child(1) { transition-delay: 0.1s; }
        .menu-overlay.open .menu-link:nth-child(2) { transition-delay: 0.18s; }
        .menu-overlay.open .menu-link:nth-child(3) { transition-delay: 0.26s; }
        .menu-overlay.open .menu-link:nth-child(4) { transition-delay: 0.34s; }
        .menu-overlay.open .menu-link:nth-child(5) { transition-delay: 0.42s; }

        /* =========================================
           5. CONTACT
        ========================================= */
        .menu-footer {
          position: absolute;
          bottom: 40px;
          left: 0;
          width: 100%;
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-overlay.open .menu-footer {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.5s;
        }

        .contact-email {
          color: #fff;
          font-size: 1rem;
          text-decoration: none;
          border-bottom: 2px solid var(--accent-lime, #a3ff12);
          padding-bottom: 4px;
        }
      `}</style>

      <header className="navbar-header">
        <a href="#" className="logo-text" onClick={() => setIsOpen(false)}>
          NABYTE<span>.</span>CREATIVE
        </a>
        
        <button 
          className={`menu-toggle ${isOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
      </header>

      <nav className={`menu-overlay ${isOpen ? 'open' : ''}`}>
        <div className="menu-links">
          {menuLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href} 
              className="menu-link"
              onClick={() => setIsOpen(false)}
            >
              <span>{link.label}</span>
              <span className="menu-link-arrow">↗</span>
            </a>
          ))}
        </div>
        
        <div className="menu-footer">
          <a href="mailto:hello@nabyte.creative" className="contact-email">
            hello@nabyte.creative
          </a>
        </div>
      </nav>
    </>
  );
};

