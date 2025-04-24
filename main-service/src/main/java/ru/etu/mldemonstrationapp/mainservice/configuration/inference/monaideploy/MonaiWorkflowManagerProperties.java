package ru.etu.mldemonstrationapp.mainservice.configuration.inference.monaideploy;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * MONAI Deploy workflow manager configuration properties
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "inference.monai-deploy.workflow-manager")
public class MonaiWorkflowManagerProperties {
    /**
     * URL of the Workflow Manager server
     */
    private String url;
}
