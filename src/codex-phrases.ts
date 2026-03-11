import type { PhrasePattern, Archetype } from './types.js';

export const CODEX_PHRASES: PhrasePattern[] = [
  // ── Eager Agreement (agreement) ────────────────────────
  {
    id: 'codex-sure',
    pattern: /\bsure(?:\s+thing)?[!.]?/gi,
    displayName: 'Sure! / Sure thing!',
    category: 'agreement',
    funFact: "GPT's version of 'Certainly!'",
  },
  {
    id: 'codex-got-it',
    pattern: /\bgot it[!.]?/gi,
    displayName: 'Got it!',
    category: 'agreement',
    funFact: 'The casual acknowledgment king',
  },
  {
    id: 'codex-no-problem',
    pattern: /\bno problem[!.]?/gi,
    displayName: 'No problem!',
    category: 'agreement',
  },
  {
    id: 'codex-sounds-good',
    pattern: /\bsounds good[!.]?/gi,
    displayName: 'Sounds good!',
    category: 'agreement',
  },
  {
    id: 'codex-youre-welcome',
    pattern: /\byou'?re welcome[!.]?/gi,
    displayName: "You're welcome!",
    category: 'agreement',
  },
  {
    id: 'codex-of-course',
    pattern: /\bof course[!.]?/gi,
    displayName: 'Of course!',
    category: 'agreement',
  },

  // ── Presentation (narration) ───────────────────────────
  {
    id: 'codex-here-you-go',
    pattern: /\bhere you go[!.]?/gi,
    displayName: 'Here you go!',
    category: 'narration',
    funFact: 'GPT thinks it\'s a waiter',
  },
  {
    id: 'codex-heres-what-i-came-up-with',
    pattern: /\bhere'?s what I came up with\b/gi,
    displayName: "Here's what I came up with",
    category: 'narration',
  },
  {
    id: 'codex-ive-gone-ahead-and',
    pattern: /\bI'?ve gone ahead and\b/gi,
    displayName: "I've gone ahead and",
    category: 'narration',
    funFact: 'Nobody asked you to go ahead',
  },
  {
    id: 'codex-let-me-whip-up',
    pattern: /\blet me whip up\b/gi,
    displayName: 'Let me whip up',
    category: 'narration',
  },
  {
    id: 'codex-i-went-with',
    pattern: /\bI went with\b/gi,
    displayName: 'I went with',
    category: 'narration',
  },

  // ── Breakdown (over-explain) ───────────────────────────
  {
    id: 'codex-lets-break-this-down',
    pattern: /\blet'?s break this down\b/gi,
    displayName: "Let's break this down",
    category: 'over-explain',
    funFact: "GPT's favorite way to stall",
  },
  {
    id: 'codex-lets-dive-in',
    pattern: /\blet'?s dive in(?:to)?\b/gi,
    displayName: "Let's dive in / Let's dive into",
    category: 'over-explain',
    funFact: "The dive metaphor that won't die",
  },
  {
    id: 'codex-at-a-high-level',
    pattern: /\bat a high level\b/gi,
    displayName: 'At a high level',
    category: 'over-explain',
  },
  {
    id: 'codex-the-key-thing-here-is',
    pattern: /\bthe key thing here is\b/gi,
    displayName: 'The key thing here is',
    category: 'over-explain',
  },
  {
    id: 'codex-the-tldr-is',
    pattern: /\bthe tl;?dr is\b/gi,
    displayName: 'The TL;DR is',
    category: 'over-explain',
  },
  {
    id: 'codex-in-a-nutshell',
    pattern: /\bin a nutshell\b/gi,
    displayName: 'In a nutshell',
    category: 'over-explain',
  },

  // ── Validation / Flattery (agreement) ──────────────────
  {
    id: 'codex-great-question',
    pattern: /\bgreat question[!.]?/gi,
    displayName: 'Great question!',
    category: 'agreement',
    funFact: 'Every question is great apparently',
  },
  {
    id: 'codex-great-choice',
    pattern: /\bgreat choice[!.]?/gi,
    displayName: 'Great choice!',
    category: 'agreement',
  },
  {
    id: 'codex-thats-a-really-good-point',
    pattern: /\bthat'?s a really good point\b/gi,
    displayName: "That's a really good point",
    category: 'agreement',
  },
  {
    id: 'codex-youre-on-the-right-track',
    pattern: /\byou'?re on the right track[!.]?/gi,
    displayName: "You're on the right track!",
    category: 'agreement',
  },
  {
    id: 'codex-love-that-idea',
    pattern: /\blove that idea[!.]?/gi,
    displayName: 'Love that idea!',
    category: 'agreement',
  },
  {
    id: 'codex-smart-approach',
    pattern: /\bsmart approach[!.]?/gi,
    displayName: 'Smart approach!',
    category: 'agreement',
  },

  // ── Checking-in (hedge) ────────────────────────────────
  {
    id: 'codex-does-that-make-sense',
    pattern: /\bdoes that make sense\b/gi,
    displayName: 'Does that make sense?',
    category: 'hedge',
    funFact: "GPT's favorite sign-off",
  },
  {
    id: 'codex-let-me-know-if-you-need-anything-else',
    pattern: /\blet me know if you need anything else[!.]?/gi,
    displayName: 'Let me know if you need anything else!',
    category: 'hedge',
  },
  {
    id: 'codex-hope-that-helps',
    pattern: /\bhope that helps[!.]?/gi,
    displayName: 'Hope that helps!',
    category: 'hedge',
  },
  {
    id: 'codex-feel-free-to-ask',
    pattern: /\bfeel free to ask\b/gi,
    displayName: 'Feel free to ask',
    category: 'hedge',
  },
  {
    id: 'codex-want-me-to-tweak',
    pattern: /\bwant me to tweak\b/gi,
    displayName: 'Want me to tweak anything?',
    category: 'hedge',
  },

  // ── Filler (qualifier) ─────────────────────────────────
  {
    id: 'codex-so-basically',
    pattern: /\bso basically\b/gi,
    displayName: 'So basically',
    category: 'qualifier',
    funFact: "The verbal filler GPT can't quit",
  },
  {
    id: 'codex-just-to-clarify',
    pattern: /\bjust to clarify\b/gi,
    displayName: 'Just to clarify',
    category: 'qualifier',
  },
  {
    id: 'codex-to-be-more-specific',
    pattern: /\bto be more specific\b/gi,
    displayName: 'To be more specific',
    category: 'qualifier',
  },

  // ── Code-specific (completion) ─────────────────────────
  {
    id: 'codex-should-do-the-trick',
    pattern: /\bshould do the trick[!.]?/gi,
    displayName: 'This should do the trick!',
    category: 'completion',
    funFact: "GPT's folksy confidence",
  },
  {
    id: 'codex-clean-and-simple',
    pattern: /\bclean and simple\b/gi,
    displayName: 'Clean and simple',
    category: 'completion',
  },
  {
    id: 'codex-nice-and-clean',
    pattern: /\bnice and clean\b/gi,
    displayName: 'Nice and clean',
    category: 'completion',
    funFact: 'GPT admiring its own code',
  },
  {
    id: 'codex-that-should-fix-it',
    pattern: /\bthat should fix it[!.]?/gi,
    displayName: 'That should fix it!',
    category: 'completion',
  },
  {
    id: 'codex-i-tweaked',
    pattern: /\bI tweaked\b/gi,
    displayName: 'I tweaked',
    category: 'completion',
  },

  // ── Enthusiasm ─────────────────────────────────────────
  {
    id: 'codex-absolutely',
    pattern: /\babsolutely[!.]?/gi,
    displayName: 'Absolutely!',
    category: 'enthusiasm',
  },
  {
    id: 'codex-perfect',
    pattern: /\bperfect[!.]?/gi,
    displayName: 'Perfect!',
    category: 'enthusiasm',
  },
  {
    id: 'codex-awesome',
    pattern: /\bawesome[!.]?/gi,
    displayName: 'Awesome!',
    category: 'enthusiasm',
  },
  {
    id: 'codex-amazing',
    pattern: /\bamazing[!.]?/gi,
    displayName: 'Amazing!',
    category: 'enthusiasm',
  },
];

export const CODEX_ARCHETYPES: Archetype[] = [
  { name: 'The Hype Man', description: 'Sure! Got it! No problem! Absolutely!', icon: '🎤', categories: ['agreement', 'enthusiasm'] },
  { name: 'The Diver', description: "Let's dive in! Let's break this down!", icon: '🤿', categories: ['narration', 'over-explain'] },
  { name: 'The Cheerleader', description: 'Great question! Smart approach! Love it!', icon: '📣', categories: ['agreement', 'enthusiasm'] },
  { name: 'The Waiter', description: 'Here you go! Great choice! Anything else?', icon: '🍽️', categories: ['narration', 'hedge'] },
  { name: 'The Bro', description: 'This should do the trick! Nice and clean!', icon: '🤙', categories: ['completion', 'enthusiasm'] },
  { name: 'The Teacher', description: "Let's break this down. The key thing here is...", icon: '👨‍🏫', categories: ['over-explain', 'narration'] },
  { name: 'The Customer Service Rep', description: 'Does that make sense? Let me know if you need anything!', icon: '🎧', categories: ['hedge', 'safety'] },
  { name: 'The Casual', description: 'So basically... In a nutshell... TL;DR...', icon: '😎', categories: ['over-explain', 'qualifier'] },
];
