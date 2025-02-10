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
        marginBottom: "10px"

    }),
    container: (provided) => ({
        ...provided,
        textAlign: "left",
        fontSize: "14px",
        color: "black",
        backgroundColor: "white",

    }),
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