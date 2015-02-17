var psiMisc = function () {
    var baseURL = null;

    // interaction variables
    var currentModule = '';
    var $TouchStartTarget = null;
    var $TouchEndTarget = null;

    var GetBaseURL = function () {
        baseURL = $("#secretData").attr("data-base-url");
        return baseURL;
    };

    var SetBaseURL = function (newBaseURL) {
        baseURL = newBaseURL;
    };

    var GetFullURL = function (stringToAppend) {
        return GetBaseURL() + stringToAppend;
    };

    //--------------------------------------------------------------
    // INTERACTION FUNCTIONS
    //--------------------------------------------------------------
    // TOUCH START MOUSE DOWN
    var TouchStartMouseDown = function (e, module) {
        currentModule = module;

        $TouchStartTarget = $(e.target).closest('.psi-clickable');
        if (!$TouchStartTarget.length) return false; // do not handle

        // allowing button clicks to propagate up can cause undesired double clicking
        if ($TouchStartTarget.prop("tagName") == "BUTTON") {
            e.preventDefault();
            e.stopPropagation();
        }

        // ok to handle
        return true;
    };

    // TOUCH MOUSE MOVE
    var TouchMove = function (e, module) {
        // triggered from different module than TouchStart
        if (currentModule != module) return false;

        // ok to handle
        return true;
    };

    // TOUCH END MOUSE UP
    var TouchEndMouseUp = function (e, module) {
        // do not check for psi-clickable in the function
        // instead check that the target is the same as in touchstart

        // allowing button clicks to propagate up can cause undesired double clicking
        var $btn = $(e.target).closest("button");
        if ($btn.length) {
            e.preventDefault();
            e.stopPropagation();
        }

        // right click, do not handle
        if (e.which == 3) return false;

        // triggered from different module than TouchStart, do not handle
        if (currentModule != module) return false;

        var newY = 0;
        var newX = 0;

        // the following method is used because
        // mouseup target is the element under the cursor
        // but touchend target is always the original element that was touched (even if finger moved out of element)
        if (typeof e.originalEvent.changedTouches == 'undefined') {
            // mouse click
            newY = e.originalEvent.clientY;
            newX = e.originalEvent.clientX;

        } else if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length == 1) {
            // single finger touch event
            // TODO: handle multi touch events
            newY = e.originalEvent.changedTouches[0].pageY;
            newX = e.originalEvent.changedTouches[0].pageX;
        } else {
            // do not handle
            return false;
        }

        // check if final target is the same as starting target, if not, do not handle event
        var $target = $(document.elementFromPoint(newX, newY)).closest(".psi-clickable");
        if (!$target.length) return false;

        // moved finger/cursor out of original element, do not handle
        if (!$target.is($TouchStartTarget)) return false;

        // ok to handle
        return true;
    };

    //--------------------------------------------------------------
    // CHART FUNCTIONS
    //--------------------------------------------------------------
    // TODO: add checks in each function to make sure incoming data structure is correct
    // improve ConvertToFormatB
    var ConvertToFormatA = function (chartData) {
        //[{ series, category, value }]
        //to
        //[{
        //    categoryA,
        //    seriesA:valueAA,
        //    seriesB:valueAB,
        //    seriesC:valueAC
        //},
        //{
        //    categoryB,
        //    seriesA:valueBA,
        //    seriesB:valueBB,
        //    seriesC:valueBC
        //}]

        // this cannot be used because series values like "2012 - Sales" causes errors in kendo scripts (unexpected number)
        // but this would be a good way to lay out data because it ties categories and series together

        var organizedData = [];

        for (var a = 0; a < chartData.length; a++) {
            var found = false;
            var d = chartData[a];

            for (var o = 0; o < organizedData.length; o++) {
                var od = organizedData[o];
                if (od["category"] && od["category"] == d["category"]) {
                    found = true;
                    od[d.series] = d.value;
                }
            }

            if (!found) {
                var mynewjsonobj = {};
                mynewjsonobj["category"] = d.category;
                mynewjsonobj[d.series] = d.value;
                organizedData.push(mynewjsonobj);
            }
        }

        return organizedData;
    };

    var ConvertToFormatB = function (chartData, divisionFactor) {
        //[{ series, category, value }]
        //will be converted to:
        //{
        //    categoryArr:
        //        [ categoryA, categoryB, categoryC ],
        //    seriesArr:
        //    [{
        //        seriesA,
        //        data:[valueAA, valueBA, valueCA]
        //    },
        //    {
        //        seriesB,
        //        data:[valueAB, valueBB, valueCB]
        //    }]
        //}

        var seriesArr = [];
        var cSeries = 0;
        var categoryArr = [];
        var cCategories = 0;
        var values = [];
        var cValues = 0;

        var prevSeries = null;
        var seriesObj = null;

        for (var i = 0; i < chartData.length; i++) {
            if (!chartData[i].series) {
                chartData[i].series = "null";
            }
            if (chartData[i].series != prevSeries) {
                prevSeries = chartData[i].series;
                if (seriesObj) {
                    seriesObj.data = values;
                    values = [];
                    cValues = 0;

                    seriesArr[cSeries] = seriesObj;
                    cSeries++;
                }
                seriesObj = { name: prevSeries };
            }
            values[cValues] = chartData[i].value / divisionFactor;

            cValues++;
        }

        if (seriesObj) {
            seriesObj.data = values;
            seriesArr[cSeries] = seriesObj;
        }

        for (var i = 0; i < chartData.length; i++) {
            var catExists = false;
            for (var c = 0; c < cCategories; c++) {
                if (categoryArr[c] == chartData[i].category) {
                    catExists = true;
                }
            }
            if (!catExists) {
                categoryArr[cCategories] = chartData[i].category;
                cCategories++;
            }
        }

        return { categoryArr: categoryArr, seriesArr: seriesArr };
    };

    return {
        GetBaseURL: GetBaseURL,
        SetBaseURL: SetBaseURL,
        GetFullURL: GetFullURL,
        TouchStartMouseDown: TouchStartMouseDown,
        TouchMove: TouchMove,
        TouchEndMouseUp: TouchEndMouseUp,
        ChartToFormatA: ConvertToFormatA,
        ChartToFormatB: ConvertToFormatB
    }
}();