import sys
##词频统计
from pyspark import SparkConf, SparkContext

if __name__ == '__main__':

    # 没有参数，就退出
    if len(sys.argv) != 3:#有两个参数这里为3，单独打印在控制台只有一个参数，这里为2
        print("Usage: wordcount <input> <output>", file=sys.stderr)
        sys.exit(-1)

    conf = SparkConf()
    sc = SparkContext(conf=conf)
#信息打印在控制台
    def printResult():
        counts = sc.textFile(sys.argv[1]) \
            .flatMap(lambda line: line.split("\t")) \
            .map(lambda x: (x, 1)) \
            .reduceByKey(lambda a, b: a + b)

        output = counts.collect()

        for (word, count) in output:
            print("%s: %i" % (word, count))

    # printResult()

#信息数据存到文件系统
    def saveFile():
        sc.textFile(sys.argv[1]) \
            .flatMap(lambda line: line.split("\t")) \
            .map(lambda x: (x, 1)) \
            .reduceByKey(lambda a, b: a + b)\
            .saveAsTextFile(sys.argv[2])

    saveFile()

    sc.stop()