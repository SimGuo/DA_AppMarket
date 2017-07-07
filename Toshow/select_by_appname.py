# -*- coding:utf-8 -*-
import codecs, pymysql, json, os

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

cursor.execute("select count(*) from market_app_metadata group by App_Name")
all_app_num = int(cursor.rowcount)
print (all_app_num)

with codecs.open('market_app_name_cnt.csv', 'w', 'utf-8') as fout:
	fout.write("all," + str(all_app_num) + '\n')
	for i in range(0, 26):
		cursor.execute("select count(*) from market_app_metadata where MarketID = " + str(i) + " group by App_Name")
		market_app_num = int(cursor.rowcount)
		fout.write(str(i) + ',' + str(market_app_num) + '\n')

'''
with codecs.open('market_download.csv', 'w', 'utf-8') as fout:
	for rows in data:
		market = rows[0]
		downloads = rows[1]
		print market, downloads
		fout.write(market + ',' + str(downloads) + '\n')
'''
cursor.close()
conn.close()