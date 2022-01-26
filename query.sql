'cmd' : sudo -u postgres psql

\l : List of databases

\c smartbraindb : connect to smartbraindb database.

create table users (
   id serial PRIMARY KEY,
   name VARCHAR(100),
   email text UNIQUE NOT NULL,
   entries BIGINT DEFAULT 0,
   joined TIMESTAMP NOT NULL 
);

CREATE TABLE login (
   id serial PRIMARY KEY,
   hash VARCHAR(100) NOT NULL,
   email text UNIQUE NOT NULL
);


