package ru.etu.mldemonstrationapp.mainservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ExternalServerClientError extends RuntimeException {
    private final HttpStatus statusCode;

    public ExternalServerClientError(String message) {
        super(message);
        this.statusCode = HttpStatus.BAD_REQUEST;
    }

    public ExternalServerClientError(HttpStatus statusCode, String message) {
        super(message);
        this.statusCode = statusCode;
    }
}
