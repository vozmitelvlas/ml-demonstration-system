package ru.etu.mldemonstrationapp.mainservice.clients;

import java.util.List;

public interface PacsModalitySender {
    /**
     * Send DICOM instances for processing to the another server
     *
     * @param modalityName name (AE Title) of the target remote DICOM modality
     * @param resources    list of sending resources IDs
     * @return ID for tracking the processing task
     */
    String sendInstanceToModality(String modalityName, List<String> resources);
}
