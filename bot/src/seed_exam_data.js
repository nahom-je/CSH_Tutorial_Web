// seed_exam_data.js — Seed all 7 Exam Subjects & 185 Authentic Exam Questions into Supabase
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const EXAM_SUBJECTS = [
  {
    code: "MATH-NAT",
    title: "Mathematics (Natural)",
    field: "Natural",
    duration_minutes: 60,
    question_count: 20,
  },
  {
    code: "MATH-SOC",
    title: "Mathematics (Social)",
    field: "Social",
    duration_minutes: 60,
    question_count: 20,
  },
  {
    code: "PHYS",
    title: "General Physics",
    field: "Natural",
    duration_minutes: 60,
    question_count: 30,
  },
  {
    code: "LOGIC",
    title: "Logic and Critical Thinking",
    field: "Both",
    duration_minutes: 60,
    question_count: 25,
  },
  {
    code: "PSYC",
    title: "General Psychology",
    field: "Both",
    duration_minutes: 60,
    question_count: 30,
  },
  {
    code: "GEOG",
    title: "Geography",
    field: "Both",
    duration_minutes: 60,
    question_count: 30,
  },
  {
    code: "ECON",
    title: "General Economics",
    field: "Social",
    duration_minutes: 60,
    question_count: 30,
  },
];

