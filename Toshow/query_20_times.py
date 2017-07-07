# -*- coding:utf-8 -*-
import pandas as pd
import pymysql, json, os, time, sys

def read_config():
	result = {}
	result['MYSQL_HOST'] = ""
	result['MYSQL_PORT'] = "3306"
	result['MYSQL_USER'] = ""
	result['MYSQL_PASSWORD'] = ""
	result['MYSQL_DB'] = ""
	result['MYSQL_CHARSET'] = "utf8"
	try:
		if os.path.isfile("config.json"):
			with open("config.json") as jsonfile:
				config_dict = json.load(jsonfile)
			for key in result.keys():
				if key in config_dict:
					result[key] = config_dict[key]
			return result
		else:
			return None
	except:
		return None


config = read_config()
conn = pymysql.connect(config['MYSQL_HOST'], config['MYSQL_USER'], config['MYSQL_PASSWORD'], config['MYSQL_DB'])
cursor = conn.cursor()

query_turns = 3
all_data = dict()
all_data.update({'marketID':[0]})
for i in range (1, 26):
	all_data['marketID'].append(i)

if sys.argv[1] == 'app':
	for i in range(1, query_turns):
		tmp_query = list()
		print "query for the ", i, "time"
		for market in range(0, 27):
			#marketID = 0,1,2,...,26
			if marketID == 16:
				continue	#Market 16 doesn't update any more
			print "marketID : ", market, "................"
			cursor.execute("select count(*) from market_app_metadata where MarketID = " + str(market) + " group by App_Name")
			market_app_num = int(cursor.rowcount)
			tmp_query.append(market_app_num)
		tmpkey = 'Turn'+str(i)
		all_data.update({tmpkey:tmp_query})
		if i != query_turns - 1:
			print "sleep for five minutes"
			time.sleep(300) # query every 5 mins
elif sys.argv[1] == 'apk':
	for i in range(1, query_turns):
		tmp_query = list()
		print "query for the ", i, "time"
		cursor.execute("select MarketID, TotalApps from toshow_view")
		tmpdata = cursor.fetchall()
		for rows in tmpdata:
			if rows[0] == 16:
				continue	#Market 16 doesn't update any more
			print "marketID : ", rows[0], "................"
			market_apk_num = rows[1]
			tmp_query.append(market_apk_num)
		tmpkey = 'Turn'+str(i)
		all_data.update({tmpkey:tmp_query})
		if i != query_turns - 1:
			print "sleep for five minutes"
			time.sleep(300) # query every 5 mins	

df = pd.DataFrame(all_data)
print df

df.to_csv("query_20times.csv")

#calculate the update
res = dict()
for i in range(1,19):
	colkey1 = 'Turn' + str(i)
	colkey2 = 'Turn' + str(i+1)
	res.update({i:data[colkey2] - data[colkey1]})
Res = pd.DataFrame(res)
Res.to_csv("increase_20times.csv")
print Res



cursor.close()
conn.close()
