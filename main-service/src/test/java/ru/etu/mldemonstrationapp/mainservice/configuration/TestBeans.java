package ru.etu.mldemonstrationapp.mainservice.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.*;

@Configuration
public class TestBeans {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSender javaMailSender = mock(JavaMailSender.class);
        doNothing().when(javaMailSender).send(any(SimpleMailMessage.class));
        return javaMailSender;
    }
}
