#!/bin/bash
#清空hosts文件信息
echo> /etc/hosts
#配置主机的host
echo 172.17.0.1 host >> /etc/hosts
echo 172.17.0.2 master >> /etc/hosts
echo 172.17.0.3 slave1 >> /etc/hosts
echo 172.17.0.4 slave2 >> /etc/hosts

#配置 master 节点的 zookeeper 的 server id
echo 1 > /home/wxk/app/zookeeper-3.4.9/tmp/myid

zkServer.sh start

hadoop-daemons.sh start journalnode
hdfs namenode -format
hdfs zkfc -formatZK

start-dfs.sh
start-yarn.sh
start-all.sh

hadoop fs -mkdir /directory
hadoop fs -mkdir /data
$SPARK_HOME/sbin/start-history-server.sh



