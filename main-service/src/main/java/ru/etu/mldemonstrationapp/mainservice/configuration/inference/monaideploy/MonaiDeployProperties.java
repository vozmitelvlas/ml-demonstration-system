package ru.etu.mldemonstrationapp.mainservice.configuration.inference.monaideploy;

import lombok.Data;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


/**
 * MONAI Deploy configuration properties class
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "inference.monai-deploy")
@ConditionalOnProperty(prefix = "inference.monai-deploy.pacs", name = "url")
public class MonaiDeployProperties {
    /**
     * DICOM server configuration properties
     */
    private PacsProperties pacs;

    private MonaiWorkflowManagerProperties workflowManager;
    /**
     * MONAI Deploy Informatics Gateway Application Entity Title (default: MONAI-DEPLOY)
     */
    private String aeTitle = "MONAI-DEPLOY";

    /**
     * Time (in minutes) for storing the inference result on the server
     */
    private Integer resultStoringTimeMinutes = 3;
}
