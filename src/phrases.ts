import type { PhrasePattern, Archetype } from './types.js';

export const PHRASES: PhrasePattern[] = [
  // ── Apology ──────────────────────────────────────────────
  {
    id: 'apologize-confusion',
    pattern: /\bI apologize for the confusion\b/gi,
    displayName: 'I apologize for the confusion',
    category: 'apology',
    funFact: "Claude's trademark move",
  },
  {
    id: 'apologize-oversight',
    pattern: /\bI apologize for the oversight\b/gi,
    displayName: 'I apologize for the oversight',
    category: 'apology',
    funFact: "The polite way of saying 'my bad'",
  },
  {
    id: 'apologize-error',
    pattern: /\bI apologize for the error\b/gi,
    displayName: 'I apologize for the error',
    category: 'apology',
  },
  {
    id: 'sorry-about-that',
    pattern: /\bsorry about that\b/gi,
    displayName: 'Sorry about that',
    category: 'apology',
  },
  {
    id: 'my-apologies',
    pattern: /\bmy apologies\b/gi,
    displayName: 'My apologies',
    category: 'apology',
  },
  {
    id: 'should-have-caught',
    pattern: /\bI should have caught that earlier\b/gi,
    displayName: 'I should have caught that earlier',
    category: 'apology',
  },

  // ── Agreement ────────────────────────────────────────────
  {
    id: 'absolutely-right',
    pattern: /\byou'?re absolutely right\b/gi,
    displayName: "You're absolutely right",
    category: 'agreement',
    funFact: "Claude's way of buttering you up",
  },
  {
    id: 'good-catch',
    pattern: /\bgood catch\b/gi,
    displayName: 'Good catch!',
    category: 'agreement',
    funFact: 'You found a bug Claude missed (again)',
  },
  {
    id: 'that-makes-sense',
    pattern: /\bthat makes sense\b/gi,
    displayName: 'That makes sense',
    category: 'agreement',
  },
  {
    id: 'great-point',
    pattern: /\bthat'?s a great point\b/gi,
    displayName: "That's a great point",
    category: 'agreement',
  },
  {
    id: 'great-question',
    pattern: /\bgreat question\b/gi,
    displayName: 'Great question!',
    category: 'agreement',
    funFact: 'Every question is great apparently',
  },
  {
    id: 'excellent-question',
    pattern: /\bexcellent question\b/gi,
    displayName: 'Excellent question',
    category: 'agreement',
  },
  {
    id: 'youre-correct',
    pattern: /\byou'?re correct\b/gi,
    displayName: "You're correct",
    category: 'agreement',
  },

  // ── Narration ────────────────────────────────────────────
  {
    id: 'let-me-take-closer-look',
    pattern: /\blet me take a closer look\b/gi,
    displayName: 'Let me take a closer look',
    category: 'narration',
    funFact: 'Claude puts on reading glasses',
  },
  {
    id: 'let-me-fix-that',
    pattern: /\blet me fix that\b/gi,
    displayName: 'Let me fix that',
    category: 'narration',
  },
  {
    id: 'let-me-search-for',
    pattern: /\blet me search for\b/gi,
    displayName: 'Let me search for',
    category: 'narration',
  },
  {
    id: 'let-me-read-the-file',
    pattern: /\blet me read the file\b/gi,
    displayName: 'Let me read the file',
    category: 'narration',
  },
  {
    id: 'let-me-investigate',
    pattern: /\blet me investigate\b/gi,
    displayName: 'Let me investigate',
    category: 'narration',
  },
  {
    id: 'let-me-check',
    pattern: /\blet me check (that|this|if|whether|the)\b/gi,
    displayName: 'Let me check...',
    category: 'narration',
  },
  {
    id: 'now-let-me',
    pattern: /^now,? let me\b/gim,
    displayName: 'Now let me...',
    category: 'narration',
    funFact: 'The classic Claude scene transition',
  },
  {
    id: 'ill-go-ahead-and',
    pattern: /\bI'?ll go ahead and\b/gi,
    displayName: "I'll go ahead and",
    category: 'narration',
    funFact: 'Nobody asked you to announce it',
  },
  {
    id: 'i-can-see-that',
    pattern: /\bI can see that\b/gi,
    displayName: 'I can see that',
    category: 'narration',
  },
  {
    id: 'i-notice-that',
    pattern: /\bI notice that\b/gi,
    displayName: 'I notice that',
    category: 'narration',
  },
  {
    id: 'i-see-the-issue',
    pattern: /\bI see the issue\b/gi,
    displayName: 'I see the issue',
    category: 'narration',
  },
  {
    id: 'looking-at-the-code',
    pattern: /\blooking at the code\b/gi,
    displayName: 'Looking at the code',
    category: 'narration',
  },
  {
    id: 'ill-fix-that-right-away',
    pattern: /\bI'?ll fix that right away\b/gi,
    displayName: "I'll fix that right away",
    category: 'narration',
  },
  {
    id: 'the-issue-is-that',
    pattern: /\bthe issue is that\b/gi,
    displayName: 'The issue is that',
    category: 'narration',
  },
  {
    id: 'ive-updated-the',
    pattern: /\bI'?ve updated the\b/gi,
    displayName: "I've updated the",
    category: 'narration',
  },

  // ── Hedge ────────────────────────────────────────────────
  {
    id: 'it-seems-like',
    pattern: /\bit seems like\b/gi,
    displayName: 'It seems like',
    category: 'hedge',
  },
  {
    id: 'it-appears-that',
    pattern: /\bit appears that\b/gi,
    displayName: 'It appears that',
    category: 'hedge',
  },
  {
    id: 'i-believe',
    pattern: /\bI believe\b/gi,
    displayName: 'I believe',
    category: 'hedge',
  },
  {
    id: 'if-i-understand-correctly',
    pattern: /\bif I understand correctly\b/gi,
    displayName: 'If I understand correctly',
    category: 'hedge',
    funFact: 'Narrator: Claude did not understand correctly',
  },
  {
    id: 'it-looks-like',
    pattern: /\bit looks like\b/gi,
    displayName: 'It looks like',
    category: 'hedge',
  },
  {
    id: 'this-should',
    pattern: /\bthis should\b/gi,
    displayName: 'This should',
    category: 'hedge',
    funFact: 'Spoiler: it might not',
  },
  {
    id: 'not-entirely-sure',
    pattern: /\bI'?m not entirely sure\b/gi,
    displayName: "I'm not entirely sure",
    category: 'hedge',
  },

  // ── Enthusiasm ───────────────────────────────────────────
  {
    id: 'certainly',
    pattern: /\bcertainly[!.]?/gi,
    displayName: 'Certainly!',
    category: 'enthusiasm',
    funFact: 'The most Claude word in existence',
  },
  {
    id: 'of-course',
    pattern: /\bof course[!.]?/gi,
    displayName: 'Of course!',
    category: 'enthusiasm',
  },
  {
    id: 'absolutely',
    pattern: /\babsolutely[!.]?/gi,
    displayName: 'Absolutely!',
    category: 'enthusiasm',
  },
  {
    id: 'happy-to-help',
    pattern: /\bhappy to help\b/gi,
    displayName: 'Happy to help',
    category: 'enthusiasm',
    funFact: 'Is Claude actually happy though?',
  },
  {
    id: 'perfect',
    pattern: /^perfect[!.]/gim,
    displayName: 'Perfect!',
    category: 'enthusiasm',
  },
  {
    id: 'great-opener',
    pattern: /^great[!.,]/gi,
    displayName: 'Great!',
    category: 'enthusiasm',
  },

  // ── Over-explain ─────────────────────────────────────────
  {
    id: 'in-other-words',
    pattern: /\bin other words\b/gi,
    displayName: 'In other words',
    category: 'over-explain',
  },
  {
    id: 'to-summarize',
    pattern: /\bto summarize\b/gi,
    displayName: 'To summarize',
    category: 'over-explain',
  },
  {
    id: 'essentially',
    pattern: /\bessentially\b/gi,
    displayName: 'Essentially',
    category: 'over-explain',
  },
  {
    id: 'heres-whats-happening',
    pattern: /\bhere'?s what'?s happening\b/gi,
    displayName: "Here's what's happening",
    category: 'over-explain',
  },
  {
    id: 'let-me-break-this-down',
    pattern: /\blet me break this down\b/gi,
    displayName: 'Let me break this down',
    category: 'over-explain',
    funFact: 'Nobody asked for a breakdown',
  },
  {
    id: 'what-this-means-is',
    pattern: /\bwhat this means is\b/gi,
    displayName: 'What this means is',
    category: 'over-explain',
  },

  // ── Structured ───────────────────────────────────────────
  {
    id: 'heres-what-i-found',
    pattern: /\bhere'?s what I found\b/gi,
    displayName: "Here's what I found",
    category: 'structured',
  },
  {
    id: 'there-are-a-few-things',
    pattern: /\bthere are a few things\b/gi,
    displayName: 'There are a few things',
    category: 'structured',
  },
  {
    id: 'heres-the-plan',
    pattern: /\bhere'?s the plan\b/gi,
    displayName: "Here's the plan",
    category: 'structured',
  },
  {
    id: 'key-changes-are',
    pattern: /\bthe key changes are\b/gi,
    displayName: 'The key changes are',
    category: 'structured',
  },

  // ── Completion ───────────────────────────────────────────
  {
    id: 'everything-is-now-working',
    pattern: /\beverything is now working\b/gi,
    displayName: 'Everything is now working',
    category: 'completion',
  },
  {
    id: 'all-tests-passing',
    pattern: /\ball tests are passing\b/gi,
    displayName: 'All tests are passing',
    category: 'completion',
    funFact: 'Famous last words',
  },
  {
    id: 'successfully',
    pattern: /\bsuccessfully\b/gi,
    displayName: 'Successfully',
    category: 'completion',
  },
  {
    id: 'should-resolve-the-issue',
    pattern: /\bthis should resolve the issue\b/gi,
    displayName: 'This should resolve the issue',
    category: 'completion',
  },
  {
    id: 'ive-made-the-following-changes',
    pattern: /\bI'?ve made the following changes\b/gi,
    displayName: "I've made the following changes",
    category: 'completion',
  },

  // ── Claude-code ──────────────────────────────────────────
  {
    id: 'let-me-search-the-codebase',
    pattern: /\blet me search the codebase\b/gi,
    displayName: 'Let me search the codebase',
    category: 'claude-code',
  },
  {
    id: 'based-on-the-error',
    pattern: /\bbased on the error\b/gi,
    displayName: 'Based on the error',
    category: 'claude-code',
  },
  {
    id: 'the-root-cause',
    pattern: /\bthe root cause\b/gi,
    displayName: 'The root cause',
    category: 'claude-code',
    funFact: 'Claude loves root cause analysis',
  },
  {
    id: 'let-me-run-the-tests',
    pattern: /\blet me run the tests\b/gi,
    displayName: 'Let me run the tests',
    category: 'claude-code',
  },

  // ── Qualifier ────────────────────────────────────────────
  {
    id: 'dont-have-access-to',
    pattern: /\bI don'?t have access to\b/gi,
    displayName: "I don't have access to",
    category: 'qualifier',
  },
  {
    id: 'want-to-make-sure',
    pattern: /\bI want to make sure\b/gi,
    displayName: 'I want to make sure',
    category: 'qualifier',
  },
  {
    id: 'just-to-clarify',
    pattern: /\bjust to clarify\b/gi,
    displayName: 'Just to clarify',
    category: 'qualifier',
  },
  {
    id: 'for-context',
    pattern: /\bfor context\b/gi,
    displayName: 'For context',
    category: 'qualifier',
  },

  // ── Safety ───────────────────────────────────────────────
  {
    id: 'please-note-that',
    pattern: /\bplease note that\b/gi,
    displayName: 'Please note that',
    category: 'safety',
  },
  {
    id: 'keep-in-mind-that',
    pattern: /\bkeep in mind that\b/gi,
    displayName: 'Keep in mind that',
    category: 'safety',
  },
  {
    id: 'its-worth-noting',
    pattern: /\bit'?s worth noting\b/gi,
    displayName: "It's worth noting",
    category: 'safety',
    funFact: 'Is it though?',
  },
  {
    id: 'be-careful-with',
    pattern: /\bbe careful with\b/gi,
    displayName: 'Be careful with',
    category: 'safety',
  },
  {
    id: 'make-sure-to',
    pattern: /\bmake sure to\b/gi,
    displayName: 'Make sure to',
    category: 'safety',
  },
  {
    id: 'let-me-know-if',
    pattern: /\blet me know if\b/gi,
    displayName: 'Let me know if',
    category: 'safety',
    funFact: "Claude's favorite sign-off",
  },
];

