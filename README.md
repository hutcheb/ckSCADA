Introduction
===================================

ckSCADA is an open source SCADA system built using Kafka.

https://ckscada.readthedocs.io/

The primary aim is to be an open source alternate to proprietry SCADA systems.

Using Kafka allows the system to be easily extended using third party
components. Kafka is a very well supported framework for messaging between
components. The system is able to be scaled easily with the addition of additional
Kafka brokers.

Roadmap
===================================

The system is currently in the very early stage of development and is not suitable
for production use.

* v0.1

        *       Basic framework has been setup and proof of concept implemented.

Future Release Milestones
-----------------------------------

* v0.2  

        *       Add exception handling to server code

        *       Document server code

        *       Fix issues around server redundancy

        *       Add additional devices including server metric tags

        *       Discuss Python implementation for server components

* v0.3  

        *       Investigate PLC4X project to use for PLC communication.

Server Installation
===================================

To install the server components.

Firstly make sure your Kafka broker/cluster has been setup already. There are
plenty of tutorials on how to setup a Kafka cluster such as this one:-

https://kafka.apache.org/quickstart

Working under the assumption that your machine is connected to the internet.

Windows Installation
-----------------------------------

For Windows you will need to install node.js manually:-

https://nodejs.org/en/download/

Install Python 3

https://www.python.org/downloads/

make sure that python is included in your path.

Following this, download the ckscada package and download the npm/python packages.

```

  make.bat

```

Linux Installation
-----------------------------------

For Debian/Ubuntu use apt to install dependancies

```

  sudo apt install npm python3

```

Following this, download the ckscada package and download the npm/python packages.

```

  cd ckSCADA
  make

```

Edit the config.json file in the config folders.
Include the nodeId, ip address and the port of one of your Kafka brokers.

We will next run the server components, opening a new terminal between each set of commands:-

```

  cd ckscada-server/server/src
  python3 ckagent.py --config ../../config/config.json

  cd ckscada-server/admin-server/src
  python3 ckadminserver.py --config ../../config/config.json

  cd ckscada-server/admin-client
  npm start .

```

There is a helper script to setup a few tags on a simulation device and start
publishing them, the sample page on the client uses these.

```

  cd ckscada-server/server/src
  ./simulate_plant.sh

```

Client Installation
===================================

Viewer Only
-----------------------------------

To install the viewer download the Node.js package from nodejs.org for your
operating system.

Windows Installation
-----------------------------------

Install node.js manually:-

https://nodejs.org/en/download/

Following this, download the ckscada package, npm packages and
remove the folders that aren't needed.

```

  del ckscada-server

  cd ckscada-client
  npm install .

```

Linux Installation
-----------------------------------

For Debian/Ubuntu use apt to install it

```

  sudo apt install npm

```

Following this, download the ckscada package and build the npm packages.

```
  rm -r cksacda-server
  cd ckscada-client
  npm install .

```

Edit the config.json file in the config folder.
Include the nodeId, ip address and the port of one of your Kafka brokers.

Assuming you have already setup your server you should then be able to run the viewer.

```

  cd ckscada-client
  npm start

```

This will open the welcome.svg screen and then open the Sample-Screen.svg file.
This is just an example page using built-in tags from the standard server install.
For production you will need to create your own HMI pages.
