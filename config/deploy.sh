#!/bin/sh
path=$(cd $( dirname ${BASH_SOURCE[0]}) )/matcha_seed.sql;
MYSQL_PASS=""  # Leave it empty if there's no password

# cd //Users/lcordeno/Applications/MAMP/mysql/bin;
cd C://xampp/mysql/bin
./mysql < $path -u root -pazerty123;

echo "Database deployed!"



