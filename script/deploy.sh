#!/bin/sh

dir=`echo $(cd $(dirname $0) && pwd)`

source $dir/env.sh

set -eu

# deploy 
rsync -av $dir/../config/ ec2-user@$domain:/var/www/learnReactJS/config
rsync --exclude-from $dir/.rsyncignore -av $dir/../client/dist/* ec2-user@$domain:/var/www/learnReactJS/public
rsync -av $dir/../server/ ec2-user@$domain:/var/www/learnReactJS/server
