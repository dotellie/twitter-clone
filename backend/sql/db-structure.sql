CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL UNIQUE PRIMARY KEY,
    handle VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS tweets (
    tweet_id SERIAL UNIQUE PRIMARY KEY,
    user_id SERIAL REFERENCES users ON DELETE CASCADE,
    tweet_contents TEXT
);

CREATE TABLE IF NOT EXISTS likes (
    tweet_id SERIAL REFERENCES tweets ON DELETE CASCADE,
    user_id SERIAL REFERENCES users ON DELETE CASCADE,

    CONSTRAINT like_id PRIMARY KEY (tweet_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_follows (
    user_id SERIAL REFERENCES users ON DELETE CASCADE,
    following_id SERIAL REFERENCES users ON DELETE CASCADE,

    CONSTRAINT follow_id PRIMARY KEY (user_id, following_id)
);
