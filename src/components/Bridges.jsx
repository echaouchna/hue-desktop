import React, {
  useEffect,
  useState
} from 'react';

const v3 = require('node-hue-api').v3;

export default function Bridges() {
  const [scanState, setScanState] = useState({
    scanCount: 0,
    bridges: [],
    finished: false
  });

  useEffect(() => {
    async function getBridge() {
      const results = await v3.discovery.upnpSearch();
      console.log(JSON.stringify(results, null, 2));
      return results
    }
    if (scanState.scanCount === 0) {
      getBridge().then(bridges => {
        setScanState({bridges: bridges, scanCount: scanState.scanCount + 1, finished: true})
      })
    }
  });

  return (
    <>
      {!scanState.finished
      ? 'discovering'
      : (scanState.bridges.length > 0
      ? scanState.bridges.map((bridge) => <li key={bridge.model.serial}>{bridge.name}</li>)
      : 'No bridge found')}
    </>
  );
}
