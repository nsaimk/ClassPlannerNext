import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import axios from '../../utils/axios';
import { useAuthContext } from "../../auth/useAutContext";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuthContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading to true when starting the fetch

                const response = await axios.get("/cities");

                if (response.statusText !== "OK") {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const dataCity = response.data;
                setCityData(dataCity);
                setError(null);
            } catch (error) {
                console.error("Error fetching city data:", error);
                setError("Error fetching city data. Please try again later.");
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedCities(
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
                    {loading && <MenuItem disabled>Loading...</MenuItem>}
                    {error && <MenuItem disabled>Error: {error}</MenuItem>}
                    {!loading &&
                        cityData.map((city) => (
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
