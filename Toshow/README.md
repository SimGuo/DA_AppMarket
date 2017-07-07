 - `select_by_appname.py` 
 
   条状图数据来源：根据App的名字App_Name计算所下载的app的数量
 
 - `extract_downloads.py`  
 
   饼图：下载量，Apk数
   根据downloads和apks排序，分别选择前10的写入相应文件

- `query_20_times.py`
 
  动图（实时apk?app?下载数目变化)（体现爬虫速度）
   
   - `python query_20_times.py app`
   
   根据**AppName**进行的查询，查询20次，每次间隔5mins
   
   - `python query_20_times.py apk`
   
   根据**package_Name**进行的查询，查询20次，每次间隔5mins，这个比较能真实反映爬虫的下载速度
   
 
