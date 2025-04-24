package ru.etu.mldemonstrationapp.mainservice.exception;

public class ExternalServerInternalException extends ExternalServerException {
    public ExternalServerInternalException(String message) {
        super(message);
    }

    public ExternalServerInternalException(String message, Throwable cause) {
        super(message, cause);
    }
}
