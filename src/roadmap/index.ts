import { RoadmapCategory, RoadmapTopic, Roadmap } from '../types';
import { FOUNDATIONS_TOPICS } from './foundationsData';
import { DATA_STRUCTURES_TOPICS } from './dataStructuresData';
import { ALGORITHMS_TOPICS } from './algorithmsData';
import { ADVANCED_TOPICS } from './advancedData';

export { FOUNDATIONS_TOPICS } from './foundationsData';
export { DATA_STRUCTURES_TOPICS } from './dataStructuresData';
export { ALGORITHMS_TOPICS } from './algorithmsData';
export { ADVANCED_TOPICS } from './advancedData';

export const ROADMAP_CATEGORIES: RoadmapCategory[] = [
  {
    id: 'cat-foundations',
    title: 'Foundations',
    description: 'Master core programming fundamentals, memory execution, conditionals, loops, functions, and defensive problem-solving.',
    icon: 'Terminal',
    level: 'Foundations',
    topics: FOUNDATIONS_TOPICS
  },
  {
    id: 'cat-datastructures',
    title: 'Data Structures',
    description: 'Learn memory structures from linear contiguous arrays and strings to hash maps, stacks, queues, linked lists, trees, and graphs.',
    icon: 'Database',
    level: 'Intermediate',
    topics: DATA_STRUCTURES_TOPICS
  },
  {
    id: 'cat-algorithms',
    title: 'Algorithms',
    description: 'Master algorithmic problem solving: binary search, sorting, two pointers, sliding window, recursion, backtracking, greedy, and dynamic programming.',
    icon: 'Cpu',
    level: 'Intermediate',
    topics: ALGORITHMS_TOPICS
  },
  {
    id: 'cat-advanced',
    title: 'Advanced & Applied Systems',
    description: 'Advanced trees, heaps, tries, shortest-path graph traversals, 2D dynamic programming, bit manipulation, full-stack APIs, and AI/LLM foundations.',
    icon: 'Compass',
    level: 'Advanced',
    topics: ADVANCED_TOPICS
  }
];

export const ALL_ROADMAP_TOPICS: RoadmapTopic[] = [
  ...FOUNDATIONS_TOPICS,
  ...DATA_STRUCTURES_TOPICS,
  ...ALGORITHMS_TOPICS,
  ...ADVANCED_TOPICS
];

export const ROADMAP_TOPIC_MAP: Record<string, RoadmapTopic> = ALL_ROADMAP_TOPICS.reduce(
  (acc, topic) => {
    acc[topic.id] = topic;
    return acc;
  },
  {} as Record<string, RoadmapTopic>
);

// Backward-compatible ROADMAPS representation for existing components if needed
export const ADAPTED_ROADMAPS: Roadmap[] = ROADMAP_CATEGORIES.map(cat => ({
  id: cat.id,
  title: cat.title,
  description: cat.description,
  icon: cat.icon,
  nodes: cat.topics.map((t, idx) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: idx === 0 ? 'unlocked' : 'locked',
    xpReward: t.xpReward,
    duration: t.duration,
    topicRefId: t.id
  }))
}));
