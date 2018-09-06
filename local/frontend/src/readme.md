npm install
gulp dev
gulp build


##png-страйты
png-файлы помещаются в папку images/sprite
####Тегом в html
```html
<i class="ic ic-name"></i>
```
####Стилями
```scss
.block {
    @extend .ic;
    @extend .ic-name;
 }
```
##svg-страйты
####Тегом svg в html
Файлы svg помещать в папку images/svg.
Такие изображения должны быть однотонными,
для них можно задавать в стилях цвет (fill),
размер (font-size), цвет и размер бордеров (stroke).
```html
<svg class="icon icon-name">
    <use xlink:href="images/sprite.svg#name"></use>
</svg>
```
####Стилях
Файлы svg помещать в папку images/svg-bg.
Стили таких иконок не изменяются.
```scss
.block {
    @include sprite(name);
 }
```