export const MATH_NAT_QUESTIONS = [
  {
    "question_number": 1,
    "question_text": "Let A = {∅, {1}, 2, {2, 3}}. Which one of the following is not true?",
    "options": [
      {
        "id": "A",
        "text": "∅ ⊆ A"
      },
      {
        "id": "B",
        "text": "{∅, 2} ⊆ A"
      },
      {
        "id": "C",
        "text": "{1} ⊆ A"
      },
      {
        "id": "D",
        "text": "{{1}} ⊆ A"
      }
    ],
    "correct_option": "C",
    "explanation": "{1} ⊆ A requires 1 ∈ A, but 1 ∉ A (the element of A is the set {1}). So C is not true.",
    "explanation_am": "{1} ⊆ A እንዲሆን 1 ∈ A መሆን አለበት፤ ግን 1 የ A አባል አይደለም (አባሉ {1} የተባለው ስብስብ ነው)። ስለዚህ C እውነት አይደለም።"
  },
  {
    "question_number": 2,
    "question_text": "A set A has 63 proper subsets. The number of elements of A is",
    "options": [
      {
        "id": "A",
        "text": "5"
      },
      {
        "id": "B",
        "text": "6"
      },
      {
        "id": "C",
        "text": "7"
      },
      {
        "id": "D",
        "text": "8"
      }
    ],
    "correct_option": "B",
    "explanation": "Proper subsets = 2^n − 1 = 63, so 2^n = 64 = 2^6 and n = 6.",
    "explanation_am": "n አባላት ያለው ስብስብ ትክክለኛ ንዑስ ስብስቦች ብዛት 2^n − 1 ነው፤ 2^n = 64 ስለዚህ n = 6።"
  },
  {
    "question_number": 3,
    "question_text": "Let U = {0, 1, 2, …, 8}, A = {x ∈ U : x is even} and B = {x ∈ U : x is a multiple of 3}. Then (A ∪ B)′ =",
    "options": [
      {
        "id": "A",
        "text": "{1, 5, 7}"
      },
      {
        "id": "B",
        "text": "{1, 5, 7, 8}"
      },
      {
        "id": "C",
        "text": "{3, 4}"
      },
      {
        "id": "D",
        "text": "{1, 3, 5, 7}"
      }
    ],
    "correct_option": "A",
    "explanation": "A = {0,2,4,6,8}, B = {0,3,6}, A ∪ B = {0,2,3,4,6,8}, so the complement in U is {1,5,7}.",
    "explanation_am": "መጀመሪያ A እና B ን እንዘረዝራለን፤ ህብረታቸውን A ∪ B = {0,2,3,4,6,8} እናገኛለን፤ ከ U ላይ ስናወጣ (A ∪ B)′ = {1, 5, 7}።"
  },
  {
    "question_number": 4,
    "question_text": "If n(A ∪ B) = 70, n(A) = 45 and n(B) = 40, then n(A Δ B) =",
    "options": [
      {
        "id": "A",
        "text": "15"
      },
      {
        "id": "B",
        "text": "25"
      },
      {
        "id": "C",
        "text": "55"
      },
      {
        "id": "D",
        "text": "70"
      }
    ],
    "correct_option": "C",
    "explanation": "n(A ∩ B) = 45 + 40 − 70 = 15. n(A Δ B) = n(A ∪ B) − n(A ∩ B) = 70 − 15 = 55.",
    "explanation_am": "n(A ∩ B) = 45 + 40 − 70 = 15፤ n(A Δ B) = 70 − 15 = 55።"
  },
  {
    "question_number": 5,
    "question_text": "Let A, B and C be sets such that A ∩ B = ∅ and C ⊆ B. Then (A ∪ C) \\ B is equal to",
    "options": [
      {
        "id": "A",
        "text": "∅"
      },
      {
        "id": "B",
        "text": "A"
      },
      {
        "id": "C",
        "text": "C"
      },
      {
        "id": "D",
        "text": "A ∪ B"
      }
    ],
    "correct_option": "B",
    "explanation": "C ⊆ B gives C \\ B = ∅; A ∩ B = ∅ gives A \\ B = A. So (A ∪ C) \\ B = A ∪ ∅ = A.",
    "explanation_am": "C ⊆ B ስለሆነ C \\ B = ∅፤ A ∩ B = ∅ ስለሆነ A \\ B = A። ስለዚህ (A ∪ C) \\ B = A።"
  },
  {
    "question_number": 6,
    "question_text": "How many subsets of {1, 2, 3, 4, 5} contain both 1 and 2?",
    "options": [
      {
        "id": "A",
        "text": "4"
      },
      {
        "id": "B",
        "text": "6"
      },
      {
        "id": "C",
        "text": "8"
      },
      {
        "id": "D",
        "text": "16"
      }
    ],
    "correct_option": "C",
    "explanation": "1 and 2 are fixed in; each of 3, 4, 5 is in or out: 2^3 = 8.",
    "explanation_am": "1 እና 2 ሁልጊዜ ይገባሉ፤ የቀሩት 3 አባላት ሊገቡም ላይገቡም ይችላሉ፤ 2^3 = 8።"
  },
  {
    "question_number": 7,
    "question_text": "In a class of 80 students, 50 like mathematics, 45 like physics and 20 like both. How many students like neither subject?",
    "options": [
      {
        "id": "A",
        "text": "5"
      },
      {
        "id": "B",
        "text": "10"
      },
      {
        "id": "C",
        "text": "15"
      },
      {
        "id": "D",
        "text": "25"
      }
    ],
    "correct_option": "A",
    "explanation": "n(M ∪ P) = 50 + 45 − 20 = 75. Neither = 80 − 75 = 5.",
    "explanation_am": "n(M ∪ P) = 50 + 45 − 20 = 75፤ ሁለቱንም የማይወዱ = 80 − 75 = 5።"
  },
  {
    "question_number": 8,
    "question_text": "A survey of 200 people showed that 110 drink tea, 90 drink coffee, 70 drink juice, 40 drink tea and coffee, 30 drink coffee and juice, 25 drink tea and juice, and 10 drink all three. How many people drink at least one of the three?",
    "options": [
      {
        "id": "A",
        "text": "110"
      },
      {
        "id": "B",
        "text": "175"
      },
      {
        "id": "C",
        "text": "15"
      },
      {
        "id": "D",
        "text": "185"
      }
    ],
    "correct_option": "D",
    "explanation": "110 + 90 + 70 − 40 − 30 − 25 + 10 = 270 − 95 + 10 = 185.",
    "explanation_am": "የሦስት ስብስብ ህብረት ቀመር (inclusion–exclusion) እንጠቀማለን፦ 110 + 90 + 70 − 40 − 30 − 25 + 10 = 185።"
  },
  {
    "question_number": 9,
    "question_text": "Of the students in a club, 40 play football, 15 play chess and 20 play athletics. A total of 50 students took part and only 3 play all three games. How many students play exactly two of the games?",
    "options": [
      {
        "id": "A",
        "text": "16"
      },
      {
        "id": "B",
        "text": "19"
      },
      {
        "id": "C",
        "text": "28"
      },
      {
        "id": "D",
        "text": "22"
      }
    ],
    "correct_option": "B",
    "explanation": "50 = 40 + 15 + 20 − S + 3, so the sum of pairwise intersections S = 28. Each pairwise intersection includes the 3 who play all, so exactly two = 28 − 3×3 = 19.",
    "explanation_am": "ጥንድ መጋጠሚያዎች ድምር = 75 + 3 − 50 = 28፤ ሦስቱንም የሚጫወቱ በእያንዳንዱ ጥንድ ውስጥ ስለሚካተቱ ሁለት ብቻ = 28 − 9 = 19።"
  },
  {
    "question_number": 10,
    "question_text": "How many subsets does the set A = {x ∈ ℤ : −2 < x ≤ 3} have?",
    "options": [
      {
        "id": "A",
        "text": "16"
      },
      {
        "id": "B",
        "text": "31"
      },
      {
        "id": "C",
        "text": "32"
      },
      {
        "id": "D",
        "text": "64"
      }
    ],
    "correct_option": "C",
    "explanation": "A = {−1, 0, 1, 2, 3} has 5 elements, so 2^5 = 32 subsets.",
    "explanation_am": "A = {−1, 0, 1, 2, 3} ማለትም 5 አባላት፤ ንዑስ ስብስቦች = 2^5 = 32።"
  },
  {
    "question_number": 11,
    "question_text": "To prove by induction that 2 + 6 + 10 + … + (4n − 2) = 2n², in the inductive step the sum 2k² + (4k + 2) simplifies to",
    "options": [
      {
        "id": "A",
        "text": "2(k + 1)²"
      },
      {
        "id": "B",
        "text": "2(k² + 1)"
      },
      {
        "id": "C",
        "text": "2k(k + 2)"
      },
      {
        "id": "D",
        "text": "(k + 1)²"
      }
    ],
    "correct_option": "A",
    "explanation": "2k² + 4k + 2 = 2(k² + 2k + 1) = 2(k + 1)².",
    "explanation_am": "2k² + 4k + 2 = 2(k² + 2k + 1) = 2(k + 1)²።"
  },
  {
    "question_number": 12,
    "question_text": "In proving that 3^(2n+2) + 8n − 9 is divisible by 16, write 3^(2k+4) + 8(k + 1) − 9 = 9(3^(2k+2) + 8k − 9) + R. Then R =",
    "options": [
      {
        "id": "A",
        "text": "64k − 80"
      },
      {
        "id": "B",
        "text": "72k − 81"
      },
      {
        "id": "C",
        "text": "−72k + 81"
      },
      {
        "id": "D",
        "text": "−64k + 80"
      }
    ],
    "correct_option": "D",
    "explanation": "9(3^(2k+2) + 8k − 9) = 9·3^(2k+2) + 72k − 81. R = (8k − 1) − (72k − 81) = −64k + 80 = −16(4k − 5), divisible by 16.",
    "explanation_am": "R = (8k − 1) − (72k − 81) = −64k + 80 = −16(4k − 5)፤ ይህም በ 16 ይካፈላል፤ ስለዚህ የኢንዳክሽን ደረጃ ተጠናቋል።"
  },
  {
    "question_number": 13,
    "question_text": "Which one of the following statements is true (well-ordering axiom)?",
    "options": [
      {
        "id": "A",
        "text": "Every non-empty subset of ℤ has a least element."
      },
      {
        "id": "B",
        "text": "Every non-empty subset of ℚ has a least element."
      },
      {
        "id": "C",
        "text": "Every non-empty subset of ℕ has a least element."
      },
      {
        "id": "D",
        "text": "Every non-empty subset of ℝ has a least element."
      }
    ],
    "correct_option": "C",
    "explanation": "The well-ordering axiom applies to ℕ. ℤ, ℚ, ℝ fail: {…, −2, −1} ⊆ ℤ and (0, 1) have no least element.",
    "explanation_am": "የ well-ordering axiom መሠረት እያንዳንዱ ባዶ ያልሆነ የ ℕ ንዑስ ስብስብ ትንሽ አባል አለው። ለ ℤ፣ ℚ፣ ℝ አይሰራም (ለምሳሌ (0, 1) ትንሽ አባል የለውም)።"
  },
  {
    "question_number": 14,
    "question_text": "If GCF(x, 90) = 15 and LCM(x, 90) = 450, then x =",
    "options": [
      {
        "id": "A",
        "text": "45"
      },
      {
        "id": "B",
        "text": "75"
      },
      {
        "id": "C",
        "text": "60"
      },
      {
        "id": "D",
        "text": "150"
      }
    ],
    "correct_option": "B",
    "explanation": "GCF × LCM = x × 90, so 15 × 450 = 90x, 6750 = 90x, x = 75.",
    "explanation_am": "ለሁለት ቁጥሮች GCF × LCM = የሁለቱ ቁጥሮች ብዜት፤ 15 × 450 = 90x ስለዚህ x = 75።"
  },
  {
    "question_number": 15,
    "question_text": "If x = GCF(36, 60, 84, 108) and y = LCM(36, 60, 84, 108), then xy =",
    "options": [
      {
        "id": "A",
        "text": "3780"
      },
      {
        "id": "B",
        "text": "12"
      },
      {
        "id": "C",
        "text": "22680"
      },
      {
        "id": "D",
        "text": "45360"
      }
    ],
    "correct_option": "D",
    "explanation": "36 = 2²·3², 60 = 2²·3·5, 84 = 2²·3·7, 108 = 2²·3³. GCF = 2²·3 = 12; LCM = 2²·3³·5·7 = 3780; xy = 12 × 3780 = 45360.",
    "explanation_am": "GCF = የጋራ ምክንያቶች ዝቅተኛ ሃይል = 12፤ LCM = ሁሉም ምክንያቶች ከፍተኛ ሃይል = 3780። xy = 12 × 3780 = 45360።"
  },
  {
    "question_number": 16,
    "question_text": "Which one of the following statements is true?",
    "options": [
      {
        "id": "A",
        "text": "Every non-empty subset of ℝ that is bounded above has a least upper bound."
      },
      {
        "id": "B",
        "text": "The sum of any two irrational numbers is irrational."
      },
      {
        "id": "C",
        "text": "The product of any rational number and any irrational number is irrational."
      },
      {
        "id": "D",
        "text": "For any real numbers a, b, c, if a < b then ac < bc."
      }
    ],
    "correct_option": "A",
    "explanation": "B is false: √2 + (−√2) = 0. C is false: 0·√2 = 0. D is false when c ≤ 0. A is the completeness property of ℝ.",
    "explanation_am": "ሐሰቶቹ፦ √2 + (−√2) = 0 ምክንያታዊ ነው፤ 0 · √2 = 0 ምክንያታዊ ነው፤ c ≤ 0 ሲሆን ac < bc አይሰራም። ትክክለኛው የ ℝ የሙላት (completeness) ባሕርይ ነው።"
  },
  {
    "question_number": 17,
    "question_text": "The least upper bound of A = {x ∈ ℝ : x² < 5} is",
    "options": [
      {
        "id": "A",
        "text": "5"
      },
      {
        "id": "B",
        "text": "−√5"
      },
      {
        "id": "C",
        "text": "√5"
      },
      {
        "id": "D",
        "text": "5/2"
      }
    ],
    "correct_option": "C",
    "explanation": "x² < 5 ⇔ −√5 < x < √5, so A = (−√5, √5) and lub A = √5 (not attained).",
    "explanation_am": "x² < 5 ማለት −√5 < x < √5፤ ስለዚህ ትንሹ የላይኛው ወሰን = √5 (በስብስቡ ውስጥ የለም)።"
  },
  {
    "question_number": 18,
    "question_text": "The repeating decimal 0.363636… written as a fraction in lowest terms is",
    "options": [
      {
        "id": "A",
        "text": "3/11"
      },
      {
        "id": "B",
        "text": "7/22"
      },
      {
        "id": "C",
        "text": "36/100"
      },
      {
        "id": "D",
        "text": "4/11"
      }
    ],
    "correct_option": "D",
    "explanation": "x = 0.3636…, 100x − x = 36, so 99x = 36 and x = 36/99 = 4/11.",
    "explanation_am": "x = 0.3636… ይሁን፤ 100x − x = 36 ስለዚህ 99x = 36፤ x = 36/99 = 4/11።"
  },
  {
    "question_number": 19,
    "question_text": "The least upper bound of A = {(−1)^n (2 + 1/n) : n ∈ ℕ} is",
    "options": [
      {
        "id": "A",
        "text": "3"
      },
      {
        "id": "B",
        "text": "5/2"
      },
      {
        "id": "C",
        "text": "2"
      },
      {
        "id": "D",
        "text": "−3"
      }
    ],
    "correct_option": "B",
    "explanation": "For even n the value is 2 + 1/n, largest at n = 2: 5/2. For odd n the value is negative. So lub A = 5/2.",
    "explanation_am": "n በ 2 ሲካፈል (even) 2 + 1/n ትልቁ n = 2 ላይ 5/2 ነው፤ n ጎዶሎ ሲሆን እሴቱ አሉታዊ ነው። ስለዚህ lub = 5/2።"
  },
  {
    "question_number": 20,
    "question_text": "The greatest lower bound of A = {2 + n/(n + 1)² : n ∈ ℕ} is",
    "options": [
      {
        "id": "A",
        "text": "2"
      },
      {
        "id": "B",
        "text": "9/4"
      },
      {
        "id": "C",
        "text": "0"
      },
      {
        "id": "D",
        "text": "1/4"
      }
    ],
    "correct_option": "A",
    "explanation": "n/(n+1)²: 1/4, 2/9, 3/16, … decreases toward 0, so the terms 2.25, 2.22, 2.19, … approach 2 without reaching it. glb A = 2.",
    "explanation_am": "n/(n + 1)² እየቀነሰ ወደ 0 ይጠጋል፤ የ A አባላት ወደ 2 ይጠጋሉ እንጂ አይደርሱበትም። ስለዚህ glb = 2።"
  }
];
export const MATH_SOC_QUESTIONS = [
  {
    "question_number": 1,
    "question_text": "Let A = {x : x² − 5x + 6 = 0} and B = {x : x² − x − 6 = 0}. Then A − B is",
    "options": [
      {
        "id": "A",
        "text": "{3}"
      },
      {
        "id": "B",
        "text": "{2}"
      },
      {
        "id": "C",
        "text": "{2, 3}"
      },
      {
        "id": "D",
        "text": "{−2}"
      }
    ],
    "correct_option": "B",
    "explanation": "A = {2, 3} since (x−2)(x−3) = 0. B = {3, −2} since (x−3)(x+2) = 0. A − B = {2}.",
    "explanation_am": "A = {2, 3}፣ B = {3, −2} ብለን እንፈታለን፤ A − B ከ A ውስጥ በ B ውስጥ ያሉትን ማውጣት ነው፤ ስለዚህ A − B = {2}።"
  },
  {
    "question_number": 2,
    "question_text": "Let n(U) = 500, n(A) = 180, n(B) = 220 and n(A ∩ B) = 60. Then n(A′ ∩ B′) =",
    "options": [
      {
        "id": "A",
        "text": "340"
      },
      {
        "id": "B",
        "text": "200"
      },
      {
        "id": "C",
        "text": "160"
      },
      {
        "id": "D",
        "text": "400"
      }
    ],
    "correct_option": "C",
    "explanation": "n(A ∪ B) = 180 + 220 − 60 = 340. By De Morgan, A′ ∩ B′ = (A ∪ B)′, so 500 − 340 = 160.",
    "explanation_am": "A′ ∩ B′ = (A ∪ B)′ (የዲ ሞርጋን ሕግ)፤ n(A ∪ B) = 340 ስለዚህ 500 − 340 = 160።"
  },
  {
    "question_number": 3,
    "question_text": "In a class of 60 students, 35 play football, 28 play volleyball and 12 play both. How many students play exactly one of the two games?",
    "options": [
      {
        "id": "A",
        "text": "39"
      },
      {
        "id": "B",
        "text": "51"
      },
      {
        "id": "C",
        "text": "27"
      },
      {
        "id": "D",
        "text": "9"
      }
    ],
    "correct_option": "A",
    "explanation": "Football only = 35 − 12 = 23; volleyball only = 28 − 12 = 16; exactly one = 23 + 16 = 39.",
    "explanation_am": "እግር ኳስ ብቻ = 35 − 12 = 23፤ ቮሊቦል ብቻ = 28 − 12 = 16፤ አንድ ብቻ = 23 + 16 = 39።"
  },
  {
    "question_number": 4,
    "question_text": "Of 120 employees, 60 use Excel, 50 use Word and 40 use PowerPoint. Also 20 use Excel and Word, 15 use Word and PowerPoint, 12 use Excel and PowerPoint, and 6 use all three. How many employees use at least one of the three programs?",
    "options": [
      {
        "id": "A",
        "text": "103"
      },
      {
        "id": "B",
        "text": "11"
      },
      {
        "id": "C",
        "text": "120"
      },
      {
        "id": "D",
        "text": "109"
      }
    ],
    "correct_option": "D",
    "explanation": "60 + 50 + 40 − 20 − 15 − 12 + 6 = 150 − 47 + 6 = 109.",
    "explanation_am": "የሦስት ስብስብ ህብረት ቀመር፦ 60 + 50 + 40 − 20 − 15 − 12 + 6 = 109።"
  },
  {
    "question_number": 5,
    "question_text": "Using the data of the previous question, how many employees use exactly two of the three programs?",
    "options": [
      {
        "id": "A",
        "text": "47"
      },
      {
        "id": "B",
        "text": "29"
      },
      {
        "id": "C",
        "text": "35"
      },
      {
        "id": "D",
        "text": "23"
      }
    ],
    "correct_option": "B",
    "explanation": "Each pair includes the 6 who use all three: (20 − 6) + (15 − 6) + (12 − 6) = 14 + 9 + 6 = 29.",
    "explanation_am": "በእያንዳንዱ ጥንድ ውስጥ ሦስቱንም የሚጠቀሙ 6 ሰዎች ስላሉ እናወጣለን፦ 14 + 9 + 6 = 29።"
  },
  {
    "question_number": 6,
    "question_text": "Which one of the following is true about A Δ B, where Δ is the symmetric difference?",
    "options": [
      {
        "id": "A",
        "text": "A Δ B = A ∩ B"
      },
      {
        "id": "B",
        "text": "A Δ B ⊆ A ∩ B"
      },
      {
        "id": "C",
        "text": "A ∪ B ⊆ A Δ B"
      },
      {
        "id": "D",
        "text": "A Δ B = (A ∪ B) \\ (A ∩ B)"
      }
    ],
    "correct_option": "D",
    "explanation": "By definition A Δ B = (A \\ B) ∪ (B \\ A) = (A ∪ B) \\ (A ∩ B). Example: A = {1,2}, B = {2,3} gives A Δ B = {1,3} while A ∩ B = {2}.",
    "explanation_am": "የ symmetric difference ትርጓሜ፦ A Δ B = (A ∪ B) \\ (A ∩ B)። ሌሎቹ በምሳሌ ሐሰት ናቸው (A = {1,2}፣ B = {2,3} ሲሆን A Δ B = {1,3})።"
  },
  {
    "question_number": 7,
    "question_text": "Let A = {1, {2}, {1, 2}}. Which one of the following is true?",
    "options": [
      {
        "id": "A",
        "text": "{{2}} ⊆ A"
      },
      {
        "id": "B",
        "text": "{2} ⊆ A"
      },
      {
        "id": "C",
        "text": "{1, 2} ⊆ A"
      },
      {
        "id": "D",
        "text": "2 ∈ A"
      }
    ],
    "correct_option": "A",
    "explanation": "{2} is an element of A, so {{2}} ⊆ A. But 2 ∉ A, so {2} ⊆ A and {1, 2} ⊆ A are false.",
    "explanation_am": "{2} የ A አባል ነው፤ ስለዚህ {{2}} ⊆ A እውነት ነው። 2 ራሱ የ A አባል አይደለም፤ ስለዚህ ሌሎቹ ሐሰት ናቸው።"
  },
  {
    "question_number": 8,
    "question_text": "A set A has 127 proper subsets. The number of elements of A is",
    "options": [
      {
        "id": "A",
        "text": "6"
      },
      {
        "id": "B",
        "text": "8"
      },
      {
        "id": "C",
        "text": "7"
      },
      {
        "id": "D",
        "text": "127"
      }
    ],
    "correct_option": "C",
    "explanation": "2^n − 1 = 127, so 2^n = 128 = 2^7 and n = 7.",
    "explanation_am": "ትክክለኛ ንዑስ ስብስቦች = 2^n − 1 = 127፤ 2^n = 128 ስለዚህ n = 7።"
  },
  {
    "question_number": 9,
    "question_text": "Let U = {1, 2, …, 10}, A = {x ∈ U : x is prime} and B = {x ∈ U : x is odd}. Then (A ∪ B)′ =",
    "options": [
      {
        "id": "A",
        "text": "{2, 4, 6, 8, 10}"
      },
      {
        "id": "B",
        "text": "{4, 6, 8, 10}"
      },
      {
        "id": "C",
        "text": "{4, 6, 8}"
      },
      {
        "id": "D",
        "text": "{1, 9}"
      }
    ],
    "correct_option": "B",
    "explanation": "A = {2,3,5,7}, B = {1,3,5,7,9}, A ∪ B = {1,2,3,5,7,9}, so the complement is {4,6,8,10}.",
    "explanation_am": "A እና B ን እንዘረዝራለን፤ A ∪ B = {1,2,3,5,7,9}፤ ከ U የቀሩት (A ∪ B)′ = {4, 6, 8, 10}።"
  },
  {
    "question_number": 10,
    "question_text": "The repeating decimal 0.272727… written as a fraction in lowest terms is",
    "options": [
      {
        "id": "A",
        "text": "27/100"
      },
      {
        "id": "B",
        "text": "1/4"
      },
      {
        "id": "C",
        "text": "2/7"
      },
      {
        "id": "D",
        "text": "3/11"
      }
    ],
    "correct_option": "D",
    "explanation": "x = 0.2727…, 100x − x = 27, so 99x = 27 and x = 27/99 = 3/11.",
    "explanation_am": "x = 0.2727… ይሁን፤ 100x − x = 27 ስለዚህ 99x = 27፤ x = 27/99 = 3/11።"
  },
  {
    "question_number": 11,
    "question_text": "If r1 and r2 are the roots of x² − 4x − 3 = 0, then r1² + r2² =",
    "options": [
      {
        "id": "A",
        "text": "22"
      },
      {
        "id": "B",
        "text": "10"
      },
      {
        "id": "C",
        "text": "16"
      },
      {
        "id": "D",
        "text": "19"
      }
    ],
    "correct_option": "A",
    "explanation": "Sum = 4, product = −3. r1² + r2² = (sum)² − 2(product) = 16 + 6 = 22.",
    "explanation_am": "የሥሮች ድምር = −b/a = 4፣ ብዜት = c/a = −3። r1² + r2² = (ድምር)² − 2(ብዜት) = 16 + 6 = 22።"
  },
  {
    "question_number": 12,
    "question_text": "For what value of k does the equation kx² − 6x + 9 = 0 have two equal real roots?",
    "options": [
      {
        "id": "A",
        "text": "3"
      },
      {
        "id": "B",
        "text": "9"
      },
      {
        "id": "C",
        "text": "1"
      },
      {
        "id": "D",
        "text": "−1"
      }
    ],
    "correct_option": "C",
    "explanation": "Equal roots need discriminant 0: (−6)² − 4(k)(9) = 36 − 36k = 0, so k = 1.",
    "explanation_am": "እኩል ሥሮች እንዲኖሩ ዲስክሪሚናንት D = b² − 4ac = 0 መሆን አለበት፤ 36 − 36k = 0 ስለዚህ k = 1።"
  },
  {
    "question_number": 13,
    "question_text": "The solution set of x² − x − 12 < 0 is",
    "options": [
      {
        "id": "A",
        "text": "(−4, 3)"
      },
      {
        "id": "B",
        "text": "(−3, 4)"
      },
      {
        "id": "C",
        "text": "(−∞, −3) ∪ (4, ∞)"
      },
      {
        "id": "D",
        "text": "[−3, 4]"
      }
    ],
    "correct_option": "B",
    "explanation": "x² − x − 12 = (x − 4)(x + 3) < 0 between the roots: −3 < x < 4.",
    "explanation_am": "(x − 4)(x + 3) < 0 የሚሆነው በሁለቱ ሥሮች መካከል ነው፤ ስለዚህ −3 < x < 4 ማለትም (−3, 4)።"
  },
  {
    "question_number": 14,
    "question_text": "Let A = {1, 2, 3} and B = {a, b}. The number of relations from A to B is",
    "options": [
      {
        "id": "A",
        "text": "6"
      },
      {
        "id": "B",
        "text": "36"
      },
      {
        "id": "C",
        "text": "32"
      },
      {
        "id": "D",
        "text": "64"
      }
    ],
    "correct_option": "D",
    "explanation": "n(A × B) = 3 × 2 = 6. A relation is any subset of A × B, so 2^6 = 64.",
    "explanation_am": "n(A × B) = 6፤ ከ A ወደ B ያለ ማንኛውም ግንኙነት የ A × B ንዑስ ስብስብ ነው፤ ስለዚህ 2^6 = 64።"
  },
  {
    "question_number": 15,
    "question_text": "The domain of f(x) = √(x − 3)/(x − 5) is",
    "options": [
      {
        "id": "A",
        "text": "[3, 5) ∪ (5, ∞)"
      },
      {
        "id": "B",
        "text": "[3, ∞)"
      },
      {
        "id": "C",
        "text": "(3, 5) ∪ (5, ∞)"
      },
      {
        "id": "D",
        "text": "ℝ \\ {5}"
      }
    ],
    "correct_option": "A",
    "explanation": "Need x − 3 ≥ 0 (x ≥ 3) and x − 5 ≠ 0 (x ≠ 5). Domain = [3, 5) ∪ (5, ∞).",
    "explanation_am": "ከካሬ ሥሩ ስር x − 3 ≥ 0 መሆን አለበት፤ ተከፋዩ x − 5 ≠ 0 መሆን አለበት። Domain = [3, 5) ∪ (5, ∞)።"
  },
  {
    "question_number": 16,
    "question_text": "The range of f(x) = x² − 4x + 5 is",
    "options": [
      {
        "id": "A",
        "text": "(1, ∞)"
      },
      {
        "id": "B",
        "text": "(−∞, 1]"
      },
      {
        "id": "C",
        "text": "[1, ∞)"
      },
      {
        "id": "D",
        "text": "[5, ∞)"
      }
    ],
    "correct_option": "C",
    "explanation": "f(x) = (x − 2)² + 1 ≥ 1, and the value 1 is reached at x = 2. Range = [1, ∞).",
    "explanation_am": "ካሬውን በማሟላት f(x) = (x − 2)² + 1 ≥ 1፤ x = 2 ላይ 1 ስለሚደርስ Range = [1, ∞)።"
  },
  {
    "question_number": 17,
    "question_text": "If f(x) = 2x − 3 and g(x) = x² + 1, then (f ∘ g)(x) =",
    "options": [
      {
        "id": "A",
        "text": "4x² − 12x + 10"
      },
      {
        "id": "B",
        "text": "2x² − 1"
      },
      {
        "id": "C",
        "text": "2x² + 1"
      },
      {
        "id": "D",
        "text": "2x² − 3"
      }
    ],
    "correct_option": "B",
    "explanation": "(f ∘ g)(x) = f(x² + 1) = 2(x² + 1) − 3 = 2x² − 1. (4x² − 12x + 10 is (g ∘ f)(x).)",
    "explanation_am": "(f ∘ g)(x) = f(g(x)) = 2(x² + 1) − 3 = 2x² − 1። (4x² − 12x + 10 የ (g ∘ f)(x) ነው።)"
  },
  {
    "question_number": 18,
    "question_text": "Which one of the following functions f : ℝ → ℝ is one-to-one?",
    "options": [
      {
        "id": "A",
        "text": "f(x) = 2x + 5"
      },
      {
        "id": "B",
        "text": "f(x) = x²"
      },
      {
        "id": "C",
        "text": "f(x) = |x|"
      },
      {
        "id": "D",
        "text": "f(x) = x⁴"
      }
    ],
    "correct_option": "A",
    "explanation": "2x + 5 is strictly increasing, so a ≠ b gives f(a) ≠ f(b). For x², |x|, x⁴: f(−1) = f(1) but −1 ≠ 1.",
    "explanation_am": "2x + 5 ሁልጊዜ እየጨመረ ስለሚሄድ አንድ-ለአንድ ነው። x²፣ |x|፣ x⁴: f(−1) = f(1) ስለሆነ አንድ-ለአንድ አይደሉም።"
  },
  {
    "question_number": 19,
    "question_text": "The inverse of f(x) = 2x − 3 is f⁻¹(x) =",
    "options": [
      {
        "id": "A",
        "text": "(x − 3)/2"
      },
      {
        "id": "B",
        "text": "2x + 3"
      },
      {
        "id": "C",
        "text": "1/(2x − 3)"
      },
      {
        "id": "D",
        "text": "(x + 3)/2"
      }
    ],
    "correct_option": "D",
    "explanation": "y = 2x − 3; swap: x = 2y − 3; 2y = x + 3; y = (x + 3)/2.",
    "explanation_am": "y = 2x − 3 ብለን x እና y ን እንለዋወጣለን፤ x = 2y − 3 ⇒ y = (x + 3)/2።"
  },
  {
    "question_number": 20,
    "question_text": "The inverse of f(x) = (3x − 1)/(x + 2) is f⁻¹(x) =",
    "options": [
      {
        "id": "A",
        "text": "(2x + 1)/(x − 3)"
      },
      {
        "id": "B",
        "text": "(x + 2)/(3x − 1)"
      },
      {
        "id": "C",
        "text": "(2x + 1)/(3 − x)"
      },
      {
        "id": "D",
        "text": "(2x − 1)/(3 − x)"
      }
    ],
    "correct_option": "C",
    "explanation": "Swap: x = (3y − 1)/(y + 2); xy + 2x = 3y − 1; xy − 3y = −1 − 2x; y(x − 3) = −(2x + 1); y = (2x + 1)/(3 − x).",
    "explanation_am": "x እና y ን እንለዋወጣለን፤ y ን ለይተን እንፈታለን፦ y(x − 3) = −(2x + 1) ስለዚህ f⁻¹(x) = (2x + 1)/(3 − x)።"
  }
];
export const PHYS_QUESTIONS = [
  {
    "question_number": 1,
    "question_text": "An object can have zero average velocity over a time interval while its average speed over the same interval is not zero.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "A",
    "explanation": "Example: a walker returns to the start. Displacement = 0 ⇒ average velocity = 0, but distance ≠ 0 ⇒ average speed ≠ 0. (ወደ መነሻ ነጥብ ሲመለስ መፈናቀል 0 ነው፤ አማካይ ፍጥነት ከአቅጣጫ ጋር 0 ነው፤ የተጓዘው ርቀት ግን 0 ስላልሆነ አማካይ ፍጥነት 0 አይደለም።)"
  },
  {
    "question_number": 2,
    "question_text": "The slope of a velocity–time graph gives the displacement of the object.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "B",
    "explanation": "Slope of a v–t graph gives acceleration; the area under the v–t graph gives displacement. (የ v–t ግራፍ ዳገት ማፍጠኛን ይሰጣል፤ ከግራፉ በታች ያለው ስፋት መፈናቀልን ይሰጣል።)"
  },
  {
    "question_number": 3,
    "question_text": "At the highest point of its path, the acceleration of a projectile is zero (neglect air resistance).",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "B",
    "explanation": "At every point (including the top) a = g = 10 m/s² downward; only the vertical velocity vy is zero at the top. (በመንገዱ ሁሉ ማፍጠኛው g ወደ ታች ነው፤ በከፍተኛው ነጥብ ላይ ዜሮ የሚሆነው ቀጥታ ፍጥነት ብቻ ነው።)"
  },
  {
    "question_number": 4,
    "question_text": "Two vectors of magnitudes 3 units and 4 units can have a resultant of magnitude 8 units.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "B",
    "explanation": "Maximum resultant = 3 + 4 = 7 < 8, so 8 is impossible. The allowable range is 1 ≤ R ≤ 7. (ከፍተኛው ውጤት 3 + 4 = 7 ነው፤ ስለዚህ 8 ሊሆን አይችልም።)"
  },
  {
    "question_number": 5,
    "question_text": "The speed of a projectile launched at an angle θ (0° < θ < 90°) is minimum at the highest point of its path.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "A",
    "explanation": "At the top vy = 0, so speed = vx = u cos θ, which is the minimum speed along the path. (በከፍተኛው ነጥብ vy = 0 ስለሆነ ፍጥነቱ vx = u cos θ ብቻ ነው፤ ይህ በመንገዱ ላይ ያለው ትንሹ ፍጥነት ነው።)"
  },
  {
    "question_number": 6,
    "question_text": "A car travels 120 km at 60 km/h and then another 120 km at 40 km/h in the same direction. Its average speed for the whole trip is",
    "options": [
      {
        "id": "A",
        "text": "50 km/h"
      },
      {
        "id": "B",
        "text": "48 km/h"
      },
      {
        "id": "C",
        "text": "52 km/h"
      },
      {
        "id": "D",
        "text": "45 km/h"
      }
    ],
    "correct_option": "B",
    "explanation": "t1 = 120/60 = 2 h; t2 = 120/40 = 3 h. Average speed = total distance / total time = 240 / (2 + 3) = 240 / 5 = 48 km/h. (Taking (60 + 40)/2 = 50 is incorrect because times spent are different)."
  },
  {
    "question_number": 7,
    "question_text": "Two vectors have magnitudes 5 units and 9 units. Which one of the following can not be the magnitude of their resultant?",
    "options": [
      {
        "id": "A",
        "text": "3 units"
      },
      {
        "id": "B",
        "text": "4 units"
      },
      {
        "id": "C",
        "text": "9 units"
      },
      {
        "id": "D",
        "text": "14 units"
      }
    ],
    "correct_option": "A",
    "explanation": "Resultant range: |9 − 5| ≤ R ≤ 9 + 5 ⇒ 4 ≤ R ≤ 14. 3 units is outside this range."
  },
  {
    "question_number": 8,
    "question_text": "If A = 3î + 4ĵ and B = 2î − ĵ, then A · B =",
    "options": [
      {
        "id": "A",
        "text": "10"
      },
      {
        "id": "B",
        "text": "−2"
      },
      {
        "id": "C",
        "text": "2"
      },
      {
        "id": "D",
        "text": "6"
      }
    ],
    "correct_option": "C",
    "explanation": "A · B = (3)(2) + (4)(−1) = 6 − 4 = 2."
  },
  {
    "question_number": 9,
    "question_text": "A unit vector parallel to A = 3î − 4ĵ is",
    "options": [
      {
        "id": "A",
        "text": "3î − 4ĵ"
      },
      {
        "id": "B",
        "text": "(3î − 4ĵ)/25"
      },
      {
        "id": "C",
        "text": "(3î − 4ĵ)/7"
      },
      {
        "id": "D",
        "text": "(3î − 4ĵ)/5"
      }
    ],
    "correct_option": "D",
    "explanation": "|A| = √(3² + (−4)²) = √(9 + 16) = 5. Unit vector = A / |A| = (3î − 4ĵ)/5."
  },
  {
    "question_number": 10,
    "question_text": "A car increases its speed uniformly from 10 m/s to 30 m/s in 5 s. The distance covered in this time is",
    "options": [
      {
        "id": "A",
        "text": "75 m"
      },
      {
        "id": "B",
        "text": "100 m"
      },
      {
        "id": "C",
        "text": "150 m"
      },
      {
        "id": "D",
        "text": "200 m"
      }
    ],
    "correct_option": "B",
    "explanation": "d = ((vi + vf)/2) · t = ((10 + 30)/2)(5) = 20 × 5 = 100 m."
  },
  {
    "question_number": 11,
    "question_text": "A stone is dropped from rest from a height of 80 m. Taking g = 10 m/s², its speed just before hitting the ground is",
    "options": [
      {
        "id": "A",
        "text": "40 m/s"
      },
      {
        "id": "B",
        "text": "80 m/s"
      },
      {
        "id": "C",
        "text": "20 m/s"
      },
      {
        "id": "D",
        "text": "160 m/s"
      }
    ],
    "correct_option": "A",
    "explanation": "v² = 2gh = 2(10)(80) = 1600 ⇒ v = √1600 = 40 m/s."
  },
  {
    "question_number": 12,
    "question_text": "A ball is thrown vertically upward with a speed of 20 m/s (g = 10 m/s²). The maximum height reached is",
    "options": [
      {
        "id": "A",
        "text": "10 m"
      },
      {
        "id": "B",
        "text": "40 m"
      },
      {
        "id": "C",
        "text": "20 m"
      },
      {
        "id": "D",
        "text": "80 m"
      }
    ],
    "correct_option": "C",
    "explanation": "H = u² / (2g) = 20² / (2 × 10) = 400 / 20 = 20 m."
  },
  {
    "question_number": 13,
    "question_text": "The velocity of a car increases uniformly from 0 to 8 m/s in 4 s, stays constant at 8 m/s for 6 s, and then decreases uniformly to 0 in 2 s. The total distance travelled is",
    "options": [
      {
        "id": "A",
        "text": "64 m"
      },
      {
        "id": "B",
        "text": "56 m"
      },
      {
        "id": "C",
        "text": "80 m"
      },
      {
        "id": "D",
        "text": "72 m"
      }
    ],
    "correct_option": "D",
    "explanation": "Stage 1 (triangle): ½ × 4 × 8 = 16 m. Stage 2 (rectangle): 8 × 6 = 48 m. Stage 3 (triangle): ½ × 2 × 8 = 8 m. Total distance = 16 + 48 + 8 = 72 m."
  },
  {
    "question_number": 14,
    "question_text": "A projectile is launched with a speed of 20 m/s at 30° above the horizontal (g = 10 m/s²). Its time of flight is",
    "options": [
      {
        "id": "A",
        "text": "1 s"
      },
      {
        "id": "B",
        "text": "2 s"
      },
      {
        "id": "C",
        "text": "4 s"
      },
      {
        "id": "D",
        "text": "3 s"
      }
    ],
    "correct_option": "B",
    "explanation": "T = 2u sin θ / g = 2(20)(sin 30°) / 10 = 2(20)(0.5) / 10 = 2 s."
  },
  {
    "question_number": 15,
    "question_text": "A stone is thrown horizontally at 15 m/s from the top of a 45 m high cliff (g = 10 m/s²). It lands at a horizontal distance of",
    "options": [
      {
        "id": "A",
        "text": "45 m"
      },
      {
        "id": "B",
        "text": "30 m"
      },
      {
        "id": "C",
        "text": "60 m"
      },
      {
        "id": "D",
        "text": "90 m"
      }
    ],
    "correct_option": "A",
    "explanation": "Vertical motion: h = ½gt² ⇒ 45 = 5t² ⇒ t² = 9 ⇒ t = 3 s. Horizontal distance = vx · t = 15 × 3 = 45 m."
  },
  {
    "question_number": 16,
    "question_text": "A projectile is launched at 50 m/s at 37° above the horizontal (sin 37° = 0.6, cos 37° = 0.8, g = 10 m/s²). Its maximum height is",
    "options": [
      {
        "id": "A",
        "text": "90 m"
      },
      {
        "id": "B",
        "text": "30 m"
      },
      {
        "id": "C",
        "text": "45 m"
      },
      {
        "id": "D",
        "text": "22.5 m"
      }
    ],
    "correct_option": "C",
    "explanation": "uy = 50 sin 37° = 50(0.6) = 30 m/s. H = uy² / (2g) = 30² / 20 = 900 / 20 = 45 m."
  },
  {
    "question_number": 17,
    "question_text": "The horizontal range of a projectile launched at 20 m/s at 45° above the horizontal (g = 10 m/s²) is",
    "options": [
      {
        "id": "A",
        "text": "20 m"
      },
      {
        "id": "B",
        "text": "80 m"
      },
      {
        "id": "C",
        "text": "10 m"
      },
      {
        "id": "D",
        "text": "40 m"
      }
    ],
    "correct_option": "D",
    "explanation": "R = u² sin(2θ) / g = 20² · sin(90°) / 10 = 400(1) / 10 = 40 m."
  },
  {
    "question_number": 18,
    "question_text": "Two projectiles are launched with the same speed, one at 30° and the other at 60° above the horizontal. The ratio of their maximum heights, H₃₀° : H₆₀°, is",
    "options": [
      {
        "id": "A",
        "text": "1 : 3"
      },
      {
        "id": "B",
        "text": "1 : 2"
      },
      {
        "id": "C",
        "text": "1 : 1"
      },
      {
        "id": "D",
        "text": "3 : 1"
      }
    ],
    "correct_option": "A",
    "explanation": "H = u² sin²θ / (2g). Ratio = sin²(30°) : sin²(60°) = (0.5)² : (√3/2)² = 0.25 : 0.75 = 1 : 3."
  },
  {
    "question_number": 19,
    "question_text": "If A = 2î + 3ĵ and B = −5î + ĵ, the magnitude of A + B is",
    "options": [
      {
        "id": "A",
        "text": "7"
      },
      {
        "id": "B",
        "text": "1"
      },
      {
        "id": "C",
        "text": "5"
      },
      {
        "id": "D",
        "text": "25"
      }
    ],
    "correct_option": "C",
    "explanation": "A + B = (2 − 5)î + (3 + 1)ĵ = −3î + 4ĵ. |A + B| = √((−3)² + 4²) = √(9 + 16) = √25 = 5."
  },
  {
    "question_number": 20,
    "question_text": "A car moving at 20 m/s brakes with a uniform deceleration of 5 m/s² until it stops. The stopping distance is",
    "options": [
      {
        "id": "A",
        "text": "20 m"
      },
      {
        "id": "B",
        "text": "40 m"
      },
      {
        "id": "C",
        "text": "80 m"
      },
      {
        "id": "D",
        "text": "100 m"
      }
    ],
    "correct_option": "B",
    "explanation": "v² = u² − 2ad ⇒ 0 = 20² − 2(5)d ⇒ 10d = 400 ⇒ d = 40 m."
  },
  {
    "question_number": 21,
    "question_text": "Which of the following correctly distinguishes distance from displacement?",
    "options": [
      {
        "id": "A",
        "text": "Distance is the total path length (scalar), while displacement is the straight-line position change with direction (vector)."
      },
      {
        "id": "B",
        "text": "Distance is a vector quantity with direction, while displacement is a scalar quantity."
      },
      {
        "id": "C",
        "text": "Displacement is always greater than or equal to distance."
      },
      {
        "id": "D",
        "text": "Distance can be zero after moving, but displacement cannot be zero."
      }
    ],
    "correct_option": "A",
    "explanation": "Distance is the total length of the path travelled; a scalar, always positive. Displacement is the straight-line change in position from start to end, with direction; a vector (can be zero)."
  },
  {
    "question_number": 22,
    "question_text": "If A = 3î + 2ĵ and B = î − 2ĵ, then 2A − B =",
    "options": [
      {
        "id": "A",
        "text": "5î + 6ĵ"
      },
      {
        "id": "B",
        "text": "5î + 4ĵ"
      },
      {
        "id": "C",
        "text": "7î + 6ĵ"
      },
      {
        "id": "D",
        "text": "2î + 4ĵ"
      }
    ],
    "correct_option": "A",
    "explanation": "2A = 6î + 4ĵ. 2A − B = (6 − 1)î + (4 − (−2))ĵ = 5î + 6ĵ."
  },
  {
    "question_number": 23,
    "question_text": "For a projectile (neglecting air resistance), what are the horizontal acceleration (ax) and vertical acceleration (ay)?",
    "options": [
      {
        "id": "A",
        "text": "ax = 0 and ay = 10 m/s² downward"
      },
      {
        "id": "B",
        "text": "ax = 10 m/s² forward and ay = 0"
      },
      {
        "id": "C",
        "text": "ax = 10 m/s² forward and ay = 10 m/s² downward"
      },
      {
        "id": "D",
        "text": "ax = 0 and ay = 0"
      }
    ],
    "correct_option": "A",
    "explanation": "Only gravity acts downwards: horizontal acceleration ax = 0, and vertical acceleration ay = −g = 10 m/s² downward."
  },
  {
    "question_number": 24,
    "question_text": "A ball thrown vertically upward returns to the thrower's hand after 6 s. Its initial speed is (taking g = 10 m/s²):",
    "options": [
      {
        "id": "A",
        "text": "60 m/s"
      },
      {
        "id": "B",
        "text": "30 m/s"
      },
      {
        "id": "C",
        "text": "20 m/s"
      },
      {
        "id": "D",
        "text": "15 m/s"
      }
    ],
    "correct_option": "B",
    "explanation": "Time up = time down = 6 / 2 = 3 s. At the top v = 0 ⇒ u = gt = 10 × 3 = 30 m/s."
  },
  {
    "question_number": 25,
    "question_text": "What do the slope of a velocity–time graph and the area under it represent, respectively?",
    "options": [
      {
        "id": "A",
        "text": "Acceleration and displacement"
      },
      {
        "id": "B",
        "text": "Displacement and acceleration"
      },
      {
        "id": "C",
        "text": "Speed and distance"
      },
      {
        "id": "D",
        "text": "Velocity and impulse"
      }
    ],
    "correct_option": "A",
    "explanation": "Slope of a v–t graph = acceleration. Area under a v–t graph = displacement (change in position)."
  },
  {
    "question_number": 26,
    "question_text": "Given A = 8î + 6ĵ and B = −2î + 2ĵ, what are the magnitude of resultant R = A + B and the scalar product A · B?",
    "options": [
      {
        "id": "A",
        "text": "|R| = 10 and A · B = −4"
      },
      {
        "id": "B",
        "text": "|R| = 10 and A · B = 4"
      },
      {
        "id": "C",
        "text": "|R| = 14 and A · B = −4"
      },
      {
        "id": "D",
        "text": "|R| = 8 and A · B = 12"
      }
    ],
    "correct_option": "A",
    "explanation": "R = (8 − 2)î + (6 + 2)ĵ = 6î + 8ĵ. |R| = √(6² + 8²) = 10. A · B = (8)(−2) + (6)(2) = −16 + 12 = −4."
  },
  {
    "question_number": 27,
    "question_text": "A hiker walks 8 km east, then 6 km north, and finally 8 km west, taking a total time of 4 h. What are the total distance and average velocity?",
    "options": [
      {
        "id": "A",
        "text": "Distance = 22 km; Average velocity = 1.5 km/h north"
      },
      {
        "id": "B",
        "text": "Distance = 6 km; Average velocity = 5.5 km/h north"
      },
      {
        "id": "C",
        "text": "Distance = 22 km; Average velocity = 5.5 km/h north"
      },
      {
        "id": "D",
        "text": "Distance = 16 km; Average velocity = 1.5 km/h north"
      }
    ],
    "correct_option": "A",
    "explanation": "Distance = 8 + 6 + 8 = 22 km. East and west cancel (8 − 8 = 0), so net displacement = 6 km due north. Average velocity = displacement / time = 6 / 4 = 1.5 km/h north."
  },
  {
    "question_number": 28,
    "question_text": "A car starts from rest and accelerates uniformly at 2 m/s² for 10 s, moves at constant speed for 20 s, and finally brakes uniformly to a stop in 5 s. What are the maximum speed and total distance travelled?",
    "options": [
      {
        "id": "A",
        "text": "vmax = 20 m/s; Total distance = 550 m"
      },
      {
        "id": "B",
        "text": "vmax = 20 m/s; Total distance = 400 m"
      },
      {
        "id": "C",
        "text": "vmax = 10 m/s; Total distance = 550 m"
      },
      {
        "id": "D",
        "text": "vmax = 25 m/s; Total distance = 600 m"
      }
    ],
    "correct_option": "A",
    "explanation": "vmax = at = 2 × 10 = 20 m/s. Stage 1 distance: ½(2)(10²) = 100 m. Stage 2 distance: 20 × 20 = 400 m. Stage 3 distance: ½(20)(5) = 50 m. Total distance = 100 + 400 + 50 = 550 m."
  },
  {
    "question_number": 29,
    "question_text": "A stone is thrown vertically upward from the ground with a speed of 30 m/s (g = 10 m/s²). What are the maximum height and the total time of flight?",
    "options": [
      {
        "id": "A",
        "text": "Hmax = 45 m; Time of flight = 6 s"
      },
      {
        "id": "B",
        "text": "Hmax = 90 m; Time of flight = 3 s"
      },
      {
        "id": "C",
        "text": "Hmax = 45 m; Time of flight = 3 s"
      },
      {
        "id": "D",
        "text": "Hmax = 30 m; Time of flight = 6 s"
      }
    ],
    "correct_option": "A",
    "explanation": "Time to top = u / g = 30 / 10 = 3 s. Total time of flight = 2 × 3 = 6 s. Hmax = u² / (2g) = 30² / (2 × 10) = 900 / 20 = 45 m."
  },
  {
    "question_number": 30,
    "question_text": "A ball is kicked from the ground with a speed of 25 m/s at 53° above horizontal (sin 53° = 0.8, cos 53° = 0.6, g = 10 m/s²). What are the initial velocity components (ux, uy), time of flight T, and horizontal range R?",
    "options": [
      {
        "id": "A",
        "text": "ux = 15 m/s, uy = 20 m/s; T = 4 s; R = 60 m"
      },
      {
        "id": "B",
        "text": "ux = 20 m/s, uy = 15 m/s; T = 3 s; R = 60 m"
      },
      {
        "id": "C",
        "text": "ux = 15 m/s, uy = 20 m/s; T = 2 s; R = 30 m"
      },
      {
        "id": "D",
        "text": "ux = 25 m/s, uy = 20 m/s; T = 4 s; R = 80 m"
      }
    ],
    "correct_option": "A",
    "explanation": "ux = 25 cos 53° = 15 m/s; uy = 25 sin 53° = 20 m/s. Time of flight T = 2uy / g = 2(20)/10 = 4 s. Range R = ux · T = 15 × 4 = 60 m."
  }
];
export const LOGIC_QUESTIONS = [
  {
    "question_number": 1,
    "question_text": "The consequent of a conditional sentence is a necessary condition for the antecedent.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "A",
    "explanation": "In 'If A then B', B is a necessary condition for A."
  },
  {
    "question_number": 2,
    "question_text": "Proving a claim to be true, in essence, is the hallmark of an argument.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "B",
    "explanation": "The hallmark of an argument is claiming that something is proved (an inferential claim), not actually proving it."
  },
  {
    "question_number": 3,
    "question_text": "In recognizing arguments, explicit inferential claim is more important than implicit one.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "B",
    "explanation": "Explicit and implicit inferential claims are equally important; many arguments carry only an implicit one."
  },
  {
    "question_number": 4,
    "question_text": "If a passage lacks indicator words, what is the most reliable method for locating the conclusion?",
    "options": [
      {
        "id": "A",
        "text": "Identify the longest sentence."
      },
      {
        "id": "B",
        "text": "Choose the statement containing universal terms."
      },
      {
        "id": "C",
        "text": "Ask which statement the arguer is trying to prove."
      },
      {
        "id": "D",
        "text": "Pick the final sentence."
      }
    ],
    "correct_option": "C",
    "explanation": "Ask which statement the arguer is trying to prove."
  },
  {
    "question_number": 5,
    "question_text": "Which one of the following is an essential approach in recognizing arguments?",
    "options": [
      {
        "id": "A",
        "text": "Conclusion indicators are sufficient; no interpretation is needed."
      },
      {
        "id": "B",
        "text": "The arguer always makes the conclusion explicit."
      },
      {
        "id": "C",
        "text": "All passages with facts contain arguments."
      },
      {
        "id": "D",
        "text": "The reader must actively interpret passages to identify reasoning."
      }
    ],
    "correct_option": "D",
    "explanation": "The reader must actively interpret passages."
  },
  {
    "question_number": 6,
    "question_text": "Identify the conclusion in the following passage: \"Pollution levels continue to rise. Since industrial regulation has weakened, and vehicle emissions have increased, the government must strengthen environmental laws.\"",
    "options": [
      {
        "id": "A",
        "text": "The government must strengthen environmental laws."
      },
      {
        "id": "B",
        "text": "Pollution levels continue to rise."
      },
      {
        "id": "C",
        "text": "Industrial regulation has weakened."
      },
      {
        "id": "D",
        "text": "Vehicle emissions have increased."
      }
    ],
    "correct_option": "A",
    "explanation": "'Since' marks the premises; the government must strengthen environmental laws is the conclusion."
  },
  {
    "question_number": 7,
    "question_text": "For a passage to be argumentative, one is not mandatory:",
    "options": [
      {
        "id": "A",
        "text": "Having premises and conclusion"
      },
      {
        "id": "B",
        "text": "Factual claim with attended reasoning"
      },
      {
        "id": "C",
        "text": "Inferential claim between the statements"
      },
      {
        "id": "D",
        "text": "Having explicit inferential claim"
      }
    ],
    "correct_option": "D",
    "explanation": "An explicit inferential claim is not mandatory; an implicit one suffices."
  },
  {
    "question_number": 8,
    "question_text": "Non-argumentative passages:",
    "options": [
      {
        "id": "A",
        "text": "By far and large, they are subjective opinions."
      },
      {
        "id": "B",
        "text": "We can know them by the type of statement they consist of."
      },
      {
        "id": "C",
        "text": "Consist of passages which do not have factual claim."
      },
      {
        "id": "D",
        "text": "May contain indicator word(s)."
      }
    ],
    "correct_option": "D",
    "explanation": "Non-arguments may contain indicator words (e.g. 'because' in explanations)."
  },
  {
    "question_number": 9,
    "question_text": "Regular exercise strengthens the heart and improves circulation. It also reduces the risk of chronic diseases. Unfailing workout routine is essential for maintaining good health. Which one of the following is incorrect?",
    "options": [
      {
        "id": "A",
        "text": "\"It also reduces the risk of chronic diseases\", is neither premise nor conclusion."
      },
      {
        "id": "B",
        "text": "\"Regular exercise strengthens the heart and improves circulation\", is a premise."
      },
      {
        "id": "C",
        "text": "\"Unfailing workout routine is essential for maintaining good health\", is a conclusion."
      },
      {
        "id": "D",
        "text": "\"Regular exercise strengthens the heart and improves circulation\", is either a premise or a conclusion."
      }
    ],
    "correct_option": "A",
    "explanation": "That statement is a premise, so calling it neither premise nor conclusion is incorrect."
  },
  {
    "question_number": 10,
    "question_text": "\"This year, Jimma University welcomed over 3,000 freshman students from across the country. The university offers structured orientation and foundational courses to support their transition. The university provides various facilities such as libraries, laboratories, and student centers to support their academic and personal development.\" This passage is:",
    "options": [
      {
        "id": "A",
        "text": "It is a deductive argument from definition."
      },
      {
        "id": "B",
        "text": "It is expository and non-argumentative passage."
      },
      {
        "id": "C",
        "text": "It is an inductive argument from generalization."
      },
      {
        "id": "D",
        "text": "It is explanation and non-argumentative passage."
      }
    ],
    "correct_option": "B",
    "explanation": "The passage is expository and non-argumentative."
  },
  {
    "question_number": 11,
    "question_text": "Which one of the following statements is true about argument and non-argument?",
    "options": [
      {
        "id": "A",
        "text": "There is no exception to treat any non-argumentative passage as if it was an argumentative."
      },
      {
        "id": "B",
        "text": "The decisive difference between an argument and non-argument is the presence or absence of a claim being supported."
      },
      {
        "id": "C",
        "text": "Its only difference arises from the degree of inference found in both types of passages."
      },
      {
        "id": "D",
        "text": "Indicator words may appear in both types of passages and always carry the same meaning."
      }
    ],
    "correct_option": "B",
    "explanation": "The decisive difference is whether a claim is being supported."
  },
  {
    "question_number": 12,
    "question_text": "Which of the following is a report?",
    "options": [
      {
        "id": "A",
        "text": "The Earth revolves around the Sun, which proves the heliocentric model is correct."
      },
      {
        "id": "B",
        "text": "You must be careful because the exam is challenging."
      },
      {
        "id": "C",
        "text": "Scientists detected new species of insects in the rainforest this year."
      },
      {
        "id": "D",
        "text": "Since it is raining, you should take an umbrella."
      }
    ],
    "correct_option": "C",
    "explanation": "A report simply conveys information."
  },
  {
    "question_number": 13,
    "question_text": "Which one of the following sentences is not a statement?",
    "options": [
      {
        "id": "A",
        "text": "A valid argument can have a false conclusion."
      },
      {
        "id": "B",
        "text": "This sentence is false."
      },
      {
        "id": "C",
        "text": "Eternal happiness is the most important purpose in life."
      },
      {
        "id": "D",
        "text": "Philosophy can't help to solve pressing problems of our days."
      }
    ],
    "correct_option": "B",
    "explanation": "'This sentence is false' is a paradox: neither true nor false, so not a statement."
  },
  {
    "question_number": 14,
    "question_text": "Which one of the following statements is correct?",
    "options": [
      {
        "id": "A",
        "text": "Some arguments have factual claim."
      },
      {
        "id": "B",
        "text": "The role of a conclusion in an argumentative passage is to prove the premise/s."
      },
      {
        "id": "C",
        "text": "It is possible to draw two and above conclusions from just same premise/s."
      },
      {
        "id": "D",
        "text": "Having a premise and a conclusion is necessary, but not sufficient condition for a given passage to be argumentative."
      }
    ],
    "correct_option": "D",
    "explanation": "Premise and conclusion are necessary but not sufficient; an inferential claim is also needed."
  },
  {
    "question_number": 15,
    "question_text": "Which one of the following is not a premise indicator?",
    "options": [
      {
        "id": "A",
        "text": "Given that"
      },
      {
        "id": "B",
        "text": "Moreover"
      },
      {
        "id": "C",
        "text": "Secondly"
      },
      {
        "id": "D",
        "text": "Clearly"
      }
    ],
    "correct_option": "B",
    "explanation": "'Moreover' is not a premise indicator."
  },
  {
    "question_number": 16,
    "question_text": "Which one of the following passages is argumentative?",
    "options": [
      {
        "id": "A",
        "text": "As Plato is Philosopher, he is from Greece."
      },
      {
        "id": "B",
        "text": "I was late to class because I couldn't find a taxi."
      },
      {
        "id": "C",
        "text": "This class began in January and end in May."
      },
      {
        "id": "D",
        "text": "I think, therefore I am."
      }
    ],
    "correct_option": "D",
    "explanation": "'I think, therefore I am' is a classic argument."
  },
  {
    "question_number": 17,
    "question_text": "Being argumentative is ____________ condition for a given passage to have a premise/s & conclusion.",
    "options": [
      {
        "id": "A",
        "text": "Both necessary and sufficient"
      },
      {
        "id": "B",
        "text": "Neither necessary nor sufficient"
      },
      {
        "id": "C",
        "text": "Sufficient"
      },
      {
        "id": "D",
        "text": "Necessary"
      }
    ],
    "correct_option": "C",
    "explanation": "Argumentative passages always contain premises and a conclusion, so being argumentative is sufficient."
  },
  {
    "question_number": 18,
    "question_text": "Identify a statement which depicts the difference between arguments and explanation.",
    "options": [
      {
        "id": "A",
        "text": "An argument has something to prove, explanation doesn't."
      },
      {
        "id": "B",
        "text": "An argument appeals to facts, while an explanation appeals to reasons."
      },
      {
        "id": "C",
        "text": "Knowledge is to explanation, while understanding is to arguments."
      },
      {
        "id": "D",
        "text": "The explanans in explanation and the premises in arguments are accepted facts."
      }
    ],
    "correct_option": "A",
    "explanation": "An argument has something to prove; an explanation does not."
  },
  {
    "question_number": 19,
    "question_text": "Having a premise(s) and conclusion is ____________ condition for a given passage to be considered as argumentative.",
    "options": [
      {
        "id": "A",
        "text": "Sufficient"
      },
      {
        "id": "B",
        "text": "Necessary"
      },
      {
        "id": "C",
        "text": "Neither sufficient nor necessary"
      },
      {
        "id": "D",
        "text": "Sufficient and necessary"
      }
    ],
    "correct_option": "B",
    "explanation": "Necessary (but not sufficient)."
  },
  {
    "question_number": 20,
    "question_text": "One of the following is ODD about simple non-inferential passages?",
    "options": [
      {
        "id": "A",
        "text": "Likely passages focus on uttering feelings, observations, or descriptions."
      },
      {
        "id": "B",
        "text": "There is no rational ground to find out a sort of statement that supports each other."
      },
      {
        "id": "C",
        "text": "In this case, it is absurd to uncover any logically justified conclusions."
      },
      {
        "id": "D",
        "text": "Likely passages have an implicit inferential claims but no explicit claims."
      }
    ],
    "correct_option": "D",
    "explanation": "Simple non-inferential passages have no inferential claim, explicit or implicit."
  },
  {
    "question_number": 21,
    "question_text": "Argumentative passages:",
    "options": [
      {
        "id": "A",
        "text": "Necessarily have factual statements."
      },
      {
        "id": "B",
        "text": "Have explicit inferential claim only."
      },
      {
        "id": "C",
        "text": "Involve claims that aim to prove something."
      },
      {
        "id": "D",
        "text": "The premises do actually support the conclusion."
      }
    ],
    "correct_option": "C",
    "explanation": "Argumentative passages involve claims that aim to prove something."
  },
  {
    "question_number": 22,
    "question_text": "How can we turn a conditional statement into an argument?",
    "options": [
      {
        "id": "A",
        "text": "By taking the antecedent of a conditional statement and make it assert something."
      },
      {
        "id": "B",
        "text": "By taking the consequent of a conditional statement and make it saying it is true."
      },
      {
        "id": "C",
        "text": "By introducing premise and conclusion indicator words."
      },
      {
        "id": "D",
        "text": "By reversing the place of the antecedent and the consequent."
      }
    ],
    "correct_option": "A",
    "explanation": "Take the antecedent and make it assert something."
  },
  {
    "question_number": 23,
    "question_text": "Which one of the following passages is argumentative?",
    "options": [
      {
        "id": "A",
        "text": "Albert isn't a fireman and he isn't a fisherman either."
      },
      {
        "id": "B",
        "text": "Every time I wash my car, it rains."
      },
      {
        "id": "C",
        "text": "Air contains molecules. Dirt does, too. So does water."
      },
      {
        "id": "D",
        "text": "I have been wrangling cattle since before you were old enough to tie your own shoes."
      }
    ],
    "correct_option": "B",
    "explanation": "'Every time I wash my car, it rains' is the best fit among the options."
  },
  {
    "question_number": 24,
    "question_text": "\"Hypotheses and theories are not derived from observed facts, but invented in order to account for them.\" (Carl Hempel, The Philosophy of Natural Science). This passage is an example of:",
    "options": [
      {
        "id": "A",
        "text": "Expository passage"
      },
      {
        "id": "B",
        "text": "Loosely associated passage"
      },
      {
        "id": "C",
        "text": "Explanatory passage"
      },
      {
        "id": "D",
        "text": "Inferential passage"
      }
    ],
    "correct_option": "C",
    "explanation": "It is an explanatory passage."
  },
  {
    "question_number": 25,
    "question_text": "Which one of the following alternatives is a statement?",
    "options": [
      {
        "id": "A",
        "text": "No one understands me but you."
      },
      {
        "id": "B",
        "text": "Alligators are on average smaller than crocodiles."
      },
      {
        "id": "C",
        "text": "Don't let any reptiles into the house."
      },
      {
        "id": "D",
        "text": "You may kill any reptile you see in the house."
      }
    ],
    "correct_option": "B",
    "explanation": "The others are commands, permissions or unclear; this one is a statement."
  }
];
export const PSYC_QUESTIONS = [
  {
    "question_number": 1,
    "question_text": "Seeing and hearing are largely perceptual processes, whereas detecting patterns and forming a melody are largely sensory processes.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "B",
    "explanation": "Seeing and hearing are largely sensory; organizing sensations into patterns and melodies is perceptual."
  },
  {
    "question_number": 2,
    "question_text": "Figure-ground perception is reversible, meaning that the figure can become the ground and the ground can become the figure.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "A",
    "explanation": "Figure and ground can switch roles."
  },
  {
    "question_number": 3,
    "question_text": "According to Weber's law, the amount of change in stimulation needed to produce a just noticeable difference (jnd) is a fixed, absolute amount regardless of the original stimulus intensity.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "B",
    "explanation": "Weber's law says the jnd is a constant fraction of the original stimulus, not a fixed absolute amount."
  },
  {
    "question_number": 4,
    "question_text": "A contour will still be clearly perceived on a piece of paper that varies continuously and smoothly in brightness from white at one border to black at the opposite border.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "B",
    "explanation": "Contours need a marked difference in brightness or color; a smooth gradual change gives no contour."
  },
  {
    "question_number": 5,
    "question_text": "Unlike binocular cues, monocular depth cues require only one eye, allowing people who have lost sight in one eye to still judge distance.",
    "options": [
      {
        "id": "A",
        "text": "True"
      },
      {
        "id": "B",
        "text": "False"
      }
    ],
    "correct_option": "A",
    "explanation": "Monocular cues work with one eye."
  },
  {
    "question_number": 6,
    "question_text": "Which one of the following may not be an external factor affecting perceptual selectivity?",
    "options": [
      {
        "id": "A",
        "text": "Stimulus intensity"
      },
      {
        "id": "B",
        "text": "Stimulus repetition"
      },
      {
        "id": "C",
        "text": "Personal motive"
      },
      {
        "id": "D",
        "text": "Stimulus novelty"
      }
    ],
    "correct_option": "C",
    "explanation": "Motives are internal factors; intensity, repetition and novelty are external stimulus factors."
  },
  {
    "question_number": 7,
    "question_text": "Dr. Dawit is watching a basketball game and notices how the orange ball stands out clearly against the polished wooden court. The wooden court and the orange ball are respectively:",
    "options": [
      {
        "id": "A",
        "text": "Figure and ground"
      },
      {
        "id": "B",
        "text": "Ground and figure"
      },
      {
        "id": "C",
        "text": "Focus and margin"
      },
      {
        "id": "D",
        "text": "Proximity and closure"
      }
    ],
    "correct_option": "B",
    "explanation": "The court is the background (ground); the ball is the object that stands out (figure)."
  },
  {
    "question_number": 8,
    "question_text": "Which one of the following alternatives consists of the correct perceptual procedures from last to first?",
    "options": [
      {
        "id": "A",
        "text": "Selectivity → Organization → Interpretation"
      },
      {
        "id": "B",
        "text": "Organization → Selectivity → Interpretation"
      },
      {
        "id": "C",
        "text": "Interpretation → Organization → Selectivity"
      },
      {
        "id": "D",
        "text": "Interpretation → Selectivity → Organization"
      }
    ],
    "correct_option": "C",
    "explanation": "Perception flows selectivity, organization, interpretation; last to first is the reverse."
  },
  {
    "question_number": 9,
    "question_text": "As a train moves farther away down a track, its retinal image becomes smaller, yet you perceive it as keeping its actual physical size because of:",
    "options": [
      {
        "id": "A",
        "text": "Shape constancy"
      },
      {
        "id": "B",
        "text": "Brightness constancy"
      },
      {
        "id": "C",
        "text": "Size constancy"
      },
      {
        "id": "D",
        "text": "Linear perspective"
      }
    ],
    "correct_option": "C",
    "explanation": "Size constancy keeps perceived size stable even when the retinal image shrinks."
  },
  {
    "question_number": 10,
    "question_text": "Events or stimuli that you perceive clearly are probably at the ___ of your attention, while other stimuli that you dimly perceive are in the ___ of your attention.",
    "options": [
      {
        "id": "A",
        "text": "Margin; Focus"
      },
      {
        "id": "B",
        "text": "Focus; Margin"
      },
      {
        "id": "C",
        "text": "Background; Figure"
      },
      {
        "id": "D",
        "text": "Periphery; Center"
      }
    ],
    "correct_option": "B",
    "explanation": "Clearly perceived events are in the focus; dimly perceived ones are in the margin."
  },
  {
    "question_number": 11,
    "question_text": "In a painting, an artist draws distant mountains as hazy and blurred while nearby trees appear sharp and clear. Which monocular cue of depth perception is used?",
    "options": [
      {
        "id": "A",
        "text": "Interposition"
      },
      {
        "id": "B",
        "text": "Texture gradient"
      },
      {
        "id": "C",
        "text": "Aerial perspective"
      },
      {
        "id": "D",
        "text": "Elevation"
      }
    ],
    "correct_option": "C",
    "explanation": "Aerial perspective: distant objects look hazy, near objects look sharp."
  },
  {
    "question_number": 12,
    "question_text": "If a subject is presented with a low-intensity sound 40 times and detects it exactly 20 times, that intensity represents the subject's:",
    "options": [
      {
        "id": "A",
        "text": "Difference threshold"
      },
      {
        "id": "B",
        "text": "Sensory adaptation"
      },
      {
        "id": "C",
        "text": "Absolute threshold"
      },
      {
        "id": "D",
        "text": "Response bias"
      }
    ],
    "correct_option": "C",
    "explanation": "Detection 20 of 40 times (50%) is the definition of the absolute threshold."
  },
  {
    "question_number": 13,
    "question_text": "When we stare at a nearby object, each eye receives a slightly different image, providing a cue known as ___, which is an example of a ___ depth cue.",
    "options": [
      {
        "id": "A",
        "text": "Convergence; binocular"
      },
      {
        "id": "B",
        "text": "Accommodation; monocular"
      },
      {
        "id": "C",
        "text": "Retinal disparity; binocular"
      },
      {
        "id": "D",
        "text": "Motion parallax; monocular"
      }
    ],
    "correct_option": "C",
    "explanation": "Retinal disparity is the difference between the two retinal images and needs both eyes."
  },
  {
    "question_number": 14,
    "question_text": "Which of the following scenarios best illustrates sensory adaptation?",
    "options": [
      {
        "id": "A",
        "text": "A footballer focusing on his coach's voice in a crowded stadium"
      },
      {
        "id": "B",
        "text": "A swimmer shivering upon entering cold water, then feeling comfortable minutes later"
      },
      {
        "id": "C",
        "text": "A person misjudging the size of the moon on the horizon"
      },
      {
        "id": "D",
        "text": "A driver noticing nearby poles passing faster than distant houses"
      }
    ],
    "correct_option": "B",
    "explanation": "Sensory adaptation is decreasing responsiveness to an unchanging stimulus over time."
  },
  {
    "question_number": 15,
    "question_text": "While riding in a fast-moving bus, a passenger notices that nearby roadside trees rush backward quickly while distant hills move very slowly. This depth cue is known as:",
    "options": [
      {
        "id": "A",
        "text": "Linear perspective"
      },
      {
        "id": "B",
        "text": "Motion parallax"
      },
      {
        "id": "C",
        "text": "Relative size"
      },
      {
        "id": "D",
        "text": "Retinal disparity"
      }
    ],
    "correct_option": "B",
    "explanation": "Motion parallax: near objects seem to move faster than distant ones when we move."
  },
  {
    "question_number": 16,
    "question_text": "If you stand in the middle of a cobblestone street, the stones look coarse near your feet and smoother in the distance. This monocular cue is called ___.",
    "options": [
      {
        "id": "A",
        "text": "Texture gradient"
      },
      {
        "id": "B",
        "text": "Linear perspective"
      },
      {
        "id": "C",
        "text": "Relative size"
      },
      {
        "id": "D",
        "text": "Interposition"
      }
    ],
    "correct_option": "A",
    "explanation": "Texture gradient: surfaces look coarse up close and smoother far away."
  },
  {
    "question_number": 17,
    "question_text": "A husband expecting an important business call hears the phone ring immediately, whereas his wife, worried about her baby, notices the baby's faint cry first. This best demonstrates which internal factor in attention?",
    "options": [
      {
        "id": "A",
        "text": "Stimulus intensity"
      },
      {
        "id": "B",
        "text": "Set or expectancy"
      },
      {
        "id": "C",
        "text": "Stimulus repetition"
      },
      {
        "id": "D",
        "text": "Sensory adaptation"
      }
    ],
    "correct_option": "B",
    "explanation": "Set or expectancy is mental readiness for anticipated inputs."
  },
  {
    "question_number": 18,
    "question_text": "Which of the following occurs when two objects produce almost the same retinal image but are perceived as different images?",
    "options": [
      {
        "id": "A",
        "text": "Perceptual constancy"
      },
      {
        "id": "B",
        "text": "Visual illusion"
      },
      {
        "id": "C",
        "text": "Figure-ground shift"
      },
      {
        "id": "D",
        "text": "Retinal disparity"
      }
    ],
    "correct_option": "B",
    "explanation": "This is a visual illusion (e.g., Müller-Lyer, Ponzo)."
  },
  {
    "question_number": 19,
    "question_text": "Which claim of extrasensory perception (ESP) refers to the ability to perceive remote events happening elsewhere, such as sensing a friend's house on fire?",
    "options": [
      {
        "id": "A",
        "text": "Telepathy"
      },
      {
        "id": "B",
        "text": "Precognition"
      },
      {
        "id": "C",
        "text": "Psychokinesis"
      },
      {
        "id": "D",
        "text": "Clairvoyance"
      }
    ],
    "correct_option": "D",
    "explanation": "Clairvoyance is perceiving remote events outside normal sensory range."
  },
  {
    "question_number": 20,
    "question_text": "When you look at a partially open rectangular door, the image on your retina is a trapezoid, yet you still perceive the door as a rectangle. This illustrates:",
    "options": [
      {
        "id": "A",
        "text": "Size constancy"
      },
      {
        "id": "B",
        "text": "Shape constancy"
      },
      {
        "id": "C",
        "text": "Brightness constancy"
      },
      {
        "id": "D",
        "text": "Closure"
      }
    ],
    "correct_option": "B",
    "explanation": "Shape constancy keeps perceived shape stable as the retinal image changes."
  },
  {
    "question_number": 21,
    "question_text": "Items that are close together in space or time tend to be perceived as units.",
    "options": [
      {
        "id": "A",
        "text": "Closure"
      },
      {
        "id": "B",
        "text": "Continuity"
      },
      {
        "id": "C",
        "text": "Proximity"
      },
      {
        "id": "D",
        "text": "Similarity"
      },
      {
        "id": "E",
        "text": "Linear perspective"
      },
      {
        "id": "F",
        "text": "Interposition"
      },
      {
        "id": "G",
        "text": "Convergence"
      }
    ],
    "correct_option": "C",
    "explanation": "Proximity groups items that are close together."
  },
  {
    "question_number": 22,
    "question_text": "Objects of similar shape, intensity, or color are grouped together.",
    "options": [
      {
        "id": "A",
        "text": "Closure"
      },
      {
        "id": "B",
        "text": "Continuity"
      },
      {
        "id": "C",
        "text": "Proximity"
      },
      {
        "id": "D",
        "text": "Similarity"
      },
      {
        "id": "E",
        "text": "Linear perspective"
      },
      {
        "id": "F",
        "text": "Interposition"
      },
      {
        "id": "G",
        "text": "Convergence"
      }
    ],
    "correct_option": "D",
    "explanation": "Similarity groups like objects together."
  },
  {
    "question_number": 23,
    "question_text": "Perceiving a complete object even though parts of it are missing.",
    "options": [
      {
        "id": "A",
        "text": "Closure"
      },
      {
        "id": "B",
        "text": "Continuity"
      },
      {
        "id": "C",
        "text": "Proximity"
      },
      {
        "id": "D",
        "text": "Similarity"
      },
      {
        "id": "E",
        "text": "Linear perspective"
      },
      {
        "id": "F",
        "text": "Interposition"
      },
      {
        "id": "G",
        "text": "Convergence"
      }
    ],
    "correct_option": "A",
    "explanation": "Closure fills in missing gaps."
  },
  {
    "question_number": 24,
    "question_text": "Seeing lines or patterns as continuing in one direction even if interrupted.",
    "options": [
      {
        "id": "A",
        "text": "Closure"
      },
      {
        "id": "B",
        "text": "Continuity"
      },
      {
        "id": "C",
        "text": "Proximity"
      },
      {
        "id": "D",
        "text": "Similarity"
      },
      {
        "id": "E",
        "text": "Linear perspective"
      },
      {
        "id": "F",
        "text": "Interposition"
      },
      {
        "id": "G",
        "text": "Convergence"
      }
    ],
    "correct_option": "B",
    "explanation": "Continuity: lines are perceived as continuing smoothly."
  },
  {
    "question_number": 25,
    "question_text": "Two parallel lines appear to converge at the horizon as they get farther away.",
    "options": [
      {
        "id": "A",
        "text": "Closure"
      },
      {
        "id": "B",
        "text": "Continuity"
      },
      {
        "id": "C",
        "text": "Proximity"
      },
      {
        "id": "D",
        "text": "Similarity"
      },
      {
        "id": "E",
        "text": "Linear perspective"
      },
      {
        "id": "F",
        "text": "Interposition"
      },
      {
        "id": "G",
        "text": "Convergence"
      }
    ],
    "correct_option": "E",
    "explanation": "Linear perspective: parallel lines seem to converge with distance."
  },
  {
    "question_number": 26,
    "question_text": "The psychological factor that refers to how ready a person is to report the presence of a particular stimulus when testing the absolute threshold is called ___.",
    "options": [
      {
        "id": "A",
        "text": "Response bias"
      },
      {
        "id": "B",
        "text": "Sensory adaptation"
      },
      {
        "id": "C",
        "text": "Retinal disparity"
      },
      {
        "id": "D",
        "text": "Perceptual constancy"
      }
    ],
    "correct_option": "A",
    "explanation": "Response bias is readiness to report a stimulus."
  },
  {
    "question_number": 27,
    "question_text": "The minimum change in stimulation that can be detected 50 percent of the time by a given person is known as the ___.",
    "options": [
      {
        "id": "A",
        "text": "Absolute threshold"
      },
      {
        "id": "B",
        "text": "Difference threshold"
      },
      {
        "id": "C",
        "text": "Sensory adaptation"
      },
      {
        "id": "D",
        "text": "Stimulus intensity"
      }
    ],
    "correct_option": "B",
    "explanation": "This is the difference threshold (jnd)."
  },
  {
    "question_number": 28,
    "question_text": "The binocular depth cue that refers to the degree to which both eyes turn inward to focus on a nearby object is called ___.",
    "options": [
      {
        "id": "A",
        "text": "Retinal disparity"
      },
      {
        "id": "B",
        "text": "Motion parallax"
      },
      {
        "id": "C",
        "text": "Convergence"
      },
      {
        "id": "D",
        "text": "Accommodation"
      }
    ],
    "correct_option": "C",
    "explanation": "Convergence is the inward turning of both eyes."
  },
  {
    "question_number": 29,
    "question_text": "The monocular depth cue in which the eye's lens changes shape (thickening for near objects, flattening for far objects) to focus images on the retina is called ___.",
    "options": [
      {
        "id": "A",
        "text": "Convergence"
      },
      {
        "id": "B",
        "text": "Accommodation"
      },
      {
        "id": "C",
        "text": "Linear perspective"
      },
      {
        "id": "D",
        "text": "Texture gradient"
      }
    ],
    "correct_option": "B",
    "explanation": "Accommodation is the lens changing shape to focus."
  },
  {
    "question_number": 30,
    "question_text": "Differentiate between absolute threshold and difference threshold (just noticeable difference).",
    "options": [
      {
        "id": "A",
        "text": "Absolute threshold detects the minimum stimulus intensity, while difference threshold detects the minimum change between stimuli."
      },
      {
        "id": "B",
        "text": "Absolute threshold detects the difference between two stimuli, while difference threshold detects the presence of a stimulus."
      },
      {
        "id": "C",
        "text": "Both absolute threshold and difference threshold measure the same thing."
      },
      {
        "id": "D",
        "text": "Neither absolute threshold nor difference threshold is related to sensory perception."
      }
    ],
    "correct_option": "A",
    "explanation": "Absolute threshold is the minimum stimulation to detect a stimulus; difference threshold is the minimum change to detect a difference."
  }
];
export const GEOG_QUESTIONS = [
  {
    "question_number": 1,
    "question_text": "In radiometric age dating, which statement accurately describes the relationship between radioactive parent elements and non-radioactive daughter elements as a rock gets older?",
    "options": [
      {
        "id": "A",
        "text": "Both parent and daughter elements increase at an equal rate over time"
      },
      {
        "id": "B",
        "text": "Parent elements increase while daughter elements decrease proportionally"
      },
      {
        "id": "C",
        "text": "Parent elements decrease while non-radioactive daughter elements increase"
      },
      {
        "id": "D",
        "text": "Both parent and daughter elements remain unchanged after crystallization"
      }
    ],
    "correct_option": "C",
    "explanation": "Unstable radioactive parent atoms decay at a constant rate into stable daughter atoms."
  },
  {
    "question_number": 2,
    "question_text": "How do exogenic geological processes differ from endogenic geological processes in shaping the Earth's surface?",
    "options": [
      {
        "id": "A",
        "text": "Exogenic processes build up plateaus and volcanic mountains, whereas endogenic processes erode them"
      },
      {
        "id": "B",
        "text": "Exogenic processes modify, roughen, and lower existing landforms, whereas endogenic processes build structural and volcanic features"
      },
      {
        "id": "C",
        "text": "Exogenic processes involve folding and faulting, whereas endogenic processes involve weathering and deposition"
      },
      {
        "id": "D",
        "text": "Exogenic processes occur deep beneath the crust, whereas endogenic processes occur exclusively on the ocean floor"
      }
    ],
    "correct_option": "B",
    "explanation": "Endogenic forces create mountains and plateaus, while exogenic forces wear them down via weathering, erosion, mass transfer, and deposition."
  },
  {
    "question_number": 3,
    "question_text": "What happens when a rock containing micas, feldspars, and hornblendes is exposed to temperatures above 125°C (257°F) prior to Potassium-Argon dating?",
    "options": [
      {
        "id": "A",
        "text": "Potassium-40 stops decaying completely, preventing any age calculation"
      },
      {
        "id": "B",
        "text": "Argon gas leaks out, causing the measured age to reflect the last heating episode rather than original formation"
      },
      {
        "id": "C",
        "text": "The rock converts into Carbon-14, requiring organic dating methods instead"
      },
      {
        "id": "D",
        "text": "Daughter elements revert back into radioactive parent elements"
      }
    ],
    "correct_option": "B",
    "explanation": "Above 125°C argon escapes, resetting the Potassium-Argon clock to the heating event."
  },
  {
    "question_number": 4,
    "question_text": "Following the breakup of Pangaea about 200 million years ago, which set of landmasses comprised the southern supercontinent fragment known as Gondwanaland?",
    "options": [
      {
        "id": "A",
        "text": "Eurasia, North America, and Greenland"
      },
      {
        "id": "B",
        "text": "Africa, South America, India, Antarctica, and Australia"
      },
      {
        "id": "C",
        "text": "Europe, Asia, Africa, and South America"
      },
      {
        "id": "D",
        "text": "North America, Antarctica, Australia, and Eurasia"
      }
    ],
    "correct_option": "B",
    "explanation": "These southern landmasses formed Gondwanaland, while Eurasia and North America formed Laurasia."
  },
  {
    "question_number": 5,
    "question_text": "Which one of the following statements is correct regarding the structure and measurement of the geological time scale?",
    "options": [
      {
        "id": "A",
        "text": "Its divisions consist of uniform lengths of time measured precisely in equal million-year intervals"
      },
      {
        "id": "B",
        "text": "It is built largely on the basis of life, evolution, and significant geological events such as mass extinctions"
      },
      {
        "id": "C",
        "text": "Each period is strictly defined by human historical records and archaeological artifacts"
      },
      {
        "id": "D",
        "text": "Epochs are the largest units of geological time, while Eons represent the smallest subdivisions"
      }
    ],
    "correct_option": "B",
    "explanation": "Divisions are not uniform in length; they are defined by major evolutionary milestones and geological events."
  },
  {
    "question_number": 6,
    "question_text": "Which one of the following indirect geological methods involves studying earthquake waves that penetrate deep beneath the Earth's surface to infer internal structures?",
    "options": [
      {
        "id": "A",
        "text": "Geochronology"
      },
      {
        "id": "B",
        "text": "Geochemistry"
      },
      {
        "id": "C",
        "text": "Geophysics"
      },
      {
        "id": "D",
        "text": "Relative dating"
      }
    ],
    "correct_option": "C",
    "explanation": "Geophysics studies earthquake waves penetrating Earth's interior to infer its structure."
  },
  {
    "question_number": 7,
    "question_text": "Which one of the following is not included under internal (endogenic) geological processes?",
    "options": [
      {
        "id": "A",
        "text": "Epeirogenesis"
      },
      {
        "id": "B",
        "text": "Mass transfer"
      },
      {
        "id": "C",
        "text": "Orogenesis"
      },
      {
        "id": "D",
        "text": "Faulting"
      }
    ],
    "correct_option": "B",
    "explanation": "Mass transfer is an exogenic process; epeirogenesis, orogenesis, and faulting are endogenic."
  },
  {
    "question_number": 8,
    "question_text": "Which one of the following correctly arranges the four main units of the geological time scale from the largest unit to the smallest unit?",
    "options": [
      {
        "id": "A",
        "text": "Eon -> Period -> Era -> Epoch"
      },
      {
        "id": "B",
        "text": "Era -> Eon -> Period -> Epoch"
      },
      {
        "id": "C",
        "text": "Eon -> Era -> Period -> Epoch"
      },
      {
        "id": "D",
        "text": "Epoch -> Period -> Era -> Eon"
      }
    ],
    "correct_option": "C",
    "explanation": "The hierarchy runs Eon, Era, Period, Epoch (largest to smallest)."
  },
  {
    "question_number": 9,
    "question_text": "The discovery of bituminous coal, which forms from compacted tropical plant remains in hot, humid jungles, in Northern Asia and Antarctica provides evidence primarily for which aspect of Wegener's theory?",
    "options": [
      {
        "id": "A",
        "text": "Apparent jigsaw fit of continental coastlines"
      },
      {
        "id": "B",
        "text": "Paleoclimate data indicating past continental positions"
      },
      {
        "id": "C",
        "text": "Rock and mountain belt correlation across oceans"
      },
      {
        "id": "D",
        "text": "Distribution of ancient freshwater reptile fossils"
      }
    ],
    "correct_option": "B",
    "explanation": "Tropical coal in cold regions shows those landmasses once lay near the equator and drifted."
  },
  {
    "question_number": 10,
    "question_text": "All of the following are true about the Carbon-14 age dating technique except:",
    "options": [
      {
        "id": "A",
        "text": "Carbon-14 begins to disintegrate at a known rate immediately upon an organism's death"
      },
      {
        "id": "B",
        "text": "No further replacement of carbon from atmospheric carbon dioxide occurs after death"
      },
      {
        "id": "C",
        "text": "Carbon-14 has a half-life of approximately 5,730 years"
      },
      {
        "id": "D",
        "text": "It is widely used for dating ancient crystalline rocks containing micas and feldspars"
      }
    ],
    "correct_option": "D",
    "explanation": "Dating rocks containing micas, feldspars, and hornblendes is done via the Potassium-Argon technique, while Carbon-14 dates once-living organic remains."
  },
  {
    "question_number": 11,
    "question_text": "Which one of the following pairs of geological eras and their dominant life forms is wrongly matched?",
    "options": [
      {
        "id": "A",
        "text": "Paleozoic Era -> Age of invertebrates"
      },
      {
        "id": "B",
        "text": "Mesozoic Era -> Age of mammals"
      },
      {
        "id": "C",
        "text": "Cenozoic Era -> Recent life"
      },
      {
        "id": "D",
        "text": "Mesozoic Era -> Age of reptiles"
      }
    ],
    "correct_option": "B",
    "explanation": "The Mesozoic Era is the age of reptiles, whereas the Cenozoic Era is the age of mammals."
  },
  {
    "question_number": 12,
    "question_text": "Geologists establish the relative age of sedimentary rock layers without determining their exact numerical age in years primarily by:",
    "options": [
      {
        "id": "A",
        "text": "Measuring the ratio of potassium-40 to argon in hornblendes"
      },
      {
        "id": "B",
        "text": "Examining fossil contents and applying the principle of superposition (\"what is on top of older rocks\")"
      },
      {
        "id": "C",
        "text": "Calculating the number of half-lives elapsed since mineral crystallization"
      },
      {
        "id": "D",
        "text": "Analyzing the radioactive disintegration rate of atmospheric carbon"
      }
    ],
    "correct_option": "B",
    "explanation": "Relative dating compares rock ages using fossil contents and stratigraphic superposition without giving exact numerical ages."
  },
  {
    "question_number": 13,
    "question_text": "Which one of the following modern continents is odd with reference to its supercontinent origin following the breakup of Pangaea about 200 million years ago?",
    "options": [
      {
        "id": "A",
        "text": "South America"
      },
      {
        "id": "B",
        "text": "Australia"
      },
      {
        "id": "C",
        "text": "North America"
      },
      {
        "id": "D",
        "text": "Antarctica"
      }
    ],
    "correct_option": "C",
    "explanation": "North America came from the northern supercontinent Laurasia, whereas South America, Australia, and Antarctica came from Gondwanaland."
  },
  {
    "question_number": 14,
    "question_text": "If a mineral sample initially contained 100% radioactive parent atoms at the time of crystallization, what proportion of the original parent atoms remains after three half-lives have elapsed?",
    "options": [
      {
        "id": "A",
        "text": "50%"
      },
      {
        "id": "B",
        "text": "25%"
      },
      {
        "id": "C",
        "text": "12.5%"
      },
      {
        "id": "D",
        "text": "6.25%"
      }
    ],
    "correct_option": "C",
    "explanation": "Each half-life halves the remaining parent atoms: 50% after 1, 25% after 2, 12.5% after 3."
  },
  {
    "question_number": 15,
    "question_text": "The slow, broad rising and sinking of a landmass without major folding or mountain building is specifically termed as:",
    "options": [
      {
        "id": "A",
        "text": "Orogenesis"
      },
      {
        "id": "B",
        "text": "Epeirogenesis"
      },
      {
        "id": "C",
        "text": "Denudation"
      },
      {
        "id": "D",
        "text": "Deposition"
      }
    ],
    "correct_option": "B",
    "explanation": "Epeirogenesis is slow, broad rising and sinking of a landmass, whereas orogenesis is mountain building."
  },
  {
    "question_number": 16,
    "question_text": "Mountains in the northeastern United States share the exact rock type and geological age with mountain ranges in the United Kingdom and northern Scandinavia. Which principle of Wegener's Continental Drift Theory does this observation support?",
    "options": [
      {
        "id": "A",
        "text": "Rock and mountain correlation"
      },
      {
        "id": "B",
        "text": "Glacial striation alignment"
      },
      {
        "id": "C",
        "text": "Apparent fit of continental margins"
      },
      {
        "id": "D",
        "text": "Freshwater fossil correlation"
      }
    ],
    "correct_option": "A",
    "explanation": "Matching rock types and ages across the Atlantic demonstrates rock and mountain correlation."
  },
  {
    "question_number": 17,
    "question_text": "Which one of the following is not used as a primary criterion to distinguish one division of the geological time scale from another?",
    "options": [
      {
        "id": "A",
        "text": "The relative position of land and sea"
      },
      {
        "id": "B",
        "text": "The kind of climate that prevailed"
      },
      {
        "id": "C",
        "text": "The kind of animal and plant life that developed and existed"
      },
      {
        "id": "D",
        "text": "The uniform duration of millions of years assigned to each period"
      }
    ],
    "correct_option": "D",
    "explanation": "Geological time units vary in length; they are separated by land-sea positions, climate, and life forms, not fixed time intervals."
  },
  {
    "question_number": 18,
    "question_text": "Deep scratches left behind on bedrock surfaces by moving ice sheets that indicate the direction of past glacier movement are known as:",
    "options": [
      {
        "id": "A",
        "text": "Volcanic intrusions"
      },
      {
        "id": "B",
        "text": "Glacial striations"
      },
      {
        "id": "C",
        "text": "Tectonic faults"
      },
      {
        "id": "D",
        "text": "Geomorphic deposits"
      }
    ],
    "correct_option": "B",
    "explanation": "Glacial striations are deep scratches left on bedrock by moving ice, showing the direction of past glacier movement."
  },
  {
    "question_number": 19,
    "question_text": "Geology is concerned with events that took place in the remote past, long before human observation. Therefore, a great deal of geological understanding must be obtained by:",
    "options": [
      {
        "id": "A",
        "text": "Direct laboratory replication of supercontinent breakups"
      },
      {
        "id": "B",
        "text": "Inference using clues from what can be seen and measured"
      },
      {
        "id": "C",
        "text": "Measuring current atmospheric carbon dioxide levels alone"
      },
      {
        "id": "D",
        "text": "Assuming Earth's materials and structures have remained static"
      }
    ],
    "correct_option": "B",
    "explanation": "Geologists infer remote past events from direct observations of rocks and landforms plus indirect geophysical, geochemical, and geochronological clues."
  },
  {
    "question_number": 20,
    "question_text": "Which one of the following statements about the Earth's early history and supercontinent evolution is correct?",
    "options": [
      {
        "id": "A",
        "text": "The Earth was formed approximately 3.5 billion years ago, while life originated 4.5 billion years ago"
      },
      {
        "id": "B",
        "text": "Pangaea existed during the Paleozoic and early Mesozoic eras before breaking apart about 200 million years ago"
      },
      {
        "id": "C",
        "text": "The landmass of Ethiopia is exclusively the result of internal endogenic processes"
      },
      {
        "id": "D",
        "text": "Ancient freshwater reptile fossils were found across all seven modern continents"
      }
    ],
    "correct_option": "B",
    "explanation": "Pangaea existed as a single landmass during the Paleozoic and early Mesozoic eras before splitting into Laurasia and Gondwanaland roughly 200 million years ago."
  },
  {
    "question_number": 21,
    "question_text": "In addition to direct observation of rocks and landforms, geologists determine the numerical ages of rocks from the radioactive elements they contain through an indirect method called:",
    "options": [
      {
        "id": "A",
        "text": "Geomorphology"
      },
      {
        "id": "B",
        "text": "Geochronology"
      },
      {
        "id": "C",
        "text": "Geochemistry"
      },
      {
        "id": "D",
        "text": "Geophysics"
      }
    ],
    "correct_option": "B",
    "explanation": "Geochronology determines numerical ages of rocks using the radioactive elements they contain."
  },
  {
    "question_number": 22,
    "question_text": "When glaciers move across the Earth's surface, they leave behind deep scratches in the bedrock that reveal the direction of past ice movement, which are known as:",
    "options": [
      {
        "id": "A",
        "text": "Glacial striations"
      },
      {
        "id": "B",
        "text": "Rift faults"
      },
      {
        "id": "C",
        "text": "Alluvial terraces"
      },
      {
        "id": "D",
        "text": "Sedimentary strata"
      }
    ],
    "correct_option": "A",
    "explanation": "Moving glaciers carve deep scratches called glacial striations into bedrock."
  },
  {
    "question_number": 23,
    "question_text": "In radiometric age dating, as geological time passes, unstable radioactive parent elements decay at a regular rate into stable, non-radioactive elements called:",
    "options": [
      {
        "id": "A",
        "text": "Isotopic elements"
      },
      {
        "id": "B",
        "text": "Superposition elements"
      },
      {
        "id": "C",
        "text": "Daughter elements"
      },
      {
        "id": "D",
        "text": "Organic elements"
      }
    ],
    "correct_option": "C",
    "explanation": "Unstable radioactive parent elements decay into stable, non-radioactive daughter elements."
  },
  {
    "question_number": 24,
    "question_text": "While structural and volcanic landforms are built up by endogenic forces, geomorphic processes such as weathering, mass transfer, erosion, and deposition are classified under:",
    "options": [
      {
        "id": "A",
        "text": "Orogenic forces"
      },
      {
        "id": "B",
        "text": "Exogenic forces"
      },
      {
        "id": "C",
        "text": "Tectonic forces"
      },
      {
        "id": "D",
        "text": "Epeirogenic forces"
      }
    ],
    "correct_option": "B",
    "explanation": "Weathering, mass transfer, erosion, and deposition are external (exogenic) forces that wear down landforms."
  },
  {
    "question_number": 25,
    "question_text": "Which one of the following accurately distinguishes Relative Dating from Absolute Dating techniques in geology?",
    "options": [
      {
        "id": "A",
        "text": "Relative dating gives exact numerical ages in years using radioactive decay, whereas absolute dating compares rock layers using fossils"
      },
      {
        "id": "B",
        "text": "Relative dating determines which rock is older or younger using fossils and superposition, whereas absolute dating determines exact numerical age using radiometric decay"
      },
      {
        "id": "C",
        "text": "Relative dating uses Carbon-14 and Potassium-Argon, whereas absolute dating relies solely on the principle of \"what is on top of older rocks\""
      },
      {
        "id": "D",
        "text": "Relative dating applies only to igneous rocks, whereas absolute dating applies exclusively to sedimentary fossils"
      }
    ],
    "correct_option": "B",
    "explanation": "Relative dating compares rock ages without exact numbers; absolute dating calculates exact age in years via radioactive decay."
  },
  {
    "question_number": 26,
    "question_text": "Which indirect geological method analyzes the detailed chemical composition of rocks to obtain clues regarding their origin?",
    "options": [
      {
        "id": "A",
        "text": "Geophysics"
      },
      {
        "id": "B",
        "text": "Geochemistry"
      },
      {
        "id": "C",
        "text": "Geochronology"
      },
      {
        "id": "D",
        "text": "Seismology"
      }
    ],
    "correct_option": "B",
    "explanation": "Geochemistry analyzes the chemical composition of rocks to find clues about their origin."
  },
  {
    "question_number": 27,
    "question_text": "Which of the following landforms is directly built up by internal (endogenic) tectonic and volcanic processes rather than external geomorphic processes?",
    "options": [
      {
        "id": "A",
        "text": "Rift valleys and block mountains"
      },
      {
        "id": "B",
        "text": "Alluvial river floodplains"
      },
      {
        "id": "C",
        "text": "Windblown sand dunes"
      },
      {
        "id": "D",
        "text": "Eroded valley floors"
      }
    ],
    "correct_option": "A",
    "explanation": "Rift valleys, block mountains, plateaus, and volcanic mountains are built by internal tectonic and volcanic forces."
  },
  {
    "question_number": 28,
    "question_text": "Approximately how long ago are the earliest forms of life on Earth thought to have originated?",
    "options": [
      {
        "id": "A",
        "text": "4.5 billion years ago"
      },
      {
        "id": "B",
        "text": "3.5 billion years ago"
      },
      {
        "id": "C",
        "text": "250 million years ago"
      },
      {
        "id": "D",
        "text": "200 million years ago"
      }
    ],
    "correct_option": "B",
    "explanation": "Earth formed about 4.5 billion years ago, and the earliest life originated approximately 3.5 billion years ago."
  },
  {
    "question_number": 29,
    "question_text": "The discovery of identical fossils of ancient freshwater reptiles exclusively at the southern tips of South America and Africa supports Wegener's theory primarily because:",
    "options": [
      {
        "id": "A",
        "text": "Freshwater reptiles could easily swim across the deep saltwater Atlantic Ocean"
      },
      {
        "id": "B",
        "text": "Those two continents were once joined together as part of a single landmass"
      },
      {
        "id": "C",
        "text": "Identical species evolved independently in identical climates across the globe"
      },
      {
        "id": "D",
        "text": "Ocean currents carried heavy reptile skeletons across thousands of kilometers"
      }
    ],
    "correct_option": "B",
    "explanation": "Freshwater reptiles could not cross the saltwater Atlantic, so South America and Africa must once have been joined."
  },
  {
    "question_number": 30,
    "question_text": "Which pairing of continental coastlines is cited as the classic example of the apparent jigsaw-puzzle fit of the continents in Alfred Wegener's Continental Drift Theory?",
    "options": [
      {
        "id": "A",
        "text": "Western North America and Eastern Asia"
      },
      {
        "id": "B",
        "text": "Eastern South America and Western Africa"
      },
      {
        "id": "C",
        "text": "Northern Europe and Southern Australia"
      },
      {
        "id": "D",
        "text": "Eastern Africa and Western India"
      }
    ],
    "correct_option": "B",
    "explanation": "The matching coastlines of eastern South America and western Africa illustrate the jigsaw-puzzle fit."
  }
];
export const ECON_QUESTIONS = [
  {
    "question_number": 1,
    "question_text": "Demand for a commodity refers to:",
    "options": [
      {
        "id": "A",
        "text": "The amount producers are willing to sell at a price"
      },
      {
        "id": "B",
        "text": "The amount that will be purchased at a particular price during a particular period of time"
      },
      {
        "id": "C",
        "text": "The amount a consumer needs regardless of price"
      },
      {
        "id": "D",
        "text": "The total stock available in the market"
      }
    ],
    "correct_option": "B",
    "explanation": "Demand is the quantity buyers will purchase at a given price in a given period."
  },
  {
    "question_number": 2,
    "question_text": "According to the law of demand, other things remaining constant:",
    "options": [
      {
        "id": "A",
        "text": "Quantity demanded rises when the price rises"
      },
      {
        "id": "B",
        "text": "Demand rises when income rises"
      },
      {
        "id": "C",
        "text": "Quantity supplied falls when price rises"
      },
      {
        "id": "D",
        "text": "Quantity demanded falls when the price of the good rises"
      }
    ],
    "correct_option": "D",
    "explanation": "Price and quantity demanded move in opposite directions."
  },
  {
    "question_number": 3,
    "question_text": "A movement along the demand curve of a good is caused by a change in:",
    "options": [
      {
        "id": "A",
        "text": "The price of the good itself"
      },
      {
        "id": "B",
        "text": "Consumers' income"
      },
      {
        "id": "C",
        "text": "Consumers' tastes"
      },
      {
        "id": "D",
        "text": "The number of buyers"
      }
    ],
    "correct_option": "A",
    "explanation": "Only a change in the good's own price moves us along the curve; the others shift it."
  },
  {
    "question_number": 4,
    "question_text": "The demand for orange increases because of a change in taste in favour of orange, ceteris paribus. This is shown by:",
    "options": [
      {
        "id": "A",
        "text": "A downward movement along the demand curve"
      },
      {
        "id": "B",
        "text": "An extension of demand"
      },
      {
        "id": "C",
        "text": "A rightward shift of the demand curve"
      },
      {
        "id": "D",
        "text": "A leftward shift of the demand curve"
      }
    ],
    "correct_option": "C",
    "explanation": "A taste change is a non-price determinant, so the curve shifts right."
  },
  {
    "question_number": 5,
    "question_text": "\"Oda\" and \"Geda\" transport companies provide substitute services. If the price of Oda goes up, the demand curve for Geda will:",
    "options": [
      {
        "id": "A",
        "text": "Shift to the left"
      },
      {
        "id": "B",
        "text": "Shift to the right"
      },
      {
        "id": "C",
        "text": "Be extended to the left"
      },
      {
        "id": "D",
        "text": "Remain constant"
      }
    ],
    "correct_option": "B",
    "explanation": "Consumers switch to the substitute, so its demand increases."
  },
  {
    "question_number": 6,
    "question_text": "When Mr. Adane's income rises from 2,000 to 6,000 Birr he stops using the bus and starts using taxis. We infer that:",
    "options": [
      {
        "id": "A",
        "text": "Bus is an inferior service for him"
      },
      {
        "id": "B",
        "text": "Taxi is an inferior service for him"
      },
      {
        "id": "C",
        "text": "Bus and taxi are complements"
      },
      {
        "id": "D",
        "text": "Bus is a necessity for him"
      }
    ],
    "correct_option": "A",
    "explanation": "Demand for bus falls as income rises, so bus is inferior."
  },
  {
    "question_number": 7,
    "question_text": "People expect the price of teff to rise next week. As a result:",
    "options": [
      {
        "id": "A",
        "text": "The price of teff falls today"
      },
      {
        "id": "B",
        "text": "Today's supply of teff increases"
      },
      {
        "id": "C",
        "text": "Next week's supply of teff increases"
      },
      {
        "id": "D",
        "text": "Today's demand for teff increases"
      }
    ],
    "correct_option": "D",
    "explanation": "Buyers buy more now to avoid the higher future price."
  },
  {
    "question_number": 8,
    "question_text": "If the price of sugar rises, the demand for tea (a complement of sugar) will:",
    "options": [
      {
        "id": "A",
        "text": "Shift to the right"
      },
      {
        "id": "B",
        "text": "Remain unchanged"
      },
      {
        "id": "C",
        "text": "Shift to the left (decrease)"
      },
      {
        "id": "D",
        "text": "Move upward along the same curve"
      }
    ],
    "correct_option": "C",
    "explanation": "A higher price of a complement lowers demand for the other good."
  },
  {
    "question_number": 9,
    "question_text": "A good whose demand falls as consumers' income rises is called:",
    "options": [
      {
        "id": "A",
        "text": "An inferior good"
      },
      {
        "id": "B",
        "text": "A normal good"
      },
      {
        "id": "C",
        "text": "A luxury good"
      },
      {
        "id": "D",
        "text": "A substitute good"
      }
    ],
    "correct_option": "A",
    "explanation": "This is the definition of an inferior good."
  },
  {
    "question_number": 10,
    "question_text": "A Giffen good is a good for which:",
    "options": [
      {
        "id": "A",
        "text": "Quantity demanded rises when its price falls"
      },
      {
        "id": "B",
        "text": "Quantity demanded falls when its price falls"
      },
      {
        "id": "C",
        "text": "Demand rises when income rises"
      },
      {
        "id": "D",
        "text": "Demand is perfectly elastic"
      }
    ],
    "correct_option": "B",
    "explanation": "A Giffen good violates the law of demand: quantity demanded falls when its price falls."
  },
  {
    "question_number": 11,
    "question_text": "The total quantity that all users of a commodity are willing and able to buy at a given price over a specific period is called:",
    "options": [
      {
        "id": "A",
        "text": "Individual demand"
      },
      {
        "id": "B",
        "text": "Market supply"
      },
      {
        "id": "C",
        "text": "Individual supply"
      },
      {
        "id": "D",
        "text": "Market demand"
      }
    ],
    "correct_option": "D",
    "explanation": "Market demand is the sum of all individual demands."
  },
  {
    "question_number": 12,
    "question_text": "Five identical consumers each have the demand Qd = 10 - P. The market demand is:",
    "options": [
      {
        "id": "A",
        "text": "Qd = 10 - P"
      },
      {
        "id": "B",
        "text": "Qd = 50 - P"
      },
      {
        "id": "C",
        "text": "Qd = 50 - 5P"
      },
      {
        "id": "D",
        "text": "Qd = 10 - 5P"
      }
    ],
    "correct_option": "C",
    "explanation": "Market demand = 5 × (10 - P) = 50 - 5P."
  },
  {
    "question_number": 13,
    "question_text": "Which of the following causes a rightward shift of the supply curve?",
    "options": [
      {
        "id": "A",
        "text": "An improvement in technology"
      },
      {
        "id": "B",
        "text": "An increase in input prices"
      },
      {
        "id": "C",
        "text": "An increase in tax on producers"
      },
      {
        "id": "D",
        "text": "A decrease in the number of sellers"
      }
    ],
    "correct_option": "A",
    "explanation": "Better technology lowers costs and increases supply."
  },
  {
    "question_number": 14,
    "question_text": "Sellers expect the price of their product to fall next month. Their current supply will:",
    "options": [
      {
        "id": "A",
        "text": "Decrease (shift left)"
      },
      {
        "id": "B",
        "text": "Not change"
      },
      {
        "id": "C",
        "text": "Move along the same curve"
      },
      {
        "id": "D",
        "text": "Increase (shift right)"
      }
    ],
    "correct_option": "D",
    "explanation": "Sellers sell more now before the price falls."
  },
  {
    "question_number": 15,
    "question_text": "A government subsidy given to producers will:",
    "options": [
      {
        "id": "A",
        "text": "Shift the supply curve to the left"
      },
      {
        "id": "B",
        "text": "Shift the supply curve to the right"
      },
      {
        "id": "C",
        "text": "Shift the demand curve to the right"
      },
      {
        "id": "D",
        "text": "Cause a movement along the supply curve"
      }
    ],
    "correct_option": "B",
    "explanation": "A subsidy lowers costs, so supply increases."
  },
  {
    "question_number": 16,
    "question_text": "The price of a good rises by 8% and the quantity demanded falls by 8%. Demand is:",
    "options": [
      {
        "id": "A",
        "text": "Elastic"
      },
      {
        "id": "B",
        "text": "Inelastic"
      },
      {
        "id": "C",
        "text": "Unitary elastic"
      },
      {
        "id": "D",
        "text": "Perfectly inelastic"
      }
    ],
    "correct_option": "C",
    "explanation": "|Ed| = 8/8 = 1, which is unitary elastic."
  },
  {
    "question_number": 17,
    "question_text": "Which statement about price elasticity of demand (PED) is wrong?",
    "options": [
      {
        "id": "A",
        "text": "More substitutes make PED more elastic"
      },
      {
        "id": "B",
        "text": "PED for necessity goods tends to be more elastic"
      },
      {
        "id": "C",
        "text": "In the long run PED tends to be elastic"
      },
      {
        "id": "D",
        "text": "A larger share of income spent makes PED more elastic"
      }
    ],
    "correct_option": "B",
    "explanation": "Necessities tend to be inelastic, so this statement is wrong."
  },
  {
    "question_number": 18,
    "question_text": "Demand is inelastic (|Ed| = 0.4). If the price rises, total revenue will:",
    "options": [
      {
        "id": "A",
        "text": "Rise"
      },
      {
        "id": "B",
        "text": "Fall"
      },
      {
        "id": "C",
        "text": "Stay the same"
      },
      {
        "id": "D",
        "text": "Fall to zero"
      }
    ],
    "correct_option": "A",
    "explanation": "With inelastic demand, price and total revenue move in the same direction."
  },
  {
    "question_number": 19,
    "question_text": "Given Qd = 100 - 5P, the price elasticity of demand at P = 10 is:",
    "options": [
      {
        "id": "A",
        "text": "-0.5"
      },
      {
        "id": "B",
        "text": "-2"
      },
      {
        "id": "C",
        "text": "-5"
      },
      {
        "id": "D",
        "text": "-1"
      }
    ],
    "correct_option": "D",
    "explanation": "At P = 10, Q = 50; Ed = (dQ/dP)(P/Q) = -5 × 10/50 = -1."
  },
  {
    "question_number": 20,
    "question_text": "Income rises by 10% and quantity demanded rises by 5%. The income elasticity is 0.5, so the good is:",
    "options": [
      {
        "id": "A",
        "text": "An inferior good"
      },
      {
        "id": "B",
        "text": "A luxury good"
      },
      {
        "id": "C",
        "text": "A normal good and a necessity"
      },
      {
        "id": "D",
        "text": "A Giffen good"
      }
    ],
    "correct_option": "C",
    "explanation": "Income elasticity between 0 and 1 means a normal good that is a necessity."
  },
  {
    "question_number": 21,
    "question_text": "The cross elasticity of demand between X and Y is -0.67. The two goods are:",
    "options": [
      {
        "id": "A",
        "text": "Substitutes"
      },
      {
        "id": "B",
        "text": "Unrelated"
      },
      {
        "id": "C",
        "text": "Inferior goods"
      },
      {
        "id": "D",
        "text": "Complements"
      }
    ],
    "correct_option": "D",
    "explanation": "Negative cross elasticity means complements."
  },
  {
    "question_number": 22,
    "question_text": "The demand curve is vertical when the price elasticity of demand is:",
    "options": [
      {
        "id": "A",
        "text": "Zero (perfectly inelastic)"
      },
      {
        "id": "B",
        "text": "Infinity"
      },
      {
        "id": "C",
        "text": "One"
      },
      {
        "id": "D",
        "text": "Greater than one"
      }
    ],
    "correct_option": "A",
    "explanation": "A vertical curve means quantity does not respond to price."
  },
  {
    "question_number": 23,
    "question_text": "Given Qd = 60 - 2P and Qs = -20 + 2P, the equilibrium price and quantity are:",
    "options": [
      {
        "id": "A",
        "text": "P = 10, Q = 40"
      },
      {
        "id": "B",
        "text": "P = 20, Q = 20"
      },
      {
        "id": "C",
        "text": "P = 20, Q = 40"
      },
      {
        "id": "D",
        "text": "P = 40, Q = 20"
      }
    ],
    "correct_option": "B",
    "explanation": "60 - 2P = -20 + 2P gives P = 20; then Q = 60 - 40 = 20."
  },
  {
    "question_number": 24,
    "question_text": "If the market price is above the equilibrium price, there is:",
    "options": [
      {
        "id": "A",
        "text": "A shortage and the price tends to rise"
      },
      {
        "id": "B",
        "text": "A surplus and the price tends to rise"
      },
      {
        "id": "C",
        "text": "A surplus and the price tends to fall"
      },
      {
        "id": "D",
        "text": "A shortage and the price tends to fall"
      }
    ],
    "correct_option": "C",
    "explanation": "Above equilibrium, Qs > Qd (surplus), pushing price down."
  },
  {
    "question_number": 25,
    "question_text": "If the price is below the equilibrium price:",
    "options": [
      {
        "id": "A",
        "text": "Quantity demanded exceeds quantity supplied"
      },
      {
        "id": "B",
        "text": "Quantity supplied exceeds quantity demanded"
      },
      {
        "id": "C",
        "text": "Quantity demanded equals quantity supplied"
      },
      {
        "id": "D",
        "text": "There is a surplus"
      }
    ],
    "correct_option": "A",
    "explanation": "Below equilibrium there is a shortage: Qd > Qs."
  },
  {
    "question_number": 26,
    "question_text": "A price ceiling set below the equilibrium price results in:",
    "options": [
      {
        "id": "A",
        "text": "A surplus"
      },
      {
        "id": "B",
        "text": "No change in the market"
      },
      {
        "id": "C",
        "text": "A higher equilibrium price"
      },
      {
        "id": "D",
        "text": "A shortage"
      }
    ],
    "correct_option": "D",
    "explanation": "A binding ceiling makes Qd exceed Qs."
  },
  {
    "question_number": 27,
    "question_text": "Demand and supply both increase by the same amount. Equilibrium price and quantity:",
    "options": [
      {
        "id": "A",
        "text": "Price rises; quantity is unchanged"
      },
      {
        "id": "B",
        "text": "Price is unchanged; quantity rises"
      },
      {
        "id": "C",
        "text": "Both rise"
      },
      {
        "id": "D",
        "text": "Price falls; quantity rises"
      }
    ],
    "correct_option": "B",
    "explanation": "Equal shifts cancel the price effect; quantity rises."
  },
  {
    "question_number": 28,
    "question_text": "Supply decreases (for example input prices rise) while demand is constant. Equilibrium price and quantity:",
    "options": [
      {
        "id": "A",
        "text": "Price falls; quantity rises"
      },
      {
        "id": "B",
        "text": "Both rise"
      },
      {
        "id": "C",
        "text": "Price rises; quantity falls"
      },
      {
        "id": "D",
        "text": "Both fall"
      }
    ],
    "correct_option": "C",
    "explanation": "The supply curve shifts left: higher price, lower quantity."
  },
  {
    "question_number": 29,
    "question_text": "In December the price of Christmas trees and the quantity sold both rise. This is:",
    "options": [
      {
        "id": "A",
        "text": "A violation of the law of demand"
      },
      {
        "id": "B",
        "text": "Not a violation of the law of demand; demand has shifted right"
      },
      {
        "id": "C",
        "text": "A movement along the demand curve"
      },
      {
        "id": "D",
        "text": "A leftward shift of supply only"
      }
    ],
    "correct_option": "B",
    "explanation": "Demand shifted right, so both price and quantity rise."
  },
  {
    "question_number": 30,
    "question_text": "Market demand is Qd = 100 - 5P and market supply is P = (1/5)Qs + 10. The equilibrium is:",
    "options": [
      {
        "id": "A",
        "text": "P = 15, Q = 75"
      },
      {
        "id": "B",
        "text": "P = 25, Q = 15"
      },
      {
        "id": "C",
        "text": "P = 10, Q = 50"
      },
      {
        "id": "D",
        "text": "P = 15, Q = 25"
      }
    ],
    "correct_option": "D",
    "explanation": "Qs = 5P - 50. Set 100 - 5P = 5P - 50, so P = 15 and Q = 25."
  }
];
