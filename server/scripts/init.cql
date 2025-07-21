CREATE KEYSPACE IF NOT EXISTS my_keyspace
    WITH REPLICATION = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
        };

USE my_keyspace;

CREATE TABLE IF NOT EXISTS products
(
    internal_id       UUID PRIMARY KEY,
    seq               INT,
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
    short_description TEXT,
    image             TEXT
);
