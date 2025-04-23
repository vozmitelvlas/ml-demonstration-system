package ru.etu.mldemonstrationapp.mainservice.clients;

import java.util.List;
import java.util.Map;

public interface PacsResourceFinder {

    /**
     * Search DICOM resources where tags match the specified values
     *
     * @param level     a level of search, i.e. Study, Series, Instance
     * @param dicomTags a map of DICOM tags where the key is the tag identifier the
     *                  value is the corresponding tag value
     * @return a list of identifiers of the found DICOM resources
     */
    List<String> findResources(String level, Map<String, String> dicomTags);

}
