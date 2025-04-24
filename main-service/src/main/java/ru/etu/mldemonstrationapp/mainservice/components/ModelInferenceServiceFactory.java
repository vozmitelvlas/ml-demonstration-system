package ru.etu.mldemonstrationapp.mainservice.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Не найден inference сервер способный обработать запрос"));
    }

}
