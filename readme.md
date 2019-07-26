npm install  
gulp dev  
gulp build 

## svg sprites
#### 1
```html
<svg class="icon icon-name">
    <use xlink:href="images/sprite.svg#name"></use>
</svg>
```
#### 2
```scss
.block {
    @include sprite(name);
 }
```
## png sprites
#### 1
```html
<i class="ic ic-name"></i>
```
#### 2
```scss
.block {
    @extend .ic;
    @extend .ic-name;
 }
```