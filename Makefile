SHELL := /bin/bash
include ./.env.docker

env:
	$(MAKE) fix-env
	cat $(PWD)/.env.local >> $(PWD)/app/.env

fix-env:
	rm -f $(PWD)/app/.env
	touch $(PWD)/app/.env

up:
	docker-compose up --build

down:
	docker-compose -f docker-compose.yaml down
	docker container prune
	docker image prune -a

webserver:
	  docker exec -it $(WEBSERVER_CONTAINER) /bin/sh