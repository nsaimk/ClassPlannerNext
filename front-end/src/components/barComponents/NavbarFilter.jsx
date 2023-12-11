import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 78;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function MultipleSelectCheckmarks() {
    const [selectedCities, setSelectedCities] = useState([]);
    const [cityData, setCityData] = useState([]);

    useEffect(() => {
        // Simulate fetching data from the database
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cities`);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                setCityData(data);
            } catch (error) {
                console.error('Error fetching city data:', error.message);
            }
        };

        fetchData(); // Call the fetchData function

    }, []); // Empty dependency array ensures the effect runs once when the component mounts

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedCities(
            // On autofill, we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel style={{ color: 'white' }} id="demo-multiple-checkbox-label">
                    Country
                </InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedCities}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" sx={{ borderColor: 'white' }} />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {cityData.map((city) => (
                        <MenuItem key={city.id} value={city.name}>
                            <Checkbox checked={selectedCities.indexOf(city.name) > -1} />
                            <ListItemText primary={city.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}