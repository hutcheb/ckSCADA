Introduction
===================================

ckSCADA is an open source SCADA system built using Kafka.

The primary aim is to be an open source alternate to proprietry SCADA systems.

Using Kafka it allows the system to be easily extended using third party
components. Kafka is a very well supported framework for messaging between
components. The system is able to be scaled easily with the addition of additional
Kafka brokers.

Roadmap
===================================

The system is currently in the very early stage of development and is not suitable
for production use.

* v0.1 - Basic framework has been setup and proof of concept implemented.

Future Release Milestones
-----------------------------------

* v0.2  - Add exception handling to server code
        - Document server code
        - Fix issues around server redundancy
        - Add additional devices including server metric tags
        - Discuss Python implementation for server components

* v0.3  - Investigate PLC4X project to use for PLC communication.

.. ckSCADA Installation Server

Server Installation
===================================

To install the server components.

Firstly make sure your Kafka broker/clusetr has been setup already. The server
components should be able to be run on the Kafka broker.

For Windows you will need to install node.js manually as well as python 3. You
can then install kafka-python with pip and manually install node.js dependancies
using

.. code-block:: bash

  npm install .

in the ckscada-client and ckscada-server/admin-client folders.

For Debian/Ubuntu use apt to install it

.. code-block:: bash

  sudo apt install npm python3
  sudo npm install -g npm-cache
  pip3 install kafka-python

Following this, download the ckscada package and build the npm packages.

.. code-block:: bash

  cd ckSCADA
  make

Edit the config.json file in the config folder.
Include the nodeId, ip address and the port of one of your Kafka brokers.

We will next run the server components.

.. code-block:: bash

  cd ckscada-server/server/src
  python3 ckagent.py --config ../../config/config.json

  cd ckscada-server/admin-server/src
  python3 points.py --config ../../config/test.json

  cd ckscada-server/admin-client
  npm start .

There is a helper script to setup a few tags on simulation device and start
publishing them the sample page on the client uses these.

.. code-block:: bash

  cd ckscada-server/server/src
  ./simulate_plant.sh


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
