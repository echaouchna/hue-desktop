import React, {
  useEffect,
  useState
} from 'react';

import { Button } from '@material-ui/core';
import { Autorenew } from '@material-ui/icons';

const v3 = require('node-hue-api').v3;

export default function Bridges() {
  const [scanState, setScanState] = useState({
    scanCount: 0,
    bridges: [],
    finished: false
  });

  async function getBridge() {
    const results = await v3.discovery.upnpSearch();
    return results
  }

  useEffect(() => {
    if (scanState.scanCount === 0) {
      getBridge().then(bridges => {
        setScanState({bridges: bridges, scanCount: scanState.scanCount + 1, finished: true})
      })
    }
  });

  const refresh = (event) => {
    setScanState({...scanState, finished: false})
    getBridge().then(bridges => {
      setScanState({bridges: bridges, scanCount: scanState.scanCount + 1, finished: true})
    })
  }

  let bridges = <p>discovering</p>

  if (scanState.finished) {
    bridges = <p>No bridge found</p>
  }
  if (scanState.finished && scanState.bridges.length > 0) {
    bridges = scanState.bridges.map((bridge) => <li key={bridge.model.serial}>{bridge.name}</li>)
  }

  return (
    <>
      <Button onClick={refresh} className="refresh" disabled={!scanState.finished} ><Autorenew className="refreshIcon"/>Refresh</Button>
      {bridges}
    </>
  );
}
