import { CafeEvent } from '../types';

const EVENT_STORAGE_KEY = 'kos_events';

// Fallback initial data
const INITIAL_EVENTS: CafeEvent[] = [
  {
    id: '1',
    name: 'Standup Comedy Night',
    date: 'Oct 24, 2026',
    time: '8:00 PM',
    description: 'Join us for a hilarious night featuring local talent!',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c30f065779?auto=format&fit=crop&q=80',
  }
];

export const getEvents = (): CafeEvent[] => {
  try {
    const data = localStorage.getItem(EVENT_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  } catch (error) {
    console.error('Failed to parse events from local storage', error);
    return INITIAL_EVENTS;
  }
};

export const saveEvent = (event: CafeEvent): void => {
  const events = getEvents();
  const existingIndex = events.findIndex((e) => e.id === event.id);
  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.unshift(event);
  }
  localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));
};

export const deleteEvent = (id: string): void => {
  const events = getEvents();
  const filtered = events.filter((e) => e.id !== id);
  localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(filtered));
};
