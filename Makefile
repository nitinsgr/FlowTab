.PHONY: dev build lint clean

dev:
	cd scripts && ./run-stack.sh

build:
	podman compose build

lint:
	npx eslint 'services/*/src/**/*.{js,ts}' 'apps/*/src/**/*.{js,ts}'

format:
	npx prettier --write '**/*.{js,ts,json,yaml,yml}'

clean:
	podman compose down -v

logs:
	podman compose logs -f
