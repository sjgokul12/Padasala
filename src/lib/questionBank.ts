import { useCollection, txt } from './store';
import { backendEnabled } from './api';
import { sampleQuestions, type Question, type Subject } from '@/data/questions';

/**
 * Questions for mock tests. With the backend connected they all come from the database question bank;
 * in demo mode the built-in practice questions are added to the ones uploaded on this device.
 */
export function useQuestionBank(): Question[] {
  const { items } = useCollection('questions');
  const uploaded: Question[] = items.map((p) => ({
    id: p.id,
    subject: txt(p.subject) as Subject,
    text: txt(p.text),
    options: p.options as string[],
    answer: Number(p.answer),
    explanation: txt(p.explanation),
    source: txt(p.source) || 'practice',
    aiExplanation: p.aiExplanation ? txt(p.aiExplanation) : undefined,
  }));
  return backendEnabled ? uploaded : [...uploaded, ...sampleQuestions];
}
