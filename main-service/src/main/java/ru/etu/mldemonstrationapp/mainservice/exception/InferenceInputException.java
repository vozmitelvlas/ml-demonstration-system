package ru.etu.mldemonstrationapp.mainservice.exception;

public class InferenceInputException extends RuntimeException {

    public InferenceInputException(String message) {
        super(message);
    }

    public InferenceInputException(String message, Throwable cause) {
        super(message, cause);
    }
}
