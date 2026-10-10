const API_URL = "https://jsonplaceholder.typicode.com/posts";
const MAX_TITLE_LENGTH = 100;

const loadBtn = document.querySelector("#load-btn");
const statusText = document.querySelector("#status");
const list = document.querySelector("#notes-list");
const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");
const submitBtn = document.querySelector("#submit-btn");

let notes = [];

async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = response.status === 204 ? null : await response.json();

  return {
    status: response.status,
    data,
  };
}

async function getNotes() {
  const result = await request(`${API_URL}?_limit=10`);
  return result.data;
}

async function createNote(title, body) {
  return request(API_URL, {
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
}

async function deleteNoteOnServer(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}

function setStatus(message, type = "info") {
  statusText.textContent = message;
  statusText.className = `status status-${type}`;
}

function createNoteElement(note) {
  const li = document.createElement("li");
  li.classList.add("note");

  const title = document.createElement("h3");
  title.textContent = note.title;

  const body = document.createElement("p");
  body.textContent = note.body || "(no details)";

  const del = document.createElement("button");

  del.textContent = "Delete";
  del.classList.add("delete-btn");

  del.addEventListener("click", () => handleDelete(note, del));

  li.append(title, body, del);

  return li;
}

function render() {
  list.innerHTML = "";

  if (notes.length === 0) {
    const item = document.createElement("li");

    item.textContent = "No notes to show. Load notes or create one.";

    item.classList.add("empty");

    list.appendChild(item);
    return;
  }

  notes.forEach((note) => {
    list.appendChild(createNoteElement(note));
  });
}

function validateTitle(title) {
  if (title === "") {
    return "Please enter a title.";
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  }

  return "";
}

async function handleLoad() {
  loadBtn.disabled = true;
  setStatus("Loading notes...");

  try {
    notes = await getNotes();

    render();

    setStatus(`Loaded ${notes.length} notes from the server.`, "success");
  } catch {
    setStatus("Could not load notes.", "error");
  } finally {
    loadBtn.disabled = false;
  }
}

async function handleCreate(event) {
  event.preventDefault();

  const title = titleInput.value.trim();

  const body = bodyInput.value.trim();

  const error = validateTitle(title);

  if (error) {
    setStatus(error, "error");
    return;
  }

  submitBtn.disabled = true;

  setStatus("Saving note...");

  try {
    const result = await createNote(title, body);

    const note = {
      ...result.data,
      localId: Date.now(),
      isLocal: true,
    };

    notes.unshift(note);

    render();

    setStatus(
      `Note created (status ${result.status}, id ${result.data.id}).`,
      "success"
    );

    form.reset();
  } catch {
    setStatus("Could not create note.", "error");
  } finally {
    submitBtn.disabled = false;
  }
}

async function handleDelete(note, button) {
  button.disabled = true;

  try {
    if (!note.isLocal) {
      await deleteNoteOnServer(note.id);
    }

    notes = notes.filter((n) =>
      note.isLocal ? n.localId !== note.localId : n.id !== note.id
    );

    render();

    setStatus("Note deleted.", "success");
  } catch {
    setStatus("Could not delete note.", "error");

    button.disabled = false;
  }
}

loadBtn.addEventListener("click", handleLoad);

form.addEventListener("submit", handleCreate);

render();
