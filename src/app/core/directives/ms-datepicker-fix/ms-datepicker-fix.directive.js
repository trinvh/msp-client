(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('momentDateTime', momentDateTime);

    /** @ngInject */
    function momentDateTime() {
        var format = "YYYY-MM-DD HH:mm"
        //date.isValid() is not enough for strict validation, see moment.js doc
        var pattern = /^\s*\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?\s*$/
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                ngModel.$parsers.push(function (text) {
                    var date = moment(text, format);
                    ngModel.$validators.dateValid = function(modelValue, viewValue) {
                        console.log(modelValue.isValid(),viewValue.match(pattern), modelValue.isValid() && viewValue.match(pattern));
                        //console.log(date.isValid() && viewValue.match(pattern));
                        return modelValue.isValid() && pattern.test(viewValue);
                    }
                    return date;
                })
                ngModel.$formatters.push(function (datetime_moment) {
                    return datetime_moment && datetime_moment.local().format(format);
                })
            }
        };
    }
})();