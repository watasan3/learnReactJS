#!/bin/sh

dir=`echo $(cd $(dirname $0) && pwd)`

source $dir/env.sh

set -eu

# deploy 
rsync -av config/ ec2-user@$domain:/var/www/meetdep/config
rsync --exclude-from $dir/.rsyncignore -av client/dist/* ec2-user@$domain:/var/www/meetdep/public
rsync -av server/ ec2-user@$domain:/var/www/meetdep/server
