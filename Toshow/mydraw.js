//----------------------------颜色定义--------------------------------
var color = ["#4d1a70","#5e1f88","#742796","#973490","#b8428c","#db5087","#e96a8d","#ee8b97","#f3aca2","#f9cdac"
,"#f9cdac","#f3aca2","#ee8b97","#f9cdac","#f3aca2","#ee8b97","#e96a8d","#db5087","#b8428c","#973490","#742796","#5e1f88","#4d1a70","#3d1459","#2d0f41",
"#2d0f41","#3d1459","#4d1a70"];
//----------------------------柱状图--------------------------------

//var bardata = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];

function draw_market_bar(dataset, id){
	//画布大小
	var width = 1100;
	var height = 300;

	//在 body 里添加一个 SVG 画布	
	var svg = d3.select(id)
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	//画布周边的空白
	var padding = {left:30, right:30, top:20, bottom:20};
	
		
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
	var rectPadding = 4;

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
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.attr("fill", function(d,i){
			return color[i];
		})
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
		.attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
		.call(xAxis); 
		
	//添加y轴
	svg.append("g")
		.attr("class","axis")
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.call(yAxis);
}
//draw_market_bar(bardata,"#test-d3");

//----------------------------饼 图--------------------------------
var piedata1 = [
		{ inits : '13', value : 3630669},
        { inits : '6' , value : 3095021},
        { inits : '11', value : 1413875},
        { inits : '12', value : 1372136},
        { inits : '5' , value : 1304635},
        { inits : '23', value : 803984 }
      ];
var piedata2 = [
		{ inits : '11', value : 8476648794900},
		{ inits : '3' , value : 2146652260880},
		{ inits : '5' , value : 1795042648152},
		{ inits :'0/1', value : 850282226820},
		{ inits : '9' , value : 586799570600},
		{ inits : '2' , value : 348268891196}
      ];

var category = ['A', 'B', 'C', 'D', 'E', 'F'];
var cateColor = ["#fdeb73","#f6c15b","#ed9445","#e66731","#b84a29","#6a3a2d"];

function generate(data, id) {
    var margin = {top: 20, right: 0, bottom: 40, left: 0},
        width = $(id).width() - margin.left - margin.right,
        height = $(id).height() - margin.top - margin.bottom;

    var radius = Math.max(width, height) / 2,
        innerRadius = radius * 0.25,
        outerRadius = radius * 0.75;

    var legendRectSize = radius/8,
        legendSpacing = radius/5;

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
        .attr("stroke", "none")
        .attr("d", arc)
        .each(function(d) {
          this._current=d;
        })
        .on('mouseover', function(d) {
          console.log(d);

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
              .attr("text-anchor", "middle")
              .transition().duration(200)
              .text(d['data']['inits']);

          svg.append("svg:text")
              .attr("class", "donutCenterText")
              .attr("dy", ".8em")
              .attr("fill","#e58600")
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
              var horz = (i-2.8)*(legendSpacing+legendRectSize);
              var vert =  radius + margin.bottom / 4;
              return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color);

        legend.append('text')
            .data(data)
            .attr('x', legendRectSize*1.2)
            .attr('y', legendRectSize/1.3)
            .text(function(d) {
              return d.inits; });

        this.getPath = function() {
          return path;
        }

        this.getArc = function() {
          return d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
        }
      }
//generate(piedata1,"#eat-a-pie");
//generate(piedata2,"#eat-two-pie");

//----------------------------折线图--------------------------------

var hAxis = 10, mAxis = 10;

//generation function
function generate2(data, id, lineType, axisNum) {

	//设置周围留白和svg图像大小
	var margin = {top: 20, right: 18, bottom: 35, left: 30},
	    width = $(id).width() - margin.left - margin.right,
	    height = $(id).height() - margin.top - margin.bottom;

	var parseDate = d3.time.format("%H:%M").parse;

	//设置纵坐标划分为时段
	var legendSize = 10,
	    legendColor = {'appnum': "#f8cd61", 'Downloads': "#ffad66"};

	//设置图标中的折线代表的含义
	var category = ['appnum', 'Downloads'];

	//ddate是将原先的数据按数据类型分组，分为appnum和Downloads两组数据，得到以Appnum和Downloads为下标的数组，
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
	    .x(function(d) { return x(d['time']); })
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
	    .ticks(d3.time.minutes, Math.floor(data.length / axisNum))
	    .tickSize(-height)
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
	    .attr("class", "x axis")
	    .attr("id", "net-x-axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);
	//画上y轴
	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis);

	//为ddate中的每个元素添加 path的组，class = gpath, 每个组对应一个元素
	var path = svg.selectAll(".gPath")
	    .data(ddata)
	    .enter().append("g")
	    .attr("class", "gPath");

	//对于现在的这张图来说, 有两个path，每个path分别对应appnum和dowdload的数据, 设置path的class为对应类别
	path.append("path")
	    .attr("d", function(d) { return area(d['values']); })
	    .attr("class", function(d) {
	      if (d['category'] === 'appnum')
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
          	console.log(currentX);
          	console.log(currentY);

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
          			return 'appnum/Downloads';
        		else{
          			return d['category'];
        		}
      		})();
      		// 两个值中的另外一个值
      		console.log(d);
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
		        .style("fill", "black")
		        .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(0-2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(0+6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(0-2.5));
      		svg.append("polyline")
		        .attr("class", "tipDot")
		        .style("fill", "black")
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


