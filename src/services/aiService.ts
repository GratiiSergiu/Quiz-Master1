import { QuizData } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function generateQuizWithAI(
  apiKey: string,
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  rounds: number
): Promise<QuizData> {
  const difficultyMap = {
    easy: 'ușor, pentru începători',
    medium: 'mediu, pentru nivel intermediar',
    hard: 'avansat, pentru experți'
  };

  const prompt = `Generează un concurs tip Jeopardy/Trivia pe tema "${topic}" cu dificultate ${difficultyMap[difficulty]}.

Creează exact ${rounds} runde principale, fiecare cu 5 categorii și 4 întrebări per categorie.
Pentru fiecare rundă, creează și o întrebare bonus.
La final, creează o întrebare pentru Final Jeopardy.

IMPORTANT: Răspunde EXCLUSIV cu un JSON valid, fără text adițional, fără markdown, fără explicații.

Structura JSON trebuie să fie exact aceasta:

{
  "title": "Titlul Concursului - ${topic}",
  "topic": "${topic}",
  "round1": [
    {
      "category": "Nume Categorie 1",
      "questions": [
        {
          "points": 100,
          "type": "standard",
          "question": "Textul întrebării?",
          "answer": "Răspunsul corect",
          "rationale": "Explicația scurtă a răspunsului"
        }
      ]
    }
  ],
  "bonus1": {
    "category": "Bonus Runda 1",
    "points": 300,
    "question": "Întrebare bonus?",
    "answer": "Răspuns bonus",
    "rationale": "Explicație"
  },
  "round2": [
    {
      "category": "Nume Categorie 1",
      "questions": [
        {
          "points": 200,
          "type": "standard",
          "question": "Textul întrebării?",
          "answer": "Răspunsul corect",
          "rationale": "Explicația scurtă"
        }
      ]
    }
  ],
  "bonus2": {
    "category": "Bonus Runda 2",
    "points": 500,
    "question": "Întrebare bonus?",
    "answer": "Răspuns bonus",
    "rationale": "Explicație"
  },
  "finalJeopardy": {
    "category": "Marea Finală",
    "question": "Întrebare finală complexă?",
    "answer": "Răspuns final",
    "rationale": "Explicație detaliată"
  }
}

Reguli:
- Fiecare categorie trebuie să aibă EXACT 4 întrebări
- Punctajele pentru Runda 1: 100, 200, 300, 400
- Punctajele pentru Runda 2: 200, 400, 800, 1000
- Întrebările trebuie să fie variate și interesante
- Răspunsurile trebuie să fie concise și corecte
- Explicațiile (rationale) trebuie să fie scurte dar informative
- Toate întrebările trebuie să fie în limba română
- Asigură-te că JSON-ul este valid și complet

Generează acum concursul complet pe tema "${topic}":`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Eroare la apelarea API-ului Gemini');
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error('Nu s-a primit răspuns de la AI');
    }

    // Extrage JSON-ul din răspuns (eliminăm markdown code blocks dacă există)
    let jsonText = textResponse.trim();
    
    // Elimină markdown code blocks dacă există
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const quizData = JSON.parse(jsonText) as QuizData;

    // Validare structură
    if (!quizData.title || !quizData.round1 || !quizData.finalJeopardy) {
      throw new Error('JSON-ul generat nu respectă structura cerută');
    }

    // Asigură-te că toate câmpurile necesare există
    if (!quizData.round2) {
      quizData.round2 = quizData.round1;
    }
    if (!quizData.bonus1) {
      quizData.bonus1 = {
        category: 'Bonus',
        points: 300,
        question: 'Întrebare bonus?',
        answer: 'Răspuns',
        rationale: 'Explicație'
      };
    }
    if (!quizData.bonus2) {
      quizData.bonus2 = {
        category: 'Bonus',
        points: 500,
        question: 'Întrebare bonus?',
        answer: 'Răspuns',
        rationale: 'Explicație'
      };
    }

    return quizData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('AI-ul a generat un JSON invalid. Încearcă din nou.');
    }
    throw error;
  }
}
