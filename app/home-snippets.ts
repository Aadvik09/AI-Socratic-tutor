import type { Snippet } from "./code";

/* Each snippet is the shortest honest version of a real lesson in the library.
   The numbers in the output panes are the values the code actually produces. */

export const homeSnippets: Snippet[] = [
  {
    id: "centers",
    tab: "Which average?",
    lang: "python",
    filename: "length_of_stay.py",
    code: `stays = [1, 2, 2, 2, 3, 3, 4, 31, 44]   # days, one ward, one week

mean = sum(stays) / len(stays)
median = sorted(stays)[len(stays) // 2]

print(f"mean   {mean:.1f} days")
print(f"median {median:.1f} days")`,
    mark: [3, 4],
    output: [
      { label: "mean", value: "10.2 days" },
      { label: "median", value: "3.0 days" },
    ],
    note: "Two long stays out of nine move the mean by seven days. The median never notices them. That gap is why “the average stay” is not a finding until you say which average — and the lesson makes you defend the choice before it grades you.",
  },
  {
    id: "grouping",
    tab: "Where the filter sits",
    lang: "sql",
    filename: "admissions.sql",
    code: `SELECT ward, COUNT(*) AS admissions
FROM visits
WHERE age >= 65          -- filters patients, before grouping
GROUP BY ward
HAVING COUNT(*) > 20     -- filters wards, after counting
ORDER BY admissions DESC;`,
    mark: [3, 5],
    output: [
      { label: "Cardiology", value: "64" },
      { label: "Geriatrics", value: "58" },
      { label: "Respiratory", value: "31" },
    ],
    note: "WHERE runs before the grouping and HAVING runs after it. Move one condition between them and the query still succeeds, still returns a table, and answers a different question entirely.",
  },
  {
    id: "leakage",
    tab: "Did it learn, or memorise?",
    lang: "python",
    filename: "evaluate.py",
    code: `X_train, X_test, y_train, y_test = split(data, test_size=0.2)

model.fit(X_train, y_train)

print("train", round(model.score(X_train, y_train), 2))
print("test ", round(model.score(X_test, y_test), 2))`,
    mark: [5],
    output: [
      { label: "train", value: "0.99" },
      { label: "test", value: "0.71" },
    ],
    note: "A model scoring 0.99 on rows it has seen and 0.71 on rows it has not did not learn the pattern — it learned the rows. Only the second number is evidence, and it is only evidence the first time you look at it.",
  },
];
