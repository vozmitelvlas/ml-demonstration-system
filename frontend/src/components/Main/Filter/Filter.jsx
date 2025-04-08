import styles from "./Filter.module.css"
import {useMemo, useState} from "react";
import arrowLogo from "../../../assets/arrow-down.svg"
import Button from "../Buttons/Button.jsx";
import closeLogo from "../../../assets/delete.svg";

export default function Filter({setIsOpen, selects = {}, sorts = {}}) {

    const [isVisible, setIsVisible] = useState({});
    const [filterValues, setFilterValues] = useState(useMemo(() => {
        const initialFilterValues = {};

        for (let filter in selects) {
            selects[filter].names.forEach(name => {
                initialFilterValues[name] = false;
            });
        }

        return initialFilterValues;
    }, []));
    const [selectedRadio, setSelectedRadio] = useState("");

    const handleClick = (name, event) => {
        const newIsVisible = {...isVisible};
        newIsVisible[name] = !newIsVisible[name];
        setIsVisible(newIsVisible);
        const svgIcon = event.target.matches('img') ? event.target : event.target.querySelector('img');
        svgIcon.classList.toggle(styles.rotated);

    };
    const handleRadioChange = (name) => {
        console.log(name)
        setSelectedRadio(name);
    };

    const handleOptions =  (event) => {
        console.log({
            ...filterValues,
            [event.target.name]: event.target.checked
        })

        setFilterValues({
            ...filterValues,
            [event.target.name]: event.target.checked
        })
    }

    return (
        <div className={styles.filter}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h2>Фильтры </h2>
                    <a className="a-img"><img src={closeLogo} alt={"close"} onClick={() => setIsOpen(false)}/></a>
                </div>
                <hr className={styles.line}/>
            </div>

            <div className={styles.container}>
                <div>
                    {Object.entries(selects).map(([name, { options, names }]) => (
                        <div key={name} className={styles.item}>
                            <button className="text-class" onClick={() => handleClick(name, event)}>
                                {name}
                                <img src={arrowLogo} alt={"ArrowLogo"}/>
                            </button>
                            {isVisible[name] && (
                                <div className={`${styles.block} ${isVisible[name] ? styles.visible : ''}`}>
                                    {options.map((option, i) => (
                                        <div key={`${name}-${i}`} className={styles.option}>
                                            <input
                                                type="checkbox"
                                                name={names[i]}
                                                checked={filterValues[names[i]]}
                                                onChange={handleOptions}
                                            />
                                            <p>{option}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {Object.entries(sorts)?.map(([name, { options, names }]) => (
                        <div key={name} className={styles.item}>
                            <button className="text-class" onClick={() => handleClick(name, event)}>
                                {name}
                                <img src={arrowLogo} alt={"ArrowLogo"} />
                            </button>
                            {isVisible[name] && (
                                <div className={`${styles.block} ${isVisible[name] ? styles.visible : ''}`}>
                                    {options.map((option, i) => (
                                        <div key={`${name}-${i}`} className={styles.option}>
                                            <input
                                                type="radio"
                                                name={"radio"}
                                                value={names[i]}
                                                checked={names[i] === selectedRadio}
                                                onChange={(e) => handleRadioChange(e.target.value)}
                                            />
                                            <p>{option}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>


                <div className={styles.buttons}>
                    <Button>Сбросить</Button>
                    <Button>Применить</Button>
                </div>
            </div>

        </div>
    );
};