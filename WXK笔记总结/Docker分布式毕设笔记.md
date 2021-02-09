Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。

# 一、在Docker中安装ubuntu系统
下载ubuntu系统，默认是最新的
docker pull ubuntu
使用docker images命令可以查看下载的镜像：

#运行最后一个镜像
docker run -ti ubuntu:15.10   
#运行第一个镜像
docker run -ti ubuntu:sparkmysql_secure_installation
注意：进入容器之后，想要容器后台运行而不结束容器，可以使用Crl+P+Q退出

# 二、在ubuntu系统中安装必要的工具
接下来是安装集群了，包括zookeeper、hadoop、spark.
接下来的工作可能会用到如下命令：
wget http://... ，用于下载资源文件
ifconfig 用于查看当前容器ip信息
vim 用于编辑文件
所以我们在这里可以先进行安装这些工具:
$ apt update
$ apt install wget
$ apt install vim
$ apt install net-tools       # ifconfig 
$ apt install iputils-ping     # ping
都安装好后，可以将此装好环境变量的镜像保存为一个副本，以后可以基于此副本构建其它镜像：容器的id就是我们刚才退出的那个容器，可以使用命令docker ps查看所有运行的容器的信息
docker commit -m "wget vim net-tools iputils-ping install" 容器ID ubuntu:v1

# 三、下载jdk、Zookeeper、 Hadoop、Spark、Scala
下载集群资源
我们计划将集群的 Zookeeper、Hadoop、Spark 安装到统一的目录 /root/soft/apache下。
所以在这里我们要先构建这个目录：
$ cd ~/
$ mkdir app
$ maker software
$ mkdir source
$ mkdir maven_repository
$ mkdir script

或者 用cp命令

docker cp /home/wxk/app cf28ae654efb:/root/

# 四、安装、配置Zookeeper、 Hadoop、Spark、Scala 。python java

## jdk1.8
tar -zxvf jdk-8u231-linux-x64.tar.gz  -C ~/app/

配置环境变量
vim ~/.bashrc (ubuntu vim ~/.bashrc)
export JAVA_HOME=/root/app/jdk1.8.0_231
export PATH=$JAVA_HOME/bin:$PATH
source ~/.bashrc(ubuntu source ~/.profile)

## scala2.11.8

tar -zxvf scala-2.11.8.tgz  -C ~/app
配置环境变量
vim ~/.bashrc
export SCALA_HOME=/root/app/scala-2.11.8
export PATH=$SCALA_HOME/bin:$PATH
source ~/.bashrc

                                    maven3.3.9
tar -zxvf apache-maven-3.3.9-bin.tar.gz -C ~/app/
配置环境变量
vim ~/.bashrc
export MAVEN_HOME=/root/app/apache-maven-3.3.9
export PATH=$MAVEN_HOME/bin:$PATH
source ~/.bashrc

                                               修改maven配置
mkdir ~/maven_repository
vim $MAVEN_HOME/conf/settings.xml
  <localRepository>/root/maven_repository</localRepository>

                                                  添加maven阿里云仓库
在setttins.xml文件中找到<mirrors></mirrors>标签对,进行修改：

<mirrors>
      <mirror>
         <id>nexus-aliyun</id>
         <mirrorOf>*</mirrorOf>
         <name>Nexus aliyun</name>
         <url>http://maven.aliyun.com/nexus/content/groups/public</url>
      </mirror> 
</mirrors>

                                                       安装python3.6.5
cd ~/software/
wget https://www.python.org/ftp/python/3.6.5/Python-3.6.5.tgz
tar -zxvf Python-3.6.5.tgz
配置环境变量
--编译前安装依赖，python依赖安装

yum -y install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel

cd Python-3.6.5/

./configure --prefix=/root/app/python3

make && make install

cd /root/app/python3/bin
pwd
--配置环境变量
vi ~/.bashrc
export PATH=/root/app/python3/bin:$PATH
source ~/.bashrc




安装 Zookeeper
下载 zookeeper

然后到这里下载 zookeeper 到 /root/software 目录下, 我这里下载的是 zookeeper-3.4.9

    $ cd /root/software
    $	wget http://archive.apache.org/dist/zookeeper/zookeeper-3.4.9/zookeeper-3.4.9.tar.gz


tar -zxvf zookeeper-3.4.9.tar.gz -C ~/app


修改 ~/.bashrc, 配置 zookeeper 环境变量

    $ vim ~/.bashrc 
       export ZOOKEEPER_HOME=/root/app/zookeeper-3.4.9
       export PATH=$PATH:$ZOOKEEPER_HOME/bin
$ source ~/.bashrc #使环境变量生效

修改 zookeeper 配置信息：
 cd ~/app/zookeeper-3.4.9/conf/
cp zoo_sample.cfg zoo.cfg
vim zoo.cfg

修改如下信息：

    dataDir=/root/app/zookeeper-3.4.9/tmp
    server.1=master:2888:3888
    server.2=slave1:2888:3888
    server.3=slave2:2888:3888


接下来添加 myid 文件

    $ cd ../
    $ mkdir tmp
    $ cd tmp
    $ touch myid
    $ echo 1 > myid

..../tmp/myid 文件中保存的数字代表本机的zkServer编号 在此设置master为编号为1的zkServer，之后生成slave1和slave2之后还需要分别修改此文件


安装 Hadoop
    修改 ~/.bashrc, 配置 hadoop 环境变量

    $ vim ~/.bashrc
         export HADOOP_HOME=/root/app/hadoop-2.6.0-cdh5.7.0
         export HADOOP_CONFIG_HOME=$HADOOP_HOME/etc/hadoop
         export PATH=$PATH:$HADOOP_HOME/bin
         export PATH=$PATH:$HADOOP_HOME/sbin
       # 保存退出 esc :wq!
    $ source ~/.bashrc #使环境变量生效





配置 hadoop


    vim hadoop-env.sh
export JAVA_HOME=/root/app/jdk1.8.0_231

进入 `hadoop` 配置文件的目录，因为 `hadoop` 所有的配置都在此目录下
$ cd $HADOOP_CONFIG_HOME/

