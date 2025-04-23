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
     * URL of the DICOM server.
     */
    private String url;

    /**
     * DICOM server in use.
     */
    private String type = "orthanc";

}
