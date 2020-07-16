import '../assets/css/App.css'
import React from 'react'
import Bridges from './Bridges'

import { AppBar, Tabs, Tab, Box } from '@material-ui/core';
import { LinkOutlined, EmojiObjectsOutlined }  from '@material-ui/icons';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <AppBar position="static" className="colorPrimary">
        <Tabs value={activeTab}
          onChange={handleChange}
          className="colorPrimary"
          variant="fullWidth"
          centered>
          <Tab icon={<LinkOutlined/>} label="Connect" />
          <Tab icon={<EmojiObjectsOutlined/>} label="Lights" />
        </Tabs>
      </AppBar>
      <TabPanel value={activeTab} index={0}>
        <Bridges/>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        Lights: working on it
      </TabPanel>
    </>
  )
}
