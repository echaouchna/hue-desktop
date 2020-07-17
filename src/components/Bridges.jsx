import React, {
  useEffect,
  useState
} from 'react';

import { Button, Grid } from '@material-ui/core';
import { Autorenew } from '@material-ui/icons';

const v3 = require('node-hue-api').v3
  , discovery = v3.discovery
  , hueApi = v3.api
  , os = require('os')
;

export default function Bridges() {
  const [scanState, setScanState] = useState({
    scanCount: 0,
    bridges: [],
    finished: false
  });

  async function getBridge() {
    const results = await discovery.upnpSearch();
    return results
  }

  async function createUser(ipAddress) {
    const unauthenticatedApi = await hueApi.createInsecureLocal(ipAddress).connect();

    let createdUser;
    try {
      createdUser = await unauthenticatedApi.users.createUser('hue-desktop', os.hostname());
      console.log('*******************************************************************************\n');
      console.log('User has been created on the Hue Bridge. The following username can be used to\n' +
                  'authenticate with the Bridge and provide full local access to the Hue Bridge.\n' +
                  'YOU SHOULD TREAT THIS LIKE A PASSWORD\n');
      console.log(`Hue Bridge User: ${createdUser.username}`);
      console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
      console.log('*******************************************************************************\n');

      // Create a new API instance that is authenticated with the new user we created
      const authenticatedApi = await hueApi.createInsecureLocal(ipAddress).connect(createdUser.username);

      // Do something with the authenticated user/api
      const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
      console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);
      hueApi.users.deleteUser(createdUser.username)

    } catch(err) {
      if (err.getHueErrorType() === 101) {
        console.error('The Link button on the bridge was not pressed. Please press the Link button and try again.');
      } else {
        console.error(`Unexpected Error: ${err.message}`);
      }
  }
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
    bridges = scanState.bridges.map((bridge) =>
      <>
        <Grid container className="bridge">
          <Grid item xs={9}>
            {bridge.name}
          </Grid>
          <Grid item xs={3}>
            <Button className="white-full-width" onClick={() => createUser(bridge.ipaddress)}>connect</Button>
          </Grid>
        </Grid>
      </>
    )
  }

  return (
    <>
      <Button onClick={refresh} className="white-full-width" disabled={!scanState.finished} ><Autorenew className="refreshIcon"/>Refresh</Button>
      <Grid container spacing={3} className="bridges">
        {bridges}
      </Grid>
    </>
  );
}
