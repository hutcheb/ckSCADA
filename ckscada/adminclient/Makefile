NAME=admin-client
VERSION=0.1
PACKAGE=$(NAME)

all: release

$(PACKAGE):
	rm -rf node_modules;
	if test -f package-lock.json; then rm package-lock.json; else echo package-lock.json does not exist; fi
	npm install;	

release: $(PACKAGE)

clean:
	rm -rf node_modules;
	if test -f package-lock.json; then rm package-lock.json; else echo package-lock.json does not exist; fi
