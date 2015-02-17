var Chart5 = function () {
    var $containerDiv = $("#Chart7");
    var $titleDiv = $containerDiv.find(".psi-chart-heading");
    var $subtitleDiv = $containerDiv.find(".psi-chart-sub-heading");

    // get data via ajax to dashboard/chartonedata
    // display chart
    $.ajax({
        url: 'http://leanera.com/psiOfficeAPI/api/Report/ChartFourData',
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

            var legendFormat = "#= kendo.format('{0:p1}', percentage) # : #= text #";
            var tooltipFormat = "#= category # : #= kendo.format('{0:p1}', percentage) # : #= kendo.format('{0:" + valueType + "0}', value)#";


            var $chart = $containerDiv.find(".psi-chart");

            $chart.kendoChart({
                theme: "silver",
                legend: {
                    position: "right",
                    labels: {
                        template: legendFormat
                    }
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                },
                series: [{
                    type: "pie",
                    startAngle: 150,
                    data: chartData
                }],
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