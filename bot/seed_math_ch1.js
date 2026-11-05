// seed_math_ch1.js — Seed/Update Mathematics Chapter 1 Questions (Propositional Logic and Set Theory)
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const QUESTIONS = [
  {
    question_number: 1,
    difficulty: 'Medium',
    question_text: 'If the compound proposition (p ∧ q) → r is false, which one of the following propositions is true?',
    options: [
      { id: 'A', text: '¬p ∨ r' },
      { id: 'B', text: 'p ↔ r' },
      { id: 'C', text: 'q → r' },
      { id: 'D', text: 'r → p' },
      { id: 'E', text: 'p → ¬q' },
    ],
    correct_option: 'D',
    explanation: 'The implication is false only when p∧q = T and r = F, so p=T, q=T, r=F. Testing each option: only r→p = F→T = T. Answer: D',
  },
  {
    question_number: 2,
    difficulty: 'Medium',
    question_text: 'In the truth table of (p ∨ q) → (r ∧ s), in how many rows does the proposition take the truth value F?',
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '7' },
      { id: 'C', text: '9' },
      { id: 'D', text: '12' },
      { id: 'E', text: '16' },
    ],
    correct_option: 'C',
    explanation: 'With 4 variables there are 16 rows. The implication is F when p∨q=T (3 cases for p,q) and r∧s=F (3 cases for r,s). So 3×3=9. Answer: C',
  },
  {
    question_number: 3,
    difficulty: 'Medium',
    question_text: 'Which one of the following is logically equivalent to (p → q) ∧ (p → r)?',
    options: [
      { id: 'A', text: '(p ∧ q) → r' },
      { id: 'B', text: '(p ∨ q) → r' },
      { id: 'C', text: 'p → (q ∨ r)' },
      { id: 'D', text: '(p → q) ∨ (p → r)' },
      { id: 'E', text: 'p → (q ∧ r)' },
    ],
    correct_option: 'E',
    explanation: '(p→q)∧(p→r) ≡ (¬p∨q)∧(¬p∨r) ≡ ¬p∨(q∧r) ≡ p→(q∧r). Answer: E',
  },
  {
    question_number: 4,
    difficulty: 'Medium',
    question_text: 'Which one of the following compound propositions is a tautology?',
    options: [
      { id: 'A', text: '[(p → q) ∧ (q → r)] → (p → r)' },
      { id: 'B', text: '(p → q) → (q → p)' },
      { id: 'C', text: '[(p → q) ∧ q] → p' },
      { id: 'D', text: '(p ∨ q) → p' },
      { id: 'E', text: '(p ↔ q) → (p ∧ q)' },
    ],
    correct_option: 'A',
    explanation: 'Option A is Hypothetical Syllogism, which is always true. All other options have counterexamples. Answer: A',
  },
  {
    question_number: 5,
    difficulty: 'Medium',
    question_text: 'Which one of the following is a contradiction?',
    options: [
      { id: 'A', text: '(p → q) ∧ (q → p)' },
      { id: 'B', text: '¬[(p → q) ∨ (q → p)]' },
      { id: 'C', text: '(p ∨ q) ∧ ¬p' },
      { id: 'D', text: 'p ↔ ¬q' },
      { id: 'E', text: '(p ∧ q) ∧ (¬p ∨ q)' },
    ],
    correct_option: 'B',
    explanation: '(p→q)∨(q→p) is a tautology (always T), so its negation is always F — a contradiction. Answer: B',
  },
  {
    question_number: 6,
    difficulty: 'Medium',
    question_text: 'Take the inverse of the conditional p → q, and then take the converse of that inverse. The resulting proposition is',
    options: [
      { id: 'A', text: 'q → p' },
      { id: 'B', text: '¬p → ¬q' },
      { id: 'C', text: 'p → ¬q' },
      { id: 'D', text: '¬p → q' },
      { id: 'E', text: '¬q → ¬p' },
    ],
    correct_option: 'E',
    explanation: 'Inverse of p→q is ¬p→¬q. Converse of ¬p→¬q is ¬q→¬p (the contrapositive of p→q). Answer: E',
  },
  {
    question_number: 7,
    difficulty: 'Medium',
    question_text: 'The negation of p → (q ∨ r) is logically equivalent to',
    options: [
      { id: 'A', text: 'p ∧ (¬q ∨ ¬r)' },
      { id: 'B', text: '¬p ∨ (¬q ∧ ¬r)' },
      { id: 'C', text: '¬p ∧ ¬q ∧ ¬r' },
      { id: 'D', text: 'p ∧ ¬q ∧ ¬r' },
      { id: 'E', text: 'p → (¬q ∧ ¬r)' },
    ],
    correct_option: 'D',
    explanation: 'p→(q∨r) ≡ ¬p∨(q∨r). Negation: p∧¬(q∨r) ≡ p∧(¬q∧¬r) = p∧¬q∧¬r. Answer: D',
  },
  {
    question_number: 8,
    difficulty: 'Medium',
    question_text: 'Which one of the following statements is NOT equivalent to "p only if q"?',
    options: [
      { id: 'A', text: 'q is sufficient for p' },
      { id: 'B', text: 'If p, then q' },
      { id: 'C', text: 'q is necessary for p' },
      { id: 'D', text: 'p is sufficient for q' },
      { id: 'E', text: '¬q → ¬p' },
    ],
    correct_option: 'A',
    explanation: '\'p only if q\' means p→q. \'q is sufficient for p\' means q→p (the converse), which is NOT equivalent. Answer: A',
  },
  {
    question_number: 9,
    difficulty: 'Medium',
    question_text: 'Let p = T, q = F, r = T and s = F. Exactly one of the following propositions is true. Which one?',
    options: [
      { id: 'A', text: '(p ∧ ¬q) → (r ∧ s)' },
      { id: 'B', text: '(q → p) → (s ∧ ¬r)' },
      { id: 'C', text: '¬(p ∨ s) ↔ (q ∨ r)' },
      { id: 'D', text: '(r → s) ∨ (¬p ∧ ¬s)' },
      { id: 'E', text: '(p → q) ↔ (r → s)' },
    ],
    correct_option: 'E',
    explanation: 'With p=T,q=F,r=T,s=F: p→q=F and r→s=F, so F↔F=T. All others evaluate to F. Answer: E',
  },
  {
    question_number: 10,
    difficulty: 'Medium',
    question_text: 'Let S be the statement ∀x∈ℝ (x² > 4 → x > 2). Which option gives the negation of S together with its correct truth value?',
    options: [
      { id: 'A', text: '∃x (x² > 4 ∧ x ≤ 2); false' },
      { id: 'B', text: '∃x (x ≤ 4 ∧ x² > 2); true' },
      { id: 'C', text: '∃x (x² > 4 ∧ x ≤ 2); true' },
      { id: 'D', text: '∀x (x² > 4 ∧ x ≤ 2); false' },
      { id: 'E', text: '∃x (x² > 4 → x ≤ 2); true' },
    ],
    correct_option: 'C',
    explanation: 'Negation of ∀x(P→Q) is ∃x(P∧¬Q) = ∃x(x²>4 ∧ x≤2). x=−3 satisfies it (9>4, −3≤2), so it is true. Answer: C',
  },
  {
    question_number: 11,
    difficulty: 'Medium',
    question_text: 'The universe is the set of integers ℤ. Which one of the following statements is TRUE?',
    options: [
      { id: 'A', text: '∀x ∀y (x² + y² > 0)' },
      { id: 'B', text: '∀x ∃y (2y = x)' },
      { id: 'C', text: '∃x ∃y (2x + 4y = 7)' },
      { id: 'D', text: '∀x ∃y (y² = x)' },
      { id: 'E', text: '∃y ∀x (x + y = x)' },
    ],
    correct_option: 'E',
    explanation: 'y=0 satisfies x+y=x for all x. So ∃y∀x(x+y=x) is true. All other options have counterexamples in ℤ. Answer: E',
  },
  {
    question_number: 12,
    difficulty: 'Medium',
    question_text: 'Which of the following implications holds for EVERY open statement P(x, y) over any non-empty universe?',
    options: [
      { id: 'A', text: '∀x ∃y P(x,y) ⟹ ∃y ∀x P(x,y)' },
      { id: 'B', text: '∃y ∀x P(x,y) ⟹ ∀x ∃y P(x,y)' },
      { id: 'C', text: '∃x ∃y P(x,y) ⟹ ∀x ∃y P(x,y)' },
      { id: 'D', text: '∀x ∃y P(x,y) ⟺ ∃y ∀x P(x,y)' },
      { id: 'E', text: '∃x ∀y P(x,y) ⟺ ∀y ∃x P(x,y)' },
    ],
    correct_option: 'B',
    explanation: 'If there exists a y that works for ALL x, then for each x we can use that same y. This one-way implication always holds. Answer: B',
  },
  {
    question_number: 13,
    difficulty: 'Medium',
    question_text: 'Over the universe ℝ, the negation of ∃x ∀y (xy = y) and its truth value are',
    options: [
      { id: 'A', text: '∀x ∃y (xy ≠ y); true' },
      { id: 'B', text: '∃x ∀y (xy ≠ y); false' },
      { id: 'C', text: '∀x ∀y (xy ≠ y); false' },
      { id: 'D', text: '∀x ∃y (xy ≠ y); false' },
      { id: 'E', text: '∃x ∃y (xy ≠ y); true' },
    ],
    correct_option: 'D',
    explanation: 'Negation of ∃x∀y(xy=y) is ∀x∃y(xy≠y). x=1 gives xy=y for all y, so ∀x∃y(xy≠y) is false. Answer: D',
  },
  {
    question_number: 14,
    difficulty: 'Medium',
    question_text: 'Consider the argument form: p → q, q → r ⊢ r → p. In how many rows of its truth table are ALL premises true, and is the argument valid?',
    options: [
      { id: 'A', text: '4 rows; invalid' },
      { id: 'B', text: '4 rows; valid' },
      { id: 'C', text: '3 rows; valid' },
      { id: 'D', text: '3 rows; invalid' },
      { id: 'E', text: '5 rows; invalid' },
    ],
    correct_option: 'A',
    explanation: 'The premises are both true in 4 rows (p=T,q=T,r=T and others). In the row p=F,q=F,r=T premises are true but conclusion r→p=F. So invalid. Answer: A',
  },
  {
    question_number: 15,
    difficulty: 'Medium',
    question_text: 'Which one of the following argument forms is valid?',
    options: [
      { id: 'A', text: 'p → q, q → r, r ⊢ p' },
      { id: 'B', text: '(p ∨ q) → r, r ⊢ p ∨ q' },
      { id: 'C', text: 'p → (q ∨ r), ¬q ∧ ¬r ⊢ ¬p' },
      { id: 'D', text: 'p ∨ q, p → r ⊢ r' },
      { id: 'E', text: 'p → q, r → q ⊢ p ∨ r' },
    ],
    correct_option: 'C',
    explanation: 'Option C applies Modus Tollens: p→(q∨r) with ¬(q∨r)=¬q∧¬r gives ¬p. Valid. All others have counterexamples. Answer: C',
  },
  {
    question_number: 16,
    difficulty: 'Medium',
    question_text: '"It is not the case that both Abebe and Chaltu are in the room. Abebe is in the room. Therefore, Chaltu is not in the room." Which rule of inference justifies this argument?',
    options: [
      { id: 'A', text: 'Modus Ponens' },
      { id: 'B', text: 'Modus Tollens' },
      { id: 'C', text: 'Modus Tollendo Ponens' },
      { id: 'D', text: 'Constructive Dilemma' },
      { id: 'E', text: 'Modus Ponendo Tollens' },
    ],
    correct_option: 'E',
    explanation: 'From ¬(p∧q) and p, conclude ¬q. This is Modus Ponendo Tollens: asserting one conjunct denies the other. Answer: E',
  },
  {
    question_number: 17,
    difficulty: 'Medium',
    question_text: 'From the premises (1) ¬p ∨ q, (2) q → r, (3) ¬r, which conclusion can be validly derived?',
    options: [
      { id: 'A', text: 'p' },
      { id: 'B', text: '¬p' },
      { id: 'C', text: 'q' },
      { id: 'D', text: 'r' },
      { id: 'E', text: 'p ∧ ¬q' },
    ],
    correct_option: 'B',
    explanation: 'From (2)+(3): Modus Tollens gives ¬q. From (1)+¬q: Modus Tollendo Ponens gives ¬p (since ¬p∨q with q=F gives ¬p=T). Answer: B',
  },
  {
    question_number: 18,
    difficulty: 'Medium',
    question_text: '"If the team practices, then it wins. If it wins, then the crowd cheers. The crowd does not cheer. Either the team practices or the coach is fired. Therefore, the coach is fired." Which option correctly states the validity and a correct sequence of rules?',
    options: [
      { id: 'A', text: 'Valid: Syllogism → Modus Tollens → Modus Tollendo Ponens' },
      { id: 'B', text: 'Invalid: it affirms the consequent' },
      { id: 'C', text: 'Valid: Modus Ponens → Modus Ponens' },
      { id: 'D', text: 'Valid: Modus Ponendo Tollens → Syllogism' },
      { id: 'E', text: 'Invalid: the premises are inconsistent' },
    ],
    correct_option: 'A',
    explanation: 'p→q, q→r by Syllogism gives p→r. With ¬r, Modus Tollens gives ¬p. With p∨c and ¬p, Modus Tollendo Ponens gives c. Valid. Answer: A',
  },
  {
    question_number: 19,
    difficulty: 'Medium',
    question_text: '(p → q) ∧ (¬p → q) is logically equivalent to',
    options: [
      { id: 'A', text: 'p' },
      { id: 'B', text: 'p ∨ q' },
      { id: 'C', text: '¬q' },
      { id: 'D', text: 'q' },
      { id: 'E', text: 'a tautology' },
    ],
    correct_option: 'D',
    explanation: '(p→q)∧(¬p→q) ≡ (¬p∨q)∧(p∨q) ≡ q∨(¬p∧p) ≡ q∨F ≡ q. Answer: D',
  },
  {
    question_number: 20,
    difficulty: 'Medium',
    question_text: 'Which one of the following is NOT logically equivalent to p ↔ q?',
    options: [
      { id: 'A', text: '(p → q) ∧ (q → p)' },
      { id: 'B', text: '(p ∧ q) ∨ (¬p ∧ ¬q)' },
      { id: 'C', text: '(¬p ∨ q) ∧ (p ∨ ¬q)' },
      { id: 'D', text: '¬(p ↔ ¬q)' },
      { id: 'E', text: '(p → q) ∨ (q → p)' },
    ],
    correct_option: 'E',
    explanation: '(p→q)∨(q→p) is a tautology (always T), but p↔q is F when p=T,q=F. So E is NOT equivalent. Answer: E',
  },
  {
    question_number: 21,
    difficulty: 'Medium',
    question_text: 'Let A = {x ∈ ℤ : x² − 3x − 4 ≤ 0} and B = {x ∈ ℤ : |2x − 3| < 5}. How many proper subsets does A ∖ B have?',
    options: [
      { id: 'A', text: '2' },
      { id: 'B', text: '3' },
      { id: 'C', text: '4' },
      { id: 'D', text: '7' },
      { id: 'E', text: '15' },
    ],
    correct_option: 'B',
    explanation: 'A={−1,0,1,2,3,4}, B={0,1,2,3}. A∖B={−1,4} has 2 elements. Proper subsets = 2²−1 = 3. Answer: B',
  },
  {
    question_number: 22,
    difficulty: 'Medium',
    question_text: 'Set A has 3 more elements than set B, and the power set P(A) has 224 more elements than P(B). How many proper subsets does A have?',
    options: [
      { id: 'A', text: '31' },
      { id: 'B', text: '63' },
      { id: 'C', text: '127' },
      { id: 'D', text: '255' },
      { id: 'E', text: '256' },
    ],
    correct_option: 'D',
    explanation: '|B|=n, |A|=n+3. 2^(n+3)−2^n=224 → 7·2^n=224 → n=5, |A|=8. Proper subsets = 2^8−1 = 255. Answer: D',
  },
  {
    question_number: 23,
    difficulty: 'Medium',
    question_text: 'How many subsets of {1, 2, 3, 4, 5, 6, 7, 8} contain both 3 and 5 but do NOT contain 8?',
    options: [
      { id: 'A', text: '8' },
      { id: 'B', text: '16' },
      { id: 'C', text: '32' },
      { id: 'D', text: '64' },
      { id: 'E', text: '128' },
    ],
    correct_option: 'C',
    explanation: '3 and 5 are fixed in; 8 is fixed out. The remaining 5 elements {1,2,4,6,7} each can be in or out: 2^5 = 32. Answer: C',
  },
  {
    question_number: 24,
    difficulty: 'Medium',
    question_text: 'Let A = {1, {1}, {1, 2}, ∅}. Which one of the following statements is FALSE?',
    options: [
      { id: 'A', text: '{1, 2} ⊆ A' },
      { id: 'B', text: '{1} ⊂ A' },
      { id: 'C', text: '{{1}} ⊆ A' },
      { id: 'D', text: '∅ ∈ A' },
      { id: 'E', text: '{{1, 2}} ⊆ A' },
    ],
    correct_option: 'A',
    explanation: '{1,2}⊆A requires 1∈A (true) and 2∈A (false, only {1,2} is in A, not 2 itself). So A is FALSE. Answer: A',
  },
  {
    question_number: 25,
    difficulty: 'Medium',
    question_text: 'Let U = {1, 2, …, 12}, A = the set of primes in U, B = the set of even numbers in U, and C = the set of multiples of 3 in U. Then (A Δ B) ∖ C equals',
    options: [
      { id: 'A', text: '{3, 6, 12}' },
      { id: 'B', text: '{3, 4, 5, 6, 7, 8, 10, 11, 12}' },
      { id: 'C', text: '{4, 8, 10}' },
      { id: 'D', text: '{4, 5, 7, 8, 10, 11}' },
      { id: 'E', text: '{5, 7, 11}' },
    ],
    correct_option: 'D',
    explanation: 'A={2,3,5,7,11}, B={2,4,6,8,10,12}. AΔB={3,4,5,6,7,8,10,11,12}. Remove multiples of 3 (3,6,12): {4,5,7,8,10,11}. Answer: D',
  },
  {
    question_number: 26,
    difficulty: 'Medium',
    question_text: 'For any sets A, B and C, A ∖ (B ∪ C) is equal to',
    options: [
      { id: 'A', text: '(A ∖ B) ∪ (A ∖ C)' },
      { id: 'B', text: '(A ∖ B) ∩ (A ∖ C)' },
      { id: 'C', text: 'A′ ∩ (B ∪ C)' },
      { id: 'D', text: '(A ∩ B) ∖ C' },
      { id: 'E', text: 'A ∖ (B ∩ C)' },
    ],
    correct_option: 'B',
    explanation: 'x∈A∖(B∪C) ⟺ x∈A and x∉B and x∉C ⟺ x∈(A∖B)∩(A∖C). Answer: B',
  },
  {
    question_number: 27,
    difficulty: 'Medium',
    question_text: 'If A Δ B = A (where Δ denotes the symmetric difference), then',
    options: [
      { id: 'A', text: 'B = ∅' },
      { id: 'B', text: 'A = B' },
      { id: 'C', text: 'A = ∅' },
      { id: 'D', text: 'B = U' },
      { id: 'E', text: 'A ⊆ B' },
    ],
    correct_option: 'A',
    explanation: 'AΔB=A means (A∖B)∪(B∖A)=A. So B∖A=∅ and A∩B=∅, which forces B=∅. Check: AΔ∅=A ✓. Answer: A',
  },
  {
    question_number: 28,
    difficulty: 'Medium',
    question_text: '[(A ∩ B) ∪ (A ∩ B′)] ∪ (A′ ∩ B) simplifies to',
    options: [
      { id: 'A', text: 'A ∩ B' },
      { id: 'B', text: 'A Δ B' },
      { id: 'C', text: 'A ∪ B' },
      { id: 'D', text: 'U' },
      { id: 'E', text: 'A' },
    ],
    correct_option: 'C',
    explanation: '(A∩B)∪(A∩B′)=A∩(B∪B′)=A. Then A∪(A′∩B)=(A∪A′)∩(A∪B)=U∩(A∪B)=A∪B. Answer: C',
  },
  {
    question_number: 29,
    difficulty: 'Medium',
    question_text: 'Let A = {1, 2, 3} and B = {2, 3, 4}. How many elements does P(A) ∪ P(B) have, where P denotes the power set?',
    options: [
      { id: 'A', text: '8' },
      { id: 'B', text: '10' },
      { id: 'C', text: '12' },
      { id: 'D', text: '14' },
      { id: 'E', text: '16' },
    ],
    correct_option: 'C',
    explanation: '|P(A)|=8. Subsets of B containing 4 (not in P(A)): 2²=4. Total = 8+4 = 12. Answer: C',
  },
  {
    question_number: 30,
    difficulty: 'Medium',
    question_text: 'Let A = {x ∈ U : P(x)} and B = {x ∈ U : Q(x)}. The statement "A is not a subset of B" (A ⊄ B) is equivalent to',
    options: [
      { id: 'A', text: '∀x (P(x) ∧ ¬Q(x))' },
      { id: 'B', text: '∃x (P(x) ∧ ¬Q(x))' },
      { id: 'C', text: '∃x (P(x) → ¬Q(x))' },
      { id: 'D', text: '∀x (¬P(x) → Q(x))' },
      { id: 'E', text: '∃x (¬P(x) ∧ Q(x))' },
    ],
    correct_option: 'B',
    explanation: 'A⊄B means some element of A is not in B: ∃x(P(x)∧¬Q(x)). Answer: B',
  },
];

