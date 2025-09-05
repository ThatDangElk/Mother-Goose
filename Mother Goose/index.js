// ==============================
// Mother Goose - Event-Driven Lore Controller
// index.js starter scaffold
// ==============================

// In-memory storage
let flags = {};       // current story/game flags
let events = [];      // loaded from events.json
let currentNode = null;

// ------------------------------
// Load events from a JSON file
// ------------------------------
function loadEvents() {
  fetch('events.json')
    .then(res => res.json())
    .then(data => {
      events = data;
      console.log('[Mother Goose] Loaded', events.length, 'events');
    })
    .catch(err => console.error('[Mother Goose] Failed to load events:', err));
}

// ------------------------------
// Process events based on flags
// ------------------------------
function processEvents() {
  let triggeredTexts = [];
  events.forEach(event => {
    // Skip non-repeatable events already fired
    if (!event.repeatable && flags[`event_fired_${event.id}`]) return;

    // Check triggers
    let ready = event.trigger_flags.every(f => flags[f]);
    if (ready) {
      // Set flags
      event.set_flags.forEach(f => flags[f] = true);

      // Mark as fired
      flags[`event_fired_${event.id}`] = true;

      // Collect text for display
      if (event.text) triggeredTexts.push(event.text);

      console.log(`[Mother Goose] Event fired: ${event.id}`);
    }
  });

  return triggeredTexts; // can inject into story or UI
}

// ------------------------------
// Filter lorebook entries based on flags
// ------------------------------
function filterLore(loreEntries) {
  return loreEntries.map(entry => {
    entry.active = !entry.condition || !!flags[entry.condition];
    return entry;
  });
}

// ------------------------------
// Advance story node
// ------------------------------
function advanceNode(node) {
  if (!node) return;
  currentNode = node.id;
  console.log(`[Mother Goose] Advancing to node: ${currentNode}`);

  if (node.unlock_flags) {
    node.unlock_flags.forEach(f => flags[f] = true);
  }

  // Immediately process any events triggered by this node
  return processEvents();
}

// ------------------------------
// Optional inline flag parser
// ------------------------------
function parseInlineFlags(text) {
  // matches {{set_flag: flag_name}}
  let regex = /\{\{set_flag:\s*([\w_-]+)\}\}/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    flags[match[1]] = true;
    console.log(`[Mother Goose] Inline flag set: ${match[1]}`);
  }
}

// ------------------------------
// UI Placeholder (Lorebook-style)
// ------------------------------
function setupUI() {
  console.log('[Mother Goose] UI setup placeholder');
  // Here you can replicate Lorebook table:
  // Columns: Title | Description | Trigger Flags | Set Flags | Repeatable | Status
}

// ------------------------------
// Initialization
// ------------------------------
function init() {
  console.log('[Mother Goose] Initializing...');
  loadEvents();
  setupUI();

  // Example: hook processEvents into story/message cycle if possible
  // Example: hook filterLore into lorebook injection pipeline
}

// ==============================
// SillyTavern Extension Export
// ==============================
export function setup() {
  init();
  // You can also add further SillyTavern-specific hooks here
  console.log('[Mother Goose] Extension setup complete');
}

// Optionally, export helpers if you want to use them elsewhere
export {
  flags,
  events,
  currentNode,
  processEvents,
  filterLore,
  advanceNode,
  parseInlineFlags
};
