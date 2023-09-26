import yfinance as yf
from pandas.io import *
import sqlite3
import json
ticker_object = yf.Ticker('AAPL')
years_ts = list(ticker_object.income_stmt)
years = []
for i in years_ts:
    i = i.year
    years.append(i)


bs =ticker_object.balance_sheet.to_records()
balancesheet = []
for x, year in enumerate(years):
    newyear= {"year": year}
    for b in bs :
        newyear.update({""+b[0]:b[x+1]})
    balancesheet.append(newyear)

ics =ticker_object.income_stmt.to_records()
income_statement = []
for x, year in enumerate(years):
    newyear= {"year": year}
    for i in ics :
        newyear.update({""+i[0]:i[x+1]})
    income_statement.append(newyear)

try:
    sqliteConnection = sqlite3.connect('database.db')
    cursor = sqliteConnection.cursor()
    print("Database created and Successfully Connected to SQLite")

    sqlite_select_Query = "select sqlite_version();"
    cursor.execute(sqlite_select_Query)
    record = cursor.fetchall()
    print("SQLite Database Version is: ", record)
    

except sqlite3.Error as error:
    print("Error while connecting to sqlite", error)





''' used to add all company list to database

json_opener= open("S&P500.json")

companies_list = json.load(json_opener);
for i in companies_list:
    data_to_insert = (""+i['Name'], ""+i['Symbol'], ""+i['Sector'])
    query = "INSERT INTO Companies(Name,Symbol,Sector) VALUES(?,?,?)"
    cursor.execute(query, data_to_insert)
'''

# 6. Commit the changes to the database
sqliteConnection.commit()

# 7. Close the cursor and the connection
cursor.close()
sqliteConnection.close()