requirejs.config({
    baseUrl: "lib",
    paths: {
        activity: "../js"
    }
});

requirejs(["activity/activity"]);
var ctx;

var mode = 0;
function $(id) {
return document.getElementById(id);
}
function Point(x, y, z) {
this.x3D = x;
this.y3D = y;
this.z3D = z;

this.x2D = x;
this.y2D = y;
this.scale = 5;
this.active = false;
}
var pi2 = Math.PI * 2;
var line_start = -1;
var drag_item = -1;
var intro_seed = 0.3;
var intro_step = 0;
var points = null;
var lines = null;
var rotation = new Point(0, 0, 0);
var mouse = {x:0, y:0};
var relative = {x:0, y:0};
var sin = new Array();
var cos = new Array();
function msin(a) {
window.status++;
return sin[(360 + a % 360) % 360];
}
function mcos(a) {
return cos[(360 + a % 360) % 360];
}
var objects = {


cube: [
[-50,-50,-50],
[50,-50,-50],
[50,-50,50],
[-50,-50,50],
[-50,50,-50],
[50,50,-50],
[50,50,50],
[-50,50,50]
],

};
var intro_balls = new Array(
[275, 140, 7.5],
[275, 157, 4.1],
[275, 200, 3],
[275, 243, 4.1],
[275, 260, 7.5]);
function changeObject(ref) {
points = [];
lines = [];
for (var i in objects[ref]) {
var X = objects[ref][i];
points.push(new Point(X[0], X[1], X[2]));
}
}
changeObject('cube');
this.init();
function init() {
ctx = $('canvas').getContext('2d');
for (var i = 0; i < 5; i++) {
ctx.fillStyle = 'rgba(6, 6, 6,'+intro_seed+')';
ctx.beginPath();
ctx.arc(intro_balls[i][0], intro_balls[i][1], 3, 0, pi2, true);
ctx.closePath();
ctx.fill();
}
for (var i = 0; i < 360; i++) {
sin[i] = Math.sin(i / 180 * Math.PI);
cos[i] = Math.cos(i / 180 * Math.PI);
}
relative.x = $('hull').offsetLeft + 5;
relative.y = $('hull').offsetTop + 5;
window.setTimeout(intro2(), 500);
}

