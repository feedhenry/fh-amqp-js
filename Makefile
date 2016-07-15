PACKAGE = fh-amqp-js

all: clean deps test dist

test:
	grunt fh:test

coverage:
	grunt fh:coverage

dist: deps
	grunt fh:dist

deps:
	npm install .

clean:
	grunt fh:clean

.PHONY: coverage test all deps dist output
