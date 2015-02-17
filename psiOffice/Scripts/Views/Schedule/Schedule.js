var ScheduleOne = function () {
    var $detailDiv = $("#ScheduleOne");

    // display detail
    if ($detailDiv) {

        $.ajax({
            url: 'http://leanera.com/psiOfficeAPI/api/Schedule/OpRequest',
            cache: false,
            type: "GET",
            success: function (data) {
                if (!data) { return; }
                var success = data["success"];
                if (!success) { return; }
                var dd = data["data"];
                var chartData = dd;
                if (!(chartData)) { return; }
                $detailDiv.html("");
                $detailDiv.kendoGrid({
                    dataSource: {
                        data: chartData
                    },
                    height: 550,
                    columns: [{
                        field: "issue_subject",
                        title: "Request to Schedule",
                        width: 200
                    }]
                });
            }, error: function (e) {
                //alert(e);
            },
            beforeSend: function () {
                $detailDiv.html("");
                $detailDiv.addClass('ajaxloader');
            },
            complete: function () {
                $detailDiv.removeClass('ajaxloader')
            }
        });
    }


} ();
