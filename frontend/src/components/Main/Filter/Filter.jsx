import "./Filter.css"
import {useEffect, useMemo, useState} from "react";
import arrowLogo from "../../../assets/arrow-down.svg"
import Button from "../../Button.jsx";
import closeLogo from "../../../assets/delete.svg";

const Filter = ({setIsOpen, selects = {}, sorts = {}}) => {

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
        svgIcon.classList.toggle('rotated');

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
        <div className="filter">
            <div className="filter-header">
                <div className="head">
                    <h2>Фильтры </h2>
                    <a className="a-img"><img src={closeLogo} alt={"close"} onClick={() => setIsOpen(false)}/></a>
                </div>
                <hr className="line"/>
            </div>

            <div className="filter-container">
                <div>
                    {Object.entries(selects).map(([name, { options, names }]) => (
                        <div key={name} className="item">
                            <button className="text-class" onClick={() => handleClick(name, event)}>
                                {name}
                                <img src={arrowLogo} alt={"ArrowLogo"}/>
                            </button>
                            {isVisible[name] && (
                                <div className={`block ${isVisible[name] ? 'visible' : ''}`}>
                                    {options.map((option, i) => (
                                        <div key={`${name}-${i}`} className="option">
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
                        <div key={name} className="item">
                            <button className="text-class" onClick={() => handleClick(name, event)}>
                                {name}
                                <img src={arrowLogo} alt={"ArrowLogo"} />
                            </button>
                            {isVisible[name] && (
                                <div className={`block ${isVisible[name] ? 'visible' : ''}`}>
                                    {options.map((option, i) => (
                                        <div key={`${name}-${i}`} className="option">
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


                <div className="filter__buttons">
                    <Button classNames="filter-button">Сбросить</Button>
                    <Button classNames="filter-button">Применить</Button>
                </div>
            </div>

        </div>
    );
};

export default Filter;