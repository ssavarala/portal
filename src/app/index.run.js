(function() {
    'use strict';

    angular
        .module('portal')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $httpBackend, $window, AuthAPI) {

        var firstNames = ['Joe', 'Sue', 'Fred', 'Betty', 'George', 'Lucy', 'Bill', 'Jen', 'Rob', 'Kate', 'Alex', 'Bob'];
        var lastNames = ['Rogan', 'Samson', 'Johnson', 'McCready', 'Trunch', 'Baker', 'Miller', 'ODonnel', 'Block', 'Robinson', 'Smithsonion', 'Jones'];

        var documents = [{title: 'Title of a doc', filetype: 'C-CDA 1'},
                         {title: 'A study in search', filetype: 'docx'},
                         {title: 'Living the dream', filetype: 'pdf'},
                         {title: 'Health stuff', filetype: 'xml'},
                         {title: 'Immunization', filetype: 'png'},
                         {title: 'Blood work', filetype: 'txt'},
                         {title: 'X-Rays', filetype: 'gif'},
                         {title: 'A thing that happened once', filetype: 'pptx'},
                         {title: 'Another title', filetype: 'C-CDA 2.2'}];
        var aDocument = [{data: "<document>\n<made>\n<of attribute='a value'>XML</of>\n</made>\n</document>"},
                         {data: "<doc ns='docstring'>\n<thing>some txt</thing>\n<another-thing>more text</another-thing>\n</doc>"},
                         {data: "<ccda version='1.1'>\n<item>1</item>\n<item>2</item>\n<item>3</item>\n</ccda>"}];
        var organizations = [{id: 1, name: 'Hospital', url: 'http://www.example.com', status: 'Active'},
                             {id: 2, name: 'EHR For Fun', url: 'http://www.example.com/2', status: 'Inactive'},
                             {id: 3, name: 'Ambulatory Center', url: 'http://www.example.com/3', status: 'Active'}];
        var acfs = [{name: 'ACF', address: {}},
                    {name: 'Another ACF', address: {}},
                    {name: 'Fairground', address: {}},
                    {name: 'Remote Hospital', address: {}},
                    {name: 'Mall', address: {}},
                    {name: 'Campsite', address: {}}];

        $httpBackend.whenPOST(/rest\/query\/patient$/).respond(200, {results: makePeople(Math.floor(Math.random() * 6) + 3)});
        $httpBackend.whenGET(/\/rest\/query\/patient\/.*\/documents$/).respond(200, {results: randomArray(documents, Math.floor(Math.random() * 6) + 1)});
        $httpBackend.whenGET(/\/rest\/query\/patient\/.*\/documents\/.*/).respond(200, aDocument[Math.floor(Math.random() * aDocument.length)]);
        $httpBackend.whenGET(/\/rest\/organizations/).respond(200, {results: randomArray(organizations, Math.floor(Math.random() * 3) + 3)});
        $httpBackend.whenGET(/\/rest\/acfs/).respond(200, {acfs: randomArray(acfs, Math.floor(Math.random() * 4) + 2)});

        $httpBackend.whenGET(AuthAPI + '/jwt').respond(200, makeToken());

        $httpBackend.whenPOST(/\/rest\/acfs\/add/).respond(function(method, url, data) { return [200, makeToken(data), {}]; });
        $httpBackend.whenPOST(/\/rest\/acfs\/set/).respond(function(method, url, data) { return [200, makeToken(data), {}]; });

        $httpBackend.whenGET(/^app/).passThrough();
        $httpBackend.whenGET(/^\/auth/).passThrough();
        $log.info('runBlock end');

        function makePeople(count) {
            var ret = [];
            for (var i = 0; i < count; i++) {
                ret.push({firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
                          lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
                          organization: organizations[Math.floor(Math.random() * organizations.length)],
                          id: i});
            }
            return ret;
        }

        function randomArray(array, count) {
            var ret = [];
            for (var i = 0; i < count; i++) {
                ret.push(angular.copy(array[Math.floor(Math.random() * array.length)]));
                ret[i].name = ret[i].name + ' ' + (i + 1);
                ret[i].id = i;
            }
            return ret;
        }

        function makeToken(postObject) {
            var iatDate = new Date();
            var expDate = new Date();
            expDate.setDate(expDate.getDate() + 1);
            var jwt = '{"username": "test2","id": ' + 2 + ',"iat": ' + iatDate.getTime() + ', "exp": ' + expDate.getTime() +
                ',"Identity":["-2","admin","Bob","Jones",' + postObject + '],"Authorities":["ROLE_ADMIN"] }';
            var tokenPrefix = 'eyJhbGciOiJSUzI1NiJ9.';
            var tokenSuffix = '.ikmHaBO5ou10Sh-ai394CUSz0RJR4KkZyxH2d-0csFnHtGuUZUNM5Di3YZ-dP6LThUE565maAHY--NLgyhRIye7K5OU2C9RlDSq3G0VrtIxp7czkEw7-R7TGsr7uqIE86THwkqzcrQ2FYsYF4WM4gK0flkaQ3MVD5tLc7e-BAAn0cQGoOjpTJOnC9tdx3LAJBykFU_guZPJFoIe5z0HZi2vqKUb3D_RUAXIyN_eQHZpuqYlFaTOKky9BgbcTyofvSBqBI4mHhn-L7r9dGEHjVIFVcqViqdP_TJzZwGY6G-7eVSEB8NNeqgqJbTjNVVn3xIOQFL5jK1MFHce1v4_XCA'
            var token = tokenPrefix + $window.btoa(jwt) + tokenSuffix;
            return token
        }
    }

})();
