CREATE TABLE categories
(
    category_id   BIGINT   NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(255) NULL,
    create_at    datetime NOT NULL,
    CONSTRAINT pk_categories PRIMARY KEY (category_id)
);

CREATE TABLE comments
(
    comment_id        BIGINT       NOT NULL AUTO_INCREMENT,
    user_id           VARCHAR(255) NOT NULL,
    parent_comment_id BIGINT NULL,
    content           VARCHAR(255) NOT NULL,
    new_id            BIGINT       NOT NULL,
    create_at         datetime     NOT NULL,
    CONSTRAINT pk_comments PRIMARY KEY (comment_id)
);

CREATE TABLE news
(
    new_id      BIGINT       NOT NULL AUTO_INCREMENT,
    link        VARCHAR(255) NOT NULL,
    title       VARCHAR(255) NULL,
    thumbnail   VARCHAR(255) NULL,
    category_id BIGINT       NOT NULL,
    create_at  datetime     NOT NULL,
    CONSTRAINT pk_news PRIMARY KEY (new_id)
);

ALTER TABLE comments
    ADD CONSTRAINT FK_COMMENTS_ON_NEW FOREIGN KEY (new_id) REFERENCES news (new_id);

ALTER TABLE news
    ADD CONSTRAINT FK_NEWS_ON_CATEGORY FOREIGN KEY (category_id) REFERENCES categories (category_id);