#!/bin/bash
hdfs namenode -bootstrapStandby
/home/wxk/app/hadoop-2.6.0-cdh5.7.0/sbin/hadoop-daemon.sh start namenode

