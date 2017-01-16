#!/bin/bash
REPO=$(pwd)
EXIT_CODE=0
# echo `git diff-index --name-only HEAD`
for FILE in `git diff-index --name-only HEAD | egrep \*.js`; do

    jshint ${REPO}/${FILE}

    if [ $? != 0 ]

	then
        EXIT_CODE=1
	fi


done

if [ $EXIT_CODE != 0 ]

then
     echo "Fix your syntax error before commiting."
fi

exit ${EXIT_CODE}