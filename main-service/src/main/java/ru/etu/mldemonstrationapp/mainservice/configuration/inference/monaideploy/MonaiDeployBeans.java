package ru.etu.mldemonstrationapp.mainservice.configuration.inference.monaideploy;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import ru.etu.mldemonstrationapp.mainservice.clients.OrthancRestClient;
import ru.etu.mldemonstrationapp.mainservice.clients.OrthancRestClientImpl;

@Configuration
@ConditionalOnProperty(prefix = "inference.monai-deploy.pacs", name = "url")
public class MonaiDeployBeans {

    @Bean
    public OrthancRestClient orthancRestClient(MonaiDeployProperties properties) {
        return new OrthancRestClientImpl(RestClient.create(properties.getPacs().getUrl()));
    }
}