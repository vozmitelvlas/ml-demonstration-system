package ru.etu.mldemonstrationapp.mainservice.configuration.inference.monaideploy;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import ru.etu.mldemonstrationapp.mainservice.clients.OrthancRestClient;
import ru.etu.mldemonstrationapp.mainservice.clients.OrthancRestClientImpl;

@Configuration
@ConditionalOnBean(MonaiDeployProperties.class)
public class MonaiDeployBeans {

    @Bean
    public OrthancRestClient orthancRestClient(MonaiDeployProperties properties) {
        return new OrthancRestClientImpl(RestClient.create(properties.getPacs().getUrl()));
    }
}