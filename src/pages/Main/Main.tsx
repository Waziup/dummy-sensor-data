import React, { useEffect, useState } from 'react';

import { Button, Container, FormControl, FormGroup, FormLabel, makeStyles, TextField } from '@material-ui/core';

import Codecs from "../../components/Codecs"
import LinearProgressWithLabel from "../../components/LinearProgressWithLabel"

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
  minTime: number;
  maxTime: number;
};


type SensorMetaType = {
  "kind"?: string;
  "quantity"?: string;
  "unit"?: string;
};

type SensorType = {
  "name": string;
  "meta"?: SensorMetaType;
};

type DeviceMetaType = {
  "codec"?: string;
};

type DeviceType = {
  "name": string;
  "sensors"?: SensorType[];
  "meta"?: DeviceMetaType;
}

/*---------------------*/

export default function Main() {
  const classes = useStyles();

  const [formValues, setFormValues] = useState({
    numDevices: 1,
    minSensors: 1,
    maxSensors: 5,
    minValues: -10,
    maxValues: 100,
    minEntries: 5,
    maxEntries: 10,
    minTime: 10,
    maxTime: 30,
  } as formValuesType);

  const [selectedCodec, setSelectedCodec] = useState(null);
  const [progress, setProgress] = useState(0);

  const startDataGenerator = async () => {

    // var mu = [0, 0],
    //   sigma = [0.25, 0.5],
    //   correlation = [[1.0, 0.5], [0.5, 1.0]];

    // var data = generateCorrLognorm(100, mu, sigma, correlation);

    // return;

    for (let d = 0; d < formValues.numDevices; d++) {
      setProgress(Math.round(100 * d / formValues.numDevices));

      const deviceName = getRandomDeviceName();
      const numOfSensors = getRandomValue(formValues.minSensors, formValues.maxSensors);

      let deviceObj: DeviceType = {
        name: deviceName,
        sensors: [],
        meta: {
          codec: selectedCodec
        }
      };

      for (let s = 0; s < numOfSensors; s++) {
        deviceObj?.sensors?.push(getRandomSensor());
      }

      // Pushing devices data

      let deviceID = 0;
      try {
        deviceID = await postAPI('/devices', deviceObj);
        if (!deviceID) continue;
      } catch (e) {
        console.error(e);
        continue;
      }

      //Preparing the time delays

      const numOfEntries = getRandomValue(formValues.minEntries, formValues.maxEntries);
      let timeSet = [];
      let nowObj = new Date();
      // Let's enter the values in the near past
      nowObj.setMinutes(nowObj.getMinutes() - formValues.maxTime * numOfEntries);
      for (let e = 0; e < numOfEntries; e++) {
        const delayInMinutes = getRandomValue(formValues.minTime, formValues.maxTime);
        nowObj.setMinutes(nowObj.getMinutes() + delayInMinutes);
        timeSet.push(nowObj.toISOString());
      }

      //Pushing the sensor values
      const sensorsList = await getAPI(`/devices/${deviceID}/sensors`)
      for (let sensor of sensorsList) {

        const sensorID = sensor['id'];

        const randomValues = getCorrRdandomValues(numOfEntries, formValues.minValues, formValues.maxValues);
        let sensorValues = [];
        for (let e = 0; e < numOfEntries; e++) {
          const value = randomValues[e];
          const time = timeSet[e];
          sensorValues.push({ value, time });
        }

        try {
          await postAPI(`/devices/${deviceID}/sensors/${sensorID}/values`, sensorValues);
        } catch (e) {
          console.error(e);
          continue;
        }
      }

    }
    setProgress(100);
  }

  /**------------- */

  const stopDataGenerator = () => { }

  /**------------- */


  return (
    <div className="Main">
      <Container maxWidth="md">
        <form className={classes.root} noValidate autoComplete="on" onSubmit={e => e.preventDefault()}>
          <FormControl className={classes.box}>
            <FormLabel>Devices:</FormLabel>
            <FormGroup className={classes.fieldset}>
              <TextField
                id="numDevices"
                label="Number of devices"
                value={formValues.numDevices}
                type="number"
                onChange={(e) => setFormValues({ ...formValues, numDevices: Number(e.target.value) })}
              />
              <Codecs onChange={(codec: string) => { setSelectedCodec(codec); }}></Codecs>
            </FormGroup>
          </FormControl>

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

          <FormControl className={classes.box}>
            <FormLabel>Delay between two entries (in minutes):</FormLabel>
            <FormGroup row className={classes.fieldset}>
              <TextField id="minTime" className={classes.numInput} label="Min" value={formValues.minTime} type="number" onChange={(e) => setFormValues({ ...formValues, minTime: Number(e.target.value) })} />
              <TextField id="maxTime" className={classes.numInput} label="Max" value={formValues.maxTime} type="number" onChange={(e) => setFormValues({ ...formValues, maxTime: Number(e.target.value) })} />
            </FormGroup>
          </FormControl>

          <FormGroup row style={{ justifyContent: "center" }}>
            {progress > 0 && <LinearProgressWithLabel value={progress} />}
            <Button variant="contained" disabled={progress > 0 && progress < 100} className={classes.button} onClick={startDataGenerator} type="submit" color="primary">Start</Button>
            {/* <Button variant="contained" className={classes.button} onClick={stopDataGenerator} color="secondary">Stop</Button> */}
          </FormGroup>
        </form>
      </Container>
    </div >
  );
}

