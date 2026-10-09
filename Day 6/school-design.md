School Database Design
Tables
Students
The students table stores information about each student. Each student has a unique student_id, first name, last name, and email address. The email field is unique to prevent duplicate student records.

Courses
The courses table stores details about available courses. Each course has a unique course_id, course name, and course code.

Enrolments
The enrolments table records which students are registered for which courses and stores their grades. It connects the students and courses tables through foreign keys.

Relationships
One-to-Many Relationships
One student can have many enrolments.
One course can have many enrolments.
Many-to-Many Relationship
Students and courses have a many-to-many relationship because:

One student can enrol in many courses.
One course can have many students.
A join table (enrolments) is required because relational databases cannot directly store many-to-many relationships.

Recommended Index
I would add an index on the course_id column in the enrolments table:

CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);

This index improves query performance because the database can quickly locate enrolment records for a specific course without scanning the entire table.

SQL vs NoSQL

For this school enrolment system, I would choose SQL rather than NoSQL. The data is highly structured and contains clear relationships between students, courses, and enrolments. A relational database allows the use of primary keys, foreign keys, unique constraints, and transactions to maintain data integrity and consistency. This is important because student records, course information, and grades must remain accurate and linked correctly. NoSQL databases are better suited to unstructured or rapidly changing data, but a school management system benefits more from the reliability, consistency, and relational features provided by SQL.
