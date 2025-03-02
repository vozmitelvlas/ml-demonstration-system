export const customStyle = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "white" : 'var(--light-accent-color)',
        '&:hover': {
            backgroundColor: "white",
        },
        border: "1px solid var(--accent-color)",
        color: "var(--accent-color)",
        marginTop: "10px",
        marginBottom: "10px",

    }),
    container: (provided) => ({
        ...provided,
        textAlign: "left",
        fontSize: "14px",
        color: "black",
        backgroundColor: "white",

    }),
    valueContainer: (provided, state) => ({
        ...provided,
        maxWidth: "300px",
    }),
    // multiValue: (provided, state) => ({
    //     ...provided,
    //     maxWidth: "200px",
    // }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "var(--accent-color)" : "white",
        color: state.isFocused ? "white" : "black"
    })
}
export const firstStyle = (prevStyles) => ({
    ...prevStyles,
    control: (provided) => ({
        ...provided,
        backgroundColor: 'white',
        border: "1px solid var(--accent-color)",
        color: "var(--accent-color)",
        marginTop: "10px",
        marginBottom: "10px"
    }),
})
export const secondStyle = (prevStyles) => ({
    ...prevStyles,
    control: (provided) => ({
        ...provided,
        backgroundColor: 'var(--light-accent-color)',
        border: "1px solid var(--accent-color)",
        color: "var(--accent-color)",
        marginTop: "10px",
        marginBottom: "10px"
    }),
})

export const setFirstMultiBackColor = (event, setOrgSelectStyle, setRolesSelectStyle) => {
    if (!event || !event.target) return;

    const targetRow = event.target.closest("tr");
    if (!targetRow || !targetRow.dataset.name) return;

    const datasetName = targetRow.dataset.name;
    if (datasetName === "roles") {
        setRolesSelectStyle((prev) => firstStyle(prev));
    } else if (datasetName === "orgs") {
        setOrgSelectStyle((prev) => firstStyle(prev));
    }
}
export const setSecondMultiBackColor = (event, setOrgSelectStyle, setRolesSelectStyle) => {
    if (!event || !event.target) return;

    const targetRow = event.target.closest("tr");
    if (!targetRow || !targetRow.dataset.name) return;

    const datasetName = targetRow.dataset.name;
    if (datasetName === "roles") {
        setRolesSelectStyle((prev) => secondStyle(prev));
    } else if (datasetName === "orgs") {
        setOrgSelectStyle((prev) => secondStyle(prev));
    }
}