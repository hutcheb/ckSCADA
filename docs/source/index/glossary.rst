.. Glossary

Glossary
==========================================

.. _io_servers:

I/O Server
***********************************

An I/O server is the machine that hosts the main ckAgent process. Only on
ckAgent process can be run per server.

.. note::
  IO servers can be any server and need not be the same server the kafka broker
  is on.

.. _kafka_broker:

Kafka broker
***********************************

A Kafka broker is a machine running Apache Kafka. This may be part of a larger
Kafka cluster or be a standalone broker.

.. _io_device:

IO Device
***********************************

An IO device is an abstract class that reads data from a physical or simulated
device and sends this data to Kafka topics. The implementation left to then
specific IO device. 
