/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files, and ! in front of an expression to ignore files.)
 *
 * For more information see:
 *   https://github.com/balderdashy/sails-docs/blob/master/anatomy/myApp/tasks/pipeline.js.md
 */


// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
'/bower_components/bootstrap/dist/css/bootstrap.css',
'https://cdn.jsdelivr.net/flexboxgrid/6.3.0/flexboxgrid.min.css',
'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Load sails.io before everything else
  'js/dependencies/sails.io.js',

  '/bower_components/jquery/dist/jquery.js',
  '/bower_components/angular/angular.js',
  '/bower_components/angular-ui-router/release/angular-ui-router.js',
  '/bower_components/angular-ui-router/release/angular-ui-router.js',
  'bower_components/momentjs/min/moment.min.js',
  'bower_components/momentjs/min/locales.min.js',
  'bower_components/humanize-duration/humanize-duration.js',
  '/bower_components/angular-timer/dist/angular-timer.js',
  '/bower_components/angular-aria/angular-aria.js',
  '/bower_components/angular-animate/angular-animate.js',
  '/bower_components/angular-material/angular-material.js',
  '/bower_components/bootstrap/dist/js/boostrap.js',
  '/bower_components/angular-material-data-table/dist/md-data-table.min.js',
  '/bower_components/angular-material-icons/angular-material-icons.js',
  '/bower_components/angular-cookies/angular-cookies.js',

  // Dependencies like jQuery, or Angular are brought in here
  'js/dependencies/**/*.js',

  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  'js/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];

module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});



