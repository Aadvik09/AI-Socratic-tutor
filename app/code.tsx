"use client";

/* A small display-only tokenizer. Nothing here executes or parses for
   correctness — it exists to give code the same typographic care as prose, so a
   snippet reads as a teaching artifact rather than a grey box. */

export type Lang = "python" | "sql";

type Token = { kind: string; text: string };

const PATTERNS: Record<Lang, { kind: string; re: RegExp }[]> = {
  python: [
    { kind: "comment", re: /^#[^\n]*/ },
    { kind: "string", re: /^(?:f|r|b)?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/ },
    { kind: "number", re: /^\b\d+(?:\.\d+)?\b/ },
    {
      kind: "keyword",
      re: /^\b(?:import|from|as|def|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|lambda|with|class|try|except|finally|raise|assert|yield|pass|break|continue|global|del)\b/,
    },
    {
      kind: "builtin",
      re: /^\b(?:print|len|sum|sorted|round|abs|min|max|range|list|dict|set|tuple|int|float|str|enumerate|zip|map|filter|any|all|open|type)\b/,
    },
    { kind: "fn", re: /^[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/ },
    { kind: "punct", re: /^[()[\]{},.:;]/ },
    { kind: "op", re: /^(?:\*\*|\/\/|[+\-*/%=<>!&|^~])+/ },
  ],
  sql: [
    { kind: "comment", re: /^--[^\n]*/ },
    { kind: "string", re: /^'(?:''|[^'])*'/ },
    { kind: "number", re: /^\b\d+(?:\.\d+)?\b/ },
    {
      kind: "keyword",
      re: /^\b(?:SELECT|FROM|WHERE|GROUP|BY|HAVING|ORDER|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|ON|AS|AND|OR|NOT|NULL|IS|IN|DISTINCT|LIMIT|WITH|CASE|WHEN|THEN|ELSE|END|UNION|ALL|DESC|ASC)\b/i,
    },
    { kind: "builtin", re: /^\b(?:COUNT|SUM|AVG|MIN|MAX|ROUND|COALESCE|CAST)\b/i },
    { kind: "fn", re: /^[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/ },
    { kind: "punct", re: /^[()[\]{},.;]/ },
    { kind: "op", re: /^(?:>=|<=|<>|!=|[+\-*/%=<>])+/ },
  ],
};

function tokenize(line: string, lang: Lang): Token[] {
  const rules = PATTERNS[lang];
  const out: Token[] = [];
  let rest = line;
  let plain = "";
  const flush = () => {
    if (plain) {
      out.push({ kind: "plain", text: plain });
      plain = "";
    }
  };
  while (rest.length) {
    let matched = false;
    for (const rule of rules) {
      const m = rule.re.exec(rest);
      if (m && m[0].length) {
        flush();
        out.push({ kind: rule.kind, text: m[0] });
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      plain += rest[0];
      rest = rest.slice(1);
    }
  }
  flush();
  return out;
}

export type Snippet = {
  id: string;
  tab: string;
  lang: Lang;
  filename: string;
  code: string;
  /** 1-indexed lines drawn with an accent rule. */
  mark?: number[];
  output?: { label: string; value: string }[];
  note: string;
};

export function CodeBlock({ snippet }: { snippet: Snippet }) {
  const lines = snippet.code.replace(/\n+$/, "").split("\n");
  const gutter = String(lines.length).length;
  return (
    <div className="code-block">
      <div className="code-head">
        <span className="code-file">{snippet.filename}</span>
        <span className="code-lang">{snippet.lang}</span>
      </div>
      <pre className="code-body" aria-label={`${snippet.lang} example`}>
        <code>
          {lines.map((line, i) => (
            <span
              key={i}
              className={`code-line${snippet.mark?.includes(i + 1) ? " marked" : ""}`}
            >
              <span className="code-no" aria-hidden="true">
                {String(i + 1).padStart(gutter, "0")}
              </span>
              <span className="code-text">
                {line.length ? (
                  tokenize(line, snippet.lang).map((t, j) => (
                    <span key={j} className={`t-${t.kind}`}>
                      {t.text}
                    </span>
                  ))
                ) : (
                  "\u00a0"
                )}
              </span>
            </span>
          ))}
        </code>
      </pre>
      {snippet.output && (
        <div className="code-output">
          <span className="code-output-label">output</span>
          <dl>
            {snippet.output.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
