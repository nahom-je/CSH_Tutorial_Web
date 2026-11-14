// seed_exam_data.js — Seed all 6 Exam Subjects & 151 Authentic Exam Questions into Supabase
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const EXAM_SUBJECTS = [
  {
    code: "MATH-1011",
    title: "Mathematics",
    field: "Both",
    duration_minutes: 90,
    question_count: 24,
  },
  {
    code: "PHYS-1011",
    title: "General Physics",
    field: "Natural",
    duration_minutes: 60,
    question_count: 19,
  },
  {
    code: "PHIL-1011",
    title: "Logic and Critical Thinking",
    field: "Both",
    duration_minutes: 40,
    question_count: 25,
  },
  {
    code: "PSYC-1011",
    title: "General Psychology",
    field: "Both",
    duration_minutes: 30,
    question_count: 33,
  },
  {
    code: "GEOG-1011",
    title: "Geography",
    field: "Both",
    duration_minutes: 40,
    question_count: 30,
  },
  {
    code: "ECON-1011",
    title: "General Economics",
    field: "Social",
    duration_minutes: 40,
    question_count: 20,
  },
];

// --- 1. MATHEMATICS (24 Qs) ---
export const MATH_QUESTIONS = [
  {
    question_number: 1,
    question_text: "Suppose p ⇒ (r ∨ ¬q) is false, then which one of the following is true?",
    options: [
      { id: "A", text: "q ⇔ r" },
      { id: "B", text: "¬p ∨ r" },
      { id: "C", text: "p ⇒ r" },
      { id: "D", text: "r ⇒ q" }
    ],
    correct_option: "D",
    explanation: "p ⇒ (r ∨ ¬q) is false means p is True and (r ∨ ¬q) is False, so r is False and q is True. Then r ⇒ q is False ⇒ True, which is True.",
    needs_review: true // Fixed from original key A to D
  },
  {
    question_number: 2,
    question_text: "Which one of the following propositions is a Tautology?",
    options: [
      { id: "A", text: "(p ∨ q) ⇒ (q ∧ r)" },
      { id: "B", text: "(p ∧ q) ⇒ (q ∨ r)" },
      { id: "C", text: "(p ∨ q) ⇒ (q ⇒ r)" },
      { id: "D", text: "None" }
    ],
    correct_option: "B",
    explanation: "If (p ∧ q) is True, q must be True, making (q ∨ r) True. Thus (p ∧ q) ⇒ (q ∨ r) is always True."
  },
  {
    question_number: 3,
    question_text: "Let p, q and r have truth value F, T and T respectively, then which of the following compound statements has truth value true?",
    options: [
      { id: "A", text: "(p ∧ q) ⇔ (r ⇒ (p ∧ ¬r))" },
      { id: "B", text: "(p ∨ q) ⇒ (¬p ⇒ ¬r)" },
      { id: "C", text: "(¬p ∧ q) ⇔ (r ⇒ (p ∧ ¬r))" },
      { id: "D", text: "(¬p ∧ q) ⇔ (p ∧ ¬r)" }
    ],
    correct_option: "A",
    explanation: "(p ∧ q) is False. r ⇒ (p ∧ ¬r) is True ⇒ False, which is False. False ⇔ False is True."
  },
  {
    question_number: 4,
    question_text: "If ¬p ⇒ r is false and p ⇔ q is true, then which one of the following has truth value True?",
    options: [
      { id: "A", text: "p ∧ (¬q ∧ r)" },
      { id: "B", text: "¬p ⇒ (q ∨ r)" },
      { id: "C", text: "p ⇔ (q ⇒ r)" },
      { id: "D", text: "¬p ∧ (q ⇒ r)" }
    ],
    correct_option: "D",
    explanation: "¬p ⇒ r is false means ¬p is True (so p is False) and r is False. p ⇔ q is True means q is False. Then ¬p is True and (q ⇒ r) is False ⇒ False (True). Thus ¬p ∧ (q ⇒ r) is True.",
    needs_review: true
  },
  {
    question_number: 5,
    question_text: "If the truth value of p ⇒ (q ∧ ¬p) is false, then which of the following propositions has truth value true?",
    options: [
      { id: "A", text: "(p ∧ ¬q) ∧ q" },
      { id: "B", text: "(¬p ∨ q) ∧ ¬p" },
      { id: "C", text: "¬p ⇔ (q ⇒ p)" },
      { id: "D", text: "¬q ⇒ (p ∨ ¬q)" }
    ],
    correct_option: "D",
    explanation: "p ⇒ (q ∧ ¬p) false means p is True and (q ∧ ¬p) is False. Since p is True, p ∨ ¬q is always True, so ¬q ⇒ (p ∨ ¬q) is True."
  },
  {
    question_number: 6,
    question_text: "Which one of the following is true?",
    options: [
      { id: "A", text: "(∀x ∈ ℕ)(∃y ∈ ℕ)(xy = 1)" },
      { id: "B", text: "(∃x ∈ ℝ)(∀y ∈ ℝ)(x + y = y)" },
      { id: "C", text: "(∀x ∈ ℝ)(∃y ∈ ℝ)(xy = 2)" },
      { id: "D", text: "(∀x ∈ ℕ)(∀y ∈ ℕ)(x ≠ y ⇒ x < y)" }
    ],
    correct_option: "B",
    explanation: "For x = 0 ∈ ℝ, 0 + y = y for every y ∈ ℝ (additive identity)."
  },
  {
    question_number: 7,
    question_text: "Which of the following compound propositions is a contradiction?",
    options: [
      { id: "A", text: "(p ⇒ q) ⇔ (¬q ⇒ ¬p)" },
      { id: "B", text: "[(¬p ∨ q) ⇒ (p ∧ ¬q)] ∧ [(p ∧ ¬q) ⇒ (¬p ∨ q)]" },
      { id: "C", text: "¬(p ⇒ q) ∨ (¬p ∨ q)" },
      { id: "D", text: "All of the above" }
    ],
    correct_option: "B",
    explanation: "Notice (p ∧ ¬q) is the exact negation of (¬p ∨ q). An equivalence between a statement and its negation (A ⇔ ¬A) is a contradiction."
  },
  {
    question_number: 8,
    question_text: "Let U = the set of natural numbers, P(x): x is a prime number, Q(x): x is a composite number, and E(x): x is an even number. Then which of the following has truth value false?",
    options: [
      { id: "A", text: "(∃x)[P(x) ∧ ¬Q(x)]" },
      { id: "B", text: "(∀x)[P(x) ⇒ ¬E(x)]" },
      { id: "C", text: "(∀x)[Q(x) ⇒ ¬P(x)]" },
      { id: "D", text: "(∃x)[¬P(x) ∧ ¬Q(x)]" }
    ],
    correct_option: "B",
    explanation: "2 is a prime number and even, so P(2) ⇒ ¬E(2) is True ⇒ False, which is False.",
    needs_review: true
  },
  {
    question_number: 9,
    question_text: "For the proposition: \"If a triangle ABC is a right triangle, then |AB|² + |BC|² = |AC|²\". Which of the following is not true?",
    options: [
      { id: "A", text: "The converse is: If |AB|² + |BC|² = |AC|², then triangle ABC is a right triangle." },
      { id: "B", text: "The contrapositive is: If |AB|² + |BC|² ≠ |AC|², then triangle ABC is not a right triangle." },
      { id: "C", text: "The negation is: If a triangle ABC is not a right triangle, then |AB|² + |BC|² < or > |AC|²." },
      { id: "D", text: "The inverse is: If triangle ABC is not a right triangle, then |AB|² + |BC|² ≠ |AC|²." }
    ],
    correct_option: "C",
    explanation: "The negation of p ⇒ q is p ∧ ¬q, not another conditional statement.",
    needs_review: true
  },
  {
    question_number: 10,
    question_text: "Which of the following statements is neither a tautology nor a contradiction?",
    options: [
      { id: "A", text: "p ⇒ (q ∨ p)" },
      { id: "B", text: "((p ⇒ q) ∧ (p ⇒ r)) ⇒ (p ⇒ r)" },
      { id: "C", text: "(p ∧ (p ⇒ q)) ⇒ q" },
      { id: "D", text: "(q ∨ ¬q) ⇒ (q ∧ p)" }
    ],
    correct_option: "D",
    explanation: "(q ∨ ¬q) is True, so (q ∨ ¬q) ⇒ (q ∧ p) reduces to (q ∧ p), which is a contingency."
  },
  {
    question_number: 11,
    question_text: "Which of the following pairs of propositions are not logically equivalent?",
    options: [
      { id: "A", text: "p ⇒ (q ∨ r) and ¬q ⇒ (¬p ∨ r)" },
      { id: "B", text: "(p ∨ q) ⇒ r and (p ⇒ q) ∧ (q ⇒ r)" },
      { id: "C", text: "p ⇒ (q ∨ r) and (¬r) ⇒ (p ⇒ q)" },
      { id: "D", text: "p ∧ (¬q ∧ ¬r) and ¬(p ⇒ (q ∨ r))" }
    ],
    correct_option: "B",
    explanation: "(p ∨ q) ⇒ r is equivalent to (p ⇒ r) ∧ (q ⇒ r), not (p ⇒ q) ∧ (q ⇒ r).",
    needs_review: true
  },
  {
    question_number: 12,
    question_text: "Which one of the following statements is true?",
    options: [
      { id: "A", text: "(∀x ∈ ℝ)(∃y ∈ ℝ)(x + y = y)" },
      { id: "B", text: "(∃x ∈ ℝ)(∀y ∈ ℝ)(x + y = 10)" },
      { id: "C", text: "(∀x ∈ ℝ)(√x² = x)" },
      { id: "D", text: "(∀x ∈ ℝ)(∃y ∈ ℝ)(x + y = 10)" }
    ],
    correct_option: "D",
    explanation: "For any real number x, choose y = 10 − x ∈ ℝ, then x + y = 10."
  },
  {
    question_number: 13,
    question_text: "\"If Solomon is healthy or rich, then he is happy.\" Then the contrapositive of the above statement is:",
    options: [
      { id: "A", text: "If Solomon is not happy, then he is neither healthy nor rich." },
      { id: "B", text: "If Solomon is not happy, then he is either healthy or rich." },
      { id: "C", text: "If Solomon is not healthy and not rich, then he is not happy." },
      { id: "D", text: "If Solomon is happy, then he is either healthy or rich." }
    ],
    correct_option: "A",
    explanation: "p: Solomon is healthy or rich (H ∨ R). q: he is happy. Contrapositive: ¬q ⇒ ¬(H ∨ R) ≡ ¬q ⇒ (¬H ∧ ¬R).",
    needs_review: true
  },
  {
    question_number: 14,
    question_text: "Suppose that the statements p, q, r, and s are assigned the truth values T, F, F, and T respectively. Then which of the following statements has truth value false?",
    options: [
      { id: "A", text: "(p ∨ r) ⇔ (r ∧ ¬s)" },
      { id: "B", text: "(q ∧ ¬s) ⇒ (p ⇔ s)" },
      { id: "C", text: "(s ⇔ p) ⇒ (¬p ∨ s)" },
      { id: "D", text: "(r ∧ s) ⇒ (p ⇒ (¬q ∨ s))" }
    ],
    correct_option: "A",
    explanation: "(p ∨ r) is True. (r ∧ ¬s) is False. True ⇔ False is False."
  },
  {
    question_number: 15,
    question_text: "Let U = {3, 5, 11} be the universal set. Which one of the following is true?",
    options: [
      { id: "A", text: "¬(∃x)(∃y)(xy − 2 is composite)" },
      { id: "B", text: "¬(∀x)(∀y)(xy − 2 is prime)" },
      { id: "C", text: "(∀x)(∃y)(x/y < 1)" },
      { id: "D", text: "(∃x)(∀y)(x/y > 1)" }
    ],
    correct_option: "B",
    explanation: "For x = 3, y = 11, xy − 2 = 33 − 2 = 31 (prime), but for x = 3, y = 3, 3(3) − 2 = 7 (prime). For x = 11, y = 11, 121 − 2 = 119 = 7 × 17 (composite!). Thus not all are prime."
  },
  {
    question_number: 16,
    question_text: "Let U = {1, 2, 3} be the universal set. Which one of the following is not true?",
    options: [
      { id: "A", text: "(∃x)(∀y)(x² + 2y < 10)" },
      { id: "B", text: "(∃x)(∃y)(x² + 2y < 10)" },
      { id: "C", text: "(∀x)(∃y)(x² + 2y < 12)" },
      { id: "D", text: "(∃x)(∃y)(x² + y² < 2xy)" }
    ],
    correct_option: "D",
    explanation: "x² + y² ≥ 2xy for all real numbers, so x² + y² < 2xy is impossible.",
    needs_review: true
  },
  {
    question_number: 17,
    question_text: "Which one of the following is true?",
    options: [
      { id: "A", text: "(∀x ∈ ℕ)(x < x²)" },
      { id: "B", text: "(∀x ∈ ℝ)(x < x²)" },
      { id: "C", text: "(∀x ∈ ℕ)((x − 1)/(x − 1) = 1)" },
      { id: "D", text: "(∀x ∈ ℕ)(√x² = x)" }
    ],
    correct_option: "D",
    explanation: "For all natural numbers x ∈ ℕ, x ≥ 1 > 0, so √x² = |x| = x."
  },
  {
    question_number: 18,
    question_text: "Which of the following compound propositions is a contradiction?",
    options: [
      { id: "A", text: "(p ∧ q) ∨ (¬p ∧ ¬q)" },
      { id: "B", text: "(p ∧ ¬p) ∨ (q ∧ ¬q)" },
      { id: "C", text: "(p → q) ∧ (¬p → ¬q)" },
      { id: "D", text: "(p ∨ q) ∧ (¬p ∨ ¬q)" }
    ],
    correct_option: "B",
    explanation: "(p ∧ ¬p) is False, and (q ∧ ¬q) is False. False ∨ False is always False."
  },
  {
    question_number: 19,
    question_text: "Which of the following compound propositions is a tautology?",
    options: [
      { id: "A", text: "(p ∨ q) ∧ (¬p ∨ ¬q)" },
      { id: "B", text: "(p ∨ q) ∨ ¬(p ∨ q)" },
      { id: "C", text: "p ∨ (q ∧ ¬q)" },
      { id: "D", text: "(p → q) ∨ (¬q → ¬p)" }
    ],
    correct_option: "B",
    explanation: "A ∨ ¬A is the law of excluded middle, always True (Tautology).",
    needs_review: true
  },
  {
    question_number: 20,
    question_text: "What is the negation of the compound proposition (p → (q ∨ r))?",
    options: [
      { id: "A", text: "(¬p ∧ ¬q) ∨ r" },
      { id: "B", text: "p ∧ (¬q ∧ ¬r)" },
      { id: "C", text: "(¬p ∨ q) ∧ ¬r" },
      { id: "D", text: "¬p ∨ (¬q ∧ ¬r)" }
    ],
    correct_option: "B",
    explanation: "¬(A → B) ≡ A ∧ ¬B. Here B = (q ∨ r), so ¬B = (¬q ∧ ¬r). Thus p ∧ (¬q ∧ ¬r)."
  },
  {
    question_number: 21,
    question_text: "Which of the following best differentiates a proposition from a sentence?",
    options: [
      { id: "A", text: "A proposition must be a declarative sentence with a definite truth value." },
      { id: "B", text: "A proposition must include at least one logical connective." },
      { id: "C", text: "A sentence is a type of proposition with uncertain truth value." },
      { id: "D", text: "Every proposition is a question or a command." }
    ],
    correct_option: "A",
    explanation: "A proposition is a declarative sentence that is either true or false, but not both."
  },
  {
    question_number: 22,
    question_text: "Evaluate the truth value of (p ∧ q) → (p ∨ s), where p is true and s is false.",
    options: [
      { id: "A", text: "True" },
      { id: "B", text: "False" },
      { id: "C", text: "Can't be determined" },
      { id: "D", text: "True only if q is true." }
    ],
    correct_option: "A",
    explanation: "Since p is true, (p ∨ s) is True. Any conditional with a True conclusion (→ True) has truth value True."
  },
  {
    question_number: 23,
    question_text: "Evaluate the truth value of ∀x∃y∀z(x + y = z), where x, y, z ∈ ℝ.",
    options: [
      { id: "A", text: "True" },
      { id: "B", text: "False" },
      { id: "C", text: "Can't be determined" },
      { id: "D", text: "True only if z = x + y." }
    ],
    correct_option: "B",
    explanation: "A single chosen y cannot satisfy x + y = z for EVERY possible real number z."
  },
  {
    question_number: 24,
    question_text: "Identify the hypothesis and conclusion in the argument: \"If it rains, the ground will be wet. It is raining. Therefore, the ground is wet.\"",
    options: [
      { id: "A", text: "Hypothesis: \"It is raining.\" Conclusion: \"The ground will be wet.\"" },
      { id: "B", text: "Hypothesis: \"If it rains, the ground will be wet.\" Conclusion: \"It is raining.\"" },
      { id: "C", text: "Hypothesis: \"If it rains, the ground will be wet\" and \"It is raining.\" Conclusion: \"The ground will be wet.\"" },
      { id: "D", text: "Hypothesis: \"The ground is wet.\" Conclusion: \"It is raining.\"" }
    ],
    correct_option: "C",
    explanation: "The premises (hypotheses) are the given conditional and affirmation, and the conclusion is 'the ground is wet'."
  }
];

