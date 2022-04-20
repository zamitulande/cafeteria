const {src, dest, watch, series} = require('gulp');

//css y sass
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano')

//imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif')

function css( done){
    //compilar sass en tres pasos
    // 1- identificar archivo
    // 2- compilar
    // 3- guardar en css

    src ('src/scss/app.scss').pipe(sourcemaps.init())
                             .pipe(sass()) //comprimir o expandir el código css
                             .pipe(postcss([autoprefixer(), cssnano()])) // en el package.json se coloca el brawserlist
                             .pipe(sourcemaps.write('.'))
                             .pipe(dest('build/css'));
    
    done();
}
function imagenes(done){
    src('src/img/**/*').pipe(imagemin({optimizationLevel: 3}))//primero se deben optimizar antes de pasar al pipe que las carga al build
                        .pipe(dest('build/img'));

    done();
}
function imagenwebp(done){
    const opciones={
        quality: 50
    }
    src('src/img/**/*.*').pipe(webp(opciones))
                                   .pipe(dest('build/img'));
    done();
}
function imagenavif(){
    const opciones={
        quality: 50
    }
    return src('src/img/**/*.*').pipe(avif(opciones))
                                         .pipe(dest('build/img'));
}
function dev(){
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes)
}
exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.imagenwebp = imagenwebp;
exports.imagenavif = imagenavif;
exports.default = series(imagenes,imagenwebp, imagenavif, css, dev);
