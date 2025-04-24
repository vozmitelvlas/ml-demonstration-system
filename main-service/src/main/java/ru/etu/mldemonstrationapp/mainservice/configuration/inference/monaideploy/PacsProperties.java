package ru.etu.mldemonstrationapp.mainservice.configuration.inference.monaideploy;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * DICOM server configuration properties
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "inference.monai-deploy.pacs")
public class PacsProperties {
    /**
     * URL of the PACS server.
     */
    private String url;

    /**
     * Type of the PACS server (default: orthanc).
     */
    private String type = "orthanc";

    /**
     * Timeout (in seconds) for storing DICOM images to PACS (default: 30).
     */
    private Integer storeTimeoutSeconds = 30;

    /**
     * Timeout (in seconds) for inference job completion (default: 500)
     */
    private Integer inferenceTaskTimeoutSeconds = 500;

}
