Endpoints
Method	Path	Description	SuccessPOST	/auth/register	Register user	201
POST	/auth/login	Login	200
GET	/notes	List notes	200
GET	/notes/{id}	Get note	200
POST	/notes	Create note	201
PUT	/notes/{id}	Update note	200
DELETE	/notes/{id}	Delete note	204
GET	/tags	List tags

Entities
users
Column	Typeid	INT
email	VARCHAR(255)
password_hash	VARCHAR(255)

PK: id

notes
Column	Typeid	INT
user_id	INT
title	VARCHAR(100)
body	TEXT

PK: id

FK: user_id → users.id

tags
Column	Typeid	INT
name	VARCHAR(50)
note_tags
Column	Typenote_id	INT
tag_id	INT

(note_id, tag_id)