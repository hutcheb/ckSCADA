./ck-create-device.js -d "Simulated.Project" -t "simulation" -s "1000" -c ../config/test.json

./ck-create-tag.js -n timestamp -d "Simulated.Project" -t showtime --rl 0 --rh 4095 --el 0 --eh 4095 -c ../config/test.json
./ck-create-tag.js -n site.name -d "Simulated.Project" -t int --rl 0 --rh 4095 --el 0 --eh 4095 -c ../config/test.json
