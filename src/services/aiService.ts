import { QuizData } from '../types';

// Modele în ordinea preferinței (fallback chain)
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-3.8-flash',
];

const BASE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Extrage JSON-ul dintr-un text care poate conține markdown, explicații, etc.
 */
function extractJSON(text: string): string {
  let cleaned = text.trim();
  
  // Elimină markdown code blocks
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  
  // Găsește primul '{' și ultimul '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('Nu s-a găsit niciun obiect JSON în răspuns');
  }
  
  return cleaned.substring(firstBrace, lastBrace + 1);
}

/**
 * Încearcă să repare un JSON trunchiat sau invalid
 */
function tryFixJSON(jsonStr: string): string {
  let fixed = jsonStr.trim();
  
  // Elimină trailing comma
  fixed = fixed.replace(/,\s*$/g, '');
  fixed = fixed.replace(/,\s*}/g, '}');
  fixed = fixed.replace(/,\s*]/g, ']');
  
  // Calculează parantezele lipsă
  const openBraces = (fixed.match(/\{/g) || []).length;
  const closeBraces = (fixed.match(/\}/g) || []).length;
  const openBrackets = (fixed.match(/\[/g) || []).length;
  const closeBrackets = (fixed.match(/\]/g) || []).length;
  
  const missingBrackets = openBrackets - closeBrackets;
  const missingBraces = openBraces - closeBraces;
  
  for (let i = 0; i < missingBrackets; i++) fixed += ']';
  for (let i = 0; i < missingBraces; i++) fixed += '}';
  
  return fixed;
}

function buildPrompt(topic: string, difficulty: 'easy' | 'medium' | 'hard', rounds: number): string {
  const difficultyMap = {
    easy: 'ușor, pentru începători',
    medium: 'mediu, pentru nivel intermediar',
    hard: 'avansat, pentru experți'
  };

  return `Generează un concurs tip Jeopardy/Trivia pe tema "${topic}" cu dificultate ${difficultyMap[difficulty]}.

Creează ${rounds} rund${rounds === 1 ? 'ă' : 'e'} principal${rounds === 1 ? 'ă' : 'e'}, fiecare cu 5 categorii și 4 întrebări per categorie.
Pentru fiecare rundă, creează și o întrebare bonus.
La final, creează o întrebare pentru Final Jeopardy.

Reguli stricte:
- Răspunde DOAR cu JSON valid, fără niciun text înainte sau după
- Nu include markdown, nu include \`\`\`, nu include explicații
- Fiecare categorie trebuie să aibă EXACT 4 întrebări
- Punctajele pentru runda 1: 100, 200, 300, 400
- Punctajele pentru runda 2: 200, 400, 800, 1000
- Toate întrebările trebuie să fie în limba română
- Întrebările trebuie să fie variate și interesante, specifice temei "${topic}"
- Răspunsurile trebuie să fie concise și corecte
- Explicațiile (rationale) trebuie să fie scurte dar informative

Format JSON exact (respectsă-l cu strictețe):
{
  "title": "Titlul Concursului",
  "topic": "${topic}",
  "round1": [
    {
      "category": "Nume Categorie",
      "questions": [
        {"points": 100, "type": "standard", "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"},
        {"points": 200, "type": "standard", "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"},
        {"points": 300, "type": "standard", "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"},
        {"points": 400, "type": "standard", "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"}
      ]
    }
  ],
  "bonus1": {"category": "Bonus", "points": 300, "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"},
  "round2": [
    {
      "category": "Nume Categorie",
      "questions": [
        {"points": 200, "type": "standard", "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"},
        {"points": 400, "type": "standard", "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"},
        {"points": 800, "type": "standard", "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"},
        {"points": 1000, "type": "standard", "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"}
      ]
    }
  ],
  "bonus2": {"category": "Bonus", "points": 500, "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"},
  "finalJeopardy": {"category": "Marea Finală", "question": "Întrebare?", "answer": "Răspuns", "rationale": "Explicație"}
}

${rounds === 1 ? 'NOTĂ: Dacă este doar 1 rundă, completează round2 cu aceleași categorii dar cu întrebări diferite.' : ''}

Generează ACUM JSON-ul complet pentru tema "${topic}":`;
}

