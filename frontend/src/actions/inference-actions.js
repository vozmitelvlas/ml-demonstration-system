import apiClient, { API_BASE_URL } from "../utils/apiClient";

export const performInferenceAction = (payload) => (dispatch) => {
    const { inferRequest, file } = payload;
    const formData = new FormData();
    formData.append(
        "parameters",
        new Blob([JSON.stringify(inferRequest)], { type: "application/json" })
    );
    if (file) {
        formData.append("file", file);
    }
    return fetch(`${API_BASE_URL}/api/inference`, {
        method: "POST",
        body: formData,
        credentials: 'include'
    }).then(async (response) => {
        if (!response.ok) {
            throw await response.json().catch(() => ({}))
        }
        return await response.json()
    })
}


export const getTaskStatus = (taskId) => {
    return apiClient(`/api/inference/tasks/${taskId}`).then(response => {
        if (response.status === "FAILED") {
            throw response
        }
        return response
    })
}


export const getTaskResult = (taskId) => {
    return fetch(`${API_BASE_URL}/api/inference/tasks/${taskId}/result`, {
        credentials: "include"
    }).then(async (response) => {
        if (!response.ok) {
            throw await response.json().catch(() => ({}))
        }
        const blob = await response.blob()
        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = `result_${taskId}`;
        if (contentDisposition) {
            filename = contentDisposition.split('filename=')[1].replaceAll('"', "")
        }
        return { blob, filename }
    })
} 