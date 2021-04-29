import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';

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
    onChange?: (codec: string) => void;
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

        // const server = window.location.protocol + "//" + window.location.hostname;

        let resp = await fetch(`/codecs`, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        });
        const contentType = resp.headers.get("Content-Type");
        const isJson = contentType?.startsWith("application/json");
        if (resp.ok) {
            var data = await resp.json();
            setCodecsList(data);
        } else {
            var text = await resp.text();
            throw `HTTP Error ${resp.status} ${resp.statusText}\n${data}`;
        }
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
