var gulp = require("gulp");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
 
gulp.task("es6ify", function() {
    return gulp.src("src/js/*.js")
      .pipe(babel({
        presets: ['es2015', 'react']
      }))
      .pipe(gulp.dest("dist/js"));
});

gulp.task("es6ify-test", function() {
    return gulp.src("src/js/tests/*.js")
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest("dist/js/tests"));
});
gulp.task("sassify", function() {
    return gulp.src("src/css/*.scss")
      .pipe(sass().on("error", sass.logError));

});

gulp.task("css-port", function() {
    return gulp.src("src/css/*.css")
      .pipe(gulp.dest("dist/css"));
});

gulp.task("map-port", function() {
    return gulp.src("src/css/*.map")
      .pipe(gulp.dest("dist/css"));
});

var notify = function(e) {
    console.log(e.path + " has changed");
};

var watch1 = gulp.watch("src/js/*.js", ["es6ify"]);
watch1.on("change", notify);
var watch2 = gulp.watch("src/**/*.scss", ["sassify"]);
watch2.on("change", notify);
var watch3 = gulp.watch("src/**/*.css", ["css-port"]);
watch3.on("change", notify);
var watch4 = gulp.watch("src/**/*.map", ["map-port"]);
watch4.on("change", notify);
var watch5 = gulp.watch("src/js/tests/**/*.js", ["es6ify-test"]);
watch5.on("change", notify);