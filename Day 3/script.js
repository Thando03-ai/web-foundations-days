let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];
// 1. searchNotes(word)
function searchNotes(word) {
  return notes.filter((note) =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}
// 2. longestNote()
function longestNote() {
  if (notes.length === 0) {
    return null;
  }
  let longest = notes[0];
  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}
// 3. countByCategory()
function countByCategory() {
  let counts = {};
  for (let note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }
  return counts;
}
// 4. getSummary()
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";
  return `${total} ${noteWord}: ${counts.personal || 0} personal, ${
    counts.work || 0
  } work, ${counts.study || 0} study.`;
}
// 5. isDuplicate(text)
function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();
  return notes.some((note) => note.text.trim().toLowerCase() === cleanedText);
}
// 6. addNote(text, category)
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];
  if (text.length < 1 || text.length > 200) {
    console.log("Invalid note length.");
    return false;
  }
  if (isDuplicate(text)) {
    console.log("Duplicate note.");
    return false;
  }
  if (!validCategories.includes(category)) {
    console.log("Invalid category.");
    return false;
  }
  notes.push({
    id: notes.length + 1,
    text,
    category,
  });
  return true;
}
/* TESTS */
// searchNotes
console.log(searchNotes("milk"));
// Expected: [{ id: 1, text: "Buy milk and bread", category: "personal" }]
console.log(searchNotes("holiday"));
// Expected: []
// longestNote
console.log(longestNote());
// Expected: note object with the longest text
let backupNotes = [...notes];
notes = [];
console.log(longestNote());
// Expected: null
notes = backupNotes;
// countByCategory
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }
notes.push({
  id: 6,
  text: "Prepare for meeting",
  category: "work",
});
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 2 }
// getSummary
console.log(getSummary());
// Expected: summary string showing note counts
notes = [{ id: 1, text: "Single note", category: "personal" }];
console.log(getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."
notes = backupNotes;
// isDuplicate
console.log(isDuplicate("Buy milk and bread"));
// Expected: true
console.log(isDuplicate("Go shopping"));
// Expected: false
// addNote
console.log(addNote("Read JavaScript book", "study"));
// Expected: true
console.log(addNote("Buy milk and bread", "personal"));
// Expected: false
