$(function () {
var tt = document.createElement('div'),
  leftOffset = -(~~$('html').css('padding-left').replace('px', '') + ~~$('body').css('margin-left').replace('px', '')),
  topOffset = -32;

tt.className = 'ex-tooltip';
document.body.appendChild(tt);

var data = {
  "xScale": "time",
  "yScale": "linear",
    'main': [{'className': '.main.l1',
    'data': [{'x': '2012-11-19T00:00:00', 'y': 12},
             {'x': '2012-11-20T00:00:00', 'y': 18},
             {'x': '2012-11-21T00:00:00', 'y': 8},
             {'x': '2012-11-22T00:00:00', 'y': 7},
             {'x': '2012-11-23T00:00:00', 'y': 6},
             {'x': '2012-11-24T00:00:00', 'y': 12},
             {'x': '2012-11-25T00:00:00', 'y': 8}]},
     {'className': '.main.l2',
    'data': [{'x': '2012-11-19T00:00:00', 'y': 29},
             {'x': '2012-11-20T00:00:00', 'y': 33},
             {'x': '2012-11-21T00:00:00', 'y': 13},
             {'x': '2012-11-22T00:00:00', 'y': 16},
             {'x': '2012-11-23T00:00:00', 'y': 7},
             {'x': '2012-11-24T00:00:00', 'y': 18},
             {'x': '2012-11-25T00:00:00', 'y': 8}]}]
};

var opts = {
  "dataFormatX": function (x) { return new Date(x); },
  "tickFormatX": function (x) { return d3.time.format('%d-%m')(x); },
  "mouseover": function (d, i) {
    var pos = $(this).offset();
    $(tt).text(d.y)
      .css({top: topOffset + pos.top, left: pos.left + leftOffset})
      .show();
  },
  "mouseout": function (x) {
    $(tt).hide();
  }
};

var chart = new xChart('line-dotted', data, '#myChart', opts);

var startDate   = new Date(),    // 6 days ago
    endDate     = new Date(startDate);                // today

endDate.setDate(startDate - 6);

ajaxLoadChart(startDate, endDate)

function ajaxLoadChart(startDate,endDate) {

    // If no data is passed (the chart was cleared)

    if(!startDate || !endDate){
        chart.setData({
            "xScale" : "time",
            "yScale" : "linear",
            "main" : [{
                className : ".main.l1",
                data : []
            }]
        });

        return;
    }

    // Otherwise, issue an AJAX request
    $.getJSON('http://localhost:5000/', {
        start:  d3.time.format(d3.time.format.iso)(startDate),
        end:    d3.time.format(d3.time.format.iso)(endDate)
    }, function(data) {

        var set_ok = [];
        var set_error = [];

        $.each(data, function() {
            set_ok.push({
                x : this.label,
                y : parseInt(this.value_ok, 10)
            });
            set_error.push({
                x : this.label,
                y : parseInt(this.value_error, 10)
            });
        });

        chart.setData({
            "xScale" : "time",
            "yScale" : "linear",
            "main" : [{
                className : ".main.l1",
                data : set_ok},
                {className : ".main.l2",
                data : set_error
            }]
        });

    });
}
}());
