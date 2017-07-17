var app = new Vue({
	el: '#charts',
	data:{
		app_num: window.num1,
		apk_num: num2
	},
});

//----------------------------颜色定义--------------------------------
var index = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
var color = ["#a76ca4", "#806ca7", "#6c96a7", "#6ca794", "#6ca76c", "#92ba55", "#c9a436", "#c96036"];
var color = ["#f9cdac","#f3aca2","#ee8b97","#e96a8d","#db5087","#b8428c","#973490","#742796","#5e1f88","#4d1a70","#3d1459","#2d0f41",
"#2d0f41","#3d1459","#4d1a70","#5e1f88","#742796","#973490","#b8428c","#db5087","#e96a8d","#ee8b97","#f3aca2","#f9cdac"
,"#f9cdac","#f3aca2","#ee8b97"];
var ordina1 = d3.scale.ordinal()
		.domain(index)
		.range(color);

var index2 = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var ordina2 = d3.scale.ordinal()
		.domain(index2)
		.range(color);

//----------------------------柱状图--------------------------------

var bardata = [10, 20, 30, 40, 33, 24, 12, 5, 12,12,23,21,12,29,12,18,27,10,38,12,19,37,29,19,12,29,12];
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

	//添加矩形元素
	var rects = svg.selectAll(".MyRect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("class","MyRect")
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.attr("fill", ordina1)
		.on("mouseover",function(d,i){
	        d3.select(this)
	        	.transition()
	            .duration(100)
	            .attr("fill","#ff9b00");
	    })
	    .on("mouseout",function(d,i){
	        d3.select(this)
	            .transition()
	            .duration(500)
	            .attr("fill",ordina1);
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
draw_market_bar(bardata,"#test-d3");

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
generate(piedata1,"#eat-a-pie");
generate(piedata2,"#eat-two-pie");

//----------------------------折线图--------------------------------
var data = [
        {time: '10:01', appnum: 200, Downloads: 500, total: 1000},
        {time: '10:02', appnum: 620, Downloads: 600, total: 1000},
        {time: '10:03', appnum: 300, Downloads: 800, total: 1000},
        {time: '10:04', appnum: 440, Downloads: 700, total: 1000},
        {time: '10:05', appnum: 900, Downloads: 900, total: 1000},
        {time: '10:06', appnum: 300, Downloads: 500, total: 1000},
        {time: '10:07', appnum: 50, Downloads: 300, total: 1000},
        {time: '10:08', appnum: 350, Downloads: 70, total: 1000},
        {time: '10:09', appnum: 750, Downloads: 200, total: 1000}
      ];

var category = ['appnum', 'Downloads'];

var hAxis = 10, mAxis = 10;

//generation function
function generate2(data, id, lineType, axisNum) {
var margin = {top: 20, right: 18, bottom: 35, left: 28},
    width = $(id).width() - margin.left - margin.right,
    height = $(id).height() - margin.top - margin.bottom;

var parseDate = d3.time.format("%H:%M").parse;

var legendSize = 10,
    legendColor = {'appnum': "#f8cd61", 'Downloads': "#ffad66"};

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

//data.length/10 is set for the garantte of timeseries's fitting effect in svg chart
var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(d3.time.minutes, Math.floor(data.length / axisNum))
    .tickSize(-height)
    .tickPadding([6])
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(10)
    .tickSize(-width)
    .orient("left");

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

// q = ddata;
// console.log(ddata);

x.domain( d3.extent(data, function(d) { return parseDate(d['time']); }) );

y.domain([
  0,
  d3.max(ddata, function(c) { return d3.max(c.values, function(v) { return v['num']; }); })+100
]);

var area = d3.svg.area()
    .x(function(d) { return x(d['time']); })
    .y0(height)
    .y1(function(d) { return y(d['num']); })
    .interpolate(lineType);

d3.select('#svg-net').remove();

var svg = d3.select(id).append("svg")
    .attr("id", "svg-net")
    .attr("width", width+margin.right+margin.left)
    .attr("height", height+margin.top+margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("id", "net-x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

var path = svg.selectAll(".gPath")
    .data(ddata)
    .enter().append("g")
    .attr("class", "gPath");

path.append("path")
    .attr("d", function(d) { return area(d['values']); })
    .attr("class", function(d) {
      if (d['category'] === 'appnum')
        return 'areaU';
      else
        return 'areaD';
    });

var legend = svg.selectAll('.legend')
    .data(category)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      return 'translate(' + (i * 10 * legendSize) + ',' + (height + margin.bottom - legendSize * 1.2) + ')';
    });

legend.append('rect')
    .attr('width', legendSize)
    .attr('height', legendSize)
    .style('fill', function(d) { return legendColor[d]});

legend.append('text')
    .data(category)
    .attr('x', legendSize*1.2)
    .attr('y', legendSize/1.1)
    .text(function(d) {
      return d;
    });

var points = svg.selectAll(".seriesPoints")
    .data(ddata)
    .enter().append("g")
    .attr("class", "seriesPoints");

points.selectAll(".tipNetPoints")
    .data(function (d) { return d['values']; })
    .enter().append("circle")
    .attr("class", "tipNetPoints")
    .attr("cx", function (d) { return x(d['time']); })
    .attr("cy", function (d) { return y(d['num']); })
    .text(function (d) { return d['num']; })
    .attr("r", "6px")
    .style("fill",function (d) { return legendColor[d['category']]; })
    .on("mouseover", function (d) {
      // console.log();
      var currentX = $(this)[0]['cx']['animVal']['value'],
          currentY = $(this)[0]['cy']['animVal']['value'];

      d3.select(this).transition().duration(100).style("opacity", 1);

      var ret = $('.tipNetPoints').filter(function(index) {
        return ($(this)[0]['cx']['animVal']['value'] === currentX && $(this)[0]['cy']['animVal']['value'] !== currentY);
      });

      //to adjust tooltip'x content if appnum and Downloads data are the same
      var jud = ret.length;

      // console.log(ret.length);

      var mainCate = (function() {
        if (jud === 0)
          return 'appnum/Downloads';
        else
          return d['category'];
      })();

      var viceCate = (function() {
        if (category[0] === d['category'])
          return category[1];
        else
          return category[0];
      })();

      $.each(ret, function(index, val) {
        // console.log(mainCate + ' | ' + viceCate);

        $(val).animate({
          opacity: "1"
        }, 100);

        $(val).tooltip({
          'container': 'body',
          'placement': 'left',
          'title': viceCate + ' | ' + $(this)[0]['textContent'],
          'trigger': 'hover'
        })
            .tooltip('show');
      });

      svg.append("g")
        .attr("class", "tipDot")
        .append("line")
        .attr("class", "tipDot")
        .transition()
        .duration(50)
        .attr("x1", $(this)[0]['cx']['animVal']['value'])
        .attr("x2", $(this)[0]['cx']['animVal']['value'])
        .attr("y2", height);

      svg.append("polyline")
        .attr("class", "tipDot")
        .style("fill", "black")
        .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(0-2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(0+6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(0-2.5));

      svg.append("polyline")
        .attr("class", "tipDot")
        .style("fill", "black")
        .attr("points", ($(this)[0]['cx']['animVal']['value']-3.5)+","+(y(0)+2.5)+","+$(this)[0]['cx']['animVal']['value']+","+(y(0)-6)+","+($(this)[0]['cx']['animVal']['value']+3.5)+","+(y(0)+2.5));

      $(this).tooltip({
        'container': 'body',
        'placement': 'left',
        'title': mainCate + ' | ' + d['num'],
        'trigger': 'hover'
      })
      .tooltip('show');
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

        $(val).tooltip('destroy');
      });

      d3.selectAll('.tipDot').transition().duration(100).remove();

      $(this).tooltip('destroy');
    });

this.getOpt = function() {
  var axisOpt = new Object();
  axisOpt['x'] = x;
  axisOpt['y'] = y;
  axisOpt['xAxis'] = xAxis;
  axisOpt['width'] = width;
  axisOpt['height'] = height;

  return axisOpt;
}

this.getSvg = function() {
  var svgD = new Object();
  svgD['svg'] = svg;
  svgD['points'] = points;
  svgD['area'] = area;
  svgD['path'] = path;
  svgD['legendColor'] = legendColor;

  return svgD;
}
}

generate2(data, "#zhexian-d3");