/**---------------- */

export const getRandomSensor = (): SensorType => {

  const sensingDevicesKeys = Object.keys(ontologies.sensingDevices);
  const randomKindId = Math.floor(Math.random() * sensingDevicesKeys.length);

  const randomKind = sensingDevicesKeys[randomKindId];
  const randomSensor = ontologies.sensingDevices[sensingDevicesKeys[randomKindId]];

  const randomQuantity = randomSensor.quantities.length ? randomSensor.quantities[Math.floor(Math.random() * randomSensor.quantities.length)] : "";
  const randomUnitId = randomQuantity ? Math.floor(Math.random() * ontologies.quantities[randomQuantity].units.length) : null;
  const randomUnit = randomUnitId !== null ? ontologies.quantities[randomQuantity].units[randomUnitId] : "";

  return {
    "name": randomSensor.label,
    "meta": {
      "kind": randomKind,
      "quantity": randomQuantity,
      "unit": randomUnit,
    }
  }
}

/**------------- */

export const getRandomDeviceName = (): string => {
  const randomDeviceId = Math.floor(Math.random() * deviceNames.length);
  return deviceNames[randomDeviceId];
}

/**------------- */

export const getRandomValue = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
}

/**------------- */

export const getCorrRdandomValues = (count: number, min: number, max: number) => {

  let output: number[] = [];
  output.push(Math.round(Math.random() * (max - min) + min));
  for (let i = 1; i < count; i++) {
    let localMin = output[i - 1] - (max - min) * 0.05; // Near numbers with max 5% distance
    let localMax = output[i - 1] + (max - min) * 0.05;
    localMin = localMin < min ? min : localMin;
    localMax = localMax > max ? max : localMax;
    const newNumber = Math.random() * (localMax - localMin) + localMin;
    output.push(Math.round(newNumber));
  }
  // console.log(count, output);
  return output;
}

/**------------- */

export const postAPI = async (path: string, val: any) => {
  let resp = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(val),
  });
  const contentType = resp.headers.get("Content-Type");
  const isJson = contentType?.startsWith("application/json");
  if (!resp.ok) {
    if (isJson) {
      var data = await resp.json();
      throw `HTTP Error ${resp.status} ${resp.statusText}\n${data}`;
    } else {
      var text = await resp.text();
      throw `HTTP Error ${resp.status} ${resp.statusText}\n${data}`;
    }
  }
  return isJson ? resp.json() : resp.text();
}

/**------------- */

export const getAPI = async (path: string) => {
  let resp = await fetch(path, {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
  const contentType = resp.headers.get("Content-Type");
  const isJson = contentType?.startsWith("application/json");
  if (!resp.ok) {
    if (isJson) {
      var data = await resp.json();
      throw `HTTP Error ${resp.status} ${resp.statusText}\n${data}`;
    } else {
      var text = await resp.text();
      throw `HTTP Error ${resp.status} ${resp.statusText}\n${data}`;
    }
  }
  return isJson ? resp.json() : resp.text();
}

/**------------- */