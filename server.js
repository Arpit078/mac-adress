const http = require('http');
const fs = require('fs');

const port = 5000;
const macAddressesFile = './mac-addresses.json';

// Create an empty object to store MAC addresses
let macAddresses = {};

// Load existing MAC addresses from file
fs.readFile(macAddressesFile, (err, data) => {
  if (!err) {
    try {
      macAddresses = JSON.parse(data);
    } catch (e) {
      console.error(`Error parsing MAC addresses file: ${e.message}`);
    }
  } else {
    console.error(`Error reading MAC addresses file: ${err.message}`);
  }
});

// Create a HTTP server
const server = http.createServer((req, res) => {
  // Get the MAC address from the request headers
  const macAddress = req.headers['x-forwarded-for'];

  // Store the MAC address in the object
  macAddresses[macAddress] = new Date().toISOString();

  // Save the MAC addresses to file
  fs.writeFile(macAddressesFile, JSON.stringify(macAddresses), (err) => {
    if (err) {
      console.error(`Error writing MAC addresses file: ${err.message}`);
    } else {
      console.log(`Updated MAC address: ${macAddress}`);
    }
  });

  // Send a response
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Updated MAC address: ${macAddress}\n`);
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});