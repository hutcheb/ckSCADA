NAME=ckscada-viewer
VERSION=0.1
PACKAGE=$(NAME)

all: release

$(PACKAGE):
	rm -rf node_modules;
	if test -f package-lock.json; then rm package-lock.json; else echo package-lock.json does not exist; fi
	npm-cache install;
	sudo chown root node_modules/electron/dist/chrome-sandbox
	sudo chmod 4755 node_modules/electron/dist/chrome-sandbox

release: $(PACKAGE)

clean:
	rm -rf node_modules;
	if test -f package-lock.json; then rm package-lock.json; else echo package-lock.json does not exist; fi

