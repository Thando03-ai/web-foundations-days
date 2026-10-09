-- Create Students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Create Courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL,
    course_code TEXT NOT NULL UNIQUE
);

-- Create Enrolments table
CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE(student_id, course_id)
);

-- Insert Students
INSERT INTO students (first_name, last_name, email)
VALUES
('Thando', 'Mahlangu', 'thando@example.com'),
('Sarah', 'Nkosi', 'sarah@example.com'),
('John', 'Mokoena', 'john@example.com');

-- Insert Courses
INSERT INTO courses (course_name, course_code)
VALUES
('Database Systems', 'DB101'),
('Web Development', 'WD102'),
('Python Programming', 'PY103');

-- Insert Enrolments
INSERT INTO enrolments (student_id, course_id, grade)
VALUES
(1, 1, 'A'),
(1, 2, 'B+'),
(2, 1, 'B'),
(2, 3, 'A'),
(3, 2, 'C+');

-- Query 1: All courses for one student (Thando)
SELECT s.first_name,
       s.last_name,
       c.course_name
FROM students s
JOIN enrolments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE s.first_name = 'Thando';

-- Query 2: All students on one course (Database Systems)
SELECT c.course_name,
       s.first_name,
       s.last_name
FROM courses c
JOIN enrolments e ON c.course_id = e.course_id
JOIN students s ON e.student_id = s.student_id
WHERE c.course_name = 'Database Systems';

-- Query 3: Number of students per course
SELECT c.course_name,
       COUNT(e.student_id) AS total_students
FROM courses c
LEFT JOIN enrolments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name;

-- Query 4: Students with no enrolments
SELECT s.student_id,
       s.first_name,
       s.last_name
FROM students s
LEFT JOIN enrolments e ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- Query 5: Update one enrolment grade
UPDATE enrolments
SET grade = 'A+'
WHERE enrolment_id = 1;