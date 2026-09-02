import { CompletedInterviewResult, InterviewSession } from '../types';

const HISTORY_STORAGE_KEY = 'mentor_ai_interview_history_v1';
const ACTIVE_SESSION_STORAGE_KEY = 'mentor_ai_active_interview_session_v1';

export function loadInterviewHistory(): CompletedInterviewResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading interview history:', err);
  }
  return [];
}

export function saveInterviewHistory(history: CompletedInterviewResult[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Error saving interview history:', err);
  }
}

export function appendCompletedInterview(result: CompletedInterviewResult): CompletedInterviewResult[] {
  const current = loadInterviewHistory();
  // Check duplicate ID
  const exists = current.some(item => item.id === result.id);
  const updated = exists ? current.map(item => item.id === result.id ? result : item) : [result, ...current];
  saveInterviewHistory(updated);
  return updated;
}

export function clearInterviewHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing interview history:', err);
  }
}

export function saveActiveSession(session: InterviewSession | null): void {
  try {
    if (session) {
      sessionStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Error saving active interview session:', err);
  }
}

export function loadActiveSession(): InterviewSession | null {
  try {
    const raw = sessionStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading active session:', err);
  }
  return null;
}
