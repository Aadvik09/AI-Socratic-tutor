"use client";

/* Lesson diagrams are drawn from a small spec so every lesson gets a figure
   that shows its actual idea, rather than decoration. Each diagram tags three
   `data-part` groups; a teaching step can focus one of them, which dims the
   rest and shows that step's annotation. */

export type DiagramSpec =
  | {
      kind: "distribution";
      caption: string;
      annotations: string[];
      bars: number[];
      medianAt: number;
      meanAt: number;
      xLabel: string;
    }
  | {
      kind: "chips";
      caption: string;
      annotations: string[];
      groups: { label: string; items: string[] }[];
    }
  | {
      kind: "scatter";
      caption: string;
      annotations: string[];
      points: [number, number][];
      outlier: [number, number];
      xLabel: string;
      yLabel: string;
    }
  | {
      kind: "grid";
      caption: string;
      annotations: string[];
      cols: string[];
      rows: number;
      missing: [number, number][];
    }
  | {
      kind: "bars";
      caption: string;
      annotations: string[];
      series: { label: string; value: number }[];
      truncatedFrom: number;
    }
  | {
      kind: "flow";
      caption: string;
      annotations: string[];
      steps: string[];
    }
  | {
      kind: "trace";
      caption: string;
      annotations: string[];
      rows: { line: string; state: string }[];
    }
  | {
      kind: "layers";
      caption: string;
      annotations: string[];
      layers: { label: string; note: string }[];
    }
  | {
      kind: "network";
      caption: string;
      annotations: string[];
      shape: [number, number, number];
      labels: [string, string, string];
    }
  | {
      kind: "curve";
      caption: string;
      annotations: string[];
      interval: [number, number];
      estimate: number;
      xLabel: string;
    }
  | {
      kind: "scales";
      caption: string;
      annotations: string[];
      claim: string;
      support: string[];
      against: string[];
    }
  | {
      kind: "tree";
      caption: string;
      annotations: string[];
      root: string;
      branches: [string, string];
      leaves: string[];
    };

const W = 320;
const H = 176;

/* A couple of kinds only occupy part of the canvas; cropping the viewBox keeps
   the figure from sitting in a field of empty space. */
const VIEWBOX: Partial<Record<DiagramSpec["kind"], string>> = {
  flow: "0 38 320 90",
  grid: "0 14 320 122",
};

function Axis({ label }: { label: string }) {
  return (
    <g className="dg-axis" data-part="2">
      <line x1="30" y1="140" x2="304" y2="140" />
      <text x="167" y="163" textAnchor="middle" className="dg-label">
        {label}
      </text>
    </g>
  );
}

function renderDistribution(s: Extract<DiagramSpec, { kind: "distribution" }>) {
  const n = s.bars.length;
  const left = 30;
  const width = 274;
  const bw = width / n;
  const peak = Math.max(...s.bars);
  const xAt = (frac: number) => left + width * frac;
  return (
    <>
      <g data-part="0">
        {s.bars.map((v, i) => (
          <rect
            key={i}
            className={i / n > 0.45 ? "dg-bar dg-bar-tail" : "dg-bar"}
            x={left + i * bw + 1.5}
            y={140 - (v / peak) * 96}
            width={bw - 3}
            height={(v / peak) * 96}
            rx="2"
            style={{ animationDelay: `${i * 45}ms` }}
          />
        ))}
      </g>
      <g data-part="1" className="dg-markers">
        <line x1={xAt(s.medianAt)} y1="28" x2={xAt(s.medianAt)} y2="140" className="dg-median" />
        <text x={xAt(s.medianAt)} y="22" textAnchor="middle" className="dg-tag dg-tag-median">
          median
        </text>
        <line x1={xAt(s.meanAt)} y1="42" x2={xAt(s.meanAt)} y2="140" className="dg-mean" />
        <text x={xAt(s.meanAt)} y="36" textAnchor="middle" className="dg-tag dg-tag-mean">
          mean
        </text>
        <path
          d={`M ${xAt(s.medianAt) + 4} 128 L ${xAt(s.meanAt) - 4} 128`}
          className="dg-gap"
          markerEnd="url(#dg-arrow)"
        />
      </g>
      <Axis label={s.xLabel} />
    </>
  );
}

function renderChips(s: Extract<DiagramSpec, { kind: "chips" }>) {
  return (
    <g>
      {s.groups.slice(0, 4).map((group, gi) => {
        const y = 16 + gi * 40;
        return (
          <g key={`${group.label}-${gi}`} data-part={String(Math.min(gi, 2))}>
            <text x="12" y={y + 13} className="dg-label dg-label-strong">
              {group.label}
            </text>
            {group.items.slice(0, 4).map((item, i) => (
              <g key={`${item}-${i}`} style={{ animationDelay: `${(gi * 4 + i) * 60}ms` }} className="dg-pop">
                <rect
                  x={104 + i * 54}
                  y={y}
                  width="50"
                  height="20"
                  rx="5"
                  className={gi === 0 ? "dg-chip dg-chip-accent" : "dg-chip"}
                />
                <text x={129 + i * 54} y={y + 14} textAnchor="middle" className="dg-chip-text">
                  {item}
                </text>
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
}

function renderScatter(s: Extract<DiagramSpec, { kind: "scatter" }>) {
  const px = (v: number) => 34 + v * 262;
  const py = (v: number) => 132 - v * 104;
  return (
    <>
      <g data-part="0">
        {s.points.map(([x, y], i) => (
          <circle
            key={i}
            cx={px(x)}
            cy={py(y)}
            r="4"
            className="dg-dot dg-pop"
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </g>
      <g data-part="1">
        <circle cx={px(s.outlier[0])} cy={py(s.outlier[1])} r="13" className="dg-ring" />
        <circle cx={px(s.outlier[0])} cy={py(s.outlier[1])} r="4.5" className="dg-dot-alert" />
        <text
          x={px(s.outlier[0])}
          y={py(s.outlier[1]) - 20}
          textAnchor="middle"
          className="dg-tag dg-tag-alert"
        >
          investigate
        </text>
      </g>
      <g className="dg-axis" data-part="2">
        <line x1="30" y1="132" x2="306" y2="132" />
        <line x1="30" y1="20" x2="30" y2="132" />
        <text x="168" y="156" textAnchor="middle" className="dg-label">
          {s.xLabel}
        </text>
        <text x="12" y="76" textAnchor="middle" className="dg-label" transform="rotate(-90 12 76)">
          {s.yLabel}
        </text>
      </g>
    </>
  );
}

function renderGrid(s: Extract<DiagramSpec, { kind: "grid" }>) {
  const cw = 62;
  const ch = 22;
  const x0 = 22;
  const y0 = 34;
  const isMissing = (r: number, c: number) =>
    s.missing.some(([mr, mc]) => mr === r && mc === c);
  return (
    <>
      <g data-part="2">
        {s.cols.slice(0, 4).map((c, i) => (
          <text key={c} x={x0 + i * cw + cw / 2} y={y0 - 10} textAnchor="middle" className="dg-label">
            {c}
          </text>
        ))}
      </g>
      <g data-part="0">
        {Array.from({ length: s.rows }).map((_, r) =>
          s.cols.slice(0, 4).map((_, c) =>
            isMissing(r, c) ? null : (
              <rect
                key={`${r}-${c}`}
                x={x0 + c * cw}
                y={y0 + r * ch}
                width={cw - 5}
                height={ch - 5}
                rx="3"
                className="dg-cell dg-pop"
                style={{ animationDelay: `${(r * 4 + c) * 30}ms` }}
              />
            ),
          ),
        )}
      </g>
      <g data-part="1">
        {s.missing.map(([r, c]) => (
          <g key={`${r}-${c}`}>
            <rect
              x={x0 + c * cw}
              y={y0 + r * ch}
              width={cw - 5}
              height={ch - 5}
              rx="3"
              className="dg-cell-missing"
            />
            <text
              x={x0 + c * cw + (cw - 5) / 2}
              y={y0 + r * ch + 14}
              textAnchor="middle"
              className="dg-cell-mark"
            >
              ?
            </text>
          </g>
        ))}
      </g>
    </>
  );
}

function renderBars(s: Extract<DiagramSpec, { kind: "bars" }>) {
  const max = Math.max(...s.series.map((d) => d.value));
  const min = s.truncatedFrom;
  const bw = 34;
  const panel = (
    x0: number,
    base: number,
    title: string,
    part: string,
    truncated: boolean,
  ) => (
    <g data-part={part}>
      <text x={x0 + 52} y="22" textAnchor="middle" className="dg-label dg-label-strong">
        {title}
      </text>
      {s.series.slice(0, 3).map((d, i) => {
        const span = max - base || 1;
        const h = Math.max(4, ((d.value - base) / span) * 84);
        return (
          <g key={`${d.label}-${i}`}>
            <rect
              x={x0 + i * (bw + 8)}
              y={128 - h}
              width={bw}
              height={h}
              rx="3"
              className={truncated ? "dg-bar dg-bar-warn" : "dg-bar"}
              style={{ animationDelay: `${i * 70}ms` }}
            />
            <text
              x={x0 + i * (bw + 8) + bw / 2}
              y="142"
              textAnchor="middle"
              className="dg-chip-text"
            >
              {d.label}
            </text>
          </g>
        );
      })}
      <line x1={x0 - 6} y1="128" x2={x0 + 118} y2="128" className="dg-baseline" />
      <text x={x0 - 10} y="132" textAnchor="end" className="dg-tick">
        {base}
      </text>
    </g>
  );
  return (
    <>
      {panel(34, min, "truncated axis", "0", true)}
      {panel(190, 0, "full baseline", "1", false)}
      <line x1="162" y1="14" x2="162" y2="150" className="dg-divider" data-part="2" />
    </>
  );
}

function renderFlow(s: Extract<DiagramSpec, { kind: "flow" }>) {
  const steps = s.steps.slice(0, 4);
  const bw = 66;
  const gap = (300 - steps.length * bw) / (steps.length - 1 || 1);
  return (
    <g>
      {steps.map((label, i) => {
        const x = 12 + i * (bw + gap);
        return (
          <g key={`${label}-${i}`} data-part={String(Math.min(i, 2))}>
            <rect
              x={x}
              y="54"
              width={bw}
              height="52"
              rx="8"
              className="dg-node dg-pop"
              style={{ animationDelay: `${i * 90}ms` }}
            />
            <text x={x + bw / 2} y="76" textAnchor="middle" className="dg-step-no">
              {String(i + 1).padStart(2, "0")}
            </text>
            <text x={x + bw / 2} y="92" textAnchor="middle" className="dg-chip-text">
              {label}
            </text>
            {i < steps.length - 1 && (
              <path
                d={`M ${x + bw + 4} 80 L ${x + bw + gap - 6} 80`}
                className="dg-gap"
                markerEnd="url(#dg-arrow)"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

function renderTrace(s: Extract<DiagramSpec, { kind: "trace" }>) {
  return (
    <g>
      <text x="20" y="26" className="dg-label dg-label-strong">
        line
      </text>
      <text x="188" y="26" className="dg-label dg-label-strong">
        state after
      </text>
      {s.rows.slice(0, 4).map((row, i) => (
        <g
          key={`${row.line}-${i}`}
          data-part={String(Math.min(i, 2))}
          className="dg-pop"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <rect x="14" y={36 + i * 30} width="160" height="24" rx="4" className="dg-cell" />
          <text x="24" y={52 + i * 30} className="dg-code">
            {row.line}
          </text>
          <path
            d={`M 180 ${48 + i * 30} L 198 ${48 + i * 30}`}
            className="dg-gap"
            markerEnd="url(#dg-arrow)"
          />
          <rect x="204" y={36 + i * 30} width="102" height="24" rx="4" className="dg-cell-accent" />
          <text x="214" y={52 + i * 30} className="dg-code dg-code-accent">
            {row.state}
          </text>
        </g>
      ))}
    </g>
  );
}

function renderLayers(s: Extract<DiagramSpec, { kind: "layers" }>) {
  return (
    <g>
      {s.layers.slice(0, 4).map((layer, i) => (
        <g
          key={`${layer.label}-${i}`}
          data-part={String(Math.min(i, 2))}
          className="dg-pop"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <rect
            x={22 + i * 6}
            y={18 + i * 36}
            width={276 - i * 12}
            height="28"
            rx="6"
            className={i === 0 ? "dg-node dg-node-accent" : "dg-node"}
          />
          <text x={36 + i * 6} y={36 + i * 36} className="dg-chip-text dg-chip-text-strong">
            {layer.label}
          </text>
          <text x={286 - i * 6} y={36 + i * 36} textAnchor="end" className="dg-tick">
            {layer.note}
          </text>
        </g>
      ))}
    </g>
  );
}

function renderNetwork(s: Extract<DiagramSpec, { kind: "network" }>) {
  const cols = s.shape;
  const xs = [56, 160, 264];
  const nodes = cols.map((count, ci) =>
    Array.from({ length: count }).map((_, i) => ({
      x: xs[ci],
      y: 96 - ((count - 1) * 30) / 2 + i * 30,
    })),
  );
  return (
    <g>
      <g data-part="1" className="dg-edges">
        {nodes[0].map((a, i) =>
          nodes[1].map((b, j) => (
            <line key={`a${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="dg-edge" />
          )),
        )}
        {nodes[1].map((a, i) =>
          nodes[2].map((b, j) => (
            <line key={`b${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="dg-edge" />
          )),
        )}
      </g>
      {nodes.map((col, ci) => (
        <g key={ci} data-part={ci === 0 ? "0" : ci === 2 ? "2" : "1"}>
          {col.map((node, i) => (
            <circle
              key={i}
              cx={node.x}
              cy={node.y}
              r="9"
              className={ci === 2 ? "dg-node-dot dg-node-dot-accent" : "dg-node-dot"}
              style={{ animationDelay: `${(ci * 3 + i) * 60}ms` }}
            />
          ))}
          <text x={xs[ci]} y="164" textAnchor="middle" className="dg-label">
            {s.labels[ci]}
          </text>
        </g>
      ))}
    </g>
  );
}

function renderCurve(s: Extract<DiagramSpec, { kind: "curve" }>) {
  const px = (v: number) => 30 + v * 274;
  const curve = (): string => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = px(t);
      const y = 132 - Math.exp(-Math.pow((t - 0.5) * 5.2, 2)) * 96;
      pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };
  return (
    <>
      <g data-part="1">
        <rect
          x={px(s.interval[0])}
          y="30"
          width={px(s.interval[1]) - px(s.interval[0])}
          height="102"
          className="dg-band"
        />
        <text
          x={(px(s.interval[0]) + px(s.interval[1])) / 2}
          y="24"
          textAnchor="middle"
          className="dg-tag dg-tag-accent"
        >
          plausible range
        </text>
      </g>
      <path d={curve()} className="dg-curve" data-part="0" />
      <g data-part="2">
        <line x1={px(s.estimate)} y1="34" x2={px(s.estimate)} y2="132" className="dg-median" />
        <circle cx={px(s.estimate)} cy="34" r="4" className="dg-dot-alert" />
      </g>
      <Axis label={s.xLabel} />
    </>
  );
}

function renderScales(s: Extract<DiagramSpec, { kind: "scales" }>) {
  const tilt = Math.min(
    12,
    Math.max(-12, (s.against.length - s.support.length) * 7),
  );
  return (
    <g>
      <g data-part="2">
        <text x="160" y="20" textAnchor="middle" className="dg-label dg-label-strong">
          {s.claim}
        </text>
        <line x1="160" y1="96" x2="160" y2="140" className="dg-baseline" />
        <path d="M 138 142 L 182 142" className="dg-baseline" />
      </g>
      <g transform={`rotate(${tilt} 160 92)`}>
        <line x1="52" y1="92" x2="268" y2="92" className="dg-beam" />
        <g data-part="0">
          <rect x="18" y="96" width="80" height="34" rx="7" className="dg-node dg-node-accent" />
          <text x="58" y="110" textAnchor="middle" className="dg-chip-text dg-chip-text-strong">
            supports
          </text>
          <text x="58" y="123" textAnchor="middle" className="dg-tick">
            {s.support.length} reason{s.support.length === 1 ? "" : "s"}
          </text>
        </g>
        <g data-part="1">
          <rect x="222" y="96" width="80" height="34" rx="7" className="dg-node" />
          <text x="262" y="110" textAnchor="middle" className="dg-chip-text dg-chip-text-strong">
            counters
          </text>
          <text x="262" y="123" textAnchor="middle" className="dg-tick">
            {s.against.length} reason{s.against.length === 1 ? "" : "s"}
          </text>
        </g>
      </g>
    </g>
  );
}

function renderTree(s: Extract<DiagramSpec, { kind: "tree" }>) {
  return (
    <g>
      <g data-part="0">
        <rect x="112" y="14" width="96" height="26" rx="6" className="dg-node dg-node-accent" />
        <text x="160" y="31" textAnchor="middle" className="dg-chip-text dg-chip-text-strong">
          {s.root}
        </text>
      </g>
      <g data-part="1">
        <path d="M 160 42 L 92 66 M 160 42 L 228 66" className="dg-edge-strong" />
        <rect x="42" y="66" width="100" height="26" rx="6" className="dg-node" />
        <text x="92" y="83" textAnchor="middle" className="dg-chip-text">
          {s.branches[0]}
        </text>
        <rect x="178" y="66" width="100" height="26" rx="6" className="dg-node" />
        <text x="228" y="83" textAnchor="middle" className="dg-chip-text">
          {s.branches[1]}
        </text>
      </g>
      <g data-part="2">
        {s.leaves.slice(0, 4).map((leaf, i) => {
          const x = 20 + i * 74;
          const parent = i < 2 ? 92 : 228;
          return (
            <g key={`${leaf}-${i}`} className="dg-pop" style={{ animationDelay: `${i * 70}ms` }}>
              <path d={`M ${parent} 94 L ${x + 32} 118`} className="dg-edge" />
              <rect x={x} y="118" width="64" height="24" rx="6" className="dg-cell" />
              <text x={x + 32} y="134" textAnchor="middle" className="dg-tick">
                {leaf}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

function renderSpec(spec: DiagramSpec) {
  switch (spec.kind) {
    case "distribution":
      return renderDistribution(spec);
    case "chips":
      return renderChips(spec);
    case "scatter":
      return renderScatter(spec);
    case "grid":
      return renderGrid(spec);
    case "bars":
      return renderBars(spec);
    case "flow":
      return renderFlow(spec);
    case "trace":
      return renderTrace(spec);
    case "layers":
      return renderLayers(spec);
    case "network":
      return renderNetwork(spec);
    case "curve":
      return renderCurve(spec);
    case "scales":
      return renderScales(spec);
    case "tree":
      return renderTree(spec);
  }
}

export function LessonDiagram({
  spec,
  focus,
  compact,
}: {
  spec: DiagramSpec;
  focus?: number;
  compact?: boolean;
}) {
  const note =
    typeof focus === "number" ? spec.annotations[focus] : undefined;
  return (
    <figure
      className={`diagram${compact ? " diagram-compact" : ""}`}
      data-focus={typeof focus === "number" ? String(focus) : undefined}
    >
      <div className="diagram-frame">
        <svg
          viewBox={VIEWBOX[spec.kind] ?? `0 0 ${W} ${H}`}
          role="img"
          aria-label={note ?? spec.caption}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="dg-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" className="dg-arrowhead" />
            </marker>
          </defs>
          {renderSpec(spec)}
        </svg>
      </div>
      <figcaption>{note ?? spec.caption}</figcaption>
    </figure>
  );
}
