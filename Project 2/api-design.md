QuickNotes API Design
Base URL:

https://api.quicknotes.com/v1

All requests and responses use JSON.

Endpoints
Method	Path	Description	Success
POST	/auth/signup	Register	201
POST	/auth/login	Login	200
GET	/notes	List notes	200
GET	/notes/{id}	Get note	200
POST	/notes	Create note	201
PATCH	/notes/{id}	Update note	200
DELETE	/notes/{id}	Delete note	204
Create Note Request
{
  "text": "Study HTTP",
  "category": "study",
  "tags": ["exam"]
}