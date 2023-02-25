const os = require('os');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const mac = getMacAddress();
  res.send(`Your MAC address is ${mac}`);
});

function getMacAddress() {
  const networkInterfaces = os.networkInterfaces();
  const interfaceNames = Object.keys(networkInterfaces);

  for (const name of interfaceNames) {
    const interface = networkInterfaces[name];
    const interfaceInfo = interface.find(info => !info.internal && info.family === 'IPv4');

    if (interfaceInfo) {
      return interfaceInfo.mac;
    }
  }

  return null;
}

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
