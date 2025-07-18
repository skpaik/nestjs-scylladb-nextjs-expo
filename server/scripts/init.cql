CREATE KEYSPACE IF NOT EXISTS my_keyspace
    WITH REPLICATION = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
        };

USE my_keyspace;

CREATE TABLE IF NOT EXISTS products (
                                        id UUID PRIMARY KEY,
                                        name text,
                                        description text,
                                        brand text,
                                        category text,
                                        price double,
                                        currency text,
                                        stock int,
                                        ean bigint,
                                        color text,
                                        size text,
                                        availability text,
                                        shortdescription text,
                                        image text
);
