import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    codec: {
        [theme.breakpoints.up('sm')]: {
            width: "400px",
        },
        width: "calc(100% - 18px)",
        verticalAlign: "top",
        margin: "auto",
    },
}));

/**-------------------- */

type Props = {
    onChange: (codec: string) => void;
};


/**-------------------- */

const Codecs = ({ onChange }: Props) => {
    const classes = useStyles();

    /*------------ */

    // Run stuff on load
    useEffect(
        () => {
            loadCodecsList();
        },
        [] /* This makes it to run only once*/
    );

    /*------------ */

    const [codecsList, setCodecsList] = useState(null);
    const loadCodecsList = async () => {
        fetch(`/codecs`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(resp => {
            resp.json().then(data => {
                setCodecsList(data);
            }, (err: Error) => {
                console.error("There was an error decoding codecs:\n" + err)
            });
        }, (err: Error) => {
            console.error("There was an error loading codecs:\n" + err)
        });
    }

    /*------------ */

    const [selectedCodec, setSelectedCodec] = useState(null);
    React.useEffect(() => {
        if (onChange) {
            onChange(selectedCodec)
        }
    }, [selectedCodec])

    /*------------ */

    if (!codecsList) {
        return (<div>Loading codecs...</div>)
    }

    return (
        <FormControl>
            <InputLabel id="codec-select-lebel">Devices Codec</InputLabel>
            <Select
                labelId="codec-select-lebel"
                id="codec-select"


                onChange={(event: any) => { setSelectedCodec(event.target.value); }}
            >
                {codecsList.map((codec: any) => (
                    <MenuItem value={codec.id}>{codec.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default Codecs;