// --- 2. GENERAL PHYSICS (19 Qs) ---
export const PHYS_QUESTIONS = [
  {
    question_number: 1,
    question_text: "Which one of the following statements is not true?",
    options: [
      { id: "A", text: "Physical property is intrinsic in nature." },
      { id: "B", text: "Unit of measure is intrinsic to natural phenomena." },
      { id: "C", text: "Accuracy does not mean exact measurement." },
      { id: "D", text: "Precision refers to uncertainty in measuring." },
      { id: "E", text: "None." }
    ],
    correct_option: "B",
    explanation: "Units of measurement are human-defined conventions, not intrinsic natural phenomena."
  },
  {
    question_number: 2,
    question_text: "A student uses a meterstick to measure the thickness of a textbook and obtains 4.3 ± 0.1 cm. Other students use vernier calipers and obtain: (a) 4.32 ± 0.01 cm, (b) 4.31 ± 0.01 cm, (c) 4.24 ± 0.01 cm, and (d) 4.43 ± 0.01 cm. Which measurement will not agree with the first student's result?",
    options: [
      { id: "A", text: "(a)" },
      { id: "B", text: "(b)" },
      { id: "C", text: "(c)" },
      { id: "D", text: "(d)" },
      { id: "E", text: "None of the above." }
    ],
    correct_option: "D",
    explanation: "The first student's range is [4.20, 4.40] cm. Measurement (d) is 4.43 cm, which lies outside this uncertainty interval."
  },
  {
    question_number: 3,
    question_text: "The number of significant figures in 0.00150 is:",
    options: [
      { id: "A", text: "2" },
      { id: "B", text: "3" },
      { id: "C", text: "4" },
      { id: "D", text: "5" },
      { id: "E", text: "None." }
    ],
    correct_option: "B",
    explanation: "Leading zeros are placeholders; 1, 5, and the trailing 0 after the decimal are significant (3 figures: 1, 5, 0)."
  },
  {
    question_number: 4,
    question_text: "Measurement of two physical quantities, along with the precision of their respective measuring instruments, is: A = (2.5 ± 0.5) m/s and B = (0.10 ± 0.01) s. The value of AB will be:",
    options: [
      { id: "A", text: "(0.25 ± 0.135) m" },
      { id: "B", text: "(0.25 ± 0.08) m" },
      { id: "C", text: "(0.25 ± 0.05) m" },
      { id: "D", text: "(0.25 ± 0.5) m" }
    ],
    correct_option: "B",
    explanation: "AB = 0.25. Relative uncertainty: ΔA/A + ΔB/B = 0.5/2.5 + 0.01/0.10 = 0.20 + 0.10 = 0.30. Δ(AB) = 0.25 × 0.30 = 0.075 ≈ 0.08 m."
  },
  {
    question_number: 5,
    question_text: "Which statement about measurement is true?",
    options: [
      { id: "A", text: "Accuracy is closeness to the exact value in physical measurements." },
      { id: "B", text: "Unit of measure is an intrinsic natural phenomenon." },
      { id: "C", text: "Random error arises from instruments, while systematic error comes from unexpected environmental factors." },
      { id: "D", text: "A precise instrument consistently gives the same measurement under the same conditions, minimizing random errors and offering high reproducibility." }
    ],
    correct_option: "D",
    explanation: "A precise instrument provides high repeatability/reproducibility with minimal random variation.",
    needs_review: true // Both A and D are arguably true; D retained per key
  },
  {
    question_number: 6,
    question_text: "Which of the following statements about significant figures is not true?",
    options: [
      { id: "A", text: "Trailing zeros in a number without a decimal point are always significant." },
      { id: "B", text: "A change of unit of measurement cannot change the number of significant figures." },
      { id: "C", text: "All non-zero digits are significant." },
      { id: "D", text: "Zeros between two non-zero digits are significant." }
    ],
    correct_option: "A",
    explanation: "Trailing zeros in a whole number without a decimal point (e.g. 500) are ambiguous and generally not considered significant."
  },
  {
    question_number: 7,
    question_text: "Which of the following units is not an SI base unit?",
    options: [
      { id: "A", text: "Kilogram (kg)" },
      { id: "B", text: "Ampere (A)" },
      { id: "C", text: "Joule (J)" },
      { id: "D", text: "Meter (m)" }
    ],
    correct_option: "C",
    explanation: "Joule is a derived unit (kg·m²/s²), whereas kg, A, and m are base units."
  },
  {
    question_number: 8,
    question_text: "The length of the path travelled by an object in a given interval of time is:",
    options: [
      { id: "A", text: "Distance" },
      { id: "B", text: "Displacement" },
      { id: "C", text: "Speed" },
      { id: "D", text: "Velocity" }
    ],
    correct_option: "A",
    explanation: "Distance is the total length of the path traveled, whereas displacement is the change in position."
  },
  {
    question_number: 9,
    question_text: "Which statement is true about dimensional analysis in physics?",
    options: [
      { id: "A", text: "If an equation is dimensionally correct, then it must be true." },
      { id: "B", text: "If an equation is not dimensionally correct, then it cannot be true." },
      { id: "C", text: "Dimensions cannot be treated as algebraic quantities." },
      { id: "D", text: "Dimensional analysis can provide an exact solution to physics problems completely." },
      { id: "E", text: "None." }
    ],
    correct_option: "B",
    explanation: "Dimensional consistency is a necessary condition for an equation to be physically valid. If dimensions do not match, it cannot be true."
  },
  {
    question_number: 10,
    question_text: "Which of the following is not an application of dimensional analysis?",
    options: [
      { id: "A", text: "Conversion of one system of units into another system." },
      { id: "B", text: "Checking the dimensional balance of an equation." },
      { id: "C", text: "Establishing relationships among various physical quantities." },
      { id: "D", text: "Finding the value of the dimensional constant." }
    ],
    correct_option: "D",
    explanation: "Dimensionless or dimensional numerical proportionality constants cannot be determined by dimensional analysis alone."
  },
  {
    question_number: 11,
    question_text: "Which pair of physical quantities does not have the same dimensional formula?",
    options: [
      { id: "A", text: "Angular momentum and Planck's constant." },
      { id: "B", text: "Impulse and linear momentum." },
      { id: "C", text: "Tension and surface tension." },
      { id: "D", text: "Work and torque." }
    ],
    correct_option: "C",
    explanation: "Tension is a force [M L T⁻²], while surface tension is force per unit length [M T⁻²]."
  },
  {
    question_number: 12,
    question_text: "A vector lies in the second quadrant of the xy-plane, with its tail at the origin. What can you conclude about its components?",
    options: [
      { id: "A", text: "Both components are positive." },
      { id: "B", text: "The x-component is positive, while the y-component is negative." },
      { id: "C", text: "The x-component is negative, while the y-component is positive." },
      { id: "D", text: "Both components are negative." },
      { id: "E", text: "Impossible to judge." }
    ],
    correct_option: "C",
    explanation: "In quadrant II, x < 0 and y > 0."
  },
  {
    question_number: 13,
    question_text: "If |A + B| = |A| + |B| and neither A nor B is zero, then:",
    options: [
      { id: "A", text: "A and B are parallel and in opposite directions." },
      { id: "B", text: "A is perpendicular to B." },
      { id: "C", text: "A and B are opposite." },
      { id: "D", text: "A and B are parallel and in the same direction." },
      { id: "E", text: "None of the above." }
    ],
    correct_option: "D",
    explanation: "|A + B| equals |A| + |B| only when the angle between them is 0° (parallel in the same direction)."
  },
  {
    question_number: 14,
    question_text: "Which of the following is a unit vector?",
    options: [
      { id: "A", text: "i + j" },
      { id: "B", text: "(1/√2)i + 2j" },
      { id: "C", text: "i + (1/√2)j" },
      { id: "D", text: "(1/√2)i + (1/√2)j" }
    ],
    correct_option: "D",
    explanation: "|v| = √((1/√2)² + (1/√2)²) = √(1/2 + 1/2) = √1 = 1."
  },
  {
    question_number: 15,
    question_text: "A line makes angles α, β and γ with the x-, y- and z-axes, respectively. Then sin²α + sin²β + sin²γ equals:",
    options: [
      { id: "A", text: "1" },
      { id: "B", text: "−1" },
      { id: "C", text: "0" },
      { id: "D", text: "2" }
    ],
    correct_option: "D",
    explanation: "cos²α + cos²β + cos²γ = 1. Therefore sin²α + sin²β + sin²γ = (1 − cos²α) + (1 − cos²β) + (1 − cos²γ) = 3 − 1 = 2."
  },
  {
    question_number: 16,
    question_text: "If a = i + j + k, b = 2i − j + 3k and c = i − 2j + k, a unit vector parallel to 2a − b + 3c is:",
    options: [
      { id: "A", text: "(1/√22)(9i − 3j + k)" },
      { id: "B", text: "(1/√22)(i − 3j + 2k)" },
      { id: "C", text: "(1/√22)(3i − 3j − 2k)" },
      { id: "D", text: "(1/√22)(3i − 3j + 2k)" }
    ],
    correct_option: "D",
    explanation: "2a − b + 3c = 2(i+j+k) − (2i−j+3k) + 3(i−2j+k) = (2−2+3)i + (2+1−6)j + (2−3+3)k = 3i − 3j + 2k. Magnitude = √(9+9+4) = √22."
  },
  {
    question_number: 17,
    question_text: "Which of the following is true when two vectors are added using the triangle method?",
    options: [
      { id: "A", text: "The resultant vector lies along the line connecting the tail of the first vector to the head of the second vector." },
      { id: "B", text: "The magnitude of the sum is always the same as the sum of the magnitudes of the vectors." },
      { id: "C", text: "The resultant vector is the diagonal of the parallelogram formed by the two vectors." },
      { id: "D", text: "The direction of the resultant vector depends only on the direction of the first vector." }
    ],
    correct_option: "A",
    explanation: "In the head-to-tail triangle rule, the resultant connects the tail of the first to the head of the second vector."
  },
  {
    question_number: 18,
    question_text: "If the displacement of an object is represented by vector d, what is the correct way to find its x- and y-components, when θ is measured from the positive x-axis?",
    options: [
      { id: "A", text: "dₓ = d sin θ, d_y = d cos θ" },
      { id: "B", text: "dₓ = d cos θ, d_y = d cos θ" },
      { id: "C", text: "dₓ = d cos θ, d_y = d sin θ" },
      { id: "D", text: "dₓ = d tan θ, d_y = d cot θ" }
    ],
    correct_option: "C",
    explanation: "By trigonometry, adjacent component is d cos θ and vertical is d sin θ."
  },
  {
    question_number: 19,
    question_text: "In two-dimensional motion, the velocity vector of an object can be expressed as:",
    options: [
      { id: "A", text: "The product of its horizontal and vertical velocity components." },
      { id: "B", text: "The difference between the horizontal and vertical velocity components." },
      { id: "C", text: "The square of its horizontal and vertical components." },
      { id: "D", text: "The sum (vector addition) of its horizontal and vertical velocity components." }
    ],
    correct_option: "D",
    explanation: "v = v_x i + v_y j, which is the vector sum of its rectangular components."
  }
];

