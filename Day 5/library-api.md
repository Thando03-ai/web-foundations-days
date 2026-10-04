# Library API Design
 
## Base URL
 
/api/books
 
---
 
## 1. List All Books
 
- Method: GET
- Path: /api/books
- Description: Returns all books.
- Success Status Code: 200 OK
 
---
 
## 2. Get One Book
 
- Method: GET
- Path: /api/books/{id}
- Description: Returns a single book by ID.
- Success Status Code: 200 OK
 
Example:
 
GET /api/books/1
 
---
 
## 3. Create a Book
 
- Method: POST
- Path: /api/books
- Description: Creates a new book.
- Success Status Code: 201 Created
 
Request Body:
 
```json
{
"title": "Clean Code",
"author": "Robert C. Martin",
"year": 2008
}
```
 
---
 
## 4. Update a Book
 
- Method: PUT
- Path: /api/books/{id}
- Description: Updates an existing book.
- Success Status Code: 200 OK
 
Request Body:
 
```json
{
"title": "Clean Code Updated",
"author": "Robert C. Martin",
"year": 2008
}
```
 
---
 
## 5. Delete a Book
 
- Method: DELETE
- Path: /api/books/{id}
- Description: Deletes a book.
- Success Status Code: 204 No Content
 
Example:
 
DELETE /api/books/1
 
---
 
## 6. List Books by Author
 
- Method: GET
- Path: /api/books?author=Robert%20C.%20Martin
- Description: Returns all books written by a specific author.
- Success Status Code: 200 OK
 
---
 
# Error Codes
 
## 400 Bad Request
 
Occurs when invalid data is sent.
 
Example:
 
```json
{
"title": ""
}
```
 
The title field is empty.
 
---
 
## 404 Not Found
 
Occurs when a requested book does not exist.
 
Example:
 
GET /api/books/999