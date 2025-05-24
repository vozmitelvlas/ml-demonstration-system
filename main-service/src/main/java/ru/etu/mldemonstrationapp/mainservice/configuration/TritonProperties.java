package ru.etu.mldemonstrationapp.mainservice.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "triton")
@Data
public class TritonProperties {
    private String url;
    private List<String> knownModels;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<String> getKnownModels() {
        return knownModels;
    }

    public void setKnownModels(List<String> knownModels) {
        this.knownModels = knownModels;
    }
}