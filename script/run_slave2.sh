#!/bin/bash
#清空hosts文件信息
echo> /etc/hosts
#配置主机的host
echo 172.17.0.1 host >> /etc/hosts
echo 172.17.0.2 master >> /etc/hosts
echo 172.17.0.3 slave1 >> /etc/hosts
echo 172.17.0.4 slave2 >> /etc/hosts
     
#配置 master 节点的 zookeeper 的 server id
echo 3 > /home/wxk/app/zookeeper-3.4.9/tmp/myid
     
zkServer.sh start
