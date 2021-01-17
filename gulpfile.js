const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass");
const csso = require("gulp-csso");
const include = require("gulp-file-include");
const del = require("del");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const sync = require("browser-sync").create();

function html() {
  return src("app/**.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist"));
}

function images() {
  return src("app/images/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/images"));
}

function svg() {
  return src("app/svg/**/*")
    .pipe(dest("dist/svg"));
}

function scss() {
  return src("app/scss/**.scss")
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 version"],
        cascade: false,
      })
    )
    .pipe(csso())
    .pipe(concat("style.css"))
    .pipe(dest("dist"));
}

function clear() {
  return del("dist");
}

function serve() {
  sync.init({
    server: "./dist",
  });

  watch("app/**html", series(html)).on("change", sync.reload);
  watch("app/scss/**.scss", series(scss)).on("change", sync.reload);
}

exports.build = series(clear, scss, html, images, svg);
exports.serve = series(clear, scss, html, images, svg, serve);
exports.images = images;
exports.clear = clear;
