import type { ReactNode } from 'react';

// ─── PageBackground ────────────────────────────────────────────────────────────
// Fixed full-viewport SVG network illustration.
// Represents webhook traffic flowing Left (providers) → Center (gateway) → Right (destinations).
// Uses SVG SMIL for packet animations — no client JS, works as a Server Component.
//
// Opacity budget (dark on dark, barely perceptible):
//   dot grid:  0.04   edges: 0.055   nodes: 0.08
//   hub glow:  0.06   packets: 0.55–0.70
//
// Center-stage lighting: two approved radial gradient glows
//   1. Hero spotlight  — top-center, lavender at 5% opacity
//   2. Gateway bloom   — viewport center, lavender at 4% opacity

// ── Network topology ──────────────────────────────────────────────────────────
// Coordinate space: 1440 × 900 (standard HD, covers most viewports)

const GX = 720; // Gateway X
const GY = 450; // Gateway Y

// Left provider nodes
const L = [
  { x: 80,  y: 120 },
  { x: 80,  y: 280 },
  { x: 80,  y: 450 },
  { x: 80,  y: 620 },
  { x: 80,  y: 780 },
];

// Left relay nodes
const LR = [
  { x: 340, y: 180 },
  { x: 340, y: 380 },
  { x: 340, y: 580 },
  { x: 340, y: 760 },
];

// Right relay nodes
const RR = [
  { x: 1100, y: 180 },
  { x: 1100, y: 380 },
  { x: 1100, y: 580 },
  { x: 1100, y: 760 },
];

// Right destination nodes
const R = [
  { x: 1360, y: 120 },
  { x: 1360, y: 280 },
  { x: 1360, y: 450 },
  { x: 1360, y: 620 },
  { x: 1360, y: 780 },
];

// Build a bezier path between two points (horizontal cubic)
function bz(x1: number, y1: number, x2: number, y2: number): string {
  const cx1 = x1 + (x2 - x1) * 0.45;
  const cx2 = x2 - (x2 - x1) * 0.45;
  return `M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`;
}

// All connection paths [id, path, animDur, begin1, begin2, animated?]
type Conn = { id: string; d: string; dur: string; b1: string; b2: string; anim: boolean };

const CONNECTIONS: Conn[] = [
  // Providers → Left relay
  { id: 'l0r0', d: bz(L[0].x,L[0].y, LR[0].x,LR[0].y), dur:'3.8s', b1:'0s',   b2:'1.9s',  anim:true  },
  { id: 'l1r0', d: bz(L[1].x,L[1].y, LR[0].x,LR[0].y), dur:'4.2s', b1:'0.6s', b2:'2.7s',  anim:true  },
  { id: 'l1r1', d: bz(L[1].x,L[1].y, LR[1].x,LR[1].y), dur:'3.5s', b1:'1.1s', b2:'2.85s', anim:false },
  { id: 'l2r1', d: bz(L[2].x,L[2].y, LR[1].x,LR[1].y), dur:'4.0s', b1:'1.7s', b2:'3.7s',  anim:true  },
  { id: 'l3r2', d: bz(L[3].x,L[3].y, LR[2].x,LR[2].y), dur:'3.6s', b1:'2.2s', b2:'4.0s',  anim:true  },
  { id: 'l4r2', d: bz(L[4].x,L[4].y, LR[2].x,LR[2].y), dur:'4.5s', b1:'2.8s', b2:'5.05s', anim:false },
  { id: 'l4r3', d: bz(L[4].x,L[4].y, LR[3].x,LR[3].y), dur:'3.3s', b1:'3.4s', b2:'5.05s', anim:true  },
  // Left relay → Gateway
  { id: 'lr0g', d: bz(LR[0].x,LR[0].y, GX,GY), dur:'3.2s', b1:'0.4s', b2:'2.0s',  anim:true  },
  { id: 'lr1g', d: bz(LR[1].x,LR[1].y, GX,GY), dur:'3.9s', b1:'1.0s', b2:'3.05s', anim:true  },
  { id: 'lr2g', d: bz(LR[2].x,LR[2].y, GX,GY), dur:'3.4s', b1:'1.5s', b2:'3.2s',  anim:true  },
  { id: 'lr3g', d: bz(LR[3].x,LR[3].y, GX,GY), dur:'4.1s', b1:'2.0s', b2:'4.05s', anim:false },
  // Gateway → Right relay
  { id: 'grr0', d: bz(GX,GY, RR[0].x,RR[0].y), dur:'3.0s', b1:'0.7s', b2:'2.2s',  anim:true  },
  { id: 'grr1', d: bz(GX,GY, RR[1].x,RR[1].y), dur:'3.7s', b1:'1.3s', b2:'3.15s', anim:true  },
  { id: 'grr2', d: bz(GX,GY, RR[2].x,RR[2].y), dur:'3.3s', b1:'1.8s', b2:'3.45s', anim:true  },
  { id: 'grr3', d: bz(GX,GY, RR[3].x,RR[3].y), dur:'4.0s', b1:'2.3s', b2:'4.3s',  anim:false },
  // Right relay → Destinations
  { id: 'rr0r0', d: bz(RR[0].x,RR[0].y, R[0].x,R[0].y), dur:'3.5s', b1:'0.9s', b2:'2.65s', anim:true  },
  { id: 'rr0r1', d: bz(RR[0].x,RR[0].y, R[1].x,R[1].y), dur:'4.0s', b1:'1.4s', b2:'3.4s',  anim:true  },
  { id: 'rr1r1', d: bz(RR[1].x,RR[1].y, R[1].x,R[1].y), dur:'3.2s', b1:'1.9s', b2:'3.5s',  anim:false },
  { id: 'rr1r2', d: bz(RR[1].x,RR[1].y, R[2].x,R[2].y), dur:'3.8s', b1:'2.5s', b2:'4.4s',  anim:true  },
  { id: 'rr2r3', d: bz(RR[2].x,RR[2].y, R[3].x,R[3].y), dur:'3.6s', b1:'3.0s', b2:'4.8s',  anim:true  },
  { id: 'rr3r4', d: bz(RR[3].x,RR[3].y, R[4].x,R[4].y), dur:'4.2s', b1:'3.5s', b2:'5.6s',  anim:false },
];

// All node positions for rendering circles
const ALL_NODES = [
  ...L, ...LR, { x: GX, y: GY }, ...RR, ...R,
];

// Animated packet along a path
function Packet({ pathId, dur, begin }: { pathId: string; dur: string; begin: string }): ReactNode {
  return (
    <circle r="2.8" fill="#5e6ad2">
      <animateMotion dur={dur} repeatCount="indefinite" begin={begin}>
        <mpath href={`#${pathId}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;0;0.65;0.65;0"
        keyTimes="0;0.05;0.15;0.88;1"
        dur={dur}
        repeatCount="indefinite"
        begin={begin}
      />
    </circle>
  );
}

export default function PageBackground(): ReactNode {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 0 }}
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dot grid texture — 64px spacing, near-invisible */}
          <pattern id="bg-dot-grid" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
            <circle cx="32" cy="32" r="0.8" fill="rgba(255,255,255,0.042)" />
          </pattern>

          {/* Hero center-stage spotlight — lavender radial at top-center */}
          <radialGradient id="hero-spot" cx="50%" cy="0%" r="65%" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#5e6ad2" stopOpacity="0.055" />
            <stop offset="60%"  stopColor="#5e6ad2" stopOpacity="0.02"  />
            <stop offset="100%" stopColor="#5e6ad2" stopOpacity="0"     />
          </radialGradient>

          {/* Gateway bloom — lavender radial at viewport center */}
          <radialGradient id="gateway-bloom" cx="50%" cy="50%" r="35%" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#5e6ad2" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#5e6ad2" stopOpacity="0"    />
          </radialGradient>

          {/* Bottom vignette — canvas black fading from bottom so footer is clean */}
          <linearGradient id="bottom-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#010102" stopOpacity="0"   />
            <stop offset="100%" stopColor="#010102" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* ── Dot grid ── */}
        <rect width="1440" height="900" fill="url(#bg-dot-grid)" />

        {/* ── Center-stage lighting ── */}
        {/* Hero spotlight at top */}
        <ellipse cx="720" cy="0" rx="700" ry="400" fill="url(#hero-spot)" />
        {/* Gateway bloom at center */}
        <ellipse cx={GX} cy={GY} rx="520" ry="380" fill="url(#gateway-bloom)" />

        {/* ── Connection paths (edges) ── */}
        {CONNECTIONS.map(({ id, d }) => (
          <path
            key={id}
            id={id}
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.055)"
            strokeWidth="0.9"
          />
        ))}

        {/* ── Animated packets ── */}
        {CONNECTIONS.filter(c => c.anim).flatMap(({ id, dur, b1, b2 }) => [
          <Packet key={`${id}-a`} pathId={id} dur={dur} begin={b1} />,
          <Packet key={`${id}-b`} pathId={id} dur={dur} begin={b2} />,
        ])}

        {/* ── Network nodes ── */}
        {ALL_NODES.map(({ x, y }, i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={x === GX && y === GY ? 0 : 3.5}  // gateway handled separately
            fill="rgba(10,10,11,0.8)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {/* ── Gateway node (central hub) ── */}
        {/* Outer pulse ring */}
        <circle cx={GX} cy={GY} r="24" fill="rgba(94,106,210,0.035)" stroke="rgba(94,106,210,0.16)" strokeWidth="1">
          <animate attributeName="r"       values="24;30;24"     dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1"      dur="4.5s" repeatCount="indefinite" />
        </circle>
        {/* Mid ring */}
        <circle cx={GX} cy={GY} r="14" fill="rgba(94,106,210,0.05)" stroke="rgba(94,106,210,0.22)" strokeWidth="1">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Core */}
        <circle cx={GX} cy={GY} r="5" fill="rgba(94,106,210,0.55)" stroke="rgba(94,106,210,0.85)" strokeWidth="1">
          <animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.8s" repeatCount="indefinite" />
        </circle>

        {/* ── Bottom vignette ── */}
        <rect width="1440" height="900" fill="url(#bottom-fade)" />
      </svg>
    </div>
  );
}
