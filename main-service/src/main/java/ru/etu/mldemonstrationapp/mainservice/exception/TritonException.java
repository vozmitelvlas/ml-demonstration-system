package ru.etu.mldemonstrationapp.mainservice.exception;

public class TritonException extends RuntimeException {
    public TritonException(String message) {
        super(message);
    }
}