修改核心配置 core-site.xml, 添加如下信息到此文件的< configuration > </configuration > 中间
vim core-site.xml
    <configuration>
        <property>
             <name>hadoop.tmp.dir</name>
             <value>/root/app/hadoop-2.6.0-cdh5.7.0/tmp</value>
             <description>A base for other temporary directories.</description>
         </property>
         <property>
             <name>fs.default.name</name>
             <value>hdfs://master:9000</value>
             <final>true</final>
             <description>The name of the default file system.  A URI whose scheme and authority determine the FileSystem implementation.  The uri's scheme determines the config property (fs.SCHEME.impl) naming the FileSystem implementation class.  The uri's authority is used to determine the host, port, etc. for a filesystem.</description>
          </property>
          <property>
                        <name>ha.zookeeper.quorum</name>
                        <value>master:2181,slave1:2181,slave2:2181</value>
            </property>
    </configuration>

修改 vim hdfs-site.xml, 添加如下信息：

    # dfs.nameservices 名称服务，在基于HA的HDFS中，用名称服务来表示当前活动的NameNode
    # dfs.ha.namenodes. 配置名称服务下有哪些NameNode 
    # dfs.namenode.rpc-address.. 配置NameNode远程调用地址 
    # dfs.namenode.http-address.. 配置NameNode浏览器访问地址 
    # dfs.namenode.shared.edits.dir 配置名称服务对应的JournalNode 
    # dfs.journalnode.edits.dir JournalNode存储数据的路径
     
    <configuration>
    <property>
       <name>dfs.nameservices</name>
       <value>ns1</value>
    </property>
    <property>
       <name>dfs.ha.namenodes.ns1</name>
       <value>nn1,nn2</value>
    </property>
    <property>
       <name>dfs.namenode.rpc-address.ns1.nn1</name>
       <value>master:9000</value>
    </property>
    <property>
       <name>dfs.namenode.http-address.ns1.nn1</name>
       <value>master:50070</value>
    </property>
    <property>
       <name>dfs.namenode.rpc-address.ns1.nn2</name>
       <value>slave1:9000</value>
    </property>
    <property>
       <name>dfs.namenode.http-address.ns1.nn2</name>
       <value>slave1:50070</value>
    </property>
    <property>
       <name>dfs.namenode.shared.edits.dir</name>
    <value>qjournal://master:8485;slave1:8485;slave2:8485/ns1</value>
    </property>
    <property>
       <name>dfs.journalnode.edits.dir</name>
       <value>/root/app/hadoop-2.6.0-cdh5.7.0/journal</value>
    </property>
    <property>
       <name>dfs.ha.automatic-failover.enabled</name>
       <value>true</value>
    </property>
    <property>
       <name>dfs.client.failover.proxy.provider.ns1</name>
       <value>
       org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider
       </value>
    </property>
    <property>
       <name>dfs.ha.fencing.methods</name>
       <value>
       sshfence
       shell(/bin/true)
       </value>
    </property>
    <property>
       <name>dfs.ha.fencing.ssh.private-key-files</name>
       <value>/root/.ssh/id_rsa</value>
    </property>
    <property>
       <name>dfs.ha.fencing.ssh.connect-timeout</name>
       <value>30000</value>
    </property>
     <property>
                        <name>ha.zookeeper.quorum</name>
                        <value>master:2181,slave1:2181,slave2:2181</value>
     </property>
    </configuration>

修改 Yarn 的配置文件vim yarn-site.xml：

    # yarn.resourcemanager.hostname RescourceManager的地址，NodeManager的地址在slaves文件中定义
     
    <configuration>
    <!-- Site specific YARN configuration properties -->
    <property>
       <name>yarn.resourcemanager.hostname</name>
       <value>master</value>
    </property>
    <property>
       <name>yarn.nodemanager.aux-services</name>
       <value>mapreduce_shuffle</value>
    </property>
    </configuration>

修改 mapred-site.xml
这个文件是不存在的，需要将 mapred-site.xml.template copy一份

$ cp mapred-site.xml.template mapred-site.xml

然后编辑 vim mapred-site.xml ，添加如下信息到文件

    <configuration>
    <!-- 指定MapReduce框架为yarn方式 -->
    <property>
        <name>
          mapreduce.framework.name
        </name>
        <value>yarn</value>
    </property>
    </configuration>

修改指定 DataNode 和 NodeManager 的配置文件 slaves :

$ vim slaves

添加如下节点名

    master
    slave1
    slave2


    安装配置 Spark

进入 spark 目录，


修改 ~/.bashrc, 配置 spark 环境变量

    $ vim ~/.bashrc
        export SPARK_HOME=/root/app/spark-2.3.0-bin-2.6.0-cdh5.7.0
        export PYSPARK_PYTHON=/root/app/python3/bin/python3.6
        export PATH=$SPARK_HOME/bin:$SPARK_HOME/sbin:$PATH
       # 保存退出 esc :wq!
    $ source ~/.bashrc #使环境变量生效

修改 spark 配置

    $ cd spark-2.3.0-bin-2.6.0-cdh5.7.0/conf
    $ cp spark-env.sh.template spark-env.sh
    $ vim spark-env.sh

添加如下信息：

     SPARK_MASTER_IP=master
     SPARK_WORKER_MEMORY=128m
     JAVA_HOME=/root/app/jdk1.8.0_231
     SCALA_HOME=/root/app/scala-2.11.8  # scala我们后面会安装它
     SPARK_HOME=/root/app/spark-2.3.0-bin-2.6.0-cdh5.7.0
     HADOOP_CONF_DIR=/root/app/hadoop-2.6.0-cdh5.7.0/etc/hadoop 
     SPARK_HISTORY_OPTS="-Dspark.history.fs.logDirectory=hdfs://master:9000/directory"
     SPARK_LIBRARY_PATH=$SPARK_HOME/lib
     SCALA_LIBRARY_PATH=$SPARK_LIBRARY_PATH
     SPARK_WORKER_CORES=1
     SPARK_WORKER_INSTANCES=1
     SPARK_MASTER_PORT=7077

