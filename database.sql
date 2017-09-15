DROP TABLE IF EXISTS news_tags; 
DROP TABLE IF EXISTS tags; 
DROP TABLE IF EXISTS news; 

CREATE TABLE news (
    id serial PRIMARY KEY, 
    title text NOT NULL, 
    url text NOT NULL, 
    votes integer NOT NULL DEFAULT 0 
); 

CREATE TABLE tags (
    id serial PRIMARY KEY, 
    tag text NOT NULL
); 

CREATE TABLE news_tags (
    news_id INTEGER NOT NULL REFERENCES news ON DELETE CASCADE, 
    tags_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
); 

INSERT INTO news (title, url, votes) VALUES
('Cat are cool', 'www.cats.com', 5),
('Cat are smelly', 'www.cats.com', 2),
('Cat are sweet', 'www.cats.com', 1),
('Cat are bad', 'www.cats.com', 0),
('Cat are loud', 'www.cats.com', 5); 

INSERT INTO tags (tag) VALUES 
('Shorthair'), 
('Bengal'), 
('Meowth'),
('Persion'),
('Ragdoll');

INSERT INTO news_tags (news_id, tags_id) VALUES 
(1,3), (2,4), (1,3), (2,5), (3,1), (4,1); 


