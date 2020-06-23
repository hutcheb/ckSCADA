.. ckSCADA Installation Client

Client Installation
===================================

Viewer Only
***********************************

To install the viewer download the Node.js package from nodejs.org for your
operating system.

For Windows download the package manually and follow the install wizard.

For Debian/Ubuntu use apt to install it

.. code-block:: bash

  sudo apt install npm

Following this download the ckscada package leaving only the docs and ckscada-client
folders.

cd to the ckscada-client folder and install the dependacies.

.. code-block:: bash

  cd ckscada-client
  npm install

Edit the config.json file in the config folder.
Include the nodeId, ip address and the port of one of your Kafka brokers.

You should then be able to run the viewer.

.. code-block:: bash

  npm start

This will open the welcome.svg screen and then open the Sample-Screen.svg file.
This is just an example page using built-in tags from the standard server install.
For production you will need to create your own HMI pages.
