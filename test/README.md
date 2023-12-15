## Run locally
 If test run from outside docker,
 then it uses exported ports on localhost:
    - make sure that docker-compose is up

## Run from docker container (devconteiner)
If test run from inside docker:
    - make sure that docker-compose is up 
    - and devcontainer is connected to default compose network

## Common info
Pass FLUSHDB=1 to clean cache before running tests
Some tests clean cache by themselves, 
but not all just for the sake of execution speed