#!/bin/sh
set -e

cd /explorer

# we build on container startup because react needs the env variables present
/usr/local/bin/node server
