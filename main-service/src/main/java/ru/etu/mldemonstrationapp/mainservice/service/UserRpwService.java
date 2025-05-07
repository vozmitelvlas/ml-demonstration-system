package ru.etu.mldemonstrationapp.mainservice.service;

import jakarta.transaction.Transactional;
import ru.etu.mldemonstrationapp.mainservice.entity.Model;
import ru.etu.mldemonstrationapp.mainservice.entity.Organization;
import ru.etu.mldemonstrationapp.mainservice.entity.User;

import java.util.List;

public interface UserRpwService {

    @Transactional
    void createAndSaveRpwForOrgMembers(Organization organization, Model model);

    @Transactional
    void createAndSaveModelsRpwForUser(User user, List<Model> models);

    @Transactional
    void deleteAllUserRpw(User user);

    @Transactional
    void deleteAllOrganizationMembersRpwForModel(Organization organization, Model model);
}
