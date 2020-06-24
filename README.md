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

.. include:: docs/source/installation/server.rst

.. include:: docs/source/installation/client.rst
