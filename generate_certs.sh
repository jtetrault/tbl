#!/bin/sh -e
script=$(readlink -f "$0")
scriptpath=$(dirname "$script")
certspath="${scriptpath}/certs"
mkdir -p "${certspath}"
existingcerts=$(ls "${certspath}")
if [ ! -z "$existingcerts" ]; then
    echo "${certspath} is not empty, not overwriting existing certs"
    exit 1
fi
openssl req -x509 -newkey rsa:2048 -keyout "${certspath}/key.pem"\
	-out "${certspath}/cert.pem" -nodes -days 9999