export const ARCHETYPES: Archetype[] = [
  {
    name: 'The Apologizer',
    description: 'Sorry not sorry (but actually sorry)',
    icon: '🙇',
    categories: ['apology'],
  },
  {
    name: 'The Over-Explainer',
    description: 'Why use 10 words when 100 will do?',
    icon: '📚',
    categories: ['over-explain', 'structured'],
  },
  {
    name: 'The Eager Helper',
    description: 'At your service, always!',
    icon: '🦮',
    categories: ['enthusiasm', 'agreement'],
  },
  {
    name: 'The Hedgehog',
    description: 'Probably maybe possibly correct',
    icon: '🦔',
    categories: ['hedge', 'qualifier'],
  },
  {
    name: 'The Cheerleader',
    description: 'Great question! Excellent point! Amazing!',
    icon: '📣',
    categories: ['agreement', 'enthusiasm'],
  },
  {
    name: 'The Narrator',
    description: 'Let me tell you what I am about to do',
    icon: '🎬',
    categories: ['narration', 'claude-code'],
  },
  {
    name: 'The Safety Inspector',
    description: 'Please note, keep in mind, be careful',
    icon: '🦺',
    categories: ['safety', 'qualifier'],
  },
  {
    name: 'The Professor',
    description: 'Here is a 500-word explanation you did not ask for',
    icon: '🎓',
    categories: ['over-explain', 'hedge'],
  },
];
