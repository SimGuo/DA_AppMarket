# -*- coding:utf-8 -*-
import codecs, pymysql, json, os
import pandas as pd

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
cursor.execute("select * from toshow_view")

all_data = dict()
data = cursor.fetchall()

for rows in data:
	market = rows[0]
	downloads = rows[1]
	apps = rows[2]
	print market, downloads, apps
	if 'marketID' in all_data.keys():
		all_data['marketID'].append(market)
		all_data['downloads'].append(downloads)
		all_data['apps'].append(apps)
	else:
		all_data.update({'marketID':[market]})
		all_data.update({'downloads':[downloads]})
		all_data.update({'apps':[apps]})
		

df = pd.DataFrame(all_data)
df.to_csv("market_toshow.csv")

df.sort(['downloads'], ascending = False) #descending sort
top10_download = df.head(10)
top10_download.to_csv("top10_downloads.csv")

df.sort(['apps'], ascending = False)
top10_apps = df.head(10)
top10_apps.to_csv("top10_apps.csv")


cursor.close()
conn.close()

