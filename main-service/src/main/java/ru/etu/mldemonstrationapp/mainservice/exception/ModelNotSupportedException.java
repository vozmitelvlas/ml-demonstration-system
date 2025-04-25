package ru.etu.mldemonstrationapp.mainservice.exception;

public class ModelNotSupportedException extends RuntimeException {
    public ModelNotSupportedException(String message) {
        super(message);
    }
}
