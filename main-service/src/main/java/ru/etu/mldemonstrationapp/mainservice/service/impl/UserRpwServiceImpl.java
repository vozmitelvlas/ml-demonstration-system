package ru.etu.mldemonstrationapp.mainservice.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.etu.mldemonstrationapp.mainservice.repository.UserRpwRepository;

@Service
public class UserRpwServiceImpl {
    @Autowired
    private UserRpwRepository userRpwRepository;

    @Scheduled(cron = "0 0 0 ? * SUN") // Every Sunday at midnight
    @Transactional
    public void resetCurrentRequestsWeekly() {
        userRpwRepository.updateCurrentRequestsToZero();
    }
}
