import yfinance as yf
from pandas.io import *
import sqlite3
import json
#print(ticker_object.balance_sheet.to_records)

try:
    sqliteConnection = sqlite3.connect('database.db')
    cursor = sqliteConnection.cursor()
    print("Database created and Successfully Connected to SQLite")
    

except sqlite3.Error as error:
    print("Error while connecting to sqlite", error)

json_opener= open("S&P500.json")

companies_list = json.load(json_opener);
for i in companies_list:
    ticker_object = yf.Ticker(f'{""+i["Symbol"]}')
    '''years_ts = list(ticker_object.balance_sheet)
    years = []
    for i in years_ts:
        i = i.year
        years.append(i)
    years = json.dumps(years)
    newBS = ticker_object.balance_sheet.to_json();
    data_to_insert = ( ""+i['Symbol'], newBS,years)
    query = "INSERT INTO Balance_sheets(Symbol,Data,Years) VALUES(?,?,?)"
    cursor.execute(query, data_to_insert)'''
    '''
    years_ts = list(ticker_object.income_stmt)
    years = []
    for x in years_ts:
        years.append(x.year)
    years = json.dumps(years)
    newIS = ticker_object.income_stmt.to_json();
    data_to_insert = ( ""+i['Symbol'], newIS,years)
    query = "INSERT INTO Income_statements(Symbol,Data,Years) VALUES(?,?,?)"
    cursor.execute(query, data_to_insert)
        
    years_ts = list(ticker_object.cash_flow)
    years = []
    for x in years_ts:
        years.append(x.year)
    years = json.dumps(years)
    newSCF = ticker_object.cash_flow.to_json();
    data_to_insert = ( ""+i['Symbol'], newSCF,years)
    query = "INSERT INTO CashFlows(Symbol,Data,Years) VALUES(?,?,?)"
    cursor.execute(query, data_to_insert)'''
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