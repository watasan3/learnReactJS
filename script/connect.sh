#!/bin/sh
dir=`echo $(cd $(dirname $0) && pwd)`

source $dir/env.sh
ssh -i ~/amazonEC2.pem ec2-user@$ip
