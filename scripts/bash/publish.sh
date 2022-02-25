#!/bin/bash

if [[ "${PWD##*/}" != "bash" ]]
then
    echo "Working directory must be that of the scripts/bash/ folder"
    exit 1
fi

declare -a apps=("web")
if [[ $1 != "packages" ]] && [[ ! " ${apps[*]} " =~ " ${1} " ]]
then
    echo "First argument of the script should either be \"packages\" or the name of any directory in apps/"
    exit 2
fi

if [[ -z $NPM_AUTH_TOKEN ]]
then
    echo "NPM_AUTH_TOKEN is undefined"
    exit 3
fi

cd ../..

if [[ $1 != "packages" ]]
then
    cd packages
    declare -a packages=("base" "vanilla" "angular" "react" "react-native" "svelte" "vue" "cli") # The order of these items is crucial.
    for i in "${packages[@]}"
    do
        cd "$i"
        yarn build
        yarn publish
        cd ..
    done
    cd ..
elif [[ ! " ${apps[*]} " =~ " ${1} " ]]
then
    cd "apps/$1"
    yarn build
    cd ../..
fi

yarn ts-node ./scripts/src/index.ts updateVersions $1
