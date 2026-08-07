import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const MODEL_NAME = 'gemini-3.6-flash';

export async function generateSummary(notes: string, subject?: string, isExamBooster?: boolean) {
  const prompt = `You are a professional study strategist for university exams.
Summarize the study notes for: ${subject || 'General'}.
Preserve formulas, theorems, and technical definitions exactly. Use bold markdown for key terms.
${isExamBooster ? 'EXAM BOOSTER MODE ACTIVE: Add "Commonly Confused Terms" and emphasize university marking scheme keywords.' : ''}

Respond STRICTLY with a valid JSON object matching this schema:
{
  "shortSummary": "A 3-5 line high-level summary using bold for key terms",
  "bulletPoints": ["10-15 dense academic bullet points"],
  "keyConcepts": [{"term": "concept name", "explanation": "detailed explanation"}],
  "examHighlights": "Section explaining how this topic usually appears in university exams",
  "quickRevisionBlock": "Ultra-short revision hook for 1 minute before exam"
}

Notes:
${notes}`;

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) throw new Error('AI returned an empty response.');
    return JSON.parse(text);
  } catch (error: any) {
    logger.error('Gemini generateSummary failed: ' + error.message);
    throw new Error('AI summary generation failed: ' + (error.message || 'Unknown error'));
  }
}

export async function generateModelAnswer(
  questionOrTopic: string,
  subject?: string,
  answerMode: 'short' | 'medium' | 'long' | 'bullet' = 'medium',
  isExamBooster?: boolean
) {
  const prompt = `You are an expert university professor specializing in high-scoring exam writing for: ${subject || 'General'}.
Generate a model answer for: ${questionOrTopic}.
Answer length mode: ${answerMode}.
${isExamBooster ? 'EXAM BOOSTER MODE ACTIVE: Include "Common Mistakes to Avoid" section and extra technical sub-points.' : ''}

Respond STRICTLY with a valid JSON object matching this schema:
{
  "title": "Academic title",
  "introduction": "2-3 sentence intro",
  "mainBody": "Core structured points",
  "conclusion": "Final summary statement",
  "keyTerms": ["keywords used"],
  "scoringKeywords": ["3-5 technical terms evaluator looks for"],
  "diagramSuggestions": "Brief description of diagram to draw",
  "examTip": "Tactical scoring hint"
}
`;

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) throw new Error('AI returned an empty response.');
    return JSON.parse(text);
  } catch (error: any) {
    logger.error('Gemini generateModelAnswer failed: ' + error.message);
    throw new Error('AI model answer generation failed: ' + (error.message || 'Unknown error'));
  }
}

export async function generateImportantQuestions(chapterNotes: string, subject?: string, isExamBooster?: boolean) {
  const prompt = `Analyze the notes and predict high-probability university exam questions for: ${subject || 'General'}.
Categorize into 2-mark, 5-mark, 10-mark, and viva questions.
${isExamBooster ? 'EXAM BOOSTER MODE ACTIVE: Highlight university paper top picks.' : ''}

Respond STRICTLY with a valid JSON object matching this schema:
{
  "predictionConfidence": "low" | "medium" | "high",
  "twoMarkQuestions": ["5 short definition questions"],
  "fiveMarkQuestions": ["5 medium explanatory questions"],
  "tenMarkQuestions": ["3 essay questions"],
  "mostProbable": ["questions MOST likely to appear"],
  "vivaQuestions": ["5 oral prep questions"]
}

Notes:
${chapterNotes}`;

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) throw new Error('AI returned an empty response.');
    return JSON.parse(text);
  } catch (error: any) {
    logger.error('Gemini generateImportantQuestions failed: ' + error.message);
    throw new Error('AI question prediction failed: ' + (error.message || 'Unknown error'));
  }
}

export async function generateRevisionSheet(topic: string, subject?: string, isExamBooster?: boolean) {
  const prompt = `Create a 1-page rapid revision pack for: ${subject || 'General'}.
Include quick notes, key formulas/definitions, mnemonics, checklist, and top 3 must-memorize points.
${isExamBooster ? 'EXAM BOOSTER MODE ACTIVE: Include Common Exam Traps.' : ''}

Respond STRICTLY with a valid JSON object matching this schema:
{
  "quickNotes": "Dense summary for fast reading",
  "formulasAndDefinitions": ["Key formulas or definitions"],
  "mnemonics": ["3-5 memory shortcuts"],
  "lastMinuteChecklist": ["5 tactical points"],
  "mustMemorizeSection": ["Top 3 points that carry most marks"]
}

Topic/Notes:
${topic}`;

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) throw new Error('AI returned an empty response.');
    return JSON.parse(text);
  } catch (error: any) {
    logger.error('Gemini generateRevisionSheet failed: ' + error.message);
    throw new Error('AI revision sheet generation failed: ' + (error.message || 'Unknown error'));
  }
}
