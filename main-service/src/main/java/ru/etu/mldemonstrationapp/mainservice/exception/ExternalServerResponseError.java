package ru.etu.mldemonstrationapp.mainservice.exception;

public class ExternalServerResponseError extends RuntimeException {
    public ExternalServerResponseError(String message) {
        super(message);
    }
}
