package com.haocp.auth_service.exceptions;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {

    NOT_FOUND_USER(404, "Not found user", HttpStatus.NOT_FOUND),
    WRONG_PASSWORD(400, "Wrong password", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN(401, "Invalid or expired token", HttpStatus.UNAUTHORIZED),;

    int code;
    String message;
    HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
