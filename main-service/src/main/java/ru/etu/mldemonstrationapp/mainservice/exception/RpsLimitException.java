package ru.etu.mldemonstrationapp.mainservice.exception;

public class RpsLimitException extends RuntimeException{
    public RpsLimitException(String message) {
        super(message);
    }
}
