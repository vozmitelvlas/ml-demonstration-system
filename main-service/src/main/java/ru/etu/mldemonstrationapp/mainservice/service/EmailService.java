package ru.etu.mldemonstrationapp.mainservice.service;

public interface EmailService {
    void sendMessage(String to, String subject, String text);
}
