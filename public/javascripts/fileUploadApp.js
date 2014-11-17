/**
 * Created by cxa70 on 11/17/2014.
 */
(function() {
    'use strict';
    var fuploader = angular.module("fuploader", ['blueimp.fileupload']);

    var isOnGitHub = window.location.hostname === 'blueimp.github.io',
        url = isOnGitHub ? '//jquery-file-upload.appspot.com/' : 'upload/';


    fuploader.config(['$httpProvider', 'fileUploadProvider',
        function ($httpProvider, fileUploadProvider) {
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            fileUploadProvider.defaults.redirect = window.location.href.replace(
                /\/[^\/]*$/,
                '/upload?%s'
            );
            if (isOnGitHub) {
                // Demo settings:
                angular.extend(fileUploadProvider.defaults, {
                    // Enable image resizing, except for Android and Opera,
                    // which actually support image resizing, but fail to
                    // send Blob objects via XHR requests:
                    disableImageResize: /Android(?!.*Chrome)|Opera/
                        .test(window.navigator.userAgent),
                    maxFileSize: 5000000,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
                });
            }
        }]);

    fuploader.controller("FileUploadController", ['$scope', '$http', '$filter', '$window',
        function ($scope, $http) {
            $scope.options = {
                url: url
            };
            if (!isOnGitHub) {
                $scope.loadingFiles = true;
                $http.get(url)
                    .then(
                    function (response) {
                        $scope.loadingFiles = false;
                        $scope.queue = response.data.files || [];
                    },
                    function () {
                        $scope.loadingFiles = false;
                    }
                );
            }
        }]);

    fuploader.controller('FileDestroyController', [
        '$scope', '$http',
        function ($scope, $http) {
            var file = $scope.file,
                state;
            if (file.url) {
                file.$state = function () {
                    return state;
                };
                file.$destroy = function () {
                    state = 'pending';
                    return $http({
                        url: file.deleteUrl,
                        method: file.deleteType
                    }).then(
                        function () {
                            state = 'resolved';
                            $scope.clear(file);
                        },
                        function () {
                            state = 'rejected';
                        }
                    );
                };
            } else if (!file.$cancel && !file._index) {
                file.$cancel = function () {
                    $scope.clear(file);
                };
            }
        }
    ]);
})();