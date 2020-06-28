#!/bin/bash
for j in {1..10}
do
./ck-create-device.js -d "simulation$j" -t "simulation" -s "30" -c ../config/config.json
for i in {1..100}
do
   ./ck-create-tag.js -n randinteger$i -d simulation$j -t int --rl 0 --rh 100 --el 0 --eh 100 -c ../config/config.json
done
done
