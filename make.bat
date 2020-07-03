cd ckscada-client
call npm install

cd ..
cd ckscada-server\admin-client
call npm install


cd ..
cd admin-server
pip3 install -r requirements.txt

cd ..
cd server
pip3 install -r requirements.txt
call npm install

cd ..\..