async function seedMathCh1() {
  console.log('🚀 Seeding Math Chapter 1 questions...');

  // 1. Get course MATH-1011
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id, code, title')
    .eq('code', 'MATH-1011')
    .single();

  if (courseErr || !course) {
    console.error('❌ Could not find course MATH-1011:', courseErr);
    process.exit(1);
  }

  // 2. Get Chapter 1
  const { data: chapter, error: chErr } = await supabase
    .from('chapters')
    .select('id, title, chapter_number')
    .eq('course_id', course.id)
    .eq('chapter_number', 1)
    .single();

  if (chErr || !chapter) {
    console.error('❌ Could not find chapter 1 for MATH-1011:', chErr);
    process.exit(1);
  }

  console.log(`📌 Found Chapter 1: "${chapter.title}" (ID: ${chapter.id})`);

  // 3. Clear existing questions
  const { error: delErr } = await supabase
    .from('questions')
    .delete()
    .eq('chapter_id', chapter.id);

  if (delErr) {
    console.error('❌ Error clearing old questions:', delErr);
    process.exit(1);
  }

  // 4. Insert 30 questions
  const rows = QUESTIONS.map((q) => ({
    chapter_id: chapter.id,
    ...q,
  }));

  const { data: inserted, error: insErr } = await supabase
    .from('questions')
    .insert(rows)
    .select('id, question_number');

  if (insErr) {
    console.error('❌ Error inserting questions:', insErr);
    process.exit(1);
  }

  console.log(`✅ Successfully seeded ${inserted.length} questions for Math Chapter 1!`);
}

seedMathCh1().catch(console.error);
