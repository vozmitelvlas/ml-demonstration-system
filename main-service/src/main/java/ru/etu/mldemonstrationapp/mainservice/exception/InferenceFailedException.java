package ru.etu.mldemonstrationapp.mainservice.exception;


public class InferenceFailedException extends RuntimeException {
    public InferenceFailedException(Throwable cause) {
        super(cause);
    }

    public InferenceFailedException(String message, Throwable cause) {
        super(message, cause);
    }

}

