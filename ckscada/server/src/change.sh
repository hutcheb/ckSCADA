#!/bin/bash
for i in {1..1000}
do
   ./kafka-topics.sh --zookeeper 192.168.1.57:2181 --alter --topic simulation.randinteger$i --config retention.ms=1000
done

