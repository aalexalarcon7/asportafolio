export function Loader() {
  return (
    <div className="loader" id="loader" role="status" aria-live="polite" aria-label="Introducción de AS Design Studio">
      <div className="loader-glow" id="loader-glow" />
      <div className="loader-top micro">
        <span>AS® / DESIGN STUDIO<br /><span className="muted">FROM A SPARK TO AN EXPERIENCE</span></span>
        <button id="skip" className="skip micro" type="button">SKIP INTRO ↗</button>
      </div>
      <div className="loader-stage" id="loader-card">
        <div className="card-back" />
        <div className="card-letters">
          <img className="card-monogram" id="typo-monogram" src="/brand/loader-as-canva.png" alt="as" draggable={false}/>
          <img className="card-name" id="typo-name" src="/brand/loader-design-studio-canva.png" alt="design studio" draggable={false}/>
          <img className="card-country" id="typo-country" src="/brand/loader-hecho-canva.png" alt="HECHO EN ARGENTINA" draggable={false}/>
        </div>
      </div>
      <img className="card-face" id="card-face" src="/brand/loader-card-canva.png" alt="Tarjeta de memoria original de AS Design Studio" draggable={false}/>
      <div className="flight symbol" id="flight" aria-hidden="true">
        <span className="glow"/>
        <span className="trail"/>
        <svg viewBox="0 0 303 99"><use href="#as-star"/></svg>
      </div>
      <div className="loader-meter" id="loader-meter">
        <div className="meter-labels micro"><span id="loading-label">REVELANDO IDENTIDAD</span><span id="loading-progress">01 / 03</span></div>
        <div className="meter"><span id="meter-fill"/></div>
      </div>
      <div className="loader-note micro">AS DESIGN STUDIO / ARGENTINA<br/>PORTFOLIO / 2026</div>
    </div>
  );
}
