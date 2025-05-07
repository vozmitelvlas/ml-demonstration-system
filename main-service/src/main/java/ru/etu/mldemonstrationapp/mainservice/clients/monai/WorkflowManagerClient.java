package ru.etu.mldemonstrationapp.mainservice.clients.monai;

import java.util.Map;

public interface WorkflowManagerClient {
    WorkflowRegisterResponse registerWorkflow(Map<String, Object> workflowConfig);

    void deleteWorkflow(String workflowId);

    record WorkflowRegisterResponse(String workflow_id) {

    }
}
