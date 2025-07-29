CREATE KEYSPACE IF NOT EXISTS my_keyspace
    WITH REPLICATION = {
        'class': 'SimpleStrategy',
        'replication_factor': 3
        };

USE my_keyspace;

CREATE TABLE IF NOT EXISTS products
(
    id       UUID PRIMARY KEY,
    seq               INT,
    createdAt         DATE,
    name              TEXT,
    description       TEXT,
    brand             TEXT,
    category          TEXT,
    price             DOUBLE,
    currency          TEXT,
    stock             INT,
    ean               BIGINT,
    color             TEXT,
    size              TEXT,
    availability      TEXT,
    shortDescription TEXT,
    image             TEXT
);
