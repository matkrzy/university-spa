#!/usr/bin/make -f
cnf ?= config.env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

port:= 1234
tag:= "$(DOCKER_REGISRY_USER)/bsc-spa"

.PHONY: build
build:
	docker build . -t "$(tag)"

.PHONY: run
run:
	docker run -p $(port):80 $(tag)

.PHONY: push
push:
	@docker login -u $(DOCKER_REGISRY_USER) -p $(DOCKER_REGISRY_USER_PASSWORD)
	docker push $(tag)
