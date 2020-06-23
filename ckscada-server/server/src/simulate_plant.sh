./ck-create-device.js -d "Simulated_Flow_Transmitter" -t "simulation" -s "2000" -c ../../config/test.json
./ck-create-device.js -d "Simulated_Modbus_PLC" -t "simulation" -s "2000" -c ../../config/test.json
./ck-create-device.js -d "Simulated_OPC_Server" -t "simulation" -s "2000" -c ../../config/test.json

sleep 5

for i in {1..9}
do
   ./ck-create-tag.js -n 00000$i -d "Simulated_Modbus_PLC" --ds "Description Text" -t int --rl 0 --rh 100 --el 0 --eh 100 -c ../../config/test.json
   ./ck-create-tag.js -n 10000$i -d "Simulated_Modbus_PLC" --ds "Description Text" -t int --rl 0 --rh 100 --el 0 --eh 100 -c ../../config/test.json
   ./ck-create-tag.js -n 30000$i -d "Simulated_Modbus_PLC" --ds "Description Text" -t int --rl 0 --rh 100 --el 0 --eh 100 -c ../../config/test.json
   ./ck-create-tag.js -n 40000$i -d "Simulated_Modbus_PLC" --ds "Description Text" -t int --rl 0 --rh 100 --el 0 --eh 100 -c ../../config/test.json
done

./ck-create-tag.js -n Raw -d "Simulated_Flow_Transmitter" --ds "Description Text" -t int --rl 0 --rh 4095 --el 0 --eh 4095 -c ../../config/test.json
./ck-create-tag.js -n Scaled -d "Simulated_Flow_Transmitter" --ds "Description Text" -t int --rl 0 --rh 4095 --el 0 --eh 4095 -c ../../config/test.json
./ck-create-tag.js -n Stored -d "Simulated_Flow_Transmitter" --ds "Description Text" -t stored --rl 0 --rh 4095 --el 0 --eh 4095 -c ../../config/test.json

./ck-create-tag.js -n PLC01.Conveyor01.Start -d "Simulated_OPC_Server" --ds "Description Text" -t int --rl 0 --rh 1 --el 0 --eh 1 -c ../../config/test.json
./ck-create-tag.js -n PLC01.Conveyor01.Stop -d "Simulated_OPC_Server" --ds "Description Text" -t int --rl 0 --rh 1 --el 0 --eh 1 -c ../../config/test.json
./ck-create-tag.js -n PLC01.Conveyor01.Running -d "Simulated_OPC_Server" --ds "Description Text" -t int --rl 0 --rh 1 --el 0 --eh 1 -c ../../config/test.json
./ck-create-tag.js -n PLC01.Conveyor01.Alarm -d "Simulated_OPC_Server" --ds "Description Text" -t int --rl 0 --rh 1 --el 0 --eh 1 -c ../../config/test.json
./ck-create-tag.js -n PLC01.Conveyor01.Speed.SP -d "Simulated_OPC_Server" --ds "Description Text" -t int --rl 0 --rh 4095 --el 0 --eh 150 -c ../../config/test.json
./ck-create-tag.js -n PLC01.Conveyor01.Speed.PV -d "Simulated_OPC_Server" --ds "Description Text" -t int --rl 0 --rh 4095 --el 0 --eh 150 -c ../../config/test.json
./ck-create-tag.js -n PLC02.Conveyor02.Start -d "Simulated_OPC_Server" --ds "Description Text" -t int --rl 0 --rh 1 --el 0 --eh 1 -c ../../config/test.json
./ck-create-tag.js -n PLC02.Conveyor02.Stop -d "Simulated_OPC_Server" --ds "Description Text" -t int --rl 0 --rh 1 --el 0 --eh 1 -c ../../config/test.json
./ck-create-tag.js -n PLC02.Conveyor02.Running -d "Simulated_OPC_Server" --ds "Description Text" -t int --rl 0 --rh 1 --el 0 --eh 1 -c ../../config/test.json
./ck-create-tag.js -n PLC02.Conveyor02.Alarm -d "Simulated_OPC_Server" --ds "Description Text" -t int --rl 0 --rh 1 --el 0 --eh 1 -c ../../config/test.json
