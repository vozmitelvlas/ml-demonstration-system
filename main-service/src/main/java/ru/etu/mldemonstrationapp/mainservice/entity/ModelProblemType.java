package ru.etu.mldemonstrationapp.mainservice.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@Getter
public enum ModelProblemType {
    MEDICAL_IMAGE_CLASSIFICATION("Классификация медицинских изображений"),
    MEDICAL_IMAGE_SEGMENTATION("Сегментация медицинских изображений"),
    IMAGE_CLASSIFICATION("Классификация изображений"),
    NLP("Обработка естественного языка");


    ModelProblemType(String value) {
        this.value = value;
    }

    private final String value;

    public String getName() {
        return name();
    }

}