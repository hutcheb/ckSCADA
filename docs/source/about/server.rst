.. ckSCADA Server

Server Overview
===================================

The server package provides the basic functionality of getting data from
the IO devices into Kafka, monitoring the IO device processes and providing an
api for the admin client to query the configuration.

ckAgent
***********************************

The ckAgent process is the main process to be run on each of the :ref:`io_servers`.
It creates the :ref:`io_device` processes as they are requested. Once the IO device
process is created then it is left to the IO device to handle redundancy,
io polling, enabling/disabling of the device.

.. todo::
  ckAgent should be able to open the configuration file and load the server
  config

.. todo::
  ckAgent should be able to poll other online ckAgent process to get a copy
  of the configuration.

The ckagent process can be run using the command

.. code-block:: python

  python3 ckagent.py --configfile ../../config/'config.json'

This will create the ckAgent process and have it wait for messages.

ckAgentDevice
************************************

Currently there is only the simulation IO device type available with the plan
to include an OPC DA, OPC UA as well as a Modbus device as soon as the base
logic has been tested and has proven itself.

.. todo::
  This is by design to limit the out of the box usefulness until it is safer to be
  used in production

When an IO device is created you are able to specify the replication factor
for that device. The ckAgent process creates the IO device and monitors the
others servers for similar online devices. The replication factor defines how
many active instances of this IO device should be available.

If there is less instances available then what has been configured a new IO device
will come online if available.

The main interface to modify IO devices is through the :ref:`admin_client`
however there are also :ref:`command-line-tools` available to programatically
modify them.

.. _config.json:

config.json
**************************************

The config.json file is used to store the projects configuration. It can be
stored anywhere. An example is included in the ckscada-client/config and
ckscada-servers/config folders.

The file is written in JSON. The following structures can be defined in the file.

**brokers** -  contains a dictionary of Kafka brokers. This is to bootstrap
the connection between the client or server and the Kafka cluster. Once a
connection has been established a list of available brokers in the cluster
is downloaded.

  The **nodeId** is the id assigned to the node within the Kafka Configuration

  The **host** is the ip address or server name. When using a server name make sure
  it is configured in your hosts file so you don't rely on a DNS.

  The **port** is the port that is configured within the Kafka Configuration on the
  server.

.. code-block:: javascript

  "brokers": [
      {
          "nodeId": <nodeid>,
          "host": "<ip adderess>",
          "port": <port>
      }
  ]

.. todo::
  Add additional configuration to the config file to be used as the base configuration
  when starting the system. This file should be able to be exported from a
  running Kafka System via the Admin Client.
