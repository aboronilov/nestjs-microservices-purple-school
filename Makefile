include envs/.account.env

create_db:
	docker run --name purple-mongo -p ${MONGO_PORT}:${MONGO_PORT} -e MONGO_INITDB_ROOT_USERNAME=${MONGO_LOGIN} -e MONGO_INITDB_ROOT_PASSWORD=${MONGO_LOGIN} -d mongo:7.0

create_rabbitmq:
	docker run --name purple-rabbit -p 15672:15672 -p 5672:5672 -d rabbitmq:3.13.1-management-alpine

run_all:
	nx run-many --target=serve --all --parallel=10

test_account:
	nx run test account --skip-nx-cache

all_tests:
	nx run-many --target=test --all --skip-nx-cache --parallel=10