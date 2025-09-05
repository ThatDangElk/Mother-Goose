// ==============================
// Event-Driven Lore Controller
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
      console.log('[Event Controller] Loaded', events.length, 'events');
    })
    .catch(err => console.error('[Event Controller] Failed to load events:', err));
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

      console.log(`[Event Controller] Event fired: ${event.id}`);
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
  console.log(`[Event Controller] Advancing to node: ${currentNode}`);

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
    console.log(`[Event Controller] Inline flag set: ${match[1]}`);
  }
}

// ------------------------------
// UI Placeholder (Lorebook-style)
// ------------------------------
function setupUI() {
  console.log('[Event Controller] UI setup placeholder');
  // Here you can replicate Lorebook table:
  // Columns: Title | Description | Trigger Flags | Set Flags | Repeatable | Status
}

// ------------------------------
// Initialization
// ------------------------------
function init() {
  console.log('[Event Controller] Initializing...');
  loadEvents();
  setupUI();

  // Example: hook processEvents into story/message cycle if possible
  // Example: hook filterLore into lorebook injection pipeline
}

init();
