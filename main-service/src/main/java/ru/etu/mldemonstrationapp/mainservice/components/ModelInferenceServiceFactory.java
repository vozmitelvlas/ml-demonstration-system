package ru.etu.mldemonstrationapp.mainservice.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;
import ru.etu.mldemonstrationapp.mainservice.exception.ModelNotSupportedException;
import ru.etu.mldemonstrationapp.mainservice.service.ModelInferenceService;

import java.util.ArrayList;
import java.util.List;

@Component
public class ModelInferenceServiceFactory {
    @Autowired(required = false)
    private List<ModelInferenceService> services = new ArrayList<>();

    public ModelInferenceService getInferenceService(ModelVersion modelVersion) {
        return this.services.stream()
                .filter(service -> service.supports(modelVersion))
                .findFirst()
                .orElseThrow(() -> new ModelNotSupportedException("Не найден inference сервер способный обработать запрос"));
    }

}
