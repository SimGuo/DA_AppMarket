//----------------------------颜色定义--------------------------------
var color = [
"#e96a8d","#ee8b97","#f3aca2","#f9cdac","#f9cdac","#f3aca2",
"#f3aca2","#f9cdac","#f9cdac","#f3aca2","#ee8b97","#e96a8d",
"#e96a8d","#ee8b97","#f3aca2","#f9cdac","#f9cdac","#f3aca2",
"#f3aca2","#f9cdac","#f9cdac","#f3aca2","#ee8b97","#e96a8d",
"#e96a8d","#ee8b97","#f3aca2","#f9cdac","#f9cdac","#f3aca2"];

var market_name = ['GooglePlay中', 'GooglePlay英', '应用宝', '百度手机助手', '360手机助手', '华为应用市场', '小米应用商店', '豌豆荚', '安卓市场', '安智市场', '91应用中心','OPPO软件商店', 'PP助手', '搜狗手机助手', '机锋网', '魅族应用商店', '新浪应用中心', '当乐网', '历趣市场', '应用汇', '移动应用商场', '乐商店', 'ZOL手机软件', 'N多市场', '手机中国', '太平洋下载中心','应用酷']
//----------------------------柱状图--------------------------------


function draw_market_bar(dataset, id){

	//画布周边的空白
	var padding = {left:80, right:0, top:50, bottom:50},
        width = $(id).width() - padding.left - padding.right,
        height = $(id).height() - padding.top - padding.bottom;
	//在 body 里添加一个 SVG 画布	
	var svg = d3.select(id)
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	//x轴的比例尺
	var xScale = d3.scale.ordinal()
		.domain(d3.range(dataset.length))
		.rangeRoundBands([0, width - padding.left - padding.right]);

	//y轴的比例尺
	var yScale = d3.scale.linear()
		.domain([0,d3.max(dataset)])
		.range([height - padding.top - padding.bottom, 0]);

	//定义x轴
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");
		
	//定义y轴
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	//矩形之间的空白
	var rectPadding = 2;

	var tip = d3.tip()
		  		.attr('class', 'd3-tip')
		  		.offset([-10, 0])
	svg.call(tip);

	//添加矩形元素
	var rects = svg.selectAll(".MyRect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("class","MyRect")
		.attr("fill", function(d,i){
			return color[i];
		})
		.attr("transform","translate(" + padding.left + "," + (padding.bottom + padding.top)/2 + ")")
		.on("mouseover",function(d,i){
	        d3.select(this)
	        	.transition()
	            .duration(100)
	            .attr("fill","#ff9b00");
	            //悬停的时候的tip
			
		  	tip.html(function() {
		    		return "Apknum: <span style='color:white'>" + dataset[i] + "</span>";
		  		});
		  	tip.show();
	    })
	    .on("mouseout",function(d,i){
	        d3.select(this)
	            .transition()
	            .duration(500)
	            .attr("fill",function(){
	            	return color[i];
	            });
	        tip.hide();

	    })
		.attr("x", function(d,i){
			return xScale(i) + rectPadding/2;
		} )
		.attr("width", xScale.rangeBand() - rectPadding )
		.attr("y",function(d){
			var min = yScale.domain()[0];
			return yScale(min);
		})
		.attr("height", function(d){
			return 0;
		})
		.transition()
		.delay(function(d,i){
			return i * 200;
		})
		.duration(2000)
		.ease("bounce")
		.attr("y",function(d){
			return yScale(d);
		})
		.attr("height", function(d){
			return height - padding.top - padding.bottom - yScale(d);
		});


	//添加x轴
	svg.append("g")
		.attr("class","axis")
		.attr("height",45)
		.attr("transform","translate(" + padding.left + "," + (height - (padding.bottom + padding.top)/2) + ")")
		.call(xAxis)
	.selectAll("text")
		.attr('x', -2)
		.attr('y', 9)
		.attr('dy', ".3em")
		.attr("transform", "rotate(-30)")
    	.style("text-anchor", "end")
    	.attr('fill','white')
    	.text(function(d){
    		return market_name[d];
    	});
	
		
	//添加y轴
	svg.append("g")
		.attr("class","axisY")
		.attr('fill','white')
		.attr("transform","translate(" + padding.left  + "," + (padding.bottom + padding.top)/2 + ")")
		.call(yAxis);	

}
//draw_market_bar(bardata,"#test-d3");

//----------------------------饼 图--------------------------------

var category = ['A', 'B', 'C', 'D', 'E', 'F'];
var cateColor = ["#5290e9","#71b37c","#ec932f","#e14d57","#965994","#dda76d"];

function draw_market_pie(data, id) {
    var margin = {top: 0, right: 0, bottom: 10, left: 0},
        width = $(id).width() - margin.left - margin.right,
        height = $(id).height() - margin.top - margin.bottom;

    var radius = Math.max(width, height) / 2,
        innerRadius = radius * 0.3,
        outerRadius = radius * 0.6;

    var legendRectSize = radius / 8,
        legendSpacing = radius / 2;

    var color = d3.scale.ordinal()
        .domain(category)
        .range(cateColor);

    var formatPercent = d3.format(".0%");

    var pie = d3.layout.pie()
        .value(function(d) {return d.value; })
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var svgX = (width+margin.right+margin.left) / 2,
        svgY = (radius*2 + margin.top*2) / 2;

    var svg = d3.select(id).append("svg")
        .attr("width", width+margin.right+margin.left)
        .attr("height", height+margin.top+margin.bottom)
        .append("g")
        .attr("transform", "translate(" + svgX + "," + svgY + ")");

    path = svg.datum(data).selectAll(".solidArc")
        .data(pie)
        .enter()
        .append("path")
        .attr("fill", function(d) {
          return color(d.data.inits);
        })
        .attr("class", "solidArc")
        .attr("stroke", "#764e4b")
        .attr("d", arc)
        .each(function(d) {
          this._current=d;
        })
        .on('mouseover', function(d) {
          	//console.log(d);

          	d3.select(this).transition().duration(200).attr("d", arc.innerRadius(innerRadius).outerRadius(outerRadius / 0.75 * 0.9));

          	//count the sum
          	var count = 0;
          	for (var i = 0; i < category.length; i++) {
            	count += data[i]['value'];
          	}

          	svg.append("svg:text")
              	.attr("class", "donutCenterText")
              	.attr("dy", "-.3em")
              	.attr("fill","#e58600")
              	.style("font-size","10px")
              	.attr("text-anchor", "middle")
              	.transition().duration(200)
              	.text(function(){
              		var marketid = d['data']['inits'];
              		return market_name[marketid];
              	});

          	svg.append("svg:text")
              	.attr("class", "donutCenterText")
              	.attr("dy", ".8em")
              	.attr("fill","#e58600")
              	.style("font-size","14px")
              	.attr("text-anchor", "middle")
              	.transition().duration(200)
              	.text(formatPercent(d['value'] / count));
        })
        .on('mouseout', function(d) {
        	d3.select(this).transition().duration(200).attr("d", arc.innerRadius(innerRadius).outerRadius(outerRadius));
        	d3.selectAll('.donutCenterText').remove();
        });

        

        //legend rendering
        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr("id", function(d) {
              return "legend-" + d;
            })
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
            	var horz;
            	var vert;
            	i = i % 6;
            	if(i < 2){
            		horz = (i-0.8) * (legendSpacing + legendRectSize);
            		vert =  radius - 50;
            	}
            	else if(i < 4){
            		horz = (i-2-0.8) * (legendSpacing + legendRectSize);
            		vert =  radius - 30;
            	}
            	else{
            		horz = (i-4-0.8) * (legendSpacing + legendRectSize);
            		vert =  radius - 10;	
            	}
            	return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize/2)
            .attr('height', legendRectSize/2)
            .style('fill', color)
            .style('stroke', color);

        legend.append('text')
            .data(data)
            .attr('x', legendRectSize*0.6)
            .attr('y', legendRectSize/2.6)
            .attr('fill', 'white')
            .style("font-size", "10px")
            .text(function(d) {
            	return market_name[d.inits]; 
            });
        
     


        this.getPath = function() {
          return path;
        }

        this.getArc = function() {
          return d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
        }
      }

