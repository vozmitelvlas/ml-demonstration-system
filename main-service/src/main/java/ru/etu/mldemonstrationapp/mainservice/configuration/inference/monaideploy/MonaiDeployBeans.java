package ru.etu.mldemonstrationapp.mainservice.configuration.inference.monaideploy;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import ru.etu.mldemonstrationapp.mainservice.clients.monai.WorkflowManagerClient;
import ru.etu.mldemonstrationapp.mainservice.clients.monai.WorkflowManagerClientImpl;
import ru.etu.mldemonstrationapp.mainservice.clients.orthanc.OrthancRestClient;
import ru.etu.mldemonstrationapp.mainservice.clients.orthanc.OrthancRestClientImpl;

@Configuration
@ConditionalOnBean(MonaiDeployProperties.class)
public class MonaiDeployBeans {

    @Bean
    public OrthancRestClient orthancRestClient(MonaiDeployProperties properties) {
        return new OrthancRestClientImpl(RestClient.create(properties.getPacs().getUrl()));
    }

    @Bean
    public WorkflowManagerClient workflowManagerClient(MonaiDeployProperties properties) {
        return new WorkflowManagerClientImpl(RestClient.create(properties.getWorkflowManager().getUrl()));
    }
}