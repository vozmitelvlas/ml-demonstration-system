package ru.etu.mldemonstrationapp.mainservice.dto;

import java.util.Map;

public class TritonInferenceRequest {
    private String modelName;
    private Map<String, Object> inputs;

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public Map<String, Object> getInputs() {
        return inputs;
    }

    public void setInputs(Map<String, Object> inputs) {
        this.inputs = inputs;
    }
}