//----------------------------折线图--------------------------------
function draw_line_chart(data, id, lineType, axisNum) {
	
	//设置周围留白和svg图像大小
	var margin = {top: 20, right: 18, bottom: 35, left: 50},
	    width = $(id).width() - margin.left - margin.right,
	    height = $(id).height() - margin.top - margin.bottom;

	var parseDate = d3.time.format("%m/%d").parse;

	//设置纵坐标划分为时段
	var legendSize = 10,
	    legendColor = {'Apknum': "#f8cd61", 'Appnum': "#ffad66"};

	//设置图标中的折线代表的含义
	var category = ['Apknum', 'Appnum'];

	//ddate是将原先的数据按数据类型分组，分为Apknum和Appnum两组数据，得到以Apknum和Appnum为下标的数组，
	//数组中每个元素由category和相应的数据数组构成
	//子数组中每个元素是由category,对应的 x值和对应的 y值构成
	var ddata = (function() {
		var temp = {}, seriesArr = [];

		category.forEach(function (name) {
			temp[name] = {category: name, values:[]};
			seriesArr.push(temp[name]);
		});

  		data.forEach(function (d) {
    		category.map(function (name) {
      			temp[name].values.push({'category': name, 'time': parseDate(d['time']), 'num': d[name]});
    		});
  		});

  		return seriesArr;
	})();
	//将 x方向的时间投影到宽度像素值上, x方向坐标尺
	var x = d3.time.scale()
	    .range([0, width])
		.domain( d3.extent(data, function(d) { return parseDate(d['time']); }) );

	//将 y方向的时间投影到高度像素值上, y方向坐标尺
	var y = d3.scale.linear()
	    .range([height, 0])
	    .domain([
		  	0,
		  	d3.max(ddata, function(c) { return d3.max(c.values, function(v) { return v['num']; }); })+100
	  	]);

	//area是d3.js中可以将部分区域涂色的函数，这里就是指对每个点，从x轴涂色到对应的 y值处。
	var area = d3.svg.area()
	    .x(function(d,i) { return x(d['time']); })
	    .y0(height)
	    .y1(function(d) { return y(d['num']); })
	    .interpolate(lineType);

	d3.select('#svg-net').remove();


	//在html的 id对应区域增加svg图像, svg的id设置为svg-net，transfrom是将图形位移
	//这边需要按照原先设定的留白，将svg移动margin.left和margin.top
	var svg = d3.select(id).append("svg")
	    .attr("id", "svg-net")
	    .attr("width", width+margin.right+margin.left)
	    .attr("height", height+margin.top+margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//x轴坐标轴
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .ticks(d3.time.days, Math.floor(data.length / axisNum))
	    .tickSize(-height)
	    .tickFormat(d3.time.format("%m/%d"))
	    .tickPadding([6])
	    .orient("bottom");
	
	//y轴坐标轴
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .ticks(10)
	    .tickSize(-width)
	    .orient("left");

	//画上x轴
	svg.append("g")
	    .attr("class", "axisY")
	    .attr("id", "net-x-axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis)
	    .selectAll('text')
	    .attr('fill','white');

	//画上y轴
	y_axis = svg.append("g")
	    .attr("class", "axisY2")
	    .call(yAxis);
	y_axis.selectAll('text')
		.attr('fill', 'white')
		.attr('x',-4)
		.style('font-size','12px');
	
	//为ddate中的每个元素添加 path的组，class = gpath, 每个组对应一个元素
	var path = svg.selectAll(".gPath")
	    .data(ddata)
	    .enter().append("g")
	    .attr("class", "gPath");

	//对于现在的这张图来说, 有两个path，每个path分别对应Apknum和dowdload的数据, 设置path的class为对应类别
	path.append("path")
	    .attr("d", function(d) { return area(d['values']); })
	    .attr("class", function(d) {
	      if (d['category'] === 'Apknum')
	        return 'areaU';
	      else
	        return 'areaD';
	    });

	// legend表示图例，为每个category创建一个图例
	var legend = svg.selectAll('.legend')
	    .data(category)
	    .enter()
	    .append('g')
	    .attr('class', 'legend')
	    .attr('transform', function(d, i) {
	      return 'translate(' + (i * 10 * legendSize) + ',' + (height + margin.bottom - legendSize * 1.2) + ')';
	    });
	//图例的小方框
	legend.append('rect')
	    .attr('width', legendSize)
	    .attr('height', legendSize)
	    .style('fill', function(d) { return legendColor[d]});
	//图例的说明文字
	legend.append('text')
	    .data(category)
	    .attr('fill','white')
	    .attr('x', legendSize*1.2)
	    .attr('y', legendSize/1.1)
	    .text(function(d) {
	      return d;
	    });

	// 实现图片的交互性质，points和path差不多，将ddata中数据按类别分成两组
	var points = svg.selectAll(".seriesPoints")
	    .data(ddata)
	    .enter().append("g")
	    .attr("class", "seriesPoints");

	var tip = d3.tip()
	  		.attr('class', 'd3-tip2')
	  		.direction('w');
	points.call(tip);

	// 将seriesPoints中的values, 提取出成为tipNetPoints，每个tipNetPoint与类中的一个值绑定
	//       .enter().append("circle")
	//       .attr("class", "tipNetPoints")
	// 的意义是tipNetPoints的每个point是一个圆，但把类名改成了tipNetPoints.  cx, cy 是圆心坐标
	points.selectAll(".tipNetPoints")
	    .data(function (d) { return d['values']; })
	    .enter().append("circle")
	    .attr("class", "tipNetPoints")
	    .attr("cx", function (d) { return x(d['time']); })
	    .attr("cy", function (d) { return y(d['num']); })
	    .attr("data-toggle","tooltip")
	    .attr("data-placement","left")
	    .attr("title","Tooltip on top")
	    .text(function (d) { return d['num']; })
	    .attr("r", "6px") //圆的大小
	    .style("fill",function (d) { return legendColor[d['category']]; }) //圆的填充颜色
	    .on("mouseover", function (d) {
	    	//animVal属性是定位工具，返回当前的像素位置
      		var currentX = $(this)[0]['cx']['animVal']['value'],
          		currentY = $(this)[0]['cy']['animVal']['value'];
          	//console.log(currentX);
          	//console.log(currentY);

          	//鼠标悬停是，显示圆圈
      		d3.select(this).transition().duration(100).style("opacity", 1);


      		//对折线图中的所有的点判断当前鼠标悬停的点重合的点有几个（以判断是否出现两条线重合的情况）
      		var ret = $('.tipNetPoints').filter(function(index) {
        		return ($(this)[0]['cx']['animVal']['value'] === currentX && $(this)[0]['cy']['animVal']['value'] !== currentY);
      		});

      		// jud = 0 , 1, 2; jud = 0时说明两个点重合，否则直接根据 tipPoint里面 d种category的值，可以知道maincategory
      		var jud = ret.length;

      		// 返回现在悬停的点代表的值的含义
      		var mainCate = (function() {
        		if (jud === 0)
          			return 'Apknum/Appnum';
        		else{
          			return d['category'];
        		}
      		})();
      		// 两个值中的另外一个值
      		//console.log(d);
      		var viceCate = (function() {
        		if (category[0] === d['category'])
          			return category[1];
        		else
          			return category[0];
      		})();
      		tip.html(function() {
		    		return mainCate + ": <span style='color:white'>" + d['num'] + "</span>";
		  		});
		  		tip.show();

		  	//表明横坐标位置的黑线
      		svg.append("g")
		        .attr("class", "tipDot")
		        .append("line")
		        .attr("class", "tipDot")
		        .transition()
		        .duration(50)
		        .attr("x1", $(this)[0]['cx']['animVal']['value'])
		        .attr("x2", $(this)[0]['cx']['animVal']['value'])
		        .attr("y2", height);
		    //画线的端点，两个黑色的三角形端点
      		svg.append("polyline")
		        .attr("class", "tipDot")
		        .style("fill", "white")
		        .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(0-2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(0+6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(0-2.5));
      		svg.append("polyline")
		        .attr("class", "tipDot")
		        .style("fill", "white")
		        .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(y(0)+2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(y(0)-6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(y(0)+2.5));
    	})
    	.on("mouseout",  function (d) {
      		var currentX = $(this)[0]['cx']['animVal']['value'];

      		d3.select(this).transition().duration(100).style("opacity", 0);

      		var ret = $('.tipNetPoints').filter(function(index) {
        		return ($(this)[0]['cx']['animVal']['value'] === currentX);
      		});

      		$.each(ret, function(index, val) {
        		$(val).animate({
          			opacity: "0"
        		}, 100);

      		});

      		d3.selectAll('.tipDot').transition().duration(100).remove();

      		tip.hide();
    	});
}


 //colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]


var data = [
	  { marketid: 0, EDUC: 1092, GAME: 44630, LIFE: 216131, UNKNOWN: 25257 },
	  { marketid: 1, EDUC: 12, GAME: 18, LIFE: 9, UNKNOWN: 4 },
	  { marketid: 2, EDUC: 05, GAME: 20, LIFE: 8, UNKNOWN: 2 },
	  { marketid: 3, EDUC: 01, GAME: 15, LIFE: 5, UNKNOWN: 4 },
	  { marketid: 4, EDUC: 02, GAME: 10, LIFE: 4, UNKNOWN: 2 },
	  { marketid: 5, EDUC: 03, GAME: 12, LIFE: 6, UNKNOWN: 3 },
	  { marketid: 6, EDUC: 04, GAME: 15, LIFE: 8, UNKNOWN: 1 },
	  { marketid: 7, EDUC: 06, GAME: 11, LIFE: 9, UNKNOWN: 4 },
	  { marketid: 8, EDUC: 10, GAME: 13, LIFE: 9, UNKNOWN: 5 },
	  { marketid: 9, EDUC: 16, GAME: 19, LIFE: 6, UNKNOWN: 9 },
	  { marketid: 10, EDUC: 19, GAME: 17, LIFE: 5, UNKNOWN: 7 },
	];

function draw_stacked_bar(data, id){

 	var margin = {top: 0, right: 30, bottom: 20, left: 30};

	var width = $(id).width() - margin.left - margin.right,
	    height = $(id).height() - margin.top - margin.bottom;

	var svg = d3.select(id)
	  .append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
	for(var i = 0; i < data.length; i++){
		var sum = data[i]['EDUC'] + data[i]['GAME'] + data[i]['LIFE'] + data[i]['UNKNOWN'];
		data[i]['SUM'] = sum;
	}

	// Transpose the data into layers
	var dataset = d3.layout.stack()(["EDUC", "GAME", "LIFE", "UNKNOWN"].map(function(fruit) {
	  return data.map(function(d) {
	    return {x: d.marketid, y: +(d[fruit]/d['SUM'])};
	  });
	}));

	// Set x, y and colors
	var x = d3.scale.ordinal()
	  .domain(dataset[0].map(function(d) { return d.x; }))
	  .rangeRoundBands([10, width-40], 0.05);

	var y = d3.scale.linear()
	  .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
	  .range([height - 35, 50]);

	var colors = ["#b33040", "#d25c4d", "#f2b447", "#d9d574"];

	// Define and draw axes
	var yAxis = d3.svg.axis()
	  .scale(y)
	  .orient("left")
	  .ticks(5)
	  .tickFormat( function(d) { return d } );

	var xAxis = d3.svg.axis()
	  .scale(x)
	  .orient("bottom");

	/*svg.append("g")
	  .attr("class", "axisY")
	  .call(yAxis);*/

	console.log("height", height);

	svg.append("g")
	  	.attr("class", "axisY")
	  	.attr("transform", "translate(0,"  + (height - 35) +")")
	  	.call(xAxis)
	  	.selectAll("text")
		.attr('x', 16)
		.attr('y', 9)
    	.text(function(d){
    		return market_name[d];
    	})
		.attr('dy', ".3em")
		.attr("transform", "rotate(-10)")
    	.style("text-anchor", "end");

	// Create groups for each series, rects for each segment 
	var groups = svg.selectAll("g.cost")
	  .data(dataset)
	  .enter().append("g")
	  .attr("class", "cost")
	  .style("fill", function(d, i) { return colors[i]; });

	var rect = groups.selectAll("rect")
	  .data(function(d) { return d; })
	  .enter()
	  .append("rect")
	  .attr("x", function(d) { return x(d.x); })
	  .attr("y", function(d) { return y(d.y0 + d.y); })
	  .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y) - 1; })
	  .attr("width", x.rangeBand());

	// Draw legend
	var legend = svg.selectAll(".legend")
	  .data(colors)
	  .enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) { return "translate(" + i * (width - 50) / 4 + ",20)"; });
	 
	legend.append("rect")
	  .attr("x", 20)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", function(d, i) {return colors.slice().reverse()[i];});
	 
	legend.append("text")
	  .attr("x", 40)
	  .attr("y", 9)
	  .attr("dy", ".35em")
	  .style("text-anchor", "start")
	  .attr('fill','white')
	  .text(function(d, i) { 
	    switch (i) {
	      case 0: return "教育";
	      case 1: return "游戏";
	      case 2: return "生活";
	      case 3: return "其他";
	    }
	  });

	
}

