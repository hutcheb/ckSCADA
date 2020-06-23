.. ckSCADA documentation master file, created by
   sphinx-quickstart on Thu Jun  4 09:51:34 2020.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

ckSCADA
===================================

.. toctree::
   :maxdepth: 2
   :caption: Overview:
   :glob:
   :hidden:

   about/*

.. toctree::
   :maxdepth: 2
   :caption: Installation:
   :glob:
   :hidden:

   installation/*

.. toctree::
  :maxdepth: 2
  :caption: Command Line Tools:
  :glob:
  :hidden:

  cli/*

.. toctree::
  :maxdepth: 2
  :caption: Developer:
  :glob:
  :hidden:

  development/*

.. toctree::
  :maxdepth: 2
  :caption: Index:
  :glob:
  :hidden:

  index/*


ckSCADA is an open source SCADA system built using Kafka as the base for
all communication.

The primary aim is to be an open source alternate to proprietry SCADA systems.
It is kept as simple as possible to minimize issues with the code base.
Yet allows the system to be extended using third party Kafka components.

Kafka is a very well supported framework for messaging between components.
This allows for the use of existing Kafka connectors to be intgrated.

As kafka is used this allows for the system to be scaled easily.
Need 100,000 more tags add another couple of servers.

Each component within the system communicates using the kafka broker(s)
which enables each component to be developed indiviually from the other.




Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