// --- 3. LOGIC AND CRITICAL THINKING (25 Qs) ---
export const LOGIC_QUESTIONS = [
  {
    question_number: 1,
    question_text: "According to the ancient Greek etymological definition of philosophy, what does the term \"Sophia\" (wisdom) specifically exclude, and what does it encompass?",
    options: [
      { id: "A", text: "It excludes speculative religious thought and encompasses only empirical scientific methods." },
      { id: "B", text: "It excludes theoretical mathematics and encompasses practical civic duties and law." },
      { id: "C", text: "It excludes technical skills and encompasses truth and theoretical knowledge of any sort." },
      { id: "D", text: "It excludes traditional customs and encompasses experimental observation and data collection." }
    ],
    correct_option: "C",
    explanation: "Sophia refers to truth and theoretical knowledge of any sort, excluding technical skills."
  },
  {
    question_number: 2,
    question_text: "Which of the following best explains the historical relationship between philosophy and specialized empirical sciences such as physics and psychology?",
    options: [
      { id: "A", text: "Philosophy originally encompassed all systematic searches for knowledge until disciplines developed their own experimental techniques starting in the 16th century." },
      { id: "B", text: "Specialized sciences originated independently of philosophy and later merged into it during the 16th century." },
      { id: "C", text: "Philosophy was created in the 16th century by Galileo, Newton, and Kepler to unify mathematics and natural astronomy." },
      { id: "D", text: "Psychology was the very first discipline to leave philosophy, followed much later by physics and astronomy." }
    ],
    correct_option: "A",
    explanation: "All systematic knowledge belonged to philosophy; from the 16th century, disciplines like physics and astronomy developed their own experimental techniques and 'left home.'"
  },
  {
    question_number: 3,
    question_text: "How does the \"formal sense\" of philosophy (\"doing\" philosophy) fundamentally differ from the \"informal sense\" (\"having\" a philosophy)?",
    options: [
      { id: "A", text: "The formal sense relies on uncritically held personal attitudes, whereas the informal sense relies on empirical data." },
      { id: "B", text: "The formal sense accepts common sense as the ultimate reality, whereas the informal sense rejects all sensory perception." },
      { id: "C", text: "The informal sense is restricted to academic philosophers, whereas the formal sense applies to everyday personal opinions." },
      { id: "D", text: "The informal sense involves a set of views often held uncritically, whereas the formal sense is a reflective, critical process of examining deeply held conceptions." }
    ],
    correct_option: "D",
    explanation: "'Having' a philosophy is holding uncritical personal views; 'doing' philosophy is the critical, reflective examination of deeply held beliefs."
  },
  {
    question_number: 4,
    question_text: "In Plato's Symposium and the analogy of the \"cover and yolk of the egg,\" what philosophical principle is illustrated regarding human perception?",
    options: [
      { id: "A", text: "Sense perception provides complete access to the fundamental reality of human emotions like love." },
      { id: "B", text: "Common sense perception represents the superficial \"cover,\" while philosophy penetrates beyond apparent perceptions to uncover ultimate reality." },
      { id: "C", text: "Apparent justifications for love, such as physical beauty, are identical to the ultimate instinct for eternity through offspring." },
      { id: "D", text: "Philosophy must remain confined to the apparent world because ultimate reality is entirely unknowable." }
    ],
    correct_option: "B",
    explanation: "Just as one must pass the shell of an egg to reach the yolk, philosophy passes beyond apparent sense perceptions to uncover ultimate reality."
  },
  {
    question_number: 5,
    question_text: "According to Bertrand Russell, what is the primary consequence for a person who has \"no tincture of philosophy\"?",
    options: [
      { id: "A", text: "They become overly skeptical of scientific laws and experimental discoveries." },
      { id: "B", text: "They develop an overly fragmented worldview due to excessive specialization in logic and language analysis." },
      { id: "C", text: "They remain imprisoned in prejudices derived from common sense, habitual beliefs of their age or nation, and unexamined convictions." },
      { id: "D", text: "They abandon all religious and historical traditions in favor of pure rationalism." }
    ],
    correct_option: "C",
    explanation: "Without philosophy, a person is imprisoned in prejudices from common sense, habitual beliefs, and unreasoned convictions."
  },
  {
    question_number: 6,
    question_text: "What distinguishes the philosopher's synoptic worldview from the perspectives of a scientist, businessperson, or artist?",
    options: [
      { id: "A", text: "The philosopher attempts to integrate the conclusions of various sciences and human experiences into a consistent, overall view of life as a totality." },
      { id: "B", text: "The philosopher rejects scientific conclusions in order to construct a purely speculative worldview." },
      { id: "C", text: "The philosopher focuses exclusively on isolated fragments of human experience to avoid the dangers of generalization." },
      { id: "D", text: "The philosopher prioritizes economic and aesthetic values over historical and religious inquiries." }
    ],
    correct_option: "A",
    explanation: "Unlike specialists who look at fragments, philosophy integrates insights into a consistent worldview of life as a totality."
  },
  {
    question_number: 7,
    question_text: "Why is the content of philosophy better understood as \"asking the right questions\" rather than \"providing the correct answers\"?",
    options: [
      { id: "A", text: "Because philosophical questions are linguistically meaningless and cannot generate coherent theories." },
      { id: "B", text: "Because empirical sciences have already answered all fundamental questions about existence, value, and truth." },
      { id: "C", text: "Because philosophers refuse to formulate systematic theories or take definitive intellectual positions." },
      { id: "D", text: "Because philosophy consists of perennial problems for which the ongoing attempt to find solutions gives rise to diverse systems of thought like idealism, realism, and pragmatism." }
    ],
    correct_option: "D",
    explanation: "Philosophy is a group of perennial problems; attempting to answer them generates major systems of thought."
  },
  {
    question_number: 8,
    question_text: "How did the term \"Metaphysics\" acquire its name, and what is its literal meaning?",
    options: [
      { id: "A", text: "Aristotle coined it from Greek words meaning \"beyond nature\" to describe his theory of evolution." },
      { id: "B", text: "Aristotle's editor, Andronicus of Rhodes, named it from Greek words meaning \"those things after the physics\" because those writings followed Aristotle's treatise on physics." },
      { id: "C", text: "Plato invented the term to distinguish the study of physical matter from the study of mathematical forms." },
      { id: "D", text: "Ancient Greek theologians used it to refer exclusively to the study of divine attributes and creation." }
    ],
    correct_option: "B",
    explanation: "Andronicus of Rhodes placed Aristotle's writings on 'first philosophy' after his Physics, naming them meta physika."
  },
  {
    question_number: 9,
    question_text: "Why are metaphysical questions considered the most basic questions in philosophy?",
    options: [
      { id: "A", text: "Because they are the easiest questions to verify through sensory observation and laboratory experiments." },
      { id: "B", text: "Because they deal solely with the grammatical clarification of ordinary language." },
      { id: "C", text: "Because they provide the irreducible foundation of reality and \"first principles\" upon which all other branches of philosophy and subsequent inquiry are based." },
      { id: "D", text: "Because they resolve all moral and political disputes without requiring ethical theory." }
    ],
    correct_option: "C",
    explanation: "Metaphysics seeks an irreducible foundation of reality, the 'first principles' of all other inquiry."
  },
  {
    question_number: 10,
    question_text: "Which of the following pairs of questions belongs strictly to the Cosmological aspect of metaphysics rather than the Anthropological or Theological aspects?",
    options: [
      { id: "A", text: "\"What is time; is its existence subjective or objective?\" and \"Did the universe come about by accident or design?\"" },
      { id: "B", text: "\"Does each person have a soul?\" and \"Do individuals have free will?\"" },
      { id: "C", text: "\"If God is all-good and all-powerful, why does evil exist?\" and \"Is God a moral being?\"" },
      { id: "D", text: "\"Are people born good, evil, or morally neutral?\" and \"What is the relation between mind and body?\"" }
    ],
    correct_option: "A",
    explanation: "Questions about the origin, purpose, and orderly nature of the universe, and about time, belong to Cosmology."
  },
  {
    question_number: 11,
    question_text: "How does Ontology differ from Cosmology within the four subsets of metaphysics?",
    options: [
      { id: "A", text: "Ontology studies the origin and development of the universe as an orderly system, while cosmology studies human free will." },
      { id: "B", text: "Ontology deals exclusively with proofs for the existence of God, while cosmology deals with the mind-body problem." },
      { id: "C", text: "Ontology rejects the existence of physical energy, while cosmology affirms that only spiritual energy exists." },
      { id: "D", text: "Ontology studies the nature of existence itself, such as whether basic reality is matter or spirit, fixed or changing, whereas cosmology studies the universe's origin, nature, and development as an orderly system." }
    ],
    correct_option: "D",
    explanation: "Cosmology studies the universe as an orderly system; Ontology studies the nature of existence itself."
  },
  {
    question_number: 12,
    question_text: "A philosopher investigating whether human actions are determined by environment and inheritance or governed by free will, and whether mind is more fundamental than body, is working within which branch of metaphysics?",
    options: [
      { id: "A", text: "Theological Metaphysics" },
      { id: "B", text: "Cosmological Metaphysics" },
      { id: "C", text: "Anthropological Metaphysics" },
      { id: "D", text: "Ontological Metaphysics" }
    ],
    correct_option: "C",
    explanation: "Anthropological metaphysics deals with the nature of human beings: mind-body relation, free will vs. determinism, the soul."
  },
  {
    question_number: 13,
    question_text: "Epistemology is said to cover two primary areas: \"the content of thought and thought itself.\" Which of the following best reflects the core scope of epistemological inquiry?",
    options: [
      { id: "A", text: "Determining the ultimate purpose of human life and the moral status of humanity." },
      { id: "B", text: "Investigating the nature, source, scope, and validity of knowledge, as well as distinguishing knowledge from mere belief or opinion." },
      { id: "C", text: "Establishing objective standards for judging artistic beauty and aesthetic pleasure." },
      { id: "D", text: "Evaluating the logical validity and formal structure of deductive syllogisms." }
    ],
    correct_option: "B",
    explanation: "Epistemology ('theory of knowledge') examines the nature, source, scope, and validity of knowledge."
  },
  {
    question_number: 14,
    question_text: "Among the four schools/sources of knowledge discussed in epistemology (Empiricism, Rationalism, Intuitionism, and Revelation), which two are classified strictly as philosophical schools of epistemology?",
    options: [
      { id: "A", text: "Empiricism and Rationalism" },
      { id: "B", text: "Intuitionism and Revelation" },
      { id: "C", text: "Empiricism and Revelation" },
      { id: "D", text: "Rationalism and Intuitionism" }
    ],
    correct_option: "A",
    explanation: "Only Empiricism and Rationalism are classified as philosophical schools of epistemology."
  },
  {
    question_number: 15,
    question_text: "Which statement accurately captures the Rationalist critique of Empiricism regarding sensory experience and the human mind?",
    options: [
      { id: "A", text: "Rationalists deny that human beings possess sensory organs and claim all ideas come from divine revelation." },
      { id: "B", text: "Rationalists claim that mental images provide direct, unmediated access to the external world without needing reason." },
      { id: "C", text: "Rationalists assert that appearance and reality are identical, making sensory deception impossible." },
      { id: "D", text: "Rationalists argue that sensations are meaningless raw material that must be organized by innate mental categories before becoming knowledge, meaning the mind is not a blank slate at birth." }
    ],
    correct_option: "D",
    explanation: "Sensations are raw data processed by innate mental categories, rejecting the 'blank slate' view."
  },
  {
    question_number: 16,
    question_text: "Why do philosophers cite the example of a straight stick appearing bent when submerged in water, alongside invisible wavelengths like X-rays?",
    options: [
      { id: "A", text: "To prove that scientific instruments are incapable of extending human knowledge." },
      { id: "B", text: "To confirm the empiricist claim that sensation is never an illusion." },
      { id: "C", text: "To demonstrate the limitations and distortions of sensory perception, showing that naked senses can deceive us and miss vast aspects of reality." },
      { id: "D", text: "To show that intuition is superior to both reason and empirical observation." }
    ],
    correct_option: "C",
    explanation: "These examples show that sensory perception is limited and can be distorted."
  },
  {
    question_number: 17,
    question_text: "What are the specific epistemological limitations associated with Intuition and Revelation, respectively?",
    options: [
      { id: "A", text: "Intuition requires scientific experimentation to occur, while revelation can be easily disproved by empirical data." },
      { id: "B", text: "Intuition is unsafe as a method of obtaining knowledge when used alone, while revelation is subject to distortion through human interpretation and must be accepted by faith rather than empirical proof." },
      { id: "C", text: "Intuition applies only to religious dogma, while revelation applies only to mathematical breakthroughs." },
      { id: "D", text: "Intuition relies entirely on conscious reasoning, while revelation denies any transcendent supernatural order." }
    ],
    correct_option: "B",
    explanation: "Intuition is unsafe alone; revelation can be distorted by interpretation and cannot be empirically proved or disproved."
  },
  {
    question_number: 18,
    question_text: "Which branch of Ethics investigates the question: \"Is an action right because of its good end, or is it good because of its right principle?\"",
    options: [
      { id: "A", text: "Meta-ethics" },
      { id: "B", text: "Applied Ethics" },
      { id: "C", text: "Normative Ethics" },
      { id: "D", text: "Moral Nihilism" }
    ],
    correct_option: "C",
    explanation: "Normative ethics determines the moral rules and standards (Consequentialism vs. Deontology) used to judge conduct."
  },
  {
    question_number: 19,
    question_text: "How does Meta-ethics differ from Applied Ethics?",
    options: [
      { id: "A", text: "Meta-ethics analyzes the meaning of ethical terms (like \"good\" or \"right\") and how moral statements are verified, whereas applied ethics uses normative principles to resolve specific practical moral problems." },
      { id: "B", text: "Meta-ethics applies general moral rules to issues like euthanasia and capital punishment, whereas applied ethics studies the origins of religion." },
      { id: "C", text: "Meta-ethics consists of Consequentialism, Deontology, and Virtue Ethics, whereas applied ethics consists of Emotivism and Prescriptivism." },
      { id: "D", text: "Meta-ethics assumes all moral principles are relative, whereas applied ethics proves all moral principles are absolute." }
    ],
    correct_option: "A",
    explanation: "Meta-ethics studies the meaning and verification of ethical terms; applied ethics applies principles to specific controversies."
  },
  {
    question_number: 20,
    question_text: "According to Chapter One, what is the precise distinction between Art and Philosophy of Art (Aesthetics)?",
    options: [
      { id: "A", text: "Art is the theoretical study of sensory-emotional values, while philosophy of art is the physical creation of paintings and sculptures." },
      { id: "B", text: "Art has no connection to morality or truth, whereas philosophy of art is strictly a branch of normative ethics." },
      { id: "C", text: "Art is restricted to visual mediums, whereas philosophy of art deals exclusively with music and theatre." },
      { id: "D", text: "Art is the perception of beauty, imitation of reality, and medium for transmitting feelings, whereas philosophy of art studies the nature and theories of art, artistic creation, criticism, and psychological responses to artworks." }
    ],
    correct_option: "D",
    explanation: "Art is creative expression; Aesthetics theoretically examines how art is created, criticized, and experienced."
  },
  {
    question_number: 21,
    question_text: "The text states that \"the value of art resides both in pleasure and beauty, and what is beautiful is always good.\" What three dimensions of art does this statement imply?",
    options: [
      { id: "A", text: "Cognitive, rational, and empirical dimensions" },
      { id: "B", text: "Emotional, aesthetic, and moral dimensions" },
      { id: "C", text: "Political, economic, and social dimensions" },
      { id: "D", text: "Metaphysical, ontological, and logical dimensions" }
    ],
    correct_option: "B",
    explanation: "Pleasure = emotional, beauty = aesthetic, goodness = moral dimension."
  },
  {
    question_number: 22,
    question_text: "Which philosophical theory of art, championed by Plato and Aristotle, defines art primarily as an \"imitation or representation of reality\"?",
    options: [
      { id: "A", text: "Formalism" },
      { id: "B", text: "Expressivism" },
      { id: "C", text: "Representationalism" },
      { id: "D", text: "Institutional Theory of Art" }
    ],
    correct_option: "C",
    explanation: "Representationalism views art as an imitation or representation of reality."
  },
  {
    question_number: 23,
    question_text: "A modern art critic argues that a urinal placed in an art gallery is an artwork solely because recognized art world authorities and institutions designate it as such. Which theory of art does this illustrate?",
    options: [
      { id: "A", text: "Institutional Theory of Art" },
      { id: "B", text: "Expressivism" },
      { id: "C", text: "Representationalism" },
      { id: "D", text: "Formalism" }
    ],
    correct_option: "A",
    explanation: "The Institutional Theory holds that an artifact becomes an artwork by recognition from art institutions."
  },
  {
    question_number: 24,
    question_text: "Which of the following sets of questions falls squarely within the domain of Logic rather than Epistemology or Social/Political Philosophy?",
    options: [
      { id: "A", text: "\"What makes an action just or unjust?\" and \"Are we obligated to obey all laws of the State?\"" },
      { id: "B", text: "\"How are concepts formed in the mind?\" and \"What is the relationship between faith and reason?\"" },
      { id: "C", text: "\"What is the ultimate foundation of moral principles?\" and \"Is beauty subjective or objective?\"" },
      { id: "D", text: "\"What makes an argument valid or invalid?\" and \"What makes an argument fallacious?\"" }
    ],
    correct_option: "D",
    explanation: "Logic studies the principles of right reasoning and how to evaluate the validity and fallaciousness of arguments."
  },
  {
    question_number: 25,
    question_text: "How does studying philosophy foster Flexibility, Tolerance, and Open-Mindedness according to Section 5 of Chapter One?",
    options: [
      { id: "A", text: "By proving that one specific philosophical school holds the absolute, unchanging truth on all human affairs." },
      { id: "B", text: "By showing that no viewpoint is necessarily true or false in isolation and that the value of any attitude is contextual, making students more receptive and sympathetic to clashing views." },
      { id: "C", text: "By encouraging students to abandon critical evaluation and accept every opinion uncritically." },
      { id: "D", text: "By demonstrating that all philosophical disagreements are merely trivial linguistic errors." }
    ],
    correct_option: "B",
    explanation: "Diverse perspectives show that the value of an attitude is contextual, which cultivates tolerance and open-mindedness."
  }
];

