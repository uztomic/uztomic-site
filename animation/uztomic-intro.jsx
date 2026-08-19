const { useComposition, animate, interpolate, Easing, CompositionStage } = window;

const W = 1920, H = 1080;
const CX = 960;
const ORB = { cx: CX, cy: 400, rx: 305, ry: 108, rot: -18 };

const MOTION = {
  draw: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeInOutCubic }),
  enter: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutExpo }),
  pop: (from, to, start, end) => animate({ from, to, start, end, ease: Easing.easeOutBack }),
};

const U_PATH = 'M 830 240 V 415 C 830 497 888 542 960 542 C 1032 542 1090 497 1090 415 V 400';
const LETTERS = ['U', 'Z', 'T', 'O', 'M', 'I', 'C'];

function orbitPoint(angle) {
  const c = Math.cos((ORB.rot * Math.PI) / 180), s = Math.sin((ORB.rot * Math.PI) / 180);
  return {
    x: ORB.cx + ORB.rx * Math.cos(angle) * c - ORB.ry * Math.sin(angle) * s,
    y: ORB.cy + ORB.rx * Math.cos(angle) * s + ORB.ry * Math.sin(angle) * c,
  };
}

function Piece(props) {
  const { T, CUES, authoredTotal } = useComposition();
  const accent = props.accentColor || '#5b7cfa';
  const cta = props.ctaLabel || 'Websitega kirish';
  const build = CUES.Qurilish, orbit = CUES.Orbita, name = CUES.Nom, enter = CUES.Kirish;

  // background bloom + closing fade (loop seam: dark at 0 and at the end)
  const bgIn = MOTION.enter(0, 1, 0.15, 1.7)(T);
  const bgOut = interpolate([authoredTotal - 0.6, authoredTotal - 0.05], [1, 0], Easing.easeInQuad)(T);
  const bg = Math.min(bgIn, bgOut);
  const breathe = 1 + 0.02 * Math.sin(T * 0.55);

  // spark that seeds the mark
  const sparkO = interpolate([0.1, 0.55, build - 0.1, build + 0.25], [0, 1, 1, 0], Easing.linear)(T);
  const sparkW = MOTION.enter(6, 300, 0.2, build)(T);

  // U stroke drawing
  const uDraw = MOTION.draw(0, 1, build - 0.05, build + 1.7)(T);
  const uGlow = interpolate([build + 1.4, build + 1.9, build + 2.6], [0, 1, 0.25], Easing.linear)(T);

  // the vertical plate drops in, then a laser slit cuts it in two
  const plateY = MOTION.pop(-340, 0, build + 1.35, build + 2.4)(T);
  const plateO = interpolate([build + 1.3, build + 1.6], [0, 1], Easing.linear)(T);
  const slitK = MOTION.pop(0, 1, build + 2.35, build + 2.95)(T);

  // orbit
  const ringDraw = MOTION.draw(0, 1, orbit, orbit + 1.5)(T);
  const spin = (T - orbit) * 0.42;
  const dotA = orbitPoint(0.35 + spin), dotB = orbitPoint(0.35 + Math.PI + spin);
  const dotO = interpolate([orbit + 0.5, orbit + 1.1], [0, 1], Easing.linear)(T);

  // wordmark
  const gap = MOTION.enter(78, 22, name, name + 1.5)(T);
  const tagO = interpolate([name + 1.5, name + 2.2], [0, 1], Easing.easeOutCubic)(T);
  const tagSpace = MOTION.enter(0.95, 0.42, name + 1.5, name + 2.4)(T);

  // final lockup move + CTA
  const lockScale = MOTION.draw(1, 0.84, enter, enter + 1.2)(T) * (T < enter ? 1 : 1);
  const lockY = MOTION.draw(0, -74, enter, enter + 1.2)(T);
  const ctaO = interpolate([enter + 0.9, enter + 1.6], [0, 1], Easing.easeOutCubic)(T) * bgOut;
  const ctaY = MOTION.pop(52, 0, enter + 0.9, enter + 1.8)(T);
  const pulse = 0.5 + 0.5 * Math.sin((T - enter) * 2.1);

  // slow camera push through the whole piece
  const camScale = interpolate([0, authoredTotal], [1.05, 1.0], Easing.easeOutSine)(T);

  const mono = "'Space Grotesk', Helvetica, Arial, sans-serif";

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#05070a' }}>
      <div style={{
        position: 'absolute', inset: '-6%',
        transform: `scale(${breathe})`, opacity: bg,
        background:
          'radial-gradient(60% 90% at 12% 40%, #4a2fa6 0%, rgba(74,47,166,0) 65%),' +
          'radial-gradient(58% 85% at 90% 58%, #0e7f8c 0%, rgba(14,127,140,0) 64%),' +
          'radial-gradient(80% 120% at 50% 50%, rgba(10,14,28,0) 30%, #05070a 96%)',
      }} />

      <div style={{ position: 'absolute', inset: 0, transform: `scale(${camScale})`, transformOrigin: '50% 45%' }}>
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${lockY}px) scale(${lockScale})`, transformOrigin: '50% 42%' }}>
          <svg viewBox="0 0 1920 1080" width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <defs>
              <mask id="uztomic-slit" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
                <rect x="0" y="0" width="1920" height="1080" fill="#ffffff" />
                <polygon points="1030,375 1140,332 1140,306 1030,349" fill="#000000"
                  transform={`translate(1085 341) scale(1 ${slitK}) translate(-1085 -341)`} />
              </mask>
            </defs>
            <g opacity={bgOut} mask="url(#uztomic-slit)">
              <path d={U_PATH} pathLength="1" fill="none" stroke="#ffffff" strokeWidth="62"
                strokeLinecap="butt" strokeDasharray="1" strokeDashoffset={1 - uDraw}
                style={{ filter: `drop-shadow(0 0 ${16 + 26 * uGlow}px rgba(150,190,255,${0.25 + 0.45 * uGlow}))` }} />
              <polygon points="1059,430 1121,430 1121,216 1059,240"
                fill="#ffffff" opacity={plateO} transform={`translate(0 ${plateY})`} />

            </g>
            <g opacity={bgOut}>
              <ellipse cx={ORB.cx} cy={ORB.cy} rx={ORB.rx} ry={ORB.ry}
                transform={`rotate(${ORB.rot} ${ORB.cx} ${ORB.cy})`}
                pathLength="1" fill="none" stroke="#ffffff" strokeWidth="7"
                strokeDasharray="1" strokeDashoffset={1 - ringDraw} opacity="0.95" />
              <circle cx={dotA.x} cy={dotA.y} r="17" fill="#ffffff" opacity={dotO} />
              <circle cx={dotB.x} cy={dotB.y} r="17" fill="#ffffff" opacity={dotO} />

            </g>
          </svg>

          <div style={{
            position: 'absolute', left: 0, right: 0, top: 660,
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
            gap: `${gap}px`, opacity: bgOut,
          }}>
            {LETTERS.map((ch, i) => {
              const t0 = name + i * 0.09;
              const o = interpolate([t0, t0 + 0.5], [0, 1], Easing.easeOutCubic)(T);
              const y = MOTION.pop(58, 0, t0, t0 + 0.85)(T);
              return (
                <span key={ch + i} style={{
                  fontFamily: "'Michroma', 'Space Grotesk', Helvetica, sans-serif",
                  fontSize: 116, lineHeight: 1, color: '#ffffff',
                  opacity: o, transform: `translateY(${y}px)`,
                  textShadow: '0 0 40px rgba(140,180,255,0.28)',
                }}>{ch}</span>
              );
            })}
          </div>

          <div style={{
            position: 'absolute', left: 0, right: 0, top: 826, textAlign: 'center',
            fontFamily: mono, fontSize: 30, fontWeight: 400,
            letterSpacing: `${tagSpace}em`, textIndent: `${tagSpace}em`,
            color: 'rgba(255,255,255,0.86)', opacity: tagO * bgOut,
          }}>SMART SOFTWARE SOLUTIONS</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: CX - sparkW / 2, top: 398,
        width: sparkW, height: 3, borderRadius: 2, opacity: sparkO,
        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, #ffffff 50%, rgba(255,255,255,0) 100%)',
        filter: 'blur(0.6px) drop-shadow(0 0 22px rgba(160,200,255,0.85))',
      }} />

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 96,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
        opacity: ctaO, transform: `translateY(${ctaY}px)`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 18,
          padding: '20px 48px', borderRadius: 999,
          border: `1.5px solid ${accent}`, background: 'rgba(8,12,24,0.5)',
          boxShadow: `0 0 ${26 + 28 * pulse}px rgba(120,160,255,${0.2 + 0.2 * pulse})`,
          color: '#f4f7ff', fontFamily: mono, fontSize: 32, fontWeight: 500,
          letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>
          <span>{cta}</span>
          <span style={{ color: accent, fontSize: 30 }}>→</span>
        </div>
        <div style={{
          fontFamily: mono, fontSize: 24, letterSpacing: '0.2em',
          color: 'rgba(232,238,255,0.72)',
        }}>uztomic.uz · Qo’qon, Uzbekistan</div>
      </div>
    </div>
  );
}

function IntroStage(props) {
  return (
    <CompositionStage width={W} height={H} bg="#05070a"
      scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
      <Piece accentColor={props.accentColor} ctaLabel={props.ctaLabel} />
    </CompositionStage>
  );
}

window.IntroStage = IntroStage;
