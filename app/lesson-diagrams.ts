import type { DiagramSpec } from "./diagrams";

/* One figure per lesson. `annotations` line up with the three "build the idea"
   steps, so the same figure is re-shown with that part highlighted. */

export const lessonDiagrams: Record<string, DiagramSpec[]> = {
  "data-literacy": [
    {
      kind: "distribution",
      xLabel: "length of stay (days)",
      bars: [4, 16, 22, 15, 9, 6, 4, 3, 2, 2, 1, 1],
      medianAt: 0.2,
      meanAt: 0.42,
      caption:
        "Most stays sit in a tight cluster, but a long right tail drags the mean away from the middle patient.",
      annotations: [
        "The bars are the whole story: the mean is computed from every one of them, so the far-right stays count as much as the crowded left cluster.",
        "The gap between the two markers is the thing to notice. Median stays inside the cluster; mean is pulled toward the tail.",
        "The axis tells you what a claim is about. “Typical stay” should point at the cluster, not at the average of a skewed spread.",
      ],
    },
    {
      kind: "chips",
      groups: [
        { label: "Nominal", items: ["home", "SNF", "hospice"] },
        { label: "Ordinal", items: ["mild", "moderate", "severe"] },
        { label: "Count", items: ["0", "3", "11"] },
        { label: "Measured", items: ["36.8°", "98.4", "1.7L"] },
      ],
      caption:
        "The same column can be stored as a number and still be a label. What the value means decides which maths is legitimate.",
      annotations: [
        "Nominal values name groups. Coding them 1, 2, 3 does not make the average of those codes mean anything.",
        "Ordinal values have an order but not equal spacing — severe is worse than moderate, not twice as bad.",
        "Counts and measurements support arithmetic, which is why they get histograms while the groups above get bar charts.",
      ],
    },
    {
      kind: "scatter",
      points: [
        [0.08, 0.32], [0.16, 0.42], [0.22, 0.28], [0.3, 0.46], [0.36, 0.35],
        [0.44, 0.5], [0.5, 0.38], [0.58, 0.47], [0.64, 0.3], [0.72, 0.44],
        [0.8, 0.36], [0.88, 0.45],
      ],
      outlier: [0.66, 0.93],
      xLabel: "specimen collected",
      yLabel: "result value",
      caption:
        "One value sits far outside the band. That is a prompt to trace it, not a licence to delete it.",
      annotations: [
        "The band of ordinary results is the reference. You can only call something unusual relative to a pattern you have actually looked at.",
        "The flagged point gets traced: units, timestamp, instrument, and the patient record it came from.",
        "The axes carry the context that decides the verdict — when it was drawn and what was being measured.",
      ],
    },
    {
      kind: "grid",
      cols: ["patient", "BP", "weight", "A1c"],
      rows: 4,
      missing: [
        [1, 3],
        [2, 3],
        [3, 2],
        [3, 3],
      ],
      caption:
        "The blanks are not scattered at random — they cluster in one column and one group of rows.",
      annotations: [
        "The recorded cells define who your analysis is actually about once incomplete rows are dropped.",
        "The blanks cluster, and a clustered pattern is evidence about the process that produced the data.",
        "The column heading usually names the cause: which measurement gets skipped, for which visits, and why.",
      ],
    },
  ],

  "python-reasoning": [
    {
      kind: "trace",
      rows: [
        { line: "total = 8", state: "total → 8" },
        { line: "total = total + 3", state: "total → 11" },
        { line: "total = total * 2", state: "total → 22" },
        { line: "print(total)", state: "prints 22" },
      ],
      caption:
        "A variable is a name for a value right now. Each assignment reads the old value and stores a new one.",
      annotations: [
        "The first line binds the name. Nothing is remembered about how the value was produced.",
        "The second line evaluates the right side using the current value, then rebinds the name to the result.",
        "By the time you print, only the latest binding exists — which is why tracing beats guessing.",
      ],
    },
    {
      kind: "tree",
      root: "if score >= 60",
      branches: ["True branch", "False branch"],
      leaves: ["pass", "review", "retry", "fail"],
      caption:
        "A condition splits execution. Only one path runs, so the path you take is the claim you are making.",
      annotations: [
        "The condition is the whole decision. Read it exactly: >= includes the boundary value, > does not.",
        "Each branch is a separate promise about what happens. Both need to be true of the real cases.",
        "The leaves are the outcomes you can actually observe — test the boundary cases that land on each one.",
      ],
    },
    {
      kind: "flow",
      steps: ["name the claim", "write one test", "run it", "narrow the scope"],
      caption:
        "A function you can test is a claim small enough to be wrong in exactly one way.",
      annotations: [
        "Start from the claim: what should this function be true of, for which inputs?",
        "One test per claim. If a test can fail for two different reasons, it will not tell you which one broke.",
        "When it fails, shrink the input until the failure is unambiguous, then fix that.",
      ],
    },
    {
      kind: "scatter",
      points: [
        [0.1, 0.4], [0.2, 0.45], [0.3, 0.38], [0.4, 0.5], [0.5, 0.42],
        [0.6, 0.48], [0.7, 0.4], [0.82, 0.46],
      ],
      outlier: [0.46, 0.88],
      xLabel: "input case",
      yLabel: "observed behaviour",
      caption:
        "The failing case is rarely the buggy line. It is the case where an assumption stopped holding.",
      annotations: [
        "The passing cases define the assumption you did not know you were making.",
        "The failure is the evidence. Reproduce it before you change anything.",
        "Only the input that separates passing from failing tells you which assumption to fix.",
      ],
    },
  ],

  cybersecurity: [
    {
      kind: "layers",
      layers: [
        { label: "What you must protect", note: "assets" },
        { label: "Who would want it", note: "actors" },
        { label: "How they'd reach it", note: "paths" },
        { label: "What you'd do about it", note: "controls" },
      ],
      caption:
        "A threat model is a stack: assets first, then who wants them, then the routes in, then the controls.",
      annotations: [
        "Name the asset first. Controls chosen before you know what you are protecting protect the wrong thing.",
        "Real adversaries have motives and budgets. “Hackers” is not a threat model.",
        "Only after assets and actors does a control make sense — and it should close a specific path.",
      ],
    },
    {
      kind: "scales",
      claim: "Is this message legitimate?",
      support: ["expected sender", "known domain"],
      against: ["urgency", "new payment detail", "reply-to mismatch"],
      caption:
        "Judge a suspicious message by weighing signals, not by how convincing the story sounds.",
      annotations: [
        "List what genuinely supports the message: an expected request through an expected channel.",
        "List the pressure signals separately — urgency and secrecy are techniques, not evidence.",
        "The verdict comes from the balance, and from verifying through a channel the message did not choose.",
      ],
    },
    {
      kind: "grid",
      cols: ["role", "read", "write", "admin"],
      rows: 4,
      missing: [
        [0, 3],
        [1, 2],
        [1, 3],
        [2, 3],
      ],
      caption:
        "Access should be the smallest set that lets the job get done — the gaps are the point.",
      annotations: [
        "Start from the task each role actually performs, not from the convenience of granting everything.",
        "The withheld cells are the control. Every extra grant is a permanent widening of the blast radius.",
        "Review by column: who really needs admin, and what would happen if that account were taken over?",
      ],
    },
    {
      kind: "flow",
      steps: ["contain", "preserve", "eradicate", "learn"],
      caption:
        "Incident response is an order of operations. Skipping preservation destroys the evidence you need.",
      annotations: [
        "Contain first to stop the spread — but containment that wipes the host also wipes the evidence.",
        "Preserve logs and images before cleanup, because the timeline is what tells you the scope.",
        "The review at the end is what converts one incident into a control that prevents the next.",
      ],
    },
  ],

  algorithms: [
    {
      kind: "flow",
      steps: ["count the steps", "as input grows", "find the dominant term", "compare methods"],
      caption:
        "Analysis counts how the work grows with input size, not how fast one run felt on your laptop.",
      annotations: [
        "Count operations that scale with the input, not wall-clock time on one machine.",
        "Ask what happens as n grows. Constant factors stop mattering; the growth term does not.",
        "The dominant term is what you compare between two approaches.",
      ],
    },
    {
      kind: "curve",
      interval: [0.55, 0.95],
      estimate: 0.75,
      xLabel: "input size → work done",
      caption:
        "Growth rates diverge. Two methods that look identical on small inputs separate sharply as n grows.",
      annotations: [
        "At small n almost anything works, which is why small benchmarks mislead.",
        "The shaded region is where the choice starts to matter for real workloads.",
        "Pick the method whose curve stays flat over the range you will actually operate in.",
      ],
    },
    {
      kind: "tree",
      root: "sorted input",
      branches: ["lower half", "upper half"],
      leaves: ["1/8", "1/8", "1/8", "1/8"],
      caption:
        "Structure buys speed: because the data is sorted, each comparison discards half the remaining work.",
      annotations: [
        "The precondition is what makes the shortcut legal — on unsorted data this method is simply wrong.",
        "Each step halves the search space, which is why the cost grows like log n rather than n.",
        "The leaves show the payoff: a handful of comparisons instead of scanning everything.",
      ],
    },
    {
      kind: "scales",
      claim: "Which approach should ship?",
      support: ["faster lookups", "predictable latency"],
      against: ["more memory", "index maintenance"],
      caption:
        "Every algorithmic choice spends one resource to save another. Name both sides before you defend it.",
      annotations: [
        "State what you gain in terms of the workload you actually have.",
        "State the cost honestly — memory, preprocessing, or complexity someone has to maintain.",
        "The defensible answer names the constraint that decides it, not the method you already liked.",
      ],
    },
  ],

  "sql-modeling": [
    {
      kind: "layers",
      layers: [
        { label: "Entity: what a row is", note: "grain" },
        { label: "Attributes: facts about it", note: "columns" },
        { label: "Keys: how rows connect", note: "relations" },
        { label: "Constraints: what stays true", note: "rules" },
      ],
      caption:
        "A schema is a claim about the world: one row means one of something, and the keys say how things relate.",
      annotations: [
        "Decide the grain first. “One row per patient” and “one row per visit” answer different questions.",
        "Attributes belong to the entity they describe, or they will be duplicated and drift apart.",
        "Keys and constraints are what keep the model honest once real data arrives.",
      ],
    },
    {
      kind: "flow",
      steps: ["FROM", "WHERE", "GROUP BY", "SELECT"],
      caption:
        "SQL does not run in the order you write it. Filtering before and after grouping asks different questions.",
      annotations: [
        "Rows come in first. The FROM clause fixes the population you are querying.",
        "WHERE filters individual rows before grouping — it changes who is counted.",
        "Filtering after aggregation removes whole groups instead, which is a different claim entirely.",
      ],
    },
    {
      kind: "grid",
      cols: ["patient", "visits", "join out", "rows"],
      rows: 4,
      missing: [
        [1, 2],
        [3, 2],
      ],
      caption:
        "A join can silently change your population: rows multiply on the many side and vanish when a match is missing.",
      annotations: [
        "Start by knowing the row count you expect. Without that you cannot notice the join changed it.",
        "Missing matches drop rows on an inner join — the people who disappear are usually the interesting ones.",
        "Duplicated matches inflate counts, so a sum after a join can double-count without any error message.",
      ],
    },
    {
      kind: "bars",
      series: [
        { label: "raw", value: 118 },
        { label: "grouped", value: 122 },
        { label: "audited", value: 104 },
      ],
      truncatedFrom: 100,
      caption:
        "An aggregate is a summary of whatever rows survived. Audit the count before you report the average.",
      annotations: [
        "The headline number looks stable until you notice the axis does not start at zero.",
        "Compare against the full baseline, where the same three numbers tell a much calmer story.",
        "The difference between them is the audit: which rows were included, and which quietly were not.",
      ],
    },
  ],

  "data-visualization": [
    {
      kind: "chips",
      groups: [
        { label: "Compare", items: ["bar", "dot"] },
        { label: "Distribute", items: ["histogram", "box"] },
        { label: "Relate", items: ["scatter", "line"] },
        { label: "Part of whole", items: ["stacked", "pie"] },
      ],
      caption:
        "The chart type is an answer to a question. Pick the question first and the form follows.",
      annotations: [
        "Comparison across named groups wants length on a common baseline — that is a bar chart.",
        "Distribution questions need the spread, not one summary bar.",
        "Relationships need two encoded axes; part-of-whole only works when the parts really do sum to the whole.",
      ],
    },
    {
      kind: "bars",
      series: [
        { label: "A", value: 62 },
        { label: "B", value: 66 },
        { label: "C", value: 64 },
      ],
      truncatedFrom: 58,
      caption:
        "The same three numbers, twice. The left chart's drama comes entirely from where its axis starts.",
      annotations: [
        "A truncated axis magnifies small differences until they look decisive.",
        "On a full baseline the differences are real but modest — that is the honest comparison.",
        "Always locate the baseline before you read the gap between bars.",
      ],
    },
    {
      kind: "curve",
      interval: [0.32, 0.72],
      estimate: 0.52,
      xLabel: "estimated effect",
      caption:
        "A point estimate without its range invites a confidence the data does not support.",
      annotations: [
        "The curve is what the data supports — not one value, but a range with a shape.",
        "The band is the honest claim. Its width is the message as much as its centre.",
        "A single dot reported alone hides everything the band was telling you.",
      ],
    },
    {
      kind: "scales",
      claim: "Is this comparison fair?",
      support: ["same baseline", "same units"],
      against: ["cherry-picked window", "unequal groups"],
      caption:
        "Defending a chart means naming what makes the comparison fair — and what would break it.",
      annotations: [
        "State the choices that make the comparison legitimate: shared scale, shared units, shared period.",
        "State the choices that could be challenged, before someone else does.",
        "An honest chart survives having its own design decisions read out loud.",
      ],
    },
  ],

  "statistical-inference": [
    {
      kind: "curve",
      interval: [0.18, 0.44],
      estimate: 0.31,
      xLabel: "result if there were no real effect",
      caption:
        "A p-value answers one narrow question: how surprising is this result if nothing were going on?",
      annotations: [
        "The curve is the world where there is no effect. Everything is judged against that assumption.",
        "The shaded region is what counts as “at least this extreme” — that area is the p-value.",
        "It never tells you the probability that your hypothesis is true, or that the effect matters.",
      ],
    },
    {
      kind: "curve",
      interval: [0.28, 0.86],
      estimate: 0.57,
      xLabel: "effect size",
      caption:
        "A confidence interval is the set of effects the data cannot rule out — its width is the finding.",
      annotations: [
        "The point estimate is one plausible value, not the answer.",
        "The interval is what to report. A wide band means the study cannot distinguish small from large.",
        "Ask whether both ends of the interval would lead to the same decision. If not, you do not have an answer yet.",
      ],
    },
    {
      kind: "grid",
      cols: ["invited", "replied", "eligible", "counted"],
      rows: 4,
      missing: [
        [1, 1],
        [2, 1],
        [2, 2],
        [3, 3],
      ],
      caption:
        "A conclusion is about whoever survived to the last column, not about everyone you set out to study.",
      annotations: [
        "The intended population is the claim you want to make.",
        "Every drop-off between columns changes who the result is actually about.",
        "If the people who dropped out differ systematically, the estimate is biased no matter how large the sample.",
      ],
    },
    {
      kind: "distribution",
      xLabel: "difference between groups",
      bars: [2, 4, 8, 14, 19, 22, 18, 12, 7, 4, 2, 1],
      medianAt: 0.44,
      meanAt: 0.62,
      caption:
        "Noise alone produces differences. The question is whether this one is bigger than noise usually manages.",
      annotations: [
        "The bulk of the distribution is what chance produces when nothing real is happening.",
        "An observed difference has to be read against that spread, not against zero.",
        "Statistical significance and practical importance are separate questions; a real effect can still be too small to act on.",
      ],
    },
  ],

  "ml-foundations": [
    {
      kind: "flow",
      steps: ["train", "validate", "test once", "deploy"],
      caption:
        "A model is only judged on data it has never seen. Everything before that is fitting, not evidence.",
      annotations: [
        "Training accuracy measures memorisation as much as learning.",
        "Validation is where you tune — which is exactly why it stops being an honest estimate.",
        "The held-out test set is spent the first time you look at it. Reuse turns it into another validation set.",
      ],
    },
    {
      kind: "grid",
      cols: ["feature", "label", "leak?", "usable"],
      rows: 4,
      missing: [
        [0, 2],
        [2, 2],
        [3, 1],
        [3, 2],
      ],
      caption:
        "Model quality is bounded by data quality. Leakage and missing labels beat any amount of tuning.",
      annotations: [
        "Check what each feature really is, and whether it exists at prediction time.",
        "A feature that encodes the answer produces beautiful offline scores and fails in production.",
        "Missing or mislabelled rows set a ceiling no model architecture can lift.",
      ],
    },
    {
      kind: "network",
      shape: [3, 4, 2],
      labels: ["inputs", "model", "predicted / actual"],
      caption:
        "One accuracy number hides which errors you are making — and the two kinds usually cost different amounts.",
      annotations: [
        "The inputs decide what the model can possibly know.",
        "The model produces a score; the threshold you choose turns that score into a decision.",
        "False positives and false negatives are different harms. Pick the metric that matches the costlier one.",
      ],
    },
    {
      kind: "distribution",
      xLabel: "months since deployment",
      bars: [18, 17, 16, 15, 13, 12, 10, 9, 7, 6, 4, 3],
      medianAt: 0.16,
      meanAt: 0.52,
      caption:
        "The world moves after you ship. Performance decays quietly unless something is watching for it.",
      annotations: [
        "Launch performance is a single point in time, not a property of the model.",
        "The decline is usually gradual, which is why it needs monitoring rather than intuition.",
        "Decide the retraining trigger in advance, so the decision is not made under pressure.",
      ],
    },
  ],

  "systems-design": [
    {
      kind: "flow",
      steps: ["measure", "find the bottleneck", "fix that", "re-measure"],
      caption:
        "Scaling anything other than the bottleneck buys cost without buying throughput.",
      annotations: [
        "Measure before changing anything, or you will not be able to tell whether it helped.",
        "One resource is the constraint at any moment — CPU, I/O, locks, or a downstream service.",
        "After the fix the bottleneck moves. Re-measure rather than repeating the previous fix.",
      ],
    },
    {
      kind: "layers",
      layers: [
        { label: "Expensive to compute", note: "cache wins" },
        { label: "Stable for a while", note: "cache wins" },
        { label: "Read far more than written", note: "cache wins" },
        { label: "Changes constantly", note: "cache hurts" },
      ],
      caption:
        "Caching trades freshness for speed. It pays only where data is costly, stable, and read often.",
      annotations: [
        "Cost is the reason to cache — caching something cheap adds a layer and saves nothing.",
        "Stability is what makes the cached copy safe to serve.",
        "Read-heavy access is what makes the trade worth its invalidation complexity.",
      ],
    },
    {
      kind: "tree",
      root: "dependency call",
      branches: ["succeeds", "fails or hangs"],
      leaves: ["serve", "retry", "fall back", "shed load"],
      caption:
        "The happy path is the easy half. The design is in what happens when a dependency stops answering.",
      annotations: [
        "Design the success path, then stop treating it as the whole design.",
        "Failure includes slow, not just down — a hanging call ties up resources the whole system needs.",
        "Timeouts, fallbacks, and shedding are decisions to make now, not during the incident.",
      ],
    },
    {
      kind: "scales",
      claim: "Which design do we choose?",
      support: ["simpler to operate", "cheaper now"],
      against: ["harder to scale", "single region"],
      caption:
        "There is no best architecture, only one that fits the constraints you can actually name.",
      annotations: [
        "Name what the design gives you against the load you actually expect.",
        "Name the limits you are accepting, including the ones that appear later.",
        "A tradeoff you can state out loud is one the team can revisit when the constraints change.",
      ],
    },
  ],

  "critical-thinking": [
    {
      kind: "scales",
      claim: "Is the claim supported?",
      support: ["cited study", "plausible mechanism"],
      against: ["small sample", "no control group"],
      caption:
        "Split what is being asserted from what is offered as evidence, then weigh the evidence on its own.",
      annotations: [
        "State the claim in one sentence, in the form that could actually be false.",
        "List the evidence separately — confidence and repetition are not evidence.",
        "The verdict is about the balance of evidence, not about how appealing the conclusion is.",
      ],
    },
    {
      kind: "tree",
      root: "the argument",
      branches: ["the reasoning", "the conclusion"],
      leaves: ["premise", "leap", "appeal", "result"],
      caption:
        "Name the specific step that fails. “That's a fallacy” is a label, not an analysis.",
      annotations: [
        "Separate the argument's parts before judging it.",
        "The error lives in a particular move — usually the leap from premise to conclusion.",
        "A conclusion can still be true even when the argument for it is bad. Those are different questions.",
      ],
    },
    {
      kind: "grid",
      cols: ["source", "evidence", "method", "stake"],
      rows: 4,
      missing: [
        [1, 1],
        [1, 2],
        [3, 2],
      ],
      caption:
        "Evaluate what a source actually shows and how. Credentials and confidence are not findings.",
      annotations: [
        "Identify what evidence the source is offering, not just who is offering it.",
        "Method decides how much weight the evidence carries — gaps here matter more than tone.",
        "Interests do not make a source wrong, but they tell you what to check most carefully.",
      ],
    },
    {
      kind: "flow",
      steps: ["state the belief", "name the test", "set the threshold", "check it"],
      caption:
        "Deciding in advance what would change your mind is what separates a belief from a commitment.",
      annotations: [
        "Write the belief down while you can still state it plainly.",
        "Name the observation that would count against it — specifically enough to recognise.",
        "Fix the threshold before the data arrives, or you will move it afterwards without noticing.",
      ],
    },
  ],
};

export const fallbackDiagram: DiagramSpec = {
  kind: "flow",
  steps: ["read the idea", "see an example", "reason it out", "apply it"],
  caption:
    "Each skill follows the same loop: understand the idea, test it against a case, then use it on your own.",
  annotations: [
    "Start with what the idea claims, in plain language.",
    "Check it against a concrete case before trusting it.",
    "Then apply it somewhere new — that is what the mastery check measures.",
  ],
};
