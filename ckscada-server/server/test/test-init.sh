../bin/ck-create-device.js -d "simulation" -t "simulation" -c ../config/test.json
../bin/ck-create-tag.js -n randint -d simulation -t int --rl 0 --rh 100 --el 0 --eh 100 -c ../config/test.json 
