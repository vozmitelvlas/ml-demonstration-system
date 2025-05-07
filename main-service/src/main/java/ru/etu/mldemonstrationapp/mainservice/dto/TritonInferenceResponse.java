package ru.etu.mldemonstrationapp.mainservice.dto;

import java.util.Map;

public class TritonInferenceResponse {
    private Map<String, Object> outputs;

    public Map<String, Object> getOutputs() {
        return outputs;
    }

    public void setOutputs(Map<String, Object> outputs) {
        this.outputs = outputs;
    }
}
