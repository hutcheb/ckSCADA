NAME=ckscada
VERSION=0.1
PACKAGE=$(NAME)

all: release

$(PACKAGE):
	make -C ckscada-client
	make -C ckscada-server/admin-client
	make -C ckscada-server/admin-server
	make -C ckscada-server/server

release: $(PACKAGE)

clean:
