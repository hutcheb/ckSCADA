.. ckSCADA Installation Client

Client Installation
===================================

Viewer Only
***********************************

To install the viewer download the Node.js package from nodejs.org for your
operating system.

For Windows you will need to install node.js manually as well as python 3. You
can then install kafka-python with pip. Then manually install node.js dependancies
using

.. code-block:: bash

  cd ckscada-client
  npm install .

For Debian/Ubuntu use apt to install it

.. code-block:: bash

  sudo apt install npm
  sudo npm install -g npm-cache

Following this, download the ckscada package and build the npm packages.

.. code-block:: bash

  cd ckSCADA
  make

Edit the config.json file in the config folder.
Include the nodeId, ip address and the port of one of your Kafka brokers.

Assuming you have already setup your server you should then be able to run the viewer.

.. code-block:: bash

  cd ckscada-client
  npm start

This will open the welcome.svg screen and then open the Sample-Screen.svg file.
This is just an example page using built-in tags from the standard server install.
For production you will need to create your own HMI pages.
