import React from 'react';

const Dropdown = props => {

    const dropdownChanged = e => {
        props.changed(e.target.value);

    }

    return (
        <div>
            <select className="selectValue"value={props.selectedValue} onChange={dropdownChanged}>
                <option key={0}>Select option</option>
                {props.options.map((item, idx) => <option key={idx + 1} value={item.id}>{item.name}</option>)}
            </select>
        </div>
    );
}

export default Dropdown;
