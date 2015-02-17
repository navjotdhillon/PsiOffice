var ChartOne = function () {
    var $containerDiv = $("#ChartOne");
    var $titleDiv = $containerDiv.find(".psi-chart-heading");
    var $subtitleDiv = $containerDiv.find(".psi-chart-sub-heading");

    // get data via ajax to dashboard/chartonedata
    // display chart
    $.ajax({
        url: 'http://leanera.com/psiOfficeAPI/api/Report/ChartOneData',
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
            var valueType = "n";
            var legendVisible = false;
            var tooltipFormat = "";
            var categoryTitle = "Week";
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

            var convChartData = psiMisc.ChartToFormatB(chartData, valueDivider);

            valueLabelFormat = "#= kendo.format('{0:" + valueType + "0}" + valSuffix + "', value)#";

            if (convChartData.seriesArr && convChartData.seriesArr.length > 1) {
                tooltipFormat = "#= series.name #: #= kendo.format('{0:" + valueType + "}" + valSuffix + "', value)#";
                legendVisible = true;
            }
            else {
                tooltipFormat = "#= category #: #= kendo.format('{0:" + valueType + "}" + valSuffix + "', value)#";
            }

            var $chart = $containerDiv.find(".psi-chart");

            $chart.kendoChart({
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
                    },
                    min: 0,
                    max: 100
                },
                categoryAxis:
                    {
                        // labels
                        categories: convChartData.categoryArr,
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
                series: convChartData.seriesArr,
                tooltip: {
                    visible: true,
                    template: tooltipFormat,
                    color: "white"
                },
                plotAreaClick: function (e) {

                }
            });

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
} ();