async function tryModel(
  model: string,
  apiKey: string,
  prompt: string
): Promise<{ text: string; model: string }> {
  const url = `${BASE_API_URL}/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = 'Eroare la apelarea API-ului';
    try {
      const errorData = JSON.parse(errorText);
      errorMsg = errorData.error?.message || errorMsg;
    } catch {
      errorMsg = errorText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse) {
    throw new Error('Nu s-a primit răspuns de la AI');
  }

  return { text: textResponse, model };
}

export async function generateQuizWithAI(
  apiKey: string,
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  rounds: number
): Promise<QuizData> {
  const prompt = buildPrompt(topic, difficulty, rounds);
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Încearcă fiecare model în ordine
    for (const model of GEMINI_MODELS) {
      try {
        const { text: textResponse } = await tryModel(model, apiKey, prompt);

        // Extrage JSON-ul
        let jsonText: string;
        try {
          jsonText = extractJSON(textResponse);
        } catch {
          continue; // Încearcă următorul model
        }

        // Încearcă să parseze JSON-ul
        let quizData: QuizData;
        try {
          quizData = JSON.parse(jsonText) as QuizData;
        } catch {
          // Încearcă să repare JSON-ul
          try {
            const fixed = tryFixJSON(jsonText);
            quizData = JSON.parse(fixed) as QuizData;
          } catch {
            continue; // Încearcă următorul model
          }
        }

        // Validare și completare structură
        if (!quizData.title) quizData.title = `Concurs: ${topic}`;
        if (!quizData.topic) quizData.topic = topic;
        
        if (!quizData.round1 || !Array.isArray(quizData.round1) || quizData.round1.length === 0) {
          continue;
        }
        
        if (!quizData.round2 || !Array.isArray(quizData.round2) || quizData.round2.length === 0) {
          quizData.round2 = quizData.round1;
        }
        
        if (!quizData.bonus1) {
          quizData.bonus1 = {
            category: 'Bonus Runda 1',
            points: 300,
            question: 'Întrebare bonus?',
            answer: 'Răspuns',
            rationale: 'Explicație'
          };
        }
        
        if (!quizData.bonus2) {
          quizData.bonus2 = {
            category: 'Bonus Runda 2',
            points: 500,
            question: 'Întrebare bonus?',
            answer: 'Răspuns',
            rationale: 'Explicație'
          };
        }
        
        if (!quizData.finalJeopardy) {
          continue;
        }

        // Asigură-te că fiecare categorie are întrebări
        const ensureQuestions = (categories: any[]) => {
          return categories.map((cat: any) => ({
            category: cat.category || 'Categorie',
            questions: Array.isArray(cat.questions) ? cat.questions.map((q: any, i: number) => ({
              points: q.points || (i + 1) * 100,
              type: 'standard' as const,
              question: q.question || 'Întrebare?',
              answer: q.answer || 'Răspuns',
              rationale: q.rationale || 'Explicație',
            })) : []
          }));
        };

        quizData.round1 = ensureQuestions(quizData.round1);
        quizData.round2 = ensureQuestions(quizData.round2);

        return quizData;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Dacă e eroare de model (not found, not available), încearcă următorul model
        if (lastError.message.includes('not found') || 
            lastError.message.includes('not available') ||
            lastError.message.includes('not supported')) {
          continue;
        }
        
        // Dacă e eroare de parsare JSON, încearcă următorul model
        if (lastError.message.includes('JSON')) {
          continue;
        }
        
        // Pentru alte erori (API key invalid, quota, etc.), oprește-te
        throw lastError;
      }
    }
  }

  throw lastError || new Error('Eroare necunoscută la generarea concursului');
}
