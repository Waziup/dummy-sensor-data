import React, { useState } from 'react';

import { Button, Container, FormControl, FormGroup, FormLabel, makeStyles, TextField } from '@material-ui/core';


import './Main.css';

import deviceNames from "../../data/deviceNames/names.json";
import ontologies from "../../data/ontologies/ontologies.json";

/*---------------------*/

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '90%',
      display: 'flex'
    },
  },
  button: {
    width: '6rem',
    margin: theme.spacing(1),
  },
  box: {
    border: 'solid 1px #CCC',
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    textAlign: "left",
  },
  fieldset: {
    justifyContent: "center",
    padding: "1rem"
  },
  numInput: {
    width: '5rem',
    marginLeft: '.5rem'
  },
}));

/*---------------------*/

type formValuesType = {
  numDevices: number;
  minSensors: number;
  maxSensors: number;
  minValues: number;
  maxValues: number;
  minEntries: number;
  maxEntries: number;
};

/*---------------------*/

export default function Main() {
  const classes = useStyles();

  const [formValues, setFormValues] = useState({
    numDevices: 10,
    minSensors: 1,
    maxSensors: 5,
    minValues: -1000,
    maxValues: 1000,
    minEntries: 5,
    maxEntries: 10,
  } as formValuesType);

  /**------------- */

  const getRandomSensor = () => {

    const sensingDevicesKeys = Object.keys(ontologies.sensingDevices);
    const randomKindId = Math.floor(Math.random() * sensingDevicesKeys.length);

    const randomKind = sensingDevicesKeys[randomKindId];
    const randomSensor = ontologies.sensingDevices[sensingDevicesKeys[randomKindId]];

    const randomQuantity = randomSensor.quantities.length ? randomSensor.quantities[Math.floor(Math.random() * randomSensor.quantities.length)] : "";
    const randomUnitId = randomQuantity ? Math.floor(Math.random() * ontologies.quantities[randomQuantity].units.length) : null;
    const randomUnit = randomUnitId !== null ? ontologies.quantities[randomQuantity].units[randomUnitId] : "";

    return {
      "kind": randomKind,
      "quantity": randomQuantity,
      "unit": randomUnit,
    }
  }

  /**------------- */

  const getRandomDevice = () => {
    const randomDeviceId = Math.floor(Math.random() * deviceNames.length);
    return deviceNames[randomDeviceId];
  }

  /**------------- */

  const getRandomValue = (min: number, max: number) => {
    return Math.round(Math.random() * (max - min) + min);
  }

  /**------------- */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted");
  }


  /**------------- */

  const startDataGenerator = () => {


    console.log(formValues);

  }

  /**------------- */

  const stopDataGenerator = () => {

  }

  /**------------- */


  return (
    <div className="Main">
      <Container maxWidth="md">
        <form className={classes.root} noValidate autoComplete="on" onSubmit={e => e.preventDefault()}>
          <TextField
            id="numDevices"
            label="Number of devices"
            value={formValues.numDevices}
            type="number"
            onChange={(e) => setFormValues({ ...formValues, numDevices: Number(e.target.value) })}
          />

          <FormControl className={classes.box}>
            <FormLabel>Num of Sensors:</FormLabel>
            <FormGroup row className={classes.fieldset}>
              <TextField id="minSensors" className={classes.numInput} label="Min" value={formValues.minSensors} type="number" onChange={(e) => setFormValues({ ...formValues, minSensors: Number(e.target.value) })} />
              <TextField id="maxSensors" className={classes.numInput} label="Max" value={formValues.maxSensors} type="number" onChange={(e) => setFormValues({ ...formValues, maxSensors: Number(e.target.value) })} />
            </FormGroup>
          </FormControl>

          <FormControl className={classes.box}>
            <FormLabel>Values Range:</FormLabel>
            <FormGroup row className={classes.fieldset}>
              <TextField id="minValues" className={classes.numInput} label="Min" value={formValues.minValues} type="number" onChange={(e) => setFormValues({ ...formValues, minValues: Number(e.target.value) })} />
              <TextField id="maxValues" className={classes.numInput} label="Max" value={formValues.maxValues} type="number" onChange={(e) => setFormValues({ ...formValues, maxValues: Number(e.target.value) })} />
            </FormGroup>
          </FormControl>

          <FormControl className={classes.box}>
            <FormLabel>Num of value entries for each device:</FormLabel>
            <FormGroup row className={classes.fieldset}>
              <TextField id="minEntries" className={classes.numInput} label="Min" value={formValues.minEntries} type="number" onChange={(e) => setFormValues({ ...formValues, minEntries: Number(e.target.value) })} />
              <TextField id="maxEntries" className={classes.numInput} label="Max" value={formValues.maxEntries} type="number" onChange={(e) => setFormValues({ ...formValues, maxEntries: Number(e.target.value) })} />
            </FormGroup>
          </FormControl>

          <FormGroup row style={{ justifyContent: "center" }}>
            <Button variant="contained" className={classes.button} onClick={startDataGenerator} type="submit" color="primary">Start</Button>
            <Button variant="contained" className={classes.button} onClick={stopDataGenerator} color="secondary">Stop</Button>
          </FormGroup>
        </form>
      </Container>
    </div >
  );
}