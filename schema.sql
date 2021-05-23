DROP TABLE IF EXISTS jobs;
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(255),
    loaction VARCHAR(255),
    description TEXT
)