import { useCollection, txt } from './store';
import { sampleQuestions, type Question, type Subject } from '@/data/questions';

/** Built-in practice questions plus everything uploaded from the admin Question Bank. */
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
  }));
  return [...uploaded, ...sampleQuestions];
}