// --- 4. GENERAL PSYCHOLOGY (33 Qs) ---
export const PSYC_QUESTIONS = [
  {
    question_number: 1,
    question_text: "Correlational research measures the relationship between two or more variables without establishing a cause-and-effect relationship.",
    options: [{ id: "A", text: "True" }, { id: "B", text: "False" }],
    correct_option: "A",
    explanation: "Correlational research reveals whether variables co-vary, but cannot determine causation."
  },
  {
    question_number: 2,
    question_text: "The goal of psychology that focuses on changing an undesirable behavior, such as failing in school, into a desirable one, such as academic success, is known as prediction.",
    options: [{ id: "A", text: "True" }, { id: "B", text: "False" }],
    correct_option: "B",
    explanation: "Modifying or changing behavior relates to the goal of Control/Intervention, not prediction."
  },
  {
    question_number: 3,
    question_text: "Sigmund Freud's psychoanalysis shifted the focus of psychology from the unconscious mind to conscious experiences.",
    options: [{ id: "A", text: "True" }, { id: "B", text: "False" }],
    correct_option: "B",
    explanation: "Freud shifted the focus from conscious experience to the unconscious mind."
  },
  {
    question_number: 4,
    question_text: "Counseling psychologists treat individuals with more severe disorders than clinical psychologists.",
    options: [{ id: "A", text: "True" }, { id: "B", text: "False" }],
    correct_option: "B",
    explanation: "Clinical psychologists deal with more severe mental health disorders; counseling psychologists deal with everyday adjustment problems."
  },
  {
    question_number: 5,
    question_text: "While Wilhelm Wundt established the first psychology laboratory in Leipzig, Germany, Edward Titchener is recognized as the founder of structuralism.",
    options: [{ id: "A", text: "True" }, { id: "B", text: "False" }],
    correct_option: "A",
    explanation: "Wundt created the first lab in 1879, and his student Titchener formally founded structuralism."
  },
  {
    question_number: 6,
    question_text: "Which of the following statements is odd?",
    options: [
      { id: "A", text: "Gestalt psychology proposes psychology to study the whole mind." },
      { id: "B", text: "Psychoanalysis proposes psychology to study the unconscious mind." },
      { id: "C", text: "Functionalism proposes psychology to study the basic elements of the mind." },
      { id: "D", text: "Behaviorism proposes psychology to study observable behavior." }
    ],
    correct_option: "C",
    explanation: "Structuralism (not functionalism) studied basic elements. Functionalism studied how the mind functions.",
    needs_review: true
  },
  {
    question_number: 7,
    question_text: "One of the following thoughts of psychology is primitive and outdated.",
    options: [
      { id: "A", text: "Cognitive" },
      { id: "B", text: "Biological" },
      { id: "C", text: "Socio-cultural" },
      { id: "D", text: "Functionalism" }
    ],
    correct_option: "D",
    explanation: "Functionalism is an early historical school; Cognitive, Biological, and Socio-cultural are modern perspectives."
  },
  {
    question_number: 8,
    question_text: "\"Our everyday actions, hidden fears, and adult personality are deeply driven by unresolved childhood conflicts, repressed desires, and unconscious urges that reveal themselves in our dreams and slips of the tongue.\" What psychological approach would support this statement?",
    options: [
      { id: "A", text: "Cognitive" },
      { id: "B", text: "Structural" },
      { id: "C", text: "Behavioral" },
      { id: "D", text: "Psychoanalytic" }
    ],
    correct_option: "D",
    explanation: "Unconscious drives, repressed desires, and childhood conflicts are key tenets of psychoanalysis."
  },
  {
    question_number: 9,
    question_text: "Which of the following psychologists is odd to the others?",
    options: [
      { id: "A", text: "John B. Watson" },
      { id: "B", text: "Sigmund Freud" },
      { id: "C", text: "Edward Thorndike" },
      { id: "D", text: "B. F. Skinner" }
    ],
    correct_option: "B",
    explanation: "Watson, Thorndike, and Skinner are behaviorists/learning theorists; Freud is the founder of psychoanalysis."
  },
  {
    question_number: 10,
    question_text: "Mr. 'A' conducted a research study in which he examined a single university student with a rare memory disorder in great detail over six months to gather a tremendous amount of data about that individual. Which type of research method is Mr. 'A' conducting?",
    options: [
      { id: "A", text: "Survey" },
      { id: "B", text: "Correlation" },
      { id: "C", text: "Case study" },
      { id: "D", text: "Descriptive" }
    ],
    correct_option: "C",
    explanation: "An intensive in-depth examination of a single individual is a case study."
  },
  {
    question_number: 11,
    question_text: "Jill wants to study the process of thinking. Which field of psychology should she choose?",
    options: [
      { id: "A", text: "Cognitive" },
      { id: "B", text: "Social" },
      { id: "C", text: "Personality" },
      { id: "D", text: "Learning" },
      { id: "E", text: "Perception" }
    ],
    correct_option: "A",
    explanation: "Cognitive psychology investigates mental processes including thinking, memory, and problem-solving."
  },
  {
    question_number: 12,
    question_text: "Of the following, who is associated with the Gestalt school of psychology?",
    options: [
      { id: "A", text: "John Watson" },
      { id: "B", text: "William James" },
      { id: "C", text: "Ivan Pavlov" },
      { id: "D", text: "Max Wertheimer" },
      { id: "E", text: "Sigmund Freud" }
    ],
    correct_option: "D",
    explanation: "Max Wertheimer (along with Koffka and Köhler) founded Gestalt psychology."
  },
  {
    question_number: 13,
    question_text: "Psychology is considered a science mainly because it relies on direct observation. Which field of psychology supports this?",
    options: [
      { id: "A", text: "Behaviorism" },
      { id: "B", text: "Psychodynamic psychology" },
      { id: "C", text: "Social psychology" },
      { id: "D", text: "Cognitive psychology" },
      { id: "E", text: "Structuralism" }
    ],
    correct_option: "A",
    explanation: "Behaviorism argues that psychology must be the study of directly observable, measurable behavior."
  },
  {
    question_number: 14,
    question_text: "Which of the following questions relates most directly to the goal of prediction?",
    options: [
      { id: "A", text: "Do the scores of men and women differ on tests of thinking abilities?" },
      { id: "B", text: "Why does a blow to the head cause memory loss?" },
      { id: "C", text: "Will productivity in a business office increase if room temperature is raised or lowered?" },
      { id: "D", text: "What percentage of college students suffer from test anxiety?" }
    ],
    correct_option: "C",
    explanation: "'Will productivity increase if...' anticipates future behavior under specified conditions (prediction)."
  },
  {
    question_number: 15,
    question_text: "Suppose that a researcher divides a group of students into two groups, giving a new study technique to one group while keeping the other group without it, and then compares their exam scores to determine cause and effect. The researcher is using:",
    options: [
      { id: "A", text: "the experimental method" },
      { id: "B", text: "naturalistic observation" },
      { id: "C", text: "case studies" },
      { id: "D", text: "the survey method" }
    ],
    correct_option: "A",
    explanation: "Manipulating an independent variable with experimental and control groups to establish causality defines the experimental method."
  },
  {
    question_number: 16,
    question_text: "The statement \"In order to understand the human mind, we must use introspection to break consciousness down into its basic elements such as sensations, images, and feelings\" might be made by a person subscribing to which school of psychology?",
    options: [
      { id: "A", text: "Functionalism" },
      { id: "B", text: "Gestalt" },
      { id: "C", text: "Behaviorism" },
      { id: "D", text: "Structuralism" }
    ],
    correct_option: "D",
    explanation: "Structuralism used introspection to analyze consciousness into its basic constituent elements."
  },
  {
    question_number: 17,
    question_text: "Which one of the following is true about early schools of psychology?",
    options: [
      { id: "A", text: "The gestalt psychologists acknowledge consciousness." },
      { id: "B", text: "The goal of Functionalists was to find out the units or elements." },
      { id: "C", text: "Structuralism focused on how the mind allows people to function in the real world." },
      { id: "D", text: "Psychoanalysis views psychology as a study of observable behaviors." }
    ],
    correct_option: "A",
    explanation: "Gestalt psychologists acknowledged consciousness and studied how it organizes whole patterns."
  },
  {
    question_number: 18,
    question_text: "Which modern perspective of psychology is most concerned with how brain chemistry and neural structures influence behavior?",
    options: [
      { id: "A", text: "Biological perspective" },
      { id: "B", text: "Humanistic perspective" },
      { id: "C", text: "Psychodynamic perspective" },
      { id: "D", text: "Behavioral perspective" }
    ],
    correct_option: "A",
    explanation: "The biological/neuroscience perspective examines brain chemistry, hormones, genetics, and neural systems."
  },
  {
    question_number: 19,
    question_text: "A researcher observes how children play on a school playground without interfering, but notices that the children act more politely whenever they realize they are being watched. Which limitation of naturalistic observation does this demonstrate?",
    options: [
      { id: "A", text: "Observer bias" },
      { id: "B", text: "Observer effect" },
      { id: "C", text: "Lack of a representative sample" },
      { id: "D", text: "Inability to generalize a single case" }
    ],
    correct_option: "B",
    explanation: "When subjects modify their natural behavior because they know they are being observed, it is the observer effect (Hawthorne effect)."
  },
  {
    question_number: 20,
    question_text: "Which subfield of psychology applies psychological principles and theories to improve teaching methods, school curricula, and the administration of academic programs?",
    options: [
      { id: "A", text: "Developmental psychology" },
      { id: "B", text: "Counseling psychology" },
      { id: "C", text: "Educational psychology" },
      { id: "D", text: "Industrial psychology" }
    ],
    correct_option: "C",
    explanation: "Educational psychology focuses on teaching methodologies, learning processes, and curriculum design.",
    needs_review: true
  },
  {
    question_number: 21,
    question_text: "Which perspective treats the mind as a \"black box\" focused on environmental inputs and outputs?",
    options: [
      { id: "A", text: "Cognitive Perspective" },
      { id: "B", text: "Behavioral Perspective" },
      { id: "C", text: "Functionalism" },
      { id: "D", text: "Social Psychology" }
    ],
    correct_option: "B",
    explanation: "Radical behaviorism treats internal mental operations as an unobservable 'black box'.",
    needs_review: true
  },
  {
    question_number: 22,
    question_text: "Which field studies whether psychological processes are universal or culture-specific?",
    options: [
      { id: "A", text: "Clinical Psychology" },
      { id: "B", text: "Counseling Psychology" },
      { id: "C", text: "Cross-cultural Psychology" },
      { id: "D", text: "Social Psychology" }
    ],
    correct_option: "C",
    explanation: "Cross-cultural psychology examines psychological diversity and universality across different cultures.",
    needs_review: true
  },
  {
    question_number: 23,
    question_text: "Which school studies how the mind adapts to the real world using mental tests?",
    options: [
      { id: "A", text: "Functionalism" },
      { id: "B", text: "Cognitive Perspective" },
      { id: "C", text: "Behavioral Perspective" },
      { id: "D", text: "Clinical Psychology" }
    ],
    correct_option: "A",
    explanation: "Functionalism investigated the adaptive functions of consciousness and pioneered mental testing.",
    needs_review: true
  },
  {
    question_number: 24,
    question_text: "Which field helps individuals with less severe everyday psychological problems?",
    options: [
      { id: "A", text: "Clinical Psychology" },
      { id: "B", text: "Counseling Psychology" },
      { id: "C", text: "Social Psychology" },
      { id: "D", text: "Cross-cultural Psychology" }
    ],
    correct_option: "B",
    explanation: "Counseling psychologists focus on vocational, educational, and adjustment concerns of everyday life.",
    needs_review: true
  },
  {
    question_number: 25,
    question_text: "Which perspective focuses on internal mental processes like reasoning, memory, and problem-solving?",
    options: [
      { id: "A", text: "Behavioral Perspective" },
      { id: "B", text: "Functionalism" },
      { id: "C", text: "Cognitive Perspective" },
      { id: "D", text: "Counseling Psychology" }
    ],
    correct_option: "C",
    explanation: "Cognitive psychology directly studies internal information processing.",
    needs_review: true
  },
  {
    question_number: 26,
    question_text: "The research technique developed by Wilhelm Wundt to scientifically examine internal mental experiences by looking inward into consciousness is called:",
    options: [
      { id: "A", text: "Objective introspection" },
      { id: "B", text: "Naturalistic observation" },
      { id: "C", text: "Case study" },
      { id: "D", text: "Free association" }
    ],
    correct_option: "A",
    explanation: "Wundt used trained experimental objective introspection.",
    needs_review: true
  },
  {
    question_number: 27,
    question_text: "In an experimental study, the group of participants that does not receive the experimental treatment and is used strictly for comparison is known as the:",
    options: [
      { id: "A", text: "Experimental group" },
      { id: "B", text: "Control group" },
      { id: "C", text: "Sample group" },
      { id: "D", text: "Target group" }
    ],
    correct_option: "B",
    explanation: "The control group serves as the baseline comparison.",
    needs_review: true
  },
  {
    question_number: 28,
    question_text: "The subfield of psychology that applies psychological principles to improve the legal system, including police work and courtroom testimony, is called:",
    options: [
      { id: "A", text: "Forensic psychology" },
      { id: "B", text: "Clinical psychology" },
      { id: "C", text: "Counseling psychology" },
      { id: "D", text: "Industrial psychology" }
    ],
    correct_option: "A",
    explanation: "Forensic psychology intersects with criminal law and legal proceedings.",
    needs_review: true
  },
  {
    question_number: 29,
    question_text: "A tentative proposition or educated guess about the relationship between two or more variables that is tested through systematic research is called a:",
    options: [
      { id: "A", text: "Theory" },
      { id: "B", text: "Hypothesis" },
      { id: "C", text: "Variable" },
      { id: "D", text: "Conclusion" }
    ],
    correct_option: "B",
    explanation: "A testable prediction is a hypothesis.",
    needs_review: true
  },
  {
    question_number: 30,
    question_text: "Case: Twenty freshman students were divided into two groups. Group A drank caffeinated coffee before a memory test, while Group B drank decaffeinated coffee. The goal was to see if caffeine improves or lowers test scores. In this case, the independent variable is:",
    options: [
      { id: "A", text: "The test scores on the memory test" },
      { id: "B", text: "Whether the students drank caffeinated or decaffeinated coffee" },
      { id: "C", text: "The number of students (twenty)" },
      { id: "D", text: "The students' memory ability" }
    ],
    correct_option: "B",
    explanation: "The independent variable is the condition manipulated by the experimenter (caffeine presence).",
    needs_review: true
  },
  {
    question_number: 31,
    question_text: "Case: Twenty freshman students were divided into two groups. Group A drank caffeinated coffee before a memory test, while Group B drank decaffeinated coffee. The goal was to see if caffeine improves or lowers test scores. In this case, the dependent variable is:",
    options: [
      { id: "A", text: "Caffeinated coffee" },
      { id: "B", text: "The test scores on the memory test" },
      { id: "C", text: "Decaffeinated coffee" },
      { id: "D", text: "The group assignment" }
    ],
    correct_option: "B",
    explanation: "The dependent variable is the measured outcome (memory test scores).",
    needs_review: true
  },
  {
    question_number: 32,
    question_text: "Case: Twenty freshman students were divided into two groups. Group A drank caffeinated coffee before a memory test, while Group B drank decaffeinated coffee. The goal was to see if caffeine improves or lowers test scores. In this case, the control group is:",
    options: [
      { id: "A", text: "Group A (caffeinated coffee)" },
      { id: "B", text: "Group B (decaffeinated coffee)" },
      { id: "C", text: "All twenty students" },
      { id: "D", text: "Neither group" }
    ],
    correct_option: "B",
    explanation: "Group B received the placebo/neutral condition without the active drug (caffeine).",
    needs_review: true
  },
  {
    question_number: 33,
    question_text: "Case: Twenty freshman students were divided into two groups. Group A drank caffeinated coffee before a memory test, while Group B drank decaffeinated coffee. The goal was to see if caffeine improves or lowers test scores. In this case, the experimental group is:",
    options: [
      { id: "A", text: "Group A (caffeinated coffee)" },
      { id: "B", text: "Group B (decaffeinated coffee)" },
      { id: "C", text: "Both groups" },
      { id: "D", text: "Neither group" }
    ],
    correct_option: "A",
    explanation: "Group A received the treatment condition (caffeine).",
    needs_review: true
  }
];