function intro2() {
function intro_point(x, y, point, sa, ca) {
x+= (point[0] - x) * ca + (point[1] - y) * sa;
y+= (point[1] - y) * ca - (point[0] - x) * sa;
ctx.fillStyle = 'rgb(4, 4, 4)';
ctx.beginPath();
ctx.arc(x, y, point[2], 0, pi2, true);
ctx.closePath();
ctx.fill();
}
var ca = mcos(intro_seed);
var sa = msin(intro_seed);
var cm = mcos(-intro_seed);
var sm = msin(-intro_seed);
if (intro_seed <= 90) {
ctx.clearRect(0, 0, 850, 800);
intro_point(275, 200, intro_balls[4], sm,cm);
intro_point(275, 200, intro_balls[0], sa,ca);
intro_point(275, 200, intro_balls[4], sa,ca);
intro_point(275, 200, intro_balls[0], sm,cm);
} else {
ctx.clearRect(228, 153, 94, 94);
}
intro_point(275, 200, intro_balls[1], sm,cm);
intro_point(275, 200, intro_balls[2], sm,cm);
intro_point(275, 200, intro_balls[3], sm,cm);
intro_point(275, 200, intro_balls[1], sa,ca);
intro_point(275, 200, intro_balls[3], sa,ca);
intro_seed+= 5;
if (intro_seed <= 270) window.setTimeout(intro2, 20);
else start();
}
function transform(rot){
ctx.clearRect(0, 0, 750, 700);
var sx = msin(rot.x3D);
var cx = mcos(rot.x3D);
var sy = msin(rot.y3D);
var cy = mcos(rot.y3D);
var sz = msin(rot.z3D);
var cz = mcos(rot.z3D);
var x,y,z, x1,x2, y1,y2, z1,z2;
var i = points.length;
while (i--){
x = points[i].x3D;
y = points[i].y3D;
z = points[i].z3D;
x1 = cz*x - sz*y;
y1 = sz*x + cz*y;
z1 = z;
x2 = x1;
y2 = y1*cx - z1*sx;
z2 = y1*sx + z1*cx;
points[i].x3D = x2*cy - z2*sy;
points[i].y3D = y2;
points[i].z3D = x2*sy + z2*cy;
var ratio = 300 / (300 + points[i].z3D);
points[i].x2D = points[i].x3D * ratio + 275;
points[i].y2D = points[i].y3D * ratio + 200;
points[i].scale = -points[i].z3D / 30 + 15;
if(points[i].active) {
ctx.fillStyle = '#F00000';
} else {
ctx.fillStyle = '#9EA2A7';
}
ctx.beginPath();
ctx.arc(points[i].x2D, points[i].y2D, points[i].scale, 0, pi2, true);
ctx.closePath();
ctx.fill();
}
ctx.strokeStyle = '#000000';
for (var i=0; i<lines.length; i++) {
ctx.beginPath();
ctx.moveTo(points[lines[i][0]].x2D, points[lines[i][0]].y2D);
ctx.lineTo(points[lines[i][1]].x2D, points[lines[i][1]].y2D);
ctx.closePath();
ctx.stroke();
}
}
function draw() {
ctx.clearRect(0, 0, 850, 800);
ctx.strokeStyle = '#000000';
for (var i=0; i<lines.length; i++) {
ctx.beginPath();
ctx.moveTo(points[lines[i][0]].x2D, points[lines[i][0]].y2D);
ctx.lineTo(points[lines[i][1]].x2D, points[lines[i][1]].y2D);
ctx.closePath();
ctx.stroke();
}
for (var i=0; i < points.length; i++) {
if(points[i].active) {
ctx.fillStyle = '#F00000';
} else {
ctx.fillStyle = '#000000';
}
ctx.beginPath();
ctx.arc(points[i].x2D, points[i].y2D, points[i].scale, 0, pi2, true);
ctx.closePath();
ctx.fill();
}
}
function start() {
$('canvas').onmousedown = function (e) {
var x = e.pageX - relative.x;
var y = e.pageY - relative.y;
if (mode != 10 && mode != 1) for (var i=points.length; i--; ) {
if (
points[i].x2D <= x + points[i].scale && x <= points[i].x2D + points[i].scale &&
points[i].y2D <= y + points[i].scale && y <= points[i].y2D + points[i].scale) {
switch (mode) {
case 0:
points[i].active = true;
drag_item = i;
break;
case 2:
var tmp1 = [];
var tmp2 = [];
for (var j=0; j < points.length; j++) {
if (i != j) {
tmp1.push(points[j]);
}
}
for (var j=0; j < lines.length; j++) {
var x = lines[j];
if (x[0] != i && i != x[1]) {
tmp2.push([x[0] - (i < x[0]), x[1] - (i < x[1])]);
}
}
points = tmp1;
lines = tmp2;
break;
case 3:
if (line_start != -1) {
lines.push([line_start, i]);
}
line_start = i;
points[i].active = true;
}
draw();
break;
}
}
}
$('canvas').onmouseup = function () {
if (drag_item != -1) {
points[drag_item].active = false;
drag_item = -1;
}
draw();
}
$('canvas').onclick = function (e) {
var x = e.pageX - relative.x;
var y = e.pageY - relative.y;
if(mode == 1) {
points.push(new Point(x - 275, y - 200, 0));
rotation.x3D = rotation.y3D = 0;
transform(rotation);
}
}
$('canvas').onmousemove = function (e) {
var x = e.pageX - relative.x;
var y = e.pageY - relative.y;
if (drag_item != -1) {
with (points[drag_item]) {
x2D = x;
y2D = y;
var ratio = (300 + z3D) / 300;
x3D = (x2D - 275) * ratio;
y3D = (y2D - 200) * ratio;
}
}
mouse.x = x;
mouse.y = y;
draw();
}
document.onkeydown = function (e) {
var code = e.keyCode || e.charCode;
if (mode == 0) switch (code) {
case 17:
mode = 1;
break;
case 32:
mode = 2;
break;
case 16:
mode = 3;
break;
case 37:
rotation.x3D=0;
rotation.y3D=2;
rotation.z3D=0;
transform(rotation);
break;
case 39:
rotation.x3D=0;
rotation.y3D=-2;
rotation.z3D=0;
transform(rotation);
break;
case 38:
rotation.x3D=2;
rotation.y3D=0;
rotation.z3D=0;
transform(rotation);
break;
case 40:
rotation.x3D=-2;
rotation.y3D=0;
rotation.z3D=0;
transform(rotation);
break;

} else if (code == 32 && mode == 10) {
mode = 0;
}
}
document.onkeyup = function () {
if (mode == 3) {
if (this.line_star != -1) {
points[line_start].active = false;
line_start = -1;
}
for (var i=0; i<lines.length; i++) {
points[lines[i][0]].active = false;
points[lines[i][1]].active = false;
}
}
draw();
if (mode != 10) {
mode = 0;
}
}
transform(rotation);
}
function my(){
    ctx.clearRect(0, 0, 850, 800);
    changeObject('null');

}
