DROP TABLE IF EXISTS jobs;
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255),
    title VARCHAR(255),
    location VARCHAR(255),
    company VARCHAR(255),
    description TEXT
)