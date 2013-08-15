var chars = [' ','.','-',':',';','i','c','x','%','#'];

var canvas = document.getElementById('myCanvas');
var text = document.getElementById('text');
var inp = document.getElementById('slide'); inp.value = '1';
var ctx = canvas.getContext('2d');

var image = new Image();
image.src = 'picture.png';
var brArray = [];
text.innerHTML = 'Loading..';
var data;
image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    var imageData = ctx.getImageData(0,0, image.width, image.height);

	//ctx.drawImage(image,0,0);
	//var imageData = ctx.getImageData(0,0, image.width, image.height);
	data = imageData.data;
	text.innerHTML = "";
	for (var y = 0; y < image.height; ++y) {
		var tmp = [];
		for (var x = 0; x < image.width; ++x) {
			var ind = (image.width*y+x)*4;
			var bright = (255-(0.34 * data[ind] + 0.5*data[ind+1] + 0.16*data[ind+2]))*(data[ind+3]/255);
			tmp.push(bright);
			//console.log('bright of ['+x+']['+y+'] = ' + bright);
			text.innerHTML += chars[Math.floor((bright/256)*chars.length)];
		}
		brArray.push(tmp);
		text.innerHTML += '<br>';
	}
}

function imgToAscii(ratio) {
	text.innerHTML = "Loading...";
	var tmp = "";
	for (var y = 0; y < image.height; y+=ratio) {
		for (var x = 0; x < image.width; x+=ratio) {
			var bright = 0;

			for (var ty = y; ty < y+ratio; ++ty) {
				for (var tx = x; tx < x+ratio; ++tx) {
					if (ty < image.height && tx < image.width)
						bright += brArray[ty][tx];
				}
			}
			bright /= Math.min(ratio, image.height-y)*Math.min(ratio, image.width-x);
			tmp += chars[Math.floor((bright/256)*chars.length)];
		}
		tmp+= '<br>';
	}
	text.innerHTML = tmp;
}
inp.onchange = function() {
	imgToAscii(parseInt(inp.value));
}



image.onerror = function() {
	canvas.style.display = 'none';
	text.style.fontSize = '1em';
	text.innerHTML = 'Wrong image source, please try to leave the prompt empty';
    
}