// --- 5. GEOGRAPHY (30 Qs) ---
export const GEOG_QUESTIONS = [
  {
    question_number: 1,
    question_text: "The amount of mapped ground area coverage is smaller for small scale maps than large scale maps.",
    options: [{ id: "A", text: "True" }, { id: "B", text: "False" }],
    correct_option: "B",
    explanation: "Small-scale maps represent larger ground areas with less detail, whereas large-scale maps cover smaller areas in greater detail."
  },
  {
    question_number: 2,
    question_text: "A regional approach studies the associations and interrelationships of all or some geographic elements within a specific area marked by a degree of homogeneity.",
    options: [{ id: "A", text: "True" }, { id: "B", text: "False" }],
    correct_option: "A",
    explanation: "Regional geography studies the complex synthesis of human and physical elements within an area characterized by homogeneity."
  },
  {
    question_number: 3,
    question_text: "Regarding its vicinal location, Ethiopia is located southwest of the Arabian Peninsula.",
    options: [{ id: "A", text: "True" }, { id: "B", text: "False" }],
    correct_option: "B",
    explanation: "That describes its location relative to water bodies and landmasses. Vicinal location expresses a country's position with reference to its bordering neighbors (Sudan, Eritrea, Djibouti, Somalia, Kenya, South Sudan)."
  },
  {
    question_number: 4,
    question_text: "For both the Area-Boundary (A/B) ratio and the Boundary-Circumference (B/C) ratio, a higher ratio value indicates a greater degree of compactness.",
    options: [{ id: "A", text: "True" }, { id: "B", text: "False" }],
    correct_option: "B",
    explanation: "A higher A/B ratio means more compact, but for the B/C ratio a country is more compact the nearer the ratio is to 1."
  },
  {
    question_number: 5,
    question_text: "The term Geography has no single and universally accepted definition due to its dynamic nature and changes in its scope.",
    options: [{ id: "A", text: "True" }, { id: "B", text: "False" }],
    correct_option: "A",
    explanation: "Geography has evolved from simple earth description to modern spatial and environmental analysis."
  },
  {
    question_number: 6,
    question_text: "Relatively, Ethiopia is located:",
    options: [
      { id: "A", text: "Southeast of South Sudan and East of Sudan" },
      { id: "B", text: "South of Kenya and West of Djibouti" },
      { id: "C", text: "Northwest of Somalia and North of Kenya" },
      { id: "D", text: "South of Kenya and South Sudan" }
    ],
    correct_option: "C",
    explanation: "Somalia lies to the east and southeast of Ethiopia, which places Ethiopia northwest of Somalia."
  },
  {
    question_number: 7,
    question_text: "If the following values are the B/C values of five African countries, which one denotes the most compact country?",
    options: [
      { id: "A", text: "1.41" },
      { id: "B", text: "1.56" },
      { id: "C", text: "1.99" },
      { id: "D", text: "1.33" },
      { id: "E", text: "1.80" }
    ],
    correct_option: "D",
    explanation: "For the B/C ratio, a country is more compact the nearer its ratio is to 1 (1.33 is closest to 1)."
  },
  {
    question_number: 8,
    question_text: "Among the following categories of the shapes of a country, a country that has one portion much more elongated than the rest of the country is known as:",
    options: [
      { id: "A", text: "Perforated" },
      { id: "B", text: "Protruded" },
      { id: "C", text: "Fragmented" },
      { id: "D", text: "Elongated" }
    ],
    correct_option: "B",
    explanation: "A protruded shape has an extension protruding outwards from the main body.",
    needs_review: true // Corrected from file key D to B per standard geographic definitions
  },
  {
    question_number: 9,
    question_text: "Ethiopian farmers build terraces on steep hillsides and construct irrigation canals to grow crops in dry areas. Which of the following themes of geography is related to this statement?",
    options: [
      { id: "A", text: "Region" },
      { id: "B", text: "Movement" },
      { id: "C", text: "Location" },
      { id: "D", text: "Human-environment interaction" },
      { id: "E", text: "Place" }
    ],
    correct_option: "D",
    explanation: "Terracing and irrigation directly illustrate human adaptation to and modification of the natural environment."
  },
  {
    question_number: 10,
    question_text: "Which of the following marginal information are important to tell what the map is all about and to interpret its conventional symbols, respectively?",
    options: [
      { id: "A", text: "Date of publication and Scale" },
      { id: "B", text: "Title and Legend" },
      { id: "C", text: "Frame and Date of publication" },
      { id: "D", text: "Margin and North arrow" }
    ],
    correct_option: "B",
    explanation: "Title states the theme/subject of the map, and Legend (key) decodes conventional signs and symbols."
  },
  {
    question_number: 11,
    question_text: "Assume countries A, B, and C have an area of 200 km², 300 km², and 400 km² respectively. If their boundary lengths are 20 km, 30 km, and 20 km respectively, which country is more compact by the A/B ratio?",
    options: [
      { id: "A", text: "A" },
      { id: "B", text: "C" },
      { id: "C", text: "B" },
      { id: "D", text: "Cannot be determined" }
    ],
    correct_option: "B",
    explanation: "A/B ratios are 200/20 = 10, 300/30 = 10, and 400/20 = 20. The highest ratio (country C) is the most compact."
  },
  {
    question_number: 12,
    question_text: "The human-environment interaction which allows humans to \"conquer\" the world for their comfortable living is:",
    options: [
      { id: "A", text: "Modification" },
      { id: "B", text: "Adaptation" },
      { id: "C", text: "Dependency" },
      { id: "D", text: "All of the above" },
      { id: "E", text: "None of the above" }
    ],
    correct_option: "A",
    explanation: "Modification involves altering landscapes (clearing, building, damming) to suit human needs."
  },
  {
    question_number: 13,
    question_text: "What is the marginal information on a map that allows the user to interpret ground measurements such as distance, area size, and gradient?",
    options: [
      { id: "A", text: "Title" },
      { id: "B", text: "Legend" },
      { id: "C", text: "Scale" },
      { id: "D", text: "North arrow" }
    ],
    correct_option: "C",
    explanation: "Scale expresses the ratio between map distance and real ground distance."
  },
  {
    question_number: 14,
    question_text: "How is the radius of the inscribing circle obtained to calculate the ratio of A/A'?",
    options: [
      { id: "A", text: "The length of the longest distance between two extreme points." },
      { id: "B", text: "Half-length of the shortest distance between two extreme points." },
      { id: "C", text: "By deriving radius from area of circle having the same area as the country itself." },
      { id: "D", text: "By dividing length of the longest distance between two extreme points into two." }
    ],
    correct_option: "D",
    explanation: "The inscribing circle uses the longest axis diameter / 2."
  },
  {
    question_number: 15,
    question_text: "Which can be generalized about Ethiopia with reference to its longitudinal extension?",
    options: [
      { id: "A", text: "Ethiopia is a land of diversity" },
      { id: "B", text: "Ethiopia is a mountainous country" },
      { id: "C", text: "There is a one-hour time difference between its easternmost and westernmost points" },
      { id: "D", text: "Ethiopia is a country of agrarian society" },
      { id: "E", text: "Ethiopia experiences a tropical type of climate" }
    ],
    correct_option: "C",
    explanation: "Longitudes span 33°E to 48°E (15° difference), which equates exactly to 1 hour difference (15° = 60 minutes)."
  },
  {
    question_number: 16,
    question_text: "Which can be generalized about Ethiopia with reference to its astronomical location?",
    options: [
      { id: "A", text: "Ethiopia is a land of diversity" },
      { id: "B", text: "Ethiopia is a mountainous country" },
      { id: "C", text: "Ethiopia is a land locked country" },
      { id: "D", text: "Ethiopia is a country of agrarian society" },
      { id: "E", text: "Ethiopia experiences a tropical type of climate" }
    ],
    correct_option: "E",
    explanation: "Located between 3°N and 15°N latitudes, Ethiopia lies entirely within the tropical zone (Tropic of Cancer to Equator)."
  },
  {
    question_number: 17,
    question_text: "The Ethiopian Highlands share common physical and climatic features, such as high elevation, similar rainfall, and comparable soil types, that distinguish them from the surrounding lowlands. To which core theme of Geography is this linked?",
    options: [
      { id: "A", text: "Human-Environment Interaction" },
      { id: "B", text: "Movement" },
      { id: "C", text: "Place" },
      { id: "D", text: "Location" },
      { id: "E", text: "Region" }
    ],
    correct_option: "E",
    explanation: "A region is an area defined by unifying physical or human characteristics that distinguish it from adjacent areas."
  },
  {
    question_number: 18,
    question_text: "A compact shaped country can have the following advantages EXCEPT:",
    options: [
      { id: "A", text: "Strong core-periphery relations among the people" },
      { id: "B", text: "Implementation of effective political administration" },
      { id: "C", text: "Integrated cultural ties among the people" },
      { id: "D", text: "Diversity of culture" }
    ],
    correct_option: "D",
    explanation: "Compact countries tend toward cultural and demographic homogeneity, rather than wide geographic cultural diversity."
  },
  {
    question_number: 19,
    question_text: "Which of the following statements is correct about Ethiopia?",
    options: [
      { id: "A", text: "In its vicinal location Ethiopia is found southwest of the Arabian Peninsula" },
      { id: "B", text: "Ethiopia shares a boundary with Kenya in the South and it is located North of Kenya." },
      { id: "C", text: "Ethiopia is located east and southeast of Somalia." },
      { id: "D", text: "Ethiopia is the largest of all the African countries." }
    ],
    correct_option: "B",
    explanation: "Kenya borders Ethiopia to the south, which places Ethiopia north of Kenya."
  },
  {
    question_number: 20,
    question_text: "The contents of topographical maps may not depend on:",
    options: [
      { id: "A", text: "the purpose of the map" },
      { id: "B", text: "the shape of the area represented" },
      { id: "C", text: "the date of compilation" },
      { id: "D", text: "the scale of the map" },
      { id: "E", text: "None of the above" }
    ],
    correct_option: "B",
    explanation: "Topographic contents depend on scale, survey date, and purpose, but not on the geometrical shape of the territory."
  },
  {
    question_number: 21,
    question_text: "Which of the following is an implication of Ethiopia's proximity to the Middle East?",
    options: [
      { id: "A", text: "Tropical temperature characteristics" },
      { id: "B", text: "One-hour longitudinal time difference" },
      { id: "C", text: "Early reception of major world religions like Christianity, Islam, and Judaism" },
      { id: "D", text: "Having a compact territorial shape" }
    ],
    correct_option: "C",
    explanation: "Proximity to the Red Sea and Arabian Peninsula fostered ancient trade links and early introduction of Abrahamic religions."
  },
  {
    question_number: 22,
    question_text: "Which of the following territorial shape categories describes a country that completely encloses another independent state within its borders, such as the Republic of South Africa?",
    options: [
      { id: "A", text: "Compact" },
      { id: "B", text: "Fragmented" },
      { id: "C", text: "Perforated" },
      { id: "D", text: "Elongated" }
    ],
    correct_option: "C",
    explanation: "A perforated state completely surrounds another sovereign territory (e.g., South Africa encloses Lesotho)."
  },
  {
    question_number: 23,
    question_text: "Among the following, which pair correctly represents the southernmost and northernmost astronomical points of Ethiopia, respectively?",
    options: [
      { id: "A", text: "Akobo (33°E) and Ogaden (48°E)" },
      { id: "B", text: "Moyale (3°N) and Bademe (15°N)" },
      { id: "C", text: "Bademe (15°N) and Moyale (3°N)" },
      { id: "D", text: "Ogaden (48°E) and Akobo (33°E)" }
    ],
    correct_option: "B",
    explanation: "Southernmost extreme is Moyale (~3°N) and northernmost is Bademe (~15°N)."
  },
  {
    question_number: 24,
    question_text: "Ethiopia shares the longest and the shortest boundary with ______ and ______ respectively.",
    options: [
      { id: "A", text: "Sudan and Djibouti" },
      { id: "B", text: "Eritrea and Somalia" },
      { id: "C", text: "Somalia and Djibouti" },
      { id: "D", text: "Djibouti and Sudan" }
    ],
    correct_option: "C",
    explanation: "Ethiopia's longest international border is with Somalia (~1,600 km) and its shortest is with Djibouti (~349 km)."
  },
  {
    question_number: 25,
    question_text: "Among the following scales of map, which one has relatively detailed information?",
    options: [
      { id: "A", text: "1:30,000" },
      { id: "B", text: "1:500,000" },
      { id: "C", text: "1:1,000,000" },
      { id: "D", text: "1:80,000" }
    ],
    correct_option: "A",
    explanation: "1:30,000 has the smallest representative fraction denominator, meaning it is the largest scale map and provides the greatest ground detail."
  },
  {
    question_number: 26,
    question_text: "Which of the following is not one of the four Earth spheres that form the thin interface zone of Geography's scope?",
    options: [
      { id: "A", text: "Atmosphere" },
      { id: "B", text: "Lithosphere" },
      { id: "C", text: "Hemisphere" },
      { id: "D", text: "Hydrosphere" }
    ],
    correct_option: "C",
    explanation: "The four environmental spheres are atmosphere, lithosphere, hydrosphere, and biosphere. Hemisphere is a geometric division."
  },
  {
    question_number: 27,
    question_text: "Which type of region is characterized by functional interrelationships in a spatial system, such as a large metropolitan city and its surrounding suburbs?",
    options: [
      { id: "A", text: "Formal region" },
      { id: "B", text: "Functional (nodal) region" },
      { id: "C", text: "Vernacular region" },
      { id: "D", text: "Perceptual region" }
    ],
    correct_option: "B",
    explanation: "Functional or nodal regions are organized around a central focal node with spatial linkages.",
    needs_review: true
  },
  {
    question_number: 28,
    question_text: "Which core theme of Geography refers to the physical and human aspects of a location, associated with toponym, site, and situation, that give it unique features to compare and contrast with other places on Earth?",
    options: [
      { id: "A", text: "Place" },
      { id: "B", text: "Movement" },
      { id: "C", text: "Region" },
      { id: "D", text: "Location" }
    ],
    correct_option: "A",
    explanation: "Place describes the distinctive human and physical characteristics of a site.",
    needs_review: true
  },
  {
    question_number: 29,
    question_text: "Which core theme of Geography is the translocation of human beings, their goods, and their ideas from one end of the planet to another?",
    options: [
      { id: "A", text: "Place" },
      { id: "B", text: "Region" },
      { id: "C", text: "Movement" },
      { id: "D", text: "Human-environment interaction" }
    ],
    correct_option: "C",
    explanation: "Movement addresses migration, trade, transport, and diffusion of ideas across space.",
    needs_review: true
  },
  {
    question_number: 30,
    question_text: "Assume you have a flight from Ogaden (48°E) to Akobo (33°E). Your airplane departed from Ogaden on Friday at 10 a.m. and landed in Akobo after a 2-hour flight. What is the local time when you arrive in Akobo?",
    options: [
      { id: "A", text: "9 a.m." },
      { id: "B", text: "11 a.m." },
      { id: "C", text: "12 noon" },
      { id: "D", text: "1 p.m." }
    ],
    correct_option: "B",
    explanation: "The 15° longitude difference is 1 hour; Akobo is to the west, so its local sun time is 1 hour behind. 10 a.m. + 2 hours = 12 noon in Ogaden time, which is 11 a.m. in Akobo.",
    needs_review: true
  }
];

// --- 6. GENERAL ECONOMICS (20 Qs) ---
export const ECON_QUESTIONS = [
  {
    question_number: 1,
    question_text: "Which of the following best explains why economics is fundamentally considered a science of choice?",
    options: [
      { id: "A", text: "Human wants are limited, but resources are unlimited." },
      { id: "B", text: "Resources are scarce relative to unlimited human wants." },
      { id: "C", text: "Governments control all economic activities." },
      { id: "D", text: "Production is always greater than consumption." }
    ],
    correct_option: "B",
    explanation: "Economics studies how individuals and societies make choices when resources are limited but human wants are unlimited."
  },
  {
    question_number: 2,
    question_text: "A researcher studies how an individual household decides to allocate its monthly income between food, clothing, and education. Which branch of economics is being applied?",
    options: [
      { id: "A", text: "Macroeconomics" },
      { id: "B", text: "Development economics" },
      { id: "C", text: "Microeconomics" },
      { id: "D", text: "International economics" }
    ],
    correct_option: "C",
    explanation: "Microeconomics studies individual economic decision-making units, including households, firms, and specific markets."
  },
  {
    question_number: 3,
    question_text: "Which of the following statements represents normative economics?",
    options: [
      { id: "A", text: "The unemployment rate in Ethiopia has increased." },
      { id: "B", text: "The price of coffee has increased this year." },
      { id: "C", text: "The government should provide free education to all citizens." },
      { id: "D", text: "National output increased during the previous year." }
    ],
    correct_option: "C",
    explanation: "Normative economics involves value judgments and opinions about what ought to be, rather than describing verifiable facts."
  },
  {
    question_number: 4,
    question_text: "An economist collects information about the consumption patterns of 500 households and uses the observations to develop a general theory of consumer behavior. Which method of reasoning is being used?",
    options: [
      { id: "A", text: "Deductive reasoning" },
      { id: "B", text: "Inductive reasoning" },
      { id: "C", text: "Normative reasoning" },
      { id: "D", text: "Comparative reasoning" }
    ],
    correct_option: "B",
    explanation: "Inductive reasoning moves from specific observations and facts toward general principles or theories."
  },
  {
    question_number: 5,
    question_text: "Which statement correctly distinguishes scarcity from shortage?",
    options: [
      { id: "A", text: "Scarcity is temporary, while shortage is permanent." },
      { id: "B", text: "Both scarcity and shortage are temporary economic problems." },
      { id: "C", text: "Scarcity is universal and everlasting, while shortage is a specific and short-term problem." },
      { id: "D", text: "Scarcity occurs only when prices increase, while shortage occurs when prices decrease." }
    ],
    correct_option: "C",
    explanation: "Scarcity exists because resources are limited relative to human wants. Shortage occurs when people cannot obtain the quantity they want at the prevailing price."
  },
  {
    question_number: 6,
    question_text: "A student has enough money to purchase either a textbook or a pair of shoes. He chooses the textbook. What is the opportunity cost of his decision?",
    options: [
      { id: "A", text: "The money spent on the textbook" },
      { id: "B", text: "The value of the shoes he sacrificed" },
      { id: "C", text: "The total value of both products" },
      { id: "D", text: "The cost of producing the textbook" }
    ],
    correct_option: "B",
    explanation: "Opportunity cost is the value of the next best alternative that must be sacrificed when making a choice."
  },
  {
    question_number: 7,
    question_text: "Which of the following correctly matches the factors of production with their respective rewards?",
    options: [
      { id: "A", text: "Land–Wages; Labour–Rent; Capital–Profit; Entrepreneurship–Interest" },
      { id: "B", text: "Land–Rent; Labour–Wages; Capital–Interest; Entrepreneurship–Profit" },
      { id: "C", text: "Land–Interest; Labour–Profit; Capital–Rent; Entrepreneurship–Wages" },
      { id: "D", text: "Land–Profit; Labour–Interest; Capital–Wages; Entrepreneurship–Rent" }
    ],
    correct_option: "B",
    explanation: "Land earns rent, labour earns wages, capital earns interest, and entrepreneurship earns profit."
  },
  {
    question_number: 8,
    question_text: "An economy produces only food and computers. A point inside its Production Possibilities Frontier (PPF) indicates:",
    options: [
      { id: "A", text: "An unattainable production combination." },
      { id: "B", text: "An efficient use of all available resources." },
      { id: "C", text: "An attainable but inefficient production combination." },
      { id: "D", text: "Economic growth caused by technological improvement." }
    ],
    correct_option: "C",
    explanation: "Points inside the PPF are attainable, but resources are not fully or efficiently used. Points on the curve are attainable and efficient, while points outside are unattainable with current resources and technology."
  },
  {
    question_number: 9,
    question_text: "According to the law of increasing opportunity cost, when an economy produces more and more of one product:",
    options: [
      { id: "A", text: "The opportunity cost per additional unit decreases." },
      { id: "B", text: "The opportunity cost per additional unit remains constant." },
      { id: "C", text: "The opportunity cost per additional unit increases." },
      { id: "D", text: "The economy experiences unlimited production." }
    ],
    correct_option: "C",
    explanation: "Resources are not equally adaptable to producing different goods. As production shifts toward one good, more and more of the other good must be sacrificed. This is why the PPF is generally concave to the origin."
  },
  {
    question_number: 10,
    question_text: "Which of the following changes would most likely cause an outward shift of the entire Production Possibilities Frontier?",
    options: [
      { id: "A", text: "An increase in unemployment" },
      { id: "B", text: "A decrease in the quantity of available resources" },
      { id: "C", text: "An improvement in production technology" },
      { id: "D", text: "Inefficient utilization of existing resources" }
    ],
    correct_option: "C",
    explanation: "Economic growth can occur through an increase in the quantity or quality of resources or advances in technology. These changes increase productive capacity and shift the PPF outward."
  },
  {
    question_number: 11,
    question_text: "A government decides whether to produce more hospitals or more military equipment. Which fundamental economic question is being addressed?",
    options: [
      { id: "A", text: "How to produce?" },
      { id: "B", text: "What to produce?" },
      { id: "C", text: "For whom to produce?" },
      { id: "D", text: "Where to produce?" }
    ],
    correct_option: "B",
    explanation: "What to produce concerns the types and quantities of goods and services an economy should produce."
  },
  {
    question_number: 12,
    question_text: "A factory decides to use more machinery and fewer workers to manufacture its products. Which fundamental economic problem does this decision address?",
    options: [
      { id: "A", text: "What to produce?" },
      { id: "B", text: "For whom to produce?" },
      { id: "C", text: "How to produce?" },
      { id: "D", text: "Why to consume?" }
    ],
    correct_option: "C",
    explanation: "How to produce concerns the choice of production techniques, particularly between labour-intensive and capital-intensive methods."
  },
  {
    question_number: 13,
    question_text: "An economy decides to distribute its produced goods and services among different groups of people in society. This decision addresses:",
    options: [
      { id: "A", text: "The problem of resource allocation" },
      { id: "B", text: "The problem of choice of technique" },
      { id: "C", text: "The problem of distribution of national product" },
      { id: "D", text: "The problem of economic growth" }
    ],
    correct_option: "C",
    explanation: "For whom to produce concerns how the final output of an economy is distributed among members of society."
  },
  {
    question_number: 14,
    question_text: "Which of the following is the most important distinguishing characteristic of a capitalist economy?",
    options: [
      { id: "A", text: "All productive resources are owned and controlled by the government." },
      { id: "B", text: "All economic decisions are made through central planning." },
      { id: "C", text: "Productive resources are privately owned, and production is mainly motivated by profit." },
      { id: "D", text: "Private property and individual economic freedom are prohibited." }
    ],
    correct_option: "C",
    explanation: "Capitalism is characterized by private ownership, profit motive, freedom of choice, competition, and a relatively minor role of government."
  },
  {
    question_number: 15,
    question_text: "In a capitalist economy, the principle of consumer sovereignty means that:",
    options: [
      { id: "A", text: "Producers determine all consumer preferences." },
      { id: "B", text: "Consumers have freedom to choose goods and services according to their preferences." },
      { id: "C", text: "The government determines the prices of all products." },
      { id: "D", text: "Consumers are required to purchase only essential goods." }
    ],
    correct_option: "B",
    explanation: "Consumer sovereignty means consumers influence what producers produce through their purchasing decisions and preferences."
  },
  {
    question_number: 16,
    question_text: "Which of the following is a major disadvantage of a command economy?",
    options: [
      { id: "A", text: "Excessive competition among private producers" },
      { id: "B", text: "Complete absence of government intervention" },
      { id: "C", text: "Lack of economic freedom and incentives for efficiency" },
      { id: "D", text: "Excessive concentration of private ownership" }
    ],
    correct_option: "C",
    explanation: "In a command economy, the government controls economic activities. This may reduce individual freedom and financial incentives for hard work and efficiency."
  },
  {
    question_number: 17,
    question_text: "Which situation best represents a mixed economy?",
    options: [
      { id: "A", text: "All industries are privately owned with no government intervention." },
      { id: "B", text: "All production and distribution decisions are made by the government." },
      { id: "C", text: "Both public and private sectors participate in economic activities." },
      { id: "D", text: "All productive resources are owned collectively without private property." }
    ],
    correct_option: "C",
    explanation: "A mixed economy combines elements of capitalism and command economies, allowing public and private sectors to coexist."
  },
  {
    question_number: 18,
    question_text: "In a closed economy, which of the following represents the three major decision-making units identified in Chapter One?",
    options: [
      { id: "A", text: "Households, firms, and foreign countries" },
      { id: "B", text: "Households, firms, and government" },
      { id: "C", text: "Banks, households, and international organizations" },
      { id: "D", text: "Producers, consumers, and foreign markets" }
    ],
    correct_option: "B",
    explanation: "The three major decision-making units in a closed economy are households, firms, and government."
  },
  {
    question_number: 19,
    question_text: "In the factor market, which of the following transactions takes place?",
    options: [
      { id: "A", text: "Households purchase finished goods from firms." },
      { id: "B", text: "Firms sell finished goods to households." },
      { id: "C", text: "Households sell factors of production to firms." },
      { id: "D", text: "Government sells consumer goods to households only." }
    ],
    correct_option: "C",
    explanation: "In the factor market, households supply labour, land, and capital to firms and receive wages, rent, and interest as income."
  },
  {
    question_number: 20,
    question_text: "In the circular flow model, firms sell goods and services to households in the product market. What does the opposite flow represent?",
    options: [
      { id: "A", text: "Households supply factors of production to firms through the factor market." },
      { id: "B", text: "Firms supply labour and land to households." },
      { id: "C", text: "Government supplies all productive resources to firms." },
      { id: "D", text: "Households pay taxes directly to firms." }
    ],
    correct_option: "A",
    explanation: "Households supply factors of production to firms through the factor market."
  }
];

export const SUBJECT_QUESTIONS_MAP = {
  "MATH-1011": MATH_QUESTIONS,
  "PHYS-1011": PHYS_QUESTIONS,
  "PHIL-1011": LOGIC_QUESTIONS,
  "PSYC-1011": PSYC_QUESTIONS,
  "GEOG-1011": GEOG_QUESTIONS,
  "ECON-1011": ECON_QUESTIONS,
};

export async function runSeeder() {
  console.log("🌱 Starting Exam Data Seeder...");

  // 1. Check if exam_subjects table exists
  const { data: testSub, error: testErr } = await supabase.from("exam_subjects").select("id").limit(1);
  if (testErr) {
    console.error("❌ Table exam_subjects does not exist yet. Please run the SQL migration in Supabase SQL editor first!");
    console.error("Error:", testErr.message);
    process.exit(1);
  }

  let totalQuestionsImported = 0;
  const reviewReport = [];

  // 2. Upsert subjects and their questions
  for (const subjectMeta of EXAM_SUBJECTS) {
    const { code, title, field, duration_minutes, question_count } = subjectMeta;

    // Upsert subject by code
    const { data: subData, error: subErr } = await supabase
      .from("exam_subjects")
      .upsert({ code, title, field, duration_minutes, question_count }, { onConflict: "code" })
      .select()
      .single();

    if (subErr) {
      console.error(`❌ Failed to upsert subject ${code}:`, subErr.message);
      continue;
    }

    const subjectId = subData.id;
    console.log(`✅ Subject [${code}] ${title} ready (ID: ${subjectId})`);

    const qList = SUBJECT_QUESTIONS_MAP[code] || [];
    
    // Clear old questions for this subject if re-seeding
    await supabase.from("exam_questions").delete().eq("subject_id", subjectId);

    const questionsToInsert = qList.map((q) => {
      const isReview = !!q.needs_review;
      if (isReview) {
        reviewReport.push({
          subject: title,
          qNum: q.question_number,
          reason: q.explanation || "Review requested in syllabus"
        });
      }
      return {
        subject_id: subjectId,
        question_number: q.question_number,
        question_text: q.question_text,
        options: q.options,
        correct_option: q.correct_option,
        explanation: q.explanation || null,
        needs_review: isReview
      };
    });

    if (questionsToInsert.length > 0) {
      const { data: inserted, error: qErr } = await supabase
        .from("exam_questions")
        .insert(questionsToInsert)
        .select("id");

      if (qErr) {
        console.error(`❌ Error inserting questions for ${code}:`, qErr.message);
      } else {
        totalQuestionsImported += (inserted?.length || 0);
        console.log(`   ↳ Inserted ${inserted?.length || 0} questions for ${title}`);
      }
    }
  }

  console.log("\n========================================================");
  console.log(`🎉 IMPORT COMPLETED! Total questions imported: ${totalQuestionsImported}`);
  console.log(`📋 Total questions marked 'needs_review': ${reviewReport.length}`);
  console.log("========================================================\n");
}

if (process.argv[1]?.endsWith("seed_exam_data.js")) {
  runSeeder().catch(console.error);
}

