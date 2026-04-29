IMAGE ?= crpi-0vih3w2g8se3zbl8.cn-hangzhou.personal.cr.aliyuncs.com/isadba/checkllm-frontend
TAG ?= latest
DOCKERFILE ?= Dockerfile
CONTEXT ?= ..

.PHONY: build

build:
	docker build -f $(DOCKERFILE) -t $(IMAGE):$(TAG) $(CONTEXT)
