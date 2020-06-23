.. ckSCADA Development Server

Server API
===================================

The server package provides the basic functionality of getting data from
the IO devices, monitoring the IO device processes and providing an api for th
e admin server to query the configuration.

It initially opens a Kafka consumer process and waits for configuration messages
on the default admin topic *'_admin'*.

The ckAgent listens for messages on the '_admin' topic. The following messages
will be acted upon:-

* add - This adds an IO device.
* del - This deletes an IO device.
* get - This gets the agents configuration and publishes it on the same topic.


.. automodule:: ckagent
   :members:
   :undoc-members:
   :noindex:

.. automodule:: ckagentdevice
  :members:
  :undoc-members:
  :noindex:

.. automodule:: ckcommon
  :members:
  :undoc-members:
  :noindex:
