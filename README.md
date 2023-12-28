# Swapi Proxy
The project implements swapi proxy server which uses caching in Redis container.
All REST swapi resources can be accessed through it via its REST API.
People/planets/starships resources can be accessed additionally also via GraphQl API.
The server can be run in docker through docker-compose.

## Running Tests
To run unittests:
```bash
npm test
```
To run e2e first make sure that docker-compose is up and running and then:
```bash
npm run test:e2e
```
When trying to run e2e tests from inside devcontainer or docker container, the container should be connected to the default project's docker compose network.
Simply run following command from your pc (outside of docker):
```bash
docker network connect COMPOSE_FILES_DIR_default CONTAINER
```
By default the cache is not cleared unless the specific testcase does it itself. This means that for the first run the execution will take longer and even jest timeouts may occur.
In order to prevent that it is advisable to call a script that calls endpoints with the most expensive swapi calls
```bash
./scripts/accessRest.sh
```
The cache can be cleared with:
```bash
npm run clear-cache
```

## Documentation and manual testing
The documentation is accessible on http://localhost:3000/api/docs/ after running docker-compose.
This is a swagger documentation.
All REST and GraphQl endpoints are also available at http://localhost:3000/api/ and http://localhost:3000/graphql/