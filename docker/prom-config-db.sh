#!/bin/bash

cd /home/prometheus/
tar xvfz mysqld_exporter-*.*-amd64.tar.gz
cd mysqld_exporter-*.*-amd64
./mysqld_exporter

#mysql -uroot -pstream -Dstream -e ""