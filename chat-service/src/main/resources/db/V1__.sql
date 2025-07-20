CREATE TABLE community_chats
(
    community_chat_id        BIGINT   NOT NULL AUTO_INCREMENT,
    user_id                  VARCHAR(255) NULL,
    content                  VARCHAR(255) NULL,
    is_pin                   BIT(1)   NOT NULL,
    parent_community_chat_id BIGINT NULL,
    create_at                datetime NOT NULL,
    CONSTRAINT pk_community_chats PRIMARY KEY (community_chat_id)
);