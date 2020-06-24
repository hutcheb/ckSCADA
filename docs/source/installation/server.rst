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
