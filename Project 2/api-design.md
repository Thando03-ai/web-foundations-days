In Markdown, a table is written with | separators, and indenting lines by 4 spaces turns them into a code block (used here for JSON examples).

docs/api-design.md   (markdown)

# QuickNotes API Design



Base URL: `https://api.quicknotes.com/v1`

All requests and responses use JSON. Every request (except sign-up and

login) must include the header `Authorization: Bearer <token>` so the

server knows which user is making it. Users can only access their own notes.



## Endpoints



| Method | Path                | Description                         | Success |

|--------|---------------------|-------------------------------------|---------|

| POST   | /auth/signup        | Create an account                   | 201     |

| POST   | /auth/login         | Log in, returns a token             | 200     |

| GET    | /notes              | List my notes (newest first)        | 200     |

| GET    | /notes?search=&category=&page= | Filter, search and paginate | 200  |

| GET    | /notes/{id}         | Get one note                        | 200     |

| POST   | /notes              | Create a note                       | 201     |

| PATCH  | /notes/{id}         | Update a note's text/category/tags  | 200     |

| DELETE | /notes/{id}         | Delete a note                       | 204     |



## Example: create a note



Request: `POST /notes`



    {

      "text": "Revise HTTP status codes",

      "category": "study",

      "tags": ["exams"]

    }



Response: `201 Created`



    {

      "id": 42,

      "text": "Revise HTTP status codes",

      "category": "study",

      "tags": ["exams"],

      "createdAt": "2026-09-22T09:15:00Z",

      "updatedAt": "2026-09-22T09:15:00Z"

    }



## Example: list notes



Request: `GET /notes?category=study&page=1`



Response: `200 OK`



    {

      "data": [

        { "id": 42, "text": "Revise HTTP status codes",

          "category": "study", "tags": ["exams"],

          "createdAt": "2026-09-22T09:15:00Z" }

      ],

      "page": 1,

      "pageSize": 20,

      "total": 1

    }



Lists are **paginated** (returned in pages of 20) so a user with

thousands of notes does not receive them all at once.



## Validation rules



- `text` is required and must be 1-200 characters.

- `category` must be one of `personal`, `work`, `study`.

- `tags` is optional: an array of up to 5 strings.



## Errors



Every error returns the same JSON shape:



    { "error": { "code": "VALIDATION_ERROR",

                 "message": "Text must be 1-200 characters." } }



| Status | When it happens                                   |

|--------|---------------------------------------------------|

| 400    | Invalid data (e.g. empty text, unknown category)  |

| 401    | Missing or invalid login token                    |

| 403    | Trying to access another user's note              |

| 404    | Note does not exist                               |

| 429    | Too many requests (limit: 100 per minute)         |

| 500    | Unexpected server error                           |

Commit: git add . then git commit -m "Add API design doc".

Step 7: Write docs/data-model.md (Task 5)

docs/data-model.md   (markdown)

# QuickNotes Data Model



We use a **relational (SQL) database - PostgreSQL**.



## Entities



**users** - people with an account



| Column        | Type      | Rules                    |

|---------------|-----------|--------------------------|

| id            | integer   | Primary key              |

| name          | text      | Required                 |

| email         | text      | Required, unique         |

| password_hash | text      | Required (never store plain passwords) |

| created_at    | timestamp | Defaults to now          |



**notes** - one note belongs to one user



| Column     | Type      | Rules                                 |

|------------|-----------|---------------------------------------|

| id         | integer   | Primary key                           |

| user_id    | integer   | Foreign key → users.id, required      |

| text       | text      | Required, max 200 characters          |

| category   | text      | personal / work / study               |

| created_at | timestamp | Defaults to now                       |

| updated_at | timestamp | Defaults to now                       |



**tags** - labels such as "urgent" (id, name - name is unique)



**note_tags** - join table linking notes and tags (note_id, tag_id)



## Relationships



- **users → notes: one-to-many.** One user has many notes; each note

  has exactly one owner (`notes.user_id`).

- **notes ↔ tags: many-to-many.** A note can have many tags and a tag

  can be used on many notes, so the `note_tags` table stores pairs.



## SQL schema



    CREATE TABLE users (

      id            SERIAL PRIMARY KEY,

      name          TEXT NOT NULL,

      email         TEXT NOT NULL UNIQUE,

      password_hash TEXT NOT NULL,

      created_at    TIMESTAMP NOT NULL DEFAULT NOW()

    );



    CREATE TABLE notes (

      id         SERIAL PRIMARY KEY,

      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

      text       TEXT NOT NULL CHECK (char_length(text) BETWEEN 1 AND 200),

      category   TEXT NOT NULL DEFAULT 'personal'

                 CHECK (category IN ('personal', 'work', 'study')),

      created_at TIMESTAMP NOT NULL DEFAULT NOW(),

      updated_at TIMESTAMP NOT NULL DEFAULT NOW()

    );



    CREATE TABLE tags (

      id   SERIAL PRIMARY KEY,

      name TEXT NOT NULL UNIQUE

    );



    CREATE TABLE note_tags (

      note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,

      tag_id  INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,

      PRIMARY KEY (note_id, tag_id)

    );



`SERIAL` is PostgreSQL's auto-numbering integer (1, 2, 3...).



## Example queries



    -- 1. A user's notes, newest first, 20 per page (page 1)

    SELECT id, text, category, created_at

    FROM notes

    WHERE user_id = 1

    ORDER BY created_at DESC

    LIMIT 20 OFFSET 0;



    -- 2. A user's notes with the tag "urgent" (JOIN)

    SELECT notes.id, notes.text

    FROM notes

    JOIN note_tags ON note_tags.note_id = notes.id

    JOIN tags      ON tags.id = note_tags.tag_id

    WHERE notes.user_id = 1 AND tags.name = 'urgent';



    -- 3. Number of notes per category for a user

    SELECT category, COUNT(*) AS total

    FROM notes

    WHERE user_id = 1

    GROUP BY category;



## Indexes



    CREATE INDEX idx_notes_user_created ON notes (user_id, created_at DESC);



Almost every request is "get this user's notes, newest first". This

index lets the database jump straight to one user's notes already in

date order, instead of scanning every note in the table. Primary keys

and UNIQUE columns (like `email` and `tags.name`) are indexed automatically.



## Why SQL instead of NoSQL?



Our data is well structured (users, notes, tags) with clear

relationships and rules (every note needs an owner, text max 200

characters, valid categories). A relational database enforces these

rules for us and handles the many-to-many tags relationship with JOINs.

Our estimate (~180 GB per year) fits comfortably in one PostgreSQL

primary with read replicas. A document database could be reconsidered

if notes later hold very flexible content such as images or checklists.

LIMIT 20 OFFSET 0 returns 20 rows starting from the first one; page 2 would use OFFSET 20. This is how pagination is done in SQL.

Commit: git add . then git commit -m "Add data model doc".