保存退出 esc :wq!

修改指定Worker的配置文件 slaves：

$ vim slaves

添加

    master
    slave1
    slave2

到这里，Spark 也算安装配置完成了。




    安装 SSH, 配置无密码访问集群其它机器

搭建集群环境，自然少不了使用SSH。这可以实现无密码访问，访问集群机器的时候很方便。
使用如下命令安装 ssh

apt install ssh 

SSH装好了以后，由于我们是 Docker 容器中运行，所以 SSH 服务不会自动启动。需要我们在容器启动以后，手动通过/usr/sbin/sshd 手动打开SSH服务。未免有些麻烦，为了方便，我们把这个命令加入到~/.bashrc文件中。通过vim ~/.bashrc编辑.bashrc文件,

vim ~/.bashrc

在文件后追加下面内容：

    #autorun
    /usr/sbin/sshd

然后运行 source ~/.bashrc 使配置生效

$ source ~/.bashrc

此过程可能会报错:
Missing privilege separation directory: /var/run/sshd 需要自己创建这个目录

$ mkdir /var/run/sshd

生成访问密钥

    $ cd ~/
    $ ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
    $ cd .ssh
    $ cat id_rsa.pub >> authorized_keys

注意： 这里，我的思路是直接将密钥生成后写入镜像，免得在买个容器里面再单独生成一次，还要相互拷贝公钥，比较麻烦。当然这只是学习使用，实际操作时，应该不会这么搞，因为这样所有容器的密钥都是一样的！！！

到这里，SSH 也算安装配置完成了
到这里，Spark 集群算是基本安装配置好了，剩下就是部署分布式了。

 

这里我们将安装好Zookeeper、 Hadopp、 Spark、Scala 的镜像保存为一个副本

    退出 Docker

$ exit 

    保存一个副本
$docker commit -m "zookeeper hadoop pyspark scala python java install" 容器ID ubuntu:spark

之后我们会基于此副本来运行我们的集群



五、启动集群

首先我们对三个终端进行分别验证IP规则，在此之前需要关闭docker中所有正在运行的容器：

终端 1:

    $ docker run -ti -h master ubuntu:spark
    $ ifconfig #172.17.0.2

终端 2:

    $ docker run -ti -h slave1 ubuntu:sparksoft
    
    $ docker run -ti -h slave2 ubuntu:spark
    $ ifconfig #172.17.0.4

看到了没，这3个Docker的 ip 分别是172.17.0.2、 172.17.0.3 、172.17.0.4，它是取决于启动Docker 的顺序的。
接下来退出这几个Docker，然后编写启动脚本

 

编写集群节点启动脚本
启动 ubuntu:spark

$ docker run -ti ubuntu:spark

进入 /root/soft 目录，我们将启动脚本都放这里吧

    $ cd /root/soft
    $ mkdir shell
    $ cd shell

vim run_master.sh 创建 Master 节点的运行脚本

$ vim run_master.sh 

添加如下信息：

#!/bin/bash
#清空hosts文件信息
echo> /etc/hosts
#配置主机的host
echo 172.17.0.1 host >> /etc/hosts
echo 172.17.0.2 master >> /etc/hosts
echo 172.17.0.3 slave1 >> /etc/hosts
echo 172.17.0.4 slave2 >> /etc/hosts

#配置 master 节点的 zookeeper 的 server id
echo 1 > /root/app/zookeeper-3.4.9/tmp/myid

zkServer.sh start

hadoop-daemons.sh start journalnode
hdfs namenode -format
hdfs zkfc -formatZK

start-dfs.sh
start-yarn.sh
start-all.sh


​     

vim run_slave1.sh 创建 Slave1 节点的运行脚本

$ vim run_slave1.sh 

添加如下信息：

#!/bin/bash
#清空hosts文件信息
echo> /etc/hosts
#配置主机的host
echo 172.17.0.1 host >> /etc/hosts
echo 172.17.0.2 master >> /etc/hosts
echo 172.17.0.3 slave1 >> /etc/hosts
echo 172.17.0.4 slave2 >> /etc/hosts
     
#配置 master 节点的 zookeeper 的 server id
echo 2 > /root/app/zookeeper-3.4.9/tmp/myid
     
zkServer.sh start



    vim run_slave2.sh 创建 Slave2 节点的运行脚本

$ vim run_slave2.sh 

添加如下信息：

#!/bin/bash
#清空hosts文件信息
echo> /etc/hosts
#配置主机的host
echo 172.17.0.1 host >> /etc/hosts
echo 172.17.0.2 master >> /etc/hosts
echo 172.17.0.3 slave1 >> /etc/hosts
echo 172.17.0.4 slave2 >> /etc/hosts
     
#配置 master 节点的 zookeeper 的 server id
echo 3 > /root/app/zookeeper-3.4.9/tmp/myid
     
zkServer.sh start



    vim stop_master.sh 创建 Stop 脚本

$ vim stop_master.sh 

添加如下信息：


#!/bin/bash
zkServer.sh stop
hadoop-daemons.sh stop journalnode
stop-dfs.sh
stop-yarn.sh
stop-all.sh

各节点运行脚本到此编写完成。

    最后
    
    chmod +x run_master.sh
    chmod +x run_slave1.sh
    chmod +x run_slave2.sh
    chmod +x stop_master.sh
    
    退出 Docker, 并保存副本

$ exit

    保存副本

$ docker commit -m "zookeeper hadoop spark scala install" 容器ID ubuntu:spark

    配置虚拟机 ubuntu 的 hosts

$ sudo vim /etc/hosts

注意：添加如下hosts，不然远程访问肯定会出错的

172.17.0.1      host
172.17.0.2      master
172.17.0.3      slave1
172.17.0.4      slave2

# 开启你的Spark集群吧！！！

(------------------备用选项
启动master：







    $  docker run --privileged -itd --name=master -h master ubuntu:spark /sbin/init 
    $ ./root/app/shell/run_master.sh

启动slave1：

    启动 Slave1 节点
    $ docker run --privileged -itd --name=slave1 -h slave1 ubuntu:spark /sbin/init
    运行 run_slave1.sh 启动脚本
    $ ./root/app/shell/run_slave1.sh

启动slave2：

    启动 Slave2 节点
    $ docker run --privileged -itd --name=slave2 -h slave2 ubuntu:spark /sbin/init
    运行 run_slave2.sh 启动脚本
    $ ./root/app/shell/run_slave2.sh

切换到master终端：(在这之前先 ssh master   ssh slave1   ssh slave2   不然会链接失败)

    root@master:hadoop-daemons.sh start journalnode
    选择master机器来格式化hdfs
    root@master:hdfs namenode -format
    root@master:hadoop-daemon.sh start namenode

再另外一台namenode机器上拉取元数据

root@slave1:hdfs namenode -bootstrapStandby

格式化

root@master:hdfs zkfc -formatZK

启动：

root@master:start-dfs.sh

访问hdfs的管理页面试试：

备用选项------------------------------  )

启动 Spark 集群

    启动 Master 节点
    
    $ docker run --privileged -itd --name=master -h master ubuntu:spark /sbin/init 
    
    在这里先不要着急着运行 run_master.sh 启动脚本。等最后再运行
    
    启动 Slave1 节点
    
    $ docker run --privileged -itd --name=slave1 -h slave1 ubuntu:spark /sbin/init 
    
    运行 run_slave1.sh 启动脚本
    
    $ ./root/app/shell/run_slave1.sh
    
    启动 Slave2 节点
    
    $ docker run --privileged -itd --name=slave2 -h slave2 ubuntu:spark /sbin/init 
    
    运行 run_slave2.sh 启动脚本
    
    $ ./root/app/shell/run_slave2.sh
    
    最后再运行 Master 节点的启动脚本 run_master.sh
    
    切换到启动了 Master 节点的 Docker 终端
    
    $ ./root/app/shell/run_master.sh
    
    可以使用 jps 命令查看当前集群运行情况
    
    $ jps
    
    不出意外的话，你应该能看到类似如下信息：
    
        2081 QuorumPeerMain
        3011 NodeManager
        2900 ResourceManager
        2165 JournalNode
        2405 NameNode
        3159 Worker
        2503 DataNode
        3207 Jps

到此已经启动了你的 Spark 集群了。

    还可以登录web管理台来查看运行状况：
    
          服务        地址
         HDFS    master:50070
         Yarn      master:8088
         Spark    master:8080


Spark Core调优
一、优化之HistoryServer配置及使用
参考网址
spark-submit --master local[2] --name spark0301 /root/app/script/spark0301.py 


•设置
 cd $SPARK_HOME/conf
vi spark-defaults.conf
 spark.eventLog.enabled           true                                
spark.eventLog.dir               hdfs://master:9000/directory 


 vi spark-env.sh
 SPARK_HISTORY_OPTS="-Dspark.history.fs.logDirectory=hdfs://master:9000/directory "


 hadoop fs -mkdir /directory(后续集成进run_master脚本)

•启动
 cd $SPARK_HOME/sbin
./start-history-server.sh((后续集成进run_master脚本))
•访问
 http://master:18080


•测试
spark-submit --master local[2] --name spark0301 /root/app/script/spark0301.py 

./spark-submit --master yarn --name spark-yarn /root/app/script/spark0402.py hdfs://master:9000/hello.txt hdfs://master:9000/wc/output




Spark运行可能会出现ImportError: libffi.so.6: cannot open shared object file: no such file or directory 错误
解决方法参考 https://blog.csdn.net/qq_33317126/article/details/108388332

Ubuntu系统升级并不只是升级系统，同时也会将一些系统的lib文件和依赖文件也升级，所以在Ubuntu18.04下的libffi.so.6就升级成为了20.04版本下的libffi.so.7，所以其实文件是有的。找到文件就好办了，创建一个名为libffi.so.6的软连接指向libffi.so.7就可以使用了。

所以可以先使用find命令找到libffi.so.7在哪儿：

find /usr/lib -name "libffi.so*"

接下来就是创建软连接：

 ln -s /usr/lib/x86_64-linux-gnu/libffi.so.7 /usr/lib/x86_64-linux-gnu/libffi.so.6



•关闭
cd $SPARK_HOME/sbin
./stop-history-server.sh

保存一个副本
$docker commit -m "zookeeper hadoop pyspark scala python java spark-historyserver install" 容器ID ubuntu:spark




六、向hdfs中上传文件
hadoop fs -put zookeeper.out /
2.txt是我要上传的文件，one.py是测试程序

one.py


    # from hdfs import InsecureClient
     
    c = InsecureClient(url="http://172.17.0.2:50070",user='root',root='/')
    c.makedirs('/user/root/pyhdfs')
    c.upload('/user/root/pyhdfs/', './2.txt', True)

如果没有报错，那就说明没问题了，在Utilities中就能看得到我们上传的文件

七、遇到的问题以及解决方法

问题一：两台namenode都是Standby状态，此状态是不能够被远程访问上传文件的，节点必须处于active状态。

查看两台机器的状态

    root@master:/# hdfs haadmin -getServiceState nn1
    standby
    root@master:/# hdfs haadmin -getServiceState nn2
    standby

将master激活态

root@master:/# hdfs haadmin -transitionToActive --forcemanual nn1

或者可以切换两台机器的状态，只能有一个机器是active状态：

    root@master:/# hdfs haadmin -transitionToStandby --forcemanual nn2
    root@master:/# hdfs haadmin -transitionToActive --forcemanual nn1

问题二：Cluster IDs not matched: dn cid=CID-a7a5843e-9c9f-4367-9d6c-246196ccd64e but ns cid=CID-f8d26769-ddea-4ce4-b02e-df4fc23c6204; bpid=BP-1438331429-172.17.0.2-1580539601133

这是因为重复格式化namenode造成的，只需要格式化一个namenode，然后另外一个拉取元数据就可以了，运行集群的顺序要和上面的一致。

