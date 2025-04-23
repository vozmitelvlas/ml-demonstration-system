package ru.etu.mldemonstrationapp.mainservice.clients;

import org.springframework.core.io.Resource;

import java.util.List;
import java.util.Map;

/**
 * REST client for interacting with the Orthanc REST API.
 *
 * @see <a href="https://orthanc.uclouvain.be/api/">Orthanc REST API documentation</a>
 * @see PacsModalitySender
 * @see PacsResourceUploader
 * @see PacsResourceFinder
 */
public interface OrthancRestClient extends PacsModalitySender, PacsResourceUploader, PacsResourceFinder {

    /**
     * Get Orthanc job details by its ID.
     *
     * <p>Relevant Orthanc REST API endpoint:</p>
     * <a href="https://orthanc.uclouvain.be/api/#tag/Jobs/paths/~1jobs~1{id}/get" target="_blank">
     * GET /jobs/{id}
     * </a> – Retrieve detailed information about the job
     *
     * @param jobId ID of orthanc job
     * @return Orthanc job details object
     * @see OrthancJob
     */
    OrthancJob getJob(String jobId);


    /**
     * Get Orthanc series details by its ID.
     * <p>Relevant Orthanc REST API endpoint:</p>
     * <a href="https://orthanc.uclouvain.be/api/#tag/Series/paths/~1series~1{id}/get" target="_blank">
     * GET /series/{id}
     * </a> – Get information about some series
     *
     * @param seriesId      Orthanc ID of the series resource
     * @param requestedTags list of hexadecimal DICOM tag identifiers to include in the response object
     * @return Orthanc series details object
     * @see OrthancSeries
     */
    OrthancSeries getSeries(String seriesId, List<String> requestedTags);


    /**
     * Delete Orthanc series by its ID.
     *
     * <p>Relevant Orthanc REST API endpoint:</p>
     * <a href="https://orthanc.uclouvain.be/api/#tag/Series/paths/~1series~1{id}/delete" target="_blank">
     * DELETE /series/{id}
     * </a> – Delete some series
     *
     * @param seriesId Orthanc ID of the series resource
     */
    void deleteSeries(String seriesId);


    /**
     * Retrieve a ZIP archive containing the DICOM series
     *
     * <p>Relevant Orthanc REST API endpoint:</p>
     * <a href="https://orthanc.uclouvain.be/api/#tag/Series/paths/~1series~1{id}~1archive/get">
     * GET /series/{id}/archive
     * </a> – Create ZIP archive
     *
     * @param seriesId Orthanc ID of the series
     * @return representing the ZIP file with DICOM instances
     */
    Resource getZip(String seriesId);



    record OrthancJob(Integer ErrorCode, String ErrorDescription, Integer Progress, String State) {
    }

    record OrthancSeries(String ID, String LastUpdate, Map<String, String> MainDicomTags, String ParentStudy,
                         Map<String, String> RequestedTags) {

    }


}
