/**
* @type {Gulp}
 */
let gulp = require('gulp'),
    uglifyjs = require('gulp-uglify-es').default,
    babel = require('gulp-babel'),
    pump = require('pump'),
    concat = require('gulp-concat'),
    //purgeSourcemaps = require('gulp-purge-sourcemaps'),
    configJs = require('./configuration.json'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload
;


gulp.task('scripts', function (done) {
    let packages = configJs.packages;
    for (let param in packages) {
        if (packages.hasOwnProperty(param)) {
            pump(
                gulp.src(packages[param]),
                concat(param + '.js', {newLine: ';'}),
                gulp.dest(configJs.destinationFolder)
            );
        }
    }
    done();
});
gulp.task('scripts-minify', function (done) {
    let packages = configJs.packages;
    for (let param in packages) {
        if (packages.hasOwnProperty(param)) {
           pump(
                gulp.src(packages[param]),
                concat(param + '.min.js', {newLine: ';'}),
                uglifyjs({ mangle: { toplevel: true } }).on('error', function(error){
                    console.log(error);
                }),
                gulp.dest(configJs.destinationFolder)
           );
        }
    }
    done();
});
gulp.task('scripts-minify-es2015', function (done) {
    let packages = configJs.packages;
    for (let param in packages) {
        if (packages.hasOwnProperty(param)) {
            pump(
                gulp.src(packages[param]),
                concat(param + '-es2015.min.js', {newLine: ';'}),
                babel({
                    presets: [
                        [
                            "@babel/preset-env", {
                                "modules": false
                            }
                        ]
                    ],
                    babelrc: false,
                    exclude: 'node_modules/**'
                }).on('error', function(error){
                    console.log(error);
                }),
                uglifyjs({ mangle: { toplevel: true } }).on('error', function(error){
                    console.log(error);
                }),
                gulp.dest(configJs.destinationFolder)
            );
        }
    }
    done();
});
gulp.task('build-minify', gulp.parallel('scripts', 'scripts-minify', 'scripts-minify-es2015'));
gulp.task('watch', function(){
    gulp.watch(
        'scripts/*.js',
        {interval: 1500},
        gulp.series('scripts-minify-es2015', 'scripts-minify', 'scripts')
    );
});
gulp.task('serve', function(){
    browserSync.init({
        server : {
            baseDir : '/data/fastJs/'
        }
    });

    browserSync.watch('dist/scripts/*.js').on('change', reload);
    browserSync.watch('*.html').on('change', reload);
});
