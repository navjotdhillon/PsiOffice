var ChartOne = function () {
    var $containerDiv = $("#ChartThree");
    var $titleDiv = $containerDiv.find(".psi-chart-heading");
    var $subtitleDiv = $containerDiv.find(".psi-chart-sub-heading");

    // get data via ajax to dashboard/chartonedata
    // display chart
    $.ajax({
        url: 'http://leanera.com/psiOfficeAPI/api/Report/SalesData',
        cache: false,
        type: "GET",
        success: function (data) {

            if (!data) { return; }

            var success = data["success"];
            if (!success) { return; }

            var chartData = data["data"];
            if (!chartData) { return; }

            var hasValAboveM = false;
            var hasValBelowOHT = false;
            var valueDivider = 1;
            var valSuffix = "";
            var valueType = "c";
            var legendVisible = true;
            var tooltipFormat = "";
            var categoryTitle = "Period";
            var categoryLabelRot = 0;
            for (var v = 0; v < chartData.length; v++) {
                if (chartData[v].value && chartData[v].value > 1000000) {
                    hasValAboveM = true;
                }
                else if (chartData[v].value > 0 && chartData[v].value < 100000) {
                    hasValBelowOHT = true;
                }
            }

            if (hasValAboveM && !hasValBelowOHT) {
                valueDivider = 1000000;
                valSuffix = "M";
            }
            else if (hasValAboveM && hasValBelowOHT) {
                valueDivider = 1000;
                valSuffix = "K";
            }

            var convChartData = psiMisc.ChartToFormatA(chartData);//(chartData, valueDivider);

            valueLabelFormat = "#= kendo.format('{0:" + valueType + "0}" + valSuffix + "', value)#";
            tooltipFormat = "#= series.name #: #= kendo.format('{0:" + valueType + "}" + valSuffix + "', value)#";

            var $chart = $containerDiv.find(".psi-chart");

            $chart.kendoChart({
                dataSource:{
                    data: convChartData
                },
                theme: "silver",
                legend: {
                    visible: legendVisible,
                    position: "top"
                },
                chartArea: {
                    background: ""
                },
                valueAxis: {
                    labels: {
                        step: 2,
                        template: valueLabelFormat
                    },
                    majorGridLines: {
                        dashType: "dot"
                    }
                },
                categoryAxis:
                    {
                        field:"category",
                        title: {
                            text: categoryTitle
                        },
                        majorGridLines: {
                            dashType: "dot"
                        },
                        labels: {
                            rotation: categoryLabelRot
                        }
                    },
                seriesDefaults: {
                    type: "column",
                    spacing: 0,
                    stack: true
                },
                series:[{
                    field: "Actual",
                    name: "Actual",
                    color: "lightgreen"
                },
                {
                    field: "Projected",
                    name: "Projected",
                    color: "lightblue"
                },
                {
                    field: "Planned",
                    name: "Planned",
                    color: "lightpink"
                }],
                tooltip: {
                    visible: true,
                    template: tooltipFormat,
                    color: "white"
                },
                plotAreaClick: function (e) {

                }
            });

            // resize kendo charts after window resizing has finished
            $(window).bind('resize', function (e) {
                kendo.resize($chart);
            });

        }, error: function (e) {
            //alert(e);
        },
        beforeSend: function () {
            //var $button = $containerDiv.find(".report-toggle-btn");
            //$button.html('<i class="icon-spinner icon-spin"></i>');
        },
        complete: function () {
        }
    });
}();