package ru.etu.mldemonstrationapp.mainservice.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import ru.etu.mldemonstrationapp.mainservice.dto.InferRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;
import ru.etu.mldemonstrationapp.mainservice.entity.Task;

import java.util.UUID;

public interface ModelInferenceService {

    /**
     * Run model inference asynchronous.
     *
     * @param inferRequest request contains model version identifier, input data and parameters
     * @param inputFile    input file for the model
     */
    void infer(InferRequest inferRequest, MultipartFile inputFile, UUID taskId);

    /**
     * Get response entity with inference result.
     * <p> Actual format and content type of the result depend on the model implementation and the inference task output.</p>
     * <p> Implementations of this method are responsible for interpreting the output of the inference task correctly,
     * and returning an appropriate HTTP response, including headers such as Content-Type and Content-Disposition.</p>
     *
     * @param task inference task associated with result
     * @return Response entity with unspecified data type
     */
    ResponseEntity<?> getInferenceResult(Task task);

    /**
     * @param modelVersion Version of the model to inference
     * @return true if ModelInferenceService implementation can handle inference request to model
     */
    boolean supports(ModelVersion modelVersion);
}
