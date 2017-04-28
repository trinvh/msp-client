(function () {
    'use strict';

    angular
        .module('app.statistic')
        .controller('StatisticController', StatisticController);

    /** @ngInject */
    function StatisticController($auth, api, $filter, $interval, Dashboard) {
        var vm = this;
        vm.data = Dashboard;
        vm.date = new Date();

        vm.calcAvgFromMinutes = function(totalMinutes) {
            var hours = parseInt(totalMinutes / 60);
            var minutes = parseInt(totalMinutes) % 60;
            return hours + ' giờ ' + minutes + ' phút'
        };

        function shortenLargeNumber(num, digits) {
            var units = [' ngàn', ' triệu', ' tỉ', 'T', 'P', 'E', 'Z', 'Y'],
                decimal;

            for (var i = units.length - 1; i >= 0; i--) {
                decimal = Math.pow(1000, i + 1);

                if (num <= -decimal || num >= decimal) {
                    return +(num / decimal).toFixed(digits) + units[i];
                }
            }

            return num;
        }

        vm.chartOptions = {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            callback: function (label, index, labels) {
                                return shortenLargeNumber(label);
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Doanh thu (1k = 1000)'
                        }
                    }
                ]
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function (tooltipItems, data) {
                        return $filter('number')(tooltipItems.yLabel);
                    }
                }
            }
        };

        vm.monthsChart = {
            labels: Dashboard.monthlySales.map(function (v, i) {
                return v.period;
            }),
            data: [Dashboard.monthlySales.map(function (v, i) {
                return v.total;
            })]
        };

        vm.daysChart = {
            labels: Dashboard.weeklySales.map(function (v, i) {
                return v.period;
            }),
            data: [Dashboard.weeklySales.map(function (v, i) {
                return v.total;
            })]
        };

        api.remote.get(function(data) {
            vm.markdown = data.content;
        }, function() {
            vm.markdown = 'Không thể tải dữ liệu';
        });
    }
})();
