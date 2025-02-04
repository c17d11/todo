#!/bin/bash

echo "Runnning Todo application...";
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}")/.." &> /dev/null && pwd )

main() (
    sudo docker-compose up > /dev/null 2>&1 &

    ready=$(curl -sI http://localhost:3000 | grep "200 OK" | wc -l)
    while [[ "$ready" != 1 ]]
    do 
        sleep 0.1;   
        ready=$(curl -sI http://localhost:3000 | grep "200 OK" | wc -l)
    done
    google-chrome http://localhost:3000 & pid=$!
    #PIDS=$(ps ax | grep firefox | grep -v grep | awk '{print $1}')
    #for pid in $PIDS; do
    #    wait $pid;
    #done
    wait $pid;

    docker-compose down > /dev/null 2>&1
)

main "$@"

echo "..application shut down";
