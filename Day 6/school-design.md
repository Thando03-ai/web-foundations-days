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
