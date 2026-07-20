.PHONY: run build install clean

install:
	npm install

run: install
	npm run dev

build: install
	npm run build

clean:
	rm -rf dist node_modules
