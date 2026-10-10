const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const notesList = document.getElementById("notes-list");
const form = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = type;
}

async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response;
}

function createNoteElement(note) {
  const li = document.createElement("li");

  const title = document.createElement("h3");
  title.textContent = note.title;

  const body = document.createElement("p");
  body.textContent = note.body;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    deleteNote(note.id, li);
  });

  li.appendChild(title);
  li.appendChild(body);
  li.appendChild(deleteBtn);

  return li;
}

async function loadNotes() {
  try {
    loadBtn.disabled = true;

    setStatus("Loading notes...");

    const response = await request(`${API_URL}?_limit=10`);

    const notes = await response.json();

    notesList.innerHTML = "";

    if (notes.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No notes available.";
      notesList.appendChild(empty);

      setStatus("No notes found.", "success");
      return;
    }

    notes.forEach((note) => {
      notesList.appendChild(createNoteElement(note));
    });

    setStatus("Loaded 10 notes from the server.", "success");
  } catch (error) {
    setStatus("Unable to load notes. Please try again.", "error");
  } finally {
    loadBtn.disabled = false;
  }
}

async function createNote(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    setStatus("Title is required.", "error");
    return;
  }

  if (title.length > 100) {
    setStatus("Title must not exceed 100 characters.", "error");
    return;
  }

  try {
    submitBtn.disabled = true;

    setStatus("Creating note...");

    const response = await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1,
      }),
    });

    const note = await response.json();

    notesList.prepend(createNoteElement(note));

    setStatus(
      `Note created (status ${response.status}, id ${note.id}).`,
      "success"
    );

    form.reset();
  } catch (error) {
    setStatus("Failed to create note.", "error");
  } finally {
    submitBtn.disabled = false;
  }
}

async function deleteNote(id, element) {
  try {
    setStatus(`Deleting note ${id}...`);

    await request(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    /*
        JSONPlaceholder does not permanently
        store created records. For this demo
        we remove the note from the UI after
        receiving a successful DELETE response.
        */

    element.remove();

    setStatus(`Note ${id} deleted.`, "success");
  } catch (error) {
    setStatus("Unable to delete note.", "error");
  }
}

loadBtn.addEventListener("click", loadNotes);

form.addEventListener("submit", createNote);
