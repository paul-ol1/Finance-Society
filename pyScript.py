import yfinance as yf
from pandas.io import *
import sqlite3
import json

try:
    sqliteConnection = sqlite3.connect('database.db') #set up database connection 
    cursor = sqliteConnection.cursor() # allows me to navigate database 
    print("Database created and Successfully Connected to SQLite")
    

except sqlite3.Error as error:
    print("Error while connecting to sqlite", error)

# set up a company list for reference and to be able to navigate through python modules and the db 
json_opener= open("S&P500.json") 
companies_list = json.load(json_opener);
table_list= ['Balance_sheets','Income_statements', 'CashFlows' ]

# drop all tables if they exist to update the entire system (delete old ones and add new ones)
for i in table_list:
    query = f"DROP TABLE IF EXISTS {i};"
    cursor.execute(query)
query = "DROP TABLE IF EXISTS Companies;"
cursor.execute(query)

# create new tables 
companies_table= "CREATE TABLE Companies (Name TEXT NOT NULL, Symbol TEXT NOT NULL, Sector TEXT, PRIMARY KEY (Symbol));"
cursor.execute(companies_table)

for i in table_list:
    query = f'CREATE TABLE {i} (Symbol TEXT NOT NULL, Data JSON, Years TEXT, FOREIGN KEY(Symbol) REFERENCES Companies(Symbol));'
    cursor.execute(query)

for i in companies_list:
    # list of companies their symbols and sectors 
    # taken directly from the json file and inserted into the database as a reference for other tables
    data_to_insert = (""+i['Name'], ""+i['Symbol'], ""+i['Sector'])
    query = "INSERT INTO Companies(Name,Symbol,Sector) VALUES(?,?,?)"
    cursor.execute(query, data_to_insert)
    
    ticker_object = yf.Ticker(f'{""+i["Symbol"]}') # use the current symbol from company list to get data of the company from yahoo finance

    years_ts = list(ticker_object.balance_sheet) # get it's balance sheet
    years = []
    for x in years_ts: # seperate the years of data we currently have from the data itself and put it in a list
        x = x.year
        years.append(x)
    years = json.dumps(years) # convert list of years we have to json for the db 

    newBS = ticker_object.balance_sheet.to_json();
    data_to_insert = ( ""+i['Symbol'], newBS,years) # we insert the current symbol, current data(in this case from the balance sheet) in json format and an array of years into the bs table
    query = "INSERT INTO Balance_sheets(Symbol,Data,Years) VALUES(?,?,?)"
    cursor.execute(query, data_to_insert)
    # repeat process for the income statement 
    newIS = ticker_object.income_stmt.to_json(); 
    data_to_insert = ( ""+i['Symbol'], newIS,years)
    query = "INSERT INTO Income_statements(Symbol,Data,Years) VALUES(?,?,?)"
    cursor.execute(query, data_to_insert)
    # repeat process for the cashflow statement
    newSCF = ticker_object.cash_flow.to_json();
    data_to_insert = ( ""+i['Symbol'], newSCF,years)
    query = "INSERT INTO CashFlows(Symbol,Data,Years) VALUES(?,?,?)"
    cursor.execute(query, data_to_insert)


# Commit the changes to the database
sqliteConnection.commit()

# Close the cursor and the connection
cursor.close()
sqliteConnection.close()