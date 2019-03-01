window.onload = function() {

    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");

    file.onchange = function() {
        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();

        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;

        var bufferLength = analyser.frequencyBinCount;

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        ctx.strokeStyle = "#f1f1f1";
        ctx.fillStyle = "#f1f1f1";

        function draw(circRadius){
            for (var i = 0; i < 4; i++) {
                    ctx.beginPath();
                    var x = WIDTH / 2; // x coordinate
                    var y = HEIGHT / 2; // y coordinate
                    var radius = circRadius * 1.5; // Arc radius
                    var startAngle = 0; // Starting point on circle
                    var endAngle = 2 * Math.PI; // End point on circle
                    var anticlockwise = i % 2 !== 0; // clockwise or anticlockwise

                    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

                    var r = (circRadius / bufferLength) * 256 + 50;
                    var g = 150;
                    var b = 0;

                    ctx.strokeStyle = "rgb(" + 0 + "," + 0 + "," + 0 + ")";
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

                    if (i > 1) {
                        ctx.fill();
                    } else {
                        ctx.stroke();
                    }
            }
        }

        function drawCircles(numCircles){
            var radii = [];
            for(var i = 0; i < numCircles; i++){
                var radius = 0;
                for(var j = (bufferLength / numCircles) * i; j < (bufferLength / numCircles) * (i + 1); j++){
                    radius += dataArray[Math.floor(j)];
                }
                radius = radius / (bufferLength / numCircles);
                radii.push(radius);
            }

            radii.sort(function(a,b){return b-a});

            for(var k = 0; k < radii.length; k++){
                draw(radii[k]);
            }
        }

        var smallRadius = 0;
        var largeRadius = 0;
        var radius = 0;


        function renderFrame() {
            requestAnimationFrame(renderFrame);

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            //for (var i = 0; i < bufferLength; i++) {
             //   radius += dataArray[i];
            //}

            for (var i = 0; i < bufferLength / 2; i++){
                smallRadius += dataArray[i];
            }
            for (var i = bufferLength/ 2; i < bufferLength; i++){
                largeRadius += dataArray[i];
            }

            radius = radius / bufferLength;

            smallRadius = smallRadius / (bufferLength / 2);
            largeRadius = largeRadius / (bufferLength / 2);

            drawCircles(7);

            //draw(smallRadius);
            //draw(largeRadius * 1.5);

        }



        audio.play();
        renderFrame();
    };
};