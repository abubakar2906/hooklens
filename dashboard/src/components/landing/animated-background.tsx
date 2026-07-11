import type { ReactNode } from 'react';

// ─── Animated Background ───────────────────────────────────────────────────────
// Pure SVG SMIL animations — no client JS, works as a Server Component.
// Renders a webhook traffic network:
//   LEFT:   three provider nodes (Paystack, Flutterwave, Monnify)
//   CENTER: HookLens gateway node (pulsing)
//   RIGHT:  destination service nodes
//
// Lavender (#5e6ad2) packets animate along each path.
// Entire layer is very low opacity so it never competes with page content.

// Gateway coordinates
const GX = 640;
const GY = 310;

// Bezier path between two points — cubic ease for organic feel
function bezier(x1: number, y1: number, x2: number, y2: number): string {
  const cx1 = x1 + (x2 - x1) * 0.45;
  const cx2 = x2 - (x2 - x1) * 0.45;
  return `M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`;
}

// Static connection data — no Math.random() to avoid hydration mismatch
const CONNECTIONS = [
  // Providers → Gateway (incoming webhook traffic)
  { id: 'p0', d: bezier(130, 155, GX, GY), dur: '3.6s', b1: '0s',    b2: '1.8s'  },
  { id: 'p1', d: bezier(130, 310, GX, GY), dur: '4.2s', b1: '0.9s',  b2: '3.0s'  },
  { id: 'p2', d: bezier(130, 465, GX, GY), dur: '3.1s', b1: '1.8s',  b2: '3.35s' },
  // Gateway → Destinations (outbound delivery)
  { id: 'd0', d: bezier(GX, GY, 1150, 110), dur: '2.9s', b1: '2.2s', b2: '3.65s' },
  { id: 'd1', d: bezier(GX, GY, 1150, 220), dur: '3.4s', b1: '2.7s', b2: '4.4s'  },
  { id: 'd2', d: bezier(GX, GY, 1150, 330), dur: '2.7s', b1: '3.1s', b2: '4.45s' },
  { id: 'd3', d: bezier(GX, GY, 1150, 440), dur: '3.8s', b1: '3.5s', b2: '5.4s'  },
  { id: 'd4', d: bezier(GX, GY, 1150, 550), dur: '3.2s', b1: '4.0s', b2: '5.6s'  },
];

const PROVIDERS = [
  { x: 130, y: 155, label: 'Paystack'    },
  { x: 130, y: 310, label: 'Flutterwave' },
  { x: 130, y: 465, label: 'Monnify'     },
];

const DESTINATIONS = [
  { x: 1150, y: 110, label: 'Express'  },
  { x: 1150, y: 220, label: 'Next.js'  },
  { x: 1150, y: 330, label: 'NestJS'   },
  { x: 1150, y: 440, label: 'FastAPI'  },
  { x: 1150, y: 550, label: 'Docker'   },
];

// Packet element: a circle that travels along a path and fades in/out at ends
function Packet({ pathId, dur, begin }: { pathId: string; dur: string; begin: string }) {
  return (
    <circle r="2.5" fill="#5e6ad2">
      <animateMotion dur={dur} repeatCount="indefinite" begin={begin}>
        <mpath href={`#${pathId}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;0.65;0.65;0"
        keyTimes="0;0.12;0.88;1"
        dur={dur}
        repeatCount="indefinite"
        begin={begin}
      />
    </circle>
  );
}

export default function AnimatedBackground(): ReactNode {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 0 }}
    >
      <svg
        viewBox="0 0 1280 640"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dot grid pattern — very subtle texture depth */}
          <pattern id="bg-dots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="0.75" fill="rgba(255,255,255,0.055)" />
          </pattern>
        </defs>

        {/* Dot grid background */}
        <rect width="1280" height="640" fill="url(#bg-dots)" />

        {/* Connection paths — hairline, near invisible */}
        {CONNECTIONS.map(({ id, d }) => (
          <path
            key={id}
            id={id}
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Animated packets — two per path for continuous flow */}
        {CONNECTIONS.flatMap(({ id, dur, b1, b2 }) => [
          <Packet key={`${id}-a`} pathId={id} dur={dur} begin={b1} />,
          <Packet key={`${id}-b`} pathId={id} dur={dur} begin={b2} />,
        ])}

        {/* Provider nodes */}
        {PROVIDERS.map(({ x, y, label }) => (
          <g key={label}>
            <circle
              cx={x}
              cy={y}
              r="5"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
            />
            <text
              x={x + 13}
              y={y + 4}
              fill="rgba(255,255,255,0.13)"
              fontSize="9.5"
              fontFamily="ui-monospace, monospace"
            >
              {label}
            </text>
          </g>
        ))}

        {/* Destination nodes */}
        {DESTINATIONS.map(({ x, y, label }) => (
          <g key={label}>
            <circle
              cx={x}
              cy={y}
              r="4"
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.11)"
              strokeWidth="1"
            />
            <text
              x={x - 12}
              y={y + 4}
              fill="rgba(255,255,255,0.12)"
              fontSize="9.5"
              fontFamily="ui-monospace, monospace"
              textAnchor="end"
            >
              {label}
            </text>
          </g>
        ))}

        {/* HookLens gateway — central pulsing node */}
        {/* Outer ring pulse */}
        <circle cx={GX} cy={GY} r="22" fill="rgba(94,106,210,0.04)" stroke="rgba(94,106,210,0.18)" strokeWidth="1">
          <animate attributeName="r" values="22;28;22" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1" dur="4s" repeatCount="indefinite" />
        </circle>
        {/* Mid ring */}
        <circle cx={GX} cy={GY} r="14" fill="rgba(94,106,210,0.06)" stroke="rgba(94,106,210,0.25)" strokeWidth="1" />
        {/* Core dot */}
        <circle cx={GX} cy={GY} r="5" fill="rgba(94,106,210,0.5)" stroke="rgba(94,106,210,0.8)" strokeWidth="1">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
        {/* HookLens label */}
        <text
          x={GX}
          y={GY + 36}
          fill="rgba(94,106,210,0.35)"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          HookLens
        </text>
      </svg>
    </div>
  );
}