为题三：

Traceback (most recent call last):

  File "one.py", line 5, in <module>

    c.upload('/user/root/pyhdfs/3.txt', './2.txt', True)

  File "/usr/lib/python2.7/site-packages/hdfs/client.py", line 611, in upload

    raise err

urllib3.exceptions.NewConnectionError: <urllib3.connection.HTTPConnection object at 0x135df90>: Failed to establish a new connection: [Errno -2] Name or service not known

/etc/hosts

 

Operation failed: End of File Exception between local host is: "master/172.17.0.2"; destination host is: "master":

这是因为没改本地的hosts文件，按照上面的方法在本地的hosts中追加一些ip即可

原来：

修改后：

    172.17.0.1      host
    172.17.0.2      master
    172.17.0.3      slave1
    172.17.0.4      slave2

 







## yarn运行模式详解

[网址](http://spark.apache.org/docs/latest/running-on-yarn.html)

```
yarn
	mapreduce yarn
	spark on yarn 70%
	spark作为客户端而已，他需要做的事情就是提交作业到yarn上去执行
	yarn vs standalone
		yarn： 你只需要一个节点，然后提交作业即可   这个是不需要spark集群的（不需要启动master和worker的）
		standalone：你的spark集群上每个节点都需要部署spark，然后需要启动spark集群（需要master和worker）


./spark-submit --master yarn --name spark-yarn /root/app/script/spark0402.py hdfs://master:9000/hello.txt hdfs://master:9000/wc/output

When running with master 'yarn' either HADOOP_CONF_DIR or YARN_CONF_DIR must be set in the environment



试想：为什么需要指定HADOOP_CONF_DIR或者YARN_CONF_DIR

如何使得这个信息规避掉
Neither spark.yarn.jars nor spark.yarn.archive is set, falling back to uploading libraries under SPARK_HOME

yarn支持client和cluster模式：driver运行在哪里
	client：提交作业的进程是不能停止的，否则作业就挂了
	cluster：提交完作业，那么提交作业端就可以断开了，因为driver是运行在am里面的


Error: Cluster deploy mode is not applicable to Spark shells

	pyspark/spark-shell : 交互式运行程序  client
	spark-sql

如何查看已经运行完的yarn的日志信息： yarn logs -applicationId <applicationId>
Log aggregation has not completed or is not enabled.
参见：https://coding.imooc.com/class/chapter/128.html#Anchor  JobHistory使用


不管你的spark应用程序运行在哪里，你的spark代码都是一样的，不需要做任何的修改和调整，所以spark使用起来是非常方便的！！！！！！
```



+ 配置

```
cd $SPARK_HOME/conf
cp spark-env.sh.template spark-env.sh
vi spark-env.sh
```

```
JAVA_HOME=/home/wxk/app/jdk1.8.0_152                           
HADOOP_CONF_DIR=/root/app/hadoop-2.6.0-cdh5.7.0/etc/hadoop 
```

![1570353192251](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1570353192251.png)

> hadoop配置文件均在该文件`/home/jungle/app/hadoop-2.6.0-cdh5.7.0/etc/hadoop`下

+ 提交

  ```
  spark-submit --master yarn --name spark-yarn /root/app/script/spark0402.py hdfs://master:9000/hello.txt hdfs://master:9000/wc/output
  ```

  




# SparkSQL测试

```SPARQL
df = spark.read.json("file:///root/app/spark-2.3.0-bin-2.6.0-cdh5.7.0/examples/src/main/resources/people.json")

df.show()
```



# SparkStreaming 测试

==服务器上运行==

Linux 系统默认没有安装 nc，可以用下面的方法安装：

```javascript
# centos
yum install nc
# ubuntu
apt-get install netcat
```

```
nc -lk 9999
容器上好像要用 nc -lp 9999
```

![1570879560288](./picture/1570879560288.png)

```
cd $SPARK_HOME
./bin/spark-submit examples/src/main/python/streaming/network_wordcount.py localhost 9999
```

> master:4040

![1570879269887](./picture/1570879269887.png)





#  Azkaban基础篇

[参考网址]( https://azkaban.github.io/ )

1. 

   ```
   Azkaban编译：万世开头难，务必要保证你的网络速度不错
   	1） 去github上下载源码包
   	2） ./gradlew build installDist
   	3） 建议搭建先去下载gradle-4.1-all.zip 然后整合到azkaban源码中来，避免在编译的过程中去网络上下载，导致编译速度非常慢
   	4） 编译成功之后，去对应的目录下找到对应模式的安装包即可
   ```


## 八、 Azkaban solo server环境部署

```
Azkaban环境搭建
	1) 解压编译后的安装包到~/app
	2）启动azkaban   $AZKABAN_HOME/bin/azkaban-solo-start.sh
		验证：jps  AzkabanSingleServer
		ip:8081(可以在azkaban.properties中修改)

```

---



```
cd /root/app/azkaban-3.43.0
```

```
cd /root/app/azkaban-3.43.0/azkaban-solo-server-0.1.0-SNAPSHOT/conf
vim azkaban-users.xml (在里面可以增加账户)

cd /root/app/azkaban-solo-server-0.1.0-SNAPSHOT
```

```
./bin/azkaban-solo-start.sh
```

==报错==

> Cannot find 'database.properties' file

 **<u>解决方案是：(最好的解决方法在bin的上级目录运行 bin/azkaban-solo-start.sh   不能进入bin里用sh,应为shell没写得好)</u>** 

```
cd conf
```

 在azkaban.properties中增加一个配置
database.sql.scripts.dir=/home/jungle/app/azkaban-solo-server-0.1.0-SNAPSHOT/sql
注意，这个配置不能写/home/jungle/app/azkaban-solo-server-0.1.0-SNAPSHOT/sql/azkaban.properties，只能写到 sql ，然后问题就不存在了。 

==报错==

> conf/global.properties (No such file or directory)

```
vi azkaban.properties
```

![1570973789936](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1570973789936.png)

```
executor.global.properties=/home/jungle/app/azkaban-solo-server-0.1.0-SNAPSHOT/conf/global.properties
```

![1570973871089](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1570973871089.png)

==报错==

> java.lang.RuntimeException: java.lang.reflect.InvocationTargetException

```
cd conf
vi azkaban.properties
```

 ![img](https://images2015.cnblogs.com/blog/855959/201707/855959-20170706000233628-684623914.png)  ![img](https://images2015.cnblogs.com/blog/855959/201707/855959-20170706000411550-673796908.png) 

```
jps
```

![1570974851274](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1570974851274.png)

```
UI:http://192.168.1.18:8081/
```

![1570975190784](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1570975190784.png)

增加用户

```
vi azkaban-users.xml
```

```xml
<user password="123456" roles="admin" username="wxk"/>
```

![1570975414346](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1570975414346.png)

==注意==

实在不行，就参考[官网](https://azkaban.readthedocs.io/en/latest/getStarted.html#installing-the-solo-server)的做法

## 九、 Azkaban快速入门案例 

[参考网址](https://azkaban.readthedocs.io/en/latest/createFlows.html#creating-flows)

1. 创建工程  



  创建一个Job

```
# vim foo.job
type=command
command=echo "Hello World"
```

```shell
打成zip包
zip -r foo.zip foo.job

```



[参考网址](https://azkaban.readthedocs.io/en/latest/useAzkaban.html#create-projects)

![1571062492992](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571062492992.png)

![1571062544787](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571062544787.png)

---

2. [创建流](https://azkaban.readthedocs.io/en/latest/createFlows.html#creating-flows)

   ### Step 1:

   Create a simple file called `flow20.project`. Add `azkaban-flow-version` to indicate this is a Flow 2.0 Azkaban project:

   ```
   azkaban-flow-version: 2.0
   ```

   ### Step 2:

   Create another file called `basic.flow`. Add a section called `nodes`, which will contain all the jobs you want to run. You need to specify `name` and `type` for all the jobs. Most jobs will require the `config` section as well. We will talk more about it later. Below is a simple example of a command job.

   ```
   nodes:
     - name: jobA
       type: command
       config:
         command: echo "This is an echoed text."
   ```

   ### Step 3:

   Select the two files you’ve already created and right click to compress them into a zip file called `Archive.zip`. You can also create a new directory with these two files and then `cd` into the new directory and compress: `zip -r Archive.zip .` Please do not zip the new directory directly.

   Make sure you have already created a project on Azkaban ( See [Create Projects](https://azkaban.readthedocs.io/en/latest/useAzkaban.html#createprojects) ). You can then upload Archive.zip to your project through Web UI ( See [Upload Projects](https://azkaban.readthedocs.io/en/latest/useAzkaban.html#uploadprojects) ).

   Now you can click `Execute Flow` to test your first Flow 2.0 Azkaban project!

3. [上传流](https://azkaban.readthedocs.io/en/latest/useAzkaban.html#upload-projects)

   ![1571062926625](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571062926625.png)

Click on the **Upload** button. You will see the following dialog.

 ![1571126240522](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571126240522.png)

Azkaban will validate the contents of the zip to make sure that dependencies are met and that there’s no cyclical dependencies detected. If it finds any invalid flows, the upload will fail.

Uploads overwrite all files in the project. Any changes made to jobs will be wiped out after a new zip file is uploaded.

After a successful upload, you should see all of your flows listed on the screen.

# 第11部分 Azkaban相关使用

##  一、依赖作业在Azkaban中的使用 

[参考网址](https://azkaban.readthedocs.io/en/latest/createFlows.html#job-dependencies)

Jobs can have dependencies on each other. You can use `dependsOn` section to list all the parent jobs. In the below example, after jobA and jobB run successfully, jobC will start to run.

```
nodes:
  - name: jobC
    type: noop
    # jobC depends on jobA and jobB
    dependsOn:
      - jobA
      - jobB

  - name: jobA
    type: command
    config:
      command: echo "This is an echoed text."

  - name: jobB
    type: command
    config:
      command: pwd
```

You can zip the new `basic.flow` and `flow20.project` again and then upload to Azkaban. Try to execute the flow and see the difference.

1. 新建依赖项目

   ```
   # vim bar.job
   type=command
   dependencies=foo
   command=echo bar
   ```

   ```shell
   zip -r dependencies.zip foo.job bar.job
   ```

   

   

   

   ![1571127139290](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571127139290.png)

2. 上传zip包

   ![1571127289506](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571127289506.png)

## 二、 HDFS作业在Azkaban中的使用 

```
hadoop fs -mkdir /azkaban1
hadoop fs -mkdir /azkaban2
hadoop fs -ls /
```

![1571127789177](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571127789177.png)

1. job

   --hadoop.flow

   ```
   nodes:
     - name: jobA
       type: command
       # jobC depends on jobA and jobB
       config:
         command: /home/jungle/app/hadoop-2.6.0-cdh5.7.0/bin/hadoop fs -ls /
   
   ```

2. 新建项目

   ![1571128130255](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571128130255.png)

3. 上传zip包

   ![1571128358330](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571128358330.png)

4. 运行结果

   ![1571128491147](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571128491147.png)

## 三、 MapReduce作业在Azkaban中的使用 

--mr_pi.flow

```
nodes:
  - name: jobA
    type: command
    config:
      command: hadoop jar /home/jungle/app/hadoop-2.6.0-cdh5.7.0/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0-cdh5.7.0.jar pi 2 3

```

--mr_wc.flow

```
nodes:
  - name: jobA
    type: command
    config:
    # /hello.txt /az/wc是hdfs上的目录
      command: hadoop jar /home/jungle/app/hadoop-2.6.0-cdh5.7.0/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0-cdh5.7.0.jar wordcount /hello.txt /az/wc

```

==在线修改==

![1571130094586](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571130094586.png)

![1571130116335](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571130116335.png)

> 也可以通过web界面查看： http://192.168.1.18:8088/cluster 

## 四、 Hive作业在Azkaban中的使用 

1. 启动hive

   ```
   hive
   ```

   ![1571130642544](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571130642544.png)

   ```
   create table emp(
   empno int, ename string, job string,
   mgr int, hiredate string, sal double,
   comm double, deptno int
   )row format delimited fields terminated by '\t';
   ```

![1571131142612](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571131142612.png)

```
# 加载数据到表
load data local inpath '/home/jungle/data/emp.txt' overwrite into table emp
```



```
select * from emp;
```

![1571131328171](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571131328171.png)

```
select deptno,count(1) from emp group by deptno;
```

![1571136782946](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571136782946.png)

---

+ azkaban上执行hive指令

  ==方法一==

```
vi test.sql
```

```
select deptno,count(1) from emp group by deptno;
```

![1571136811983](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571136811983.png)

--hive.flow

```
nodes:
  - name: jobA
    type: command
    config:
      command: hive -f /home/jungle/sql/test.sql

```

==方法二==

--hive.flow

```
nodes:
  - name: jobA
    type: command
    config:
      command: hive -f "test.sql"
```

> 把test.sql也打入zip包

![1571137463903](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571137463903.png)



## 五、 定时调度作业在Azkaban中的使用 

### 1.启动定时任务

![1571140449340](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571140449340.png)

![1571140528715](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571140528715.png)

![1571140564369](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571140564369.png)

### 2.删除定时任务

![1571140627894](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571140627894.png)

## 六、 邮件告警及SLA在Azkaban中的使用 

[参考网址](https://azkaban.readthedocs.io/en/latest/useAzkaban.html#email-overrides)

![1571141771248](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571141771248.png)

```
cd /home/jungle/source/azkaban/azkaban-solo-server/build/install/azkaban-solo-server/conf
```

```
vi azkaban.properties
```

![1571142364373](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571142364373.png)

+ SLA

```
SLA：Service-Level Agreement的缩写，意思是服务等级协议。
SLA：某个作业必须要在某个时间范围内要执行完成
	互联网公司
	99.99% 
	99.999%
	99.9%
```

![1571141805114](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571141805114.png)

![1571141851836](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/1571141851836.png)



# 容器安装MariaDB

​	eytool -keystore keystore -alias jetty -genkey -keyalg RSAeytool -keystore keystore -alias jetty -genkey -keyalg RSA这里有个大坑：出现（ERROR 2002 (HY000): Can’t connect to local MySQL server through socket  ‘/var/run/mysqld/mysqld.sock’ (2 “No such file or directory”)）

解决方法:应为容器内mysql服务没有启动，容器无法执行systemctl命令，无法启动，所以要给容器提权添加 --privileged 参数，并将 cmd 或者 entrypoint 设置为 /usr/sbin/init

```docker run --privileged -itd --name=master  8f82d6c713aa /sbin/init 
docker run --privileged -itd --name=master -h master ubuntu:spark /sbin/init 
docker run --privileged -itd --name=slave1 -h slave1 ubuntu:spark /sbin/init

docker run --privileged -itd --name=slave2 -h slave2 ubuntu:spark /sbin/init


```



MariaDB 是一个开源的关系型数据库管理系统，向后兼容，可替代 MySQL。本文将会讲解如何在 Ubuntu 20.04 上安装和维护 MariaDB。

## 一、前提条件

你需要拥有 Ubuntu 服务器的管理权限，或者以 root 身份 或者以拥有 sudo 权限的用户身份登录系统。

Ubuntu 软件源仓库中的 MariaDB 最新版是 10.3，可以运行下面的命令进行安装：

```
sudo apt update
sudo apt install mariadb-server
```

安装完成后 ，MariaDB 服务将会自动启动。输入以下命令验证数据库服务器是否正在运行：

```
sudo systemctl status mariadb
```

输出结果将会显示服务已经启用，并且正在运行：

```
...
```

假如没在运行：

systemctl start mariadb
systemctl enable mariadb

## 三、维护 MariaDB

MariaDB 服务器有一个脚本叫做`mysql_secure_installation`，通过它你可以很容易提高数据库服务器的安全性。
不带参数运行脚本：

```
sudo mysql_secure_installation
```

根据脚本提示输入 root 密码：

```
Enter current password for root (enter for none):
```

由于没有设置 root 密码，所以这里仅仅输入回车"Enter"即可。
接下来，会提示是否为 MySQL root 用户设置密码：

```
Set root password? [Y/n] n
```

输入`n`。在 Ubuntu 上， MariaDB 用户默认使用`auth_socket`进行鉴权。这个插件会检查启动客户端的本地系统用户是否和指定的 MariaDB 用户名相匹配。
下一步，系统会要求移除匿名用户，限制 root 用户访问本地机器，移除测试数据库，并且重新加载权限表。如下所示，你只需要输入`Y`：

```
Remove anonymous users? [Y/n] Y
Disallow root login remotely? [Y/n] Y
Remove test database and access to it? [Y/n] Y
Reload privilege tables now? [Y/n] Y
```



## 四、以 root 身份登录

如果想要在终端命令行和 MariaDB 服务器进行交互，可以使用`mysql`客户端工具或者`mariadb`。这个工具被作为 MariaDB 服务器软件包的依赖软件被安装。
这个`auth_socket`插件将会通过 Unix socket 文件验证用户来连接`localhost`。这就意味着你不能通过提供密码来验证 root。
想要以 root 用户名登录 MariaDB 服务器，需要输入以下命令：

```
sudo mysql
```

执行成功后会展示 MariaDB shell，如下所示：

```
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 61
Server version: 10.3.22-MariaDB-1ubuntu1 Ubuntu 20.04
Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
MariaDB [(none)]> Bye
```

如果想使用第三方程序（例如 phpMyAdmin），以 root 身份登录你的 MariaDB 服务器，有以下两种方式可以选择。
第一个是将鉴权方法从`auth_socket`修改为`mysql_native_password`。你可以通过运行下面的命令实现：

```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'very_strong_password';
FLUSH PRIVILEGES;
```

第二个推荐的方式就是创建一个管理员用户，可以访问所有的数据库：

```
GRANT ALL PRIVILEGES ON *.* TO 'wxk'@'localhost' IDENTIFIED BY '123456';
```







# 第12部分 Azkaban进阶

##  一、Multi Executor Serve

[参考网址](https://azkaban.readthedocs.io/en/latest/getStarted.html#getting-started-with-the-multi-executor-server)

### 1.[Database setup](https://azkaban.readthedocs.io/en/latest/getStarted.html#database-setup)

```
# 进入mysql
mysql -uroot -p -h192.168.1.18 -P9906
```

```
# 建库
 CREATE DATABASE azkaban;
 
```

```
# 创建用户
 CREATE USER 'azkaban'@'%' IDENTIFIED BY 'azkaban';
```

```
# 为用户赋予权限
GRANT SELECT,INSERT,UPDATE,DELETE ON azkaban.* to 'azkaban'@'%' WITH GRANT OPTION;
```

```
# 刷新权限
flush privileges;
```

+ Create the Azkaban Tables 

  ```
  cd /root/app/azkaban-3.43.0/azkaban-db-0.1.0-SNAPSHOT
  ll
  ```

  ![image-20191026210004647](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/image-20191026210004647.png)

  数据库导入sql语句

  ```
  use azkaban;
  
  ```

source /root/app/azkaban-3.43.0/azkaban-db-0.1.0-SNAPSHOT/create-all-sql-0.1.0-SNAPSHOT.sql



![image-20191026210033558](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/image-20191026210033558.png)

  ```
show tables;
  ```

  ![image-20191026210402288](/home/wxk/PycharmProjects/wxk_pySpark/WXK笔记总结/picture/image-20191026210402288.png)

(5)生成ssl

  ```
cd ~/app
[root@node1 ~]# keytool -keystore keystore -alias jetty -genkey -keyalg RSA
注:密码和最后确认需要输入，其他默认即可。
  ```

(6)设置web‐server

拷贝conf目录和log4j.properties

```
[root@node1 ~]# cp -r ~/app/azkaban-3.43.0/azkaban-solo-server-0.1.0-SNAPSHOT/conf  ~/app/azkaban-3.43.0/azkaban-web-server-0.1.0-SNAPSHOT/
[root@node1 ~]# find ~/app/azkaban-3.43.0 -name 'log4j*'

[root@node1 ~]# vim ~/app/azkaban-3.43.0/azkaban-web-server-0.1.0-SNAPSHOT/conf/azkaban.properties
#需要修改的地方
default.timezone.id=Asia/Shanghai
#database.type=h2
#h2.path=./h2
#h2.create.tables=true
database.type=mysql
mysql.port=3306
mysql.host=localhost
mysql.database=azkaban
mysql.user=azkaban
mysql.password=azkaban
jetty.use.ssl=true
jetty.ssl.port=8443
mysql.numconnections=100
jetty.keystore=/root/app/keystore #keytool生成的keystore路径
jetty.password=123456 #keytool中设置的密码
jetty.keypassword=123456
jetty.truststore=/root/app/keystore
jetty.trustpassword=123456

```

(7)启动web-serrver并验证

```
[root@node1 ~]# cd ~/app/azkaban-3.43.0/azkaban-web-server-0.1.0-SNAPSHOT/
[root@node1 azkaban-web-server-0.1.0-SNAPSHOT]# bin/azkaban-web-start.sh

添加azkaban.native.lib=false 和 execute.as.user=false属性
cd ~/app/azkaban-3.43.0/azkaban-web-server-0.1.0-SNAPSHOT/
[root@node1 azkaban-web-server-0.1.0-SNAPSHOT]# mkdir -p plugins/jobtypes
cd plugins/jobtypes
[root@node1 jobtypes]# vim commonprivate.properties azkaban.native.lib=false
execute.as.user=false

验证:
    jps=>AzkabanWebServer
    webUI=>http://node1:8081/index
出现  Exit with error: ./bin/../conf/log4j.properties file doesn't exist.

解决办法：新建一个配置文件log4j.properties，
如：
vim  ~/app/azkaban-3.43.0/azkaban-web-server-0.1.0-SNAPSHOT/conf/log4j.properties

log4j.rootLogger=INFO,C
log4j.appender.C=org.apache.log4j.ConsoleAppender
log4j.appender.C.layout=org.apache.log4j.PatternLayout
log4j.appender.C.layout.ConversionPattern=%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n

```

(8)从web-server拷贝conf目录、plugins目录并启动executor‐server

```
[root@node1 ~]# cd ~/app/azkaban-3.43.0/azkaban-exec-server-0.1.0-SNAPSHOT/
[root@node1 azkaban-exec-server-0.1.0-SNAPSHOT]# cp -r ~/app/azkaban-3.43.0/azkaban-web-server-0.1.0-SNAPSHOT/conf  ~/app/azkaban-3.43.0/azkaban-exec-server-0.1.0-SNAPSHOT/

cd ~/app/azkaban-3.43.0/azkaban-exec-server-0.1.0-SNAPSHOT/
cp -r ~/app/azkaban-3.43.0/azkaban-web-server-0.1.0-SNAPSHOT/plugins/ .

[root@node1 azkaban-exec-server-0.1.0-SNAPSHOT]# bin/azkaban-executor-start.sh

```



azkaban运行dependency出现错误azkaban.utils.UndefinedPropertyException: Missing required property 'azkaban.native.lib'

```
添加azkaban.native.lib=false 和 execute.as.user=false属性
cd ~/app/azkaban-3.43.0/azkaban-web-server-0.1.0-SNAPSHOT/
[root@node1 azkaban-web-server-0.1.0-SNAPSHOT]# mkdir -p plugins/jobtypes
cd plugins/jobtypes
[root@node1 jobtypes]# vim commonprivate.properties azkaban.native.lib=false
execute.as.user=false

cd ~/app/azkaban-3.43.0/azkaban-exec-server-0.1.0-SNAPSHOT/
cp -r ~/app/azkaban-3.43.0/azkaban-web-server-0.1.0-SNAPSHOT/plugins/ .


```


```

```