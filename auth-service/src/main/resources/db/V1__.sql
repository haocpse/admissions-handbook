CREATE TABLE invalid_tokens
(
    id          VARCHAR(255) NOT NULL,
    expiry_time datetime     NOT NULL,
    CONSTRAINT pk_invalidtokens PRIMARY KEY (id)
);

CREATE TABLE users
(
    user_id    VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NULL,
    last_name  VARCHAR(255) NULL,
    phone      VARCHAR(255) NULL,
    username   VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NULL,
    `role`     VARCHAR(255) NOT NULL,
    active     BIT(1)       NOT NULL,
    created_at datetime     NOT NULL,
    updated_at datetime     NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (user_id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_username UNIQUE (username);