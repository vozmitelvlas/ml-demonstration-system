package ru.etu.mldemonstrationapp.mainservice.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum ModelRuntime {
    TRITON_INFERENCE_SERVER("Triton Inference Server"),
    MONAI_DEPLOY("MONAI Deploy");

    ModelRuntime(String value) {
        this.value = value;
    }

    private final String value;

    public String getName() {
        return name();
    }

}
