"use client";

import type { VisualSpec, VisualItem } from "./build-schema";

/* Visuals for generated courses. These are laid out in HTML rather than a fixed
   SVG canvas, because agent-written content has unpredictable length — a causal
   step can be four words or twenty — and a flow layout absorbs that where a
   coordinate system does not. */

function band(item: VisualItem): "low" | "high" | "normal" | "none" {
  const g = (item.group || "").toLowerCase();
  if (g.includes("low") || g.includes("below") || g.includes("down")) return "low";
  if (g.includes("high") || g.includes("above") || g.includes("up")) return "high";
  if (g.includes("normal") || g.includes("within")) return "normal";
  return "none";
}

function CausalChain({ items }: { items: VisualItem[] }) {
  return (
    <ol className="vz-chain">
      {items.map((item, i) => (
        <li key={`${item.label}-${i}`} style={{ animationDelay: `${i * 70}ms` }}>
          <span className="vz-chain-index">{String(i + 1).padStart(2, "0")}</span>
          <div className="vz-chain-body">
            <b>{item.label}</b>
            {item.detail && <p>{item.detail}</p>}
            {item.value && <span className="vz-chain-because">{item.value}</span>}
          </div>
          {i < items.length - 1 && <span className="vz-chain-arrow" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

function FeedbackLoop({ items }: { items: VisualItem[] }) {
  const nodes = items.slice(0, 6);
  return (
    <div className="vz-loop">
      <ol>
        {nodes.map((item, i) => {
          const sign = item.value.trim().startsWith("-") || /decreas|inhibit|suppress|fall/i.test(item.value)
            ? "down"
            : "up";
          return (
            <li key={`${item.label}-${i}`} style={{ animationDelay: `${i * 80}ms` }}>
              <span className={`vz-loop-dot ${sign}`} aria-hidden="true" />
              <div>
                <b>{item.label}</b>
                {item.detail && <p>{item.detail}</p>}
              </div>
              <span className="vz-loop-edge" aria-hidden="true">
                {i === nodes.length - 1 ? "↺" : "↓"}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="vz-loop-note">
        The last step feeds the first — which is why the system settles, or runs away.
      </p>
    </div>
  );
}

function LabPanel({ items }: { items: VisualItem[] }) {
  return (
    <table className="vz-labs">
      <thead>
        <tr>
          <th>Measure</th>
          <th>Value</th>
          <th>Reference</th>
          <th>Reading</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => {
          const status = band(item);
          return (
            <tr key={`${item.label}-${i}`} data-status={status}>
              <th scope="row">{item.label}</th>
              <td className="vz-labs-value">
                <span className={`vz-flag ${status}`}>
                  {status === "low" ? "↓" : status === "high" ? "↑" : "—"}
                </span>
                {item.value || "—"}
              </td>
              <td className="vz-labs-ref">{item.group || "—"}</td>
              <td className="vz-labs-note">{item.detail}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Compare({ items }: { items: VisualItem[] }) {
  const columns: string[] = [];
  items.forEach((item) => {
    const col = item.group || "—";
    if (!columns.includes(col)) columns.push(col);
  });
  const features: string[] = [];
  items.forEach((item) => {
    if (!features.includes(item.label)) features.push(item.label);
  });
  const cell = (feature: string, column: string) =>
    items.find((i) => i.label === feature && (i.group || "—") === column);
  return (
    <table className="vz-compare">
      <thead>
        <tr>
          <th />
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {features.map((feature) => (
          <tr key={feature}>
            <th scope="row">{feature}</th>
            {columns.map((col) => {
              const found = cell(feature, col);
              return (
                <td key={col}>
                  <b>{found?.value || "—"}</b>
                  {found?.detail && <span>{found.detail}</span>}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DecisionTree({ items }: { items: VisualItem[] }) {
  return (
    <ol className="vz-tree">
      {items.map((item, i) => (
        <li key={`${item.label}-${i}`} style={{ animationDelay: `${i * 70}ms` }}>
          {item.group && <span className="vz-tree-branch">{item.group}</span>}
          <div className="vz-tree-node">
            <b>{item.label}</b>
            {item.value && <span className="vz-tree-answer">{item.value}</span>}
            {item.detail && <p>{item.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Timeline({ items }: { items: VisualItem[] }) {
  return (
    <ol className="vz-timeline">
      {items.map((item, i) => (
        <li key={`${item.label}-${i}`} style={{ animationDelay: `${i * 70}ms` }}>
          <span className="vz-timeline-mark" aria-hidden="true" />
          <div>
            {item.value && <span className="vz-timeline-when">{item.value}</span>}
            <b>{item.label}</b>
            {item.detail && <p>{item.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Spectrum({ items }: { items: VisualItem[] }) {
  const positions = items.map((item, i) => {
    const raw = parseFloat(item.value.replace(/[^0-9.\-]/g, ""));
    const pct = Number.isFinite(raw)
      ? Math.max(0, Math.min(100, raw))
      : ((i + 0.5) / items.length) * 100;
    return { item, pct };
  });
  return (
    <div className="vz-spectrum">
      <div className="vz-spectrum-track" aria-hidden="true">
        {positions.map(({ item, pct }, i) => (
          <span key={`${item.label}-${i}`} style={{ left: `${pct}%` }} />
        ))}
      </div>
      <ol>
        {positions.map(({ item, pct }, i) => (
          <li key={`${item.label}-${i}`} style={{ animationDelay: `${i * 70}ms` }}>
            <span className="vz-spectrum-pos">{Math.round(pct)}</span>
            <div>
              <b>{item.label}</b>
              {item.detail && <p>{item.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CourseVisual({ spec }: { spec: VisualSpec }) {
  const items = spec.items ?? [];
  const body = () => {
    switch (spec.kind) {
      case "causal-chain":
        return <CausalChain items={items} />;
      case "feedback-loop":
        return <FeedbackLoop items={items} />;
      case "lab-panel":
        return <LabPanel items={items} />;
      case "compare":
        return <Compare items={items} />;
      case "decision-tree":
        return <DecisionTree items={items} />;
      case "timeline":
        return <Timeline items={items} />;
      case "spectrum":
        return <Spectrum items={items} />;
      default:
        return <CausalChain items={items} />;
    }
  };
  return (
    <figure className="vz" data-kind={spec.kind}>
      <figcaption className="vz-head">
        <span className="vz-kind">{spec.kind.replace("-", " ")}</span>
        {spec.title && <b>{spec.title}</b>}
      </figcaption>
      <div className="vz-body">{body()}</div>
      {spec.caption && <p className="vz-caption">{spec.caption}</p>}
    </figure>
  );
}
