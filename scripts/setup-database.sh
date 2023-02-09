#!/usr/bin/bash

cat $(dirname 0)/setup-database.txt | mysql
