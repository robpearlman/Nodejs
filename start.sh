#!/bin/bash

# Navigate to the client directory and build the React app
cd client && npm run build

# Navigate back to the root directory
cd ..

# Start the Express server
node index.js