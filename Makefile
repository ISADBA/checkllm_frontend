IMAGE ?= checkllm-frontend
TAG ?= latest
DOCKERFILE ?= Dockerfile
CONTEXT ?= ..

.PHONY: build

build:
	docker build -f $(DOCKERFILE) -t $(IMAGE):$(TAG) $(CONTEXT)
