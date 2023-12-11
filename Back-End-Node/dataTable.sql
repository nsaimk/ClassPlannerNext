CREATE TABLE region (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE
);


CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE
    
);

CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    slack_photo_link VARCHAR(250),
    slack_firstname VARCHAR(250),
    slack_lastname VARCHAR(250),
    slack_email VARCHAR(250) UNIQUE,
    slack_title VARCHAR(250),
);

CREATE TABLE lesson_content (
    id SERIAL PRIMARY KEY,
    module VARCHAR(250),
    module_no INT,
    week_no INT,
    lesson_topic VARCHAR(250),
    syllabus_link VARCHAR(250)
);

CREATE TABLE session (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP,
    time_start TIMESTAMP,
    time_end TIMESTAMP,
    meeting_link VARCHAR(250),  
    lesson_content_id INT REFERENCES lesson_content(id),  
);

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    person_id INT REFERENCES person(id),
    session_id INT REFERENCES session(id),
    role_id INT REFERENCES role(id)
);

