//引入插件
var gulp = require('gulp');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var postcss = require('gulp-postcss');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');

//使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: './',
        livereload: true,
        port: 8010,
        middleware: function (connect, opt) {
            return [
                proxy('/event', {
                    target: 'http://10.10.0.206:9095/',
                    changeOrigin:true
                })
            ]
        }
    });
});

// sass生成css
gulp.task('sass2css', function () {
	gulp.src('./src/sass/**/*.scss')
	.pipe(sass())
    .pipe(autoprefix('last 2 version'))
	.pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());
})

// js
gulp.task('js2js', function () {
    gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload());
})

// 图片深度压缩
gulp.task('Imagemin', function () {
    gulp.src('./img/**/*.{png,jpg,jpeg,gif,ico}')
    .pipe(cache(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('./dist/img/'))
})

// 监听HTML和css页面热重载
gulp.task('watch', function () {
	gulp.watch(['./src/sass/**/*.scss'], ['sass2css']);
    gulp.watch(['./src/js/**/*.js'], ['js2js']);
    gulp.watch(['./src/*.html'], ['html']);
});

gulp.task('html', function () {
    gulp.src('./src/*.html')
        .pipe(connect.reload())
        .pipe(gulp.dest('./dist/'));
});


//运行Gulp时，默认的Task
gulp.task('default', ['connect', 'watch']);