package ru.etu.mldemonstrationapp.mainservice.clients;

import org.springframework.core.io.Resource;

public interface PacsResourceUploader {
    /**
     * Upload DICOM instances to the PACS
     *
     * @param file DICOM or ZIP file to upload
     * @return ID of the uploaded DICOM series
     */
    String uploadDicomInstance(Resource file);
}
