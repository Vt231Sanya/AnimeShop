import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

const PriceFilter = ({ min, max, onChange }) => {
    const [values, setValues] = useState([min, max]);

    const STEP = 1;
    const MIN = min;
    const MAX = max;

    const handleChange = (values) => {
        setValues(values);
        onChange && onChange(values);
    };

    return (
        <div style={{ margin: '2em', width: 300 }}>
            <h3>Фільтр по ціні</h3>

            <Range
                step={STEP}
                min={MIN}
                max={MAX}
                values={values}
                onChange={handleChange}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '6px',
                            width: '100%',
                            background: getTrackBackground({
                                values,
                                colors: ['#ccc', '#548BF4', '#ccc'],
                                min: MIN,
                                max: MAX,
                            }),
                            borderRadius: '3px',
                        }}
                    >
                        {children}
                    </div>
                )}
                renderThumb={({ props, index }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '24px',
                            width: '24px',
                            backgroundColor: '#548BF4',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 2px 6px #AAA',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-28px',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                                padding: '4px',
                                borderRadius: '4px',
                                backgroundColor: '#548BF4',
                            }}
                        >
                            {values[index]} грн
                        </div>
                    </div>
                )}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1em' }}>
                <span>Мін: {values[0]} грн</span>
                <span>Макс: {values[1]} грн</span>
            </div>
        </div>
    );
};

export default PriceFilter;
