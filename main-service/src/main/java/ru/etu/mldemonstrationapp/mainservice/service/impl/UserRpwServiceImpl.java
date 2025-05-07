package ru.etu.mldemonstrationapp.mainservice.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.etu.mldemonstrationapp.mainservice.entity.Model;
import ru.etu.mldemonstrationapp.mainservice.entity.Organization;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.entity.UserRpw;
import ru.etu.mldemonstrationapp.mainservice.repository.UserRpwRepository;
import ru.etu.mldemonstrationapp.mainservice.service.UserRpwService;

import java.util.List;

@Service
public class UserRpwServiceImpl implements UserRpwService {
    @Autowired
    private UserRpwRepository userRpwRepository;

    @Scheduled(cron = "0 0 0 ? * SUN") // Every Sunday at midnight
    @Transactional
    public void resetCurrentRequestsWeekly() {
        userRpwRepository.updateCurrentRequestsToZero();
    }

    @Transactional
    @Override
    public void createAndSaveRpwForOrgMembers(Organization organization, Model model) {
        List<UserRpw> newUserRpws = organization.getMembers().stream()
                .map(user -> {
                    UserRpw userRpw = new UserRpw();
                    userRpw.setUser(user);
                    userRpw.setModel(model);
                    userRpw.setCurrentRequests(0);
                    return userRpw;
                })
                .toList();

        userRpwRepository.saveAll(newUserRpws);
    }

    @Transactional
    @Override
    public void createAndSaveModelsRpwForUser(User user, List<Model> models) {
        List<UserRpw> newUserRpws = models.stream()
                .map(model -> {
                    UserRpw userRpw = new UserRpw();
                    userRpw.setUser(user);
                    userRpw.setModel(model);
                    userRpw.setCurrentRequests(0);
                    return userRpw;
                })
                .toList();

        userRpwRepository.saveAll(newUserRpws);
    }

    @Transactional
    @Override
    public void deleteAllUserRpw(User user) {
        userRpwRepository.deleteAllByUser(user);
    }

    @Transactional
    @Override
    public void deleteAllOrganizationMembersRpwForModel(Organization organization, Model model) {
        List<UserRpw> userRpwToDelete = userRpwRepository.findAllByOrganizationAndModel(organization.getOrganizationId(), model.getModelId());
        userRpwRepository.deleteAllInBatch(userRpwToDelete);
    }

}
