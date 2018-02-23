#!/usr/bin/python3
# News database analysis tool (Python)

import psycopg2
import pandas


def connect(database_name="news"):
    try:
        db = psycopg2.connect("dbname={}".format(database_name))
        cursor = db.cursor()
        return db, cursor
    except:
        print("Could not connect to requested database: %s", {database_name})

def analyze():
    db, cursor = connect()

    query1 = "select articles.title as title, count(log.path) as \
    views from log, articles \
    where log.path=concat('/article/', articles.slug) group by \
    articles.title order by views desc limit 3"

    query2 = "select authors.name as author, count(log.path) as views from log,\
    articles, authors where authors.id = articles.author and log.path = \
    concat('/article/', articles.slug) group by authors.name \
    order by views desc"

    query3 = "\
        WITH errorCount AS \
            (SELECT date(time) as date, \
            count(status) as error from log where log.status = '404 NOT FOUND'\
            GROUP BY date),\
        totalCount AS (\
            SELECT date(time) as date,\
            count(status) as total from log\
            GROUP BY date),\
        finalResult AS(\
        SELECT errorCount.date as date, \
        ((errorCount.error::decimal / totalCount.total::decimal) * 100) \
        AS percentage\
        FROM errorCount, totalCount\
        WHERE errorCount.date = totalCount.date\
        ORDER BY percentage desc)\
        SELECT date, percentage\
        FROM finalResult\
        WHERE percentage > 1;"

    print("What are the most popular three articles of all time?\n")

    table = pandas.read_sql(query1, db)
    table.index += 1
    print(table)

    print("\nWho are the most popular article authors of all time?\n")

    table = pandas.read_sql(query2, db)
    table.index += 1
    print(table)

    print("\nOn which days did more than 1% of requests lead to errors?\n")
    table = pandas.read_sql(query3, db)\

    table.index +=1
    print(table)
    db.close()

analyze()
