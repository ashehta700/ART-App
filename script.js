var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = 1100;
var ch = 700;
var dx = 0;
var dy = 0;
var draw = false;
var mode = "move";
var drag = false;
var point = function(x, y) {
        this.x = x;
        this.y = y;
    }
    //build a function for all shapes to call it
var shape = function(type, beginX, beginY, endX, endY, stroke, fill, lineWidth) {
        this.type = type || "line";
        this.begin = new point(beginX, beginY);
        // we make the end point array for the free point
        this.end = new Array();
        this.end.push(new point(endX, endY));
        this.strokeStyle = stroke;
        this.fillStyle = fill;
        this.lineWidth = lineWidth;
    }
    //make the default board in first
var board = new Array();
board.push(new shape('rect', 0, 0, cw, ch, '#ffffff', '#ffffff', 3));

function drawBoard(board) {
    //we loop in a default board
    for (var i in board) {
        var obj = board[i];
        ctx.lineWidth = obj.lineWidth;
        ctx.fillStyle = obj.fillStyle;
        ctx.strokeStyle = obj.strokeStyle;

        switch (obj.type) {
            //this for line draw
            case "line":
                ctx.beginPath();
                ctx.moveTo(obj.begin.x - dx, obj.begin.y - dy);
                ctx.lineTo(obj.end[0].x - dx, obj.end[0].y - dy);
                ctx.stroke();
                break;
                //this for rectangle draw
            case "rect":
                var w = obj.end[0].x - obj.begin.x;
                var h = obj.end[0].y - obj.begin.y;
                ctx.fillRect(obj.begin.x - dx, obj.begin.y - dy, w, h);
                ctx.strokeRect(obj.begin.x - dx, obj.begin.y - dy, w, h);
                break;
                //this for circle
            case "circle":
                ctx.beginPath();
                var r = Math.sqrt(Math.pow((obj.end[0].x - obj.begin.x), 2) + Math.pow((obj.end[0].y - obj.begin.y), 2));;
                ctx.arc(obj.begin.x - dx, obj.begin.y - dy, Math.abs(r), 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                break;
                // this for free
            case "free":
                ctx.beginPath();
                ctx.moveTo(obj.begin.x - dx, obj.begin.y - dy);
                for (var x in obj.end)
                    ctx.lineTo(obj.end[x].x - dx, obj.end[x].y - dy);
                ctx.stroke();
                break;
        }
    }
}
$('#canvas').on('mousedown', function(e) {
    if (mode == "move") {
        drag = true;
        dx = e.clientX - canvas.getBoundingClientRect().left;
        dy = e.clientY - canvas.getBoundingClientRect().top;
    } else {
        draw = true;
        dx = $('#draw').position().left;
        dy = $('#draw').position().top;
        if (mode == "erase")
            board.push(new shape("free", e.clientX, e.clientY, e.clientX, e.clientY, "#ffffff", "#ffffff", $('#lineWidth').val()));
        else
            board.push(new shape(mode, e.clientX, e.clientY, e.clientX, e.clientY, $('#strokeStyle').val(), $('#fillStyle').val(), $('#lineWidth').val()));
    }
});
$('#canvas').on('mouseup', function(e) {
    if (draw)
        draw = false;
    else
        drag = false;
    drawBoard(board);
});
$('#canvas').on('mousemove', function(e) {
    if (draw) {
        if (mode == "free" || mode == "erase") {
            board[board.length - 1].end.push(new point(e.clientX, e.clientY));
        } else {
            board[board.length - 1].end[0].x = e.clientX;
            board[board.length - 1].end[0].y = e.clientY;
        }
        drawBoard(board);
    } else if (drag) {
        $('#draw').css({ 'left': (e.clientX - dx) + 'px' });
        $('#draw').css({ 'top': (e.clientY - dy) + 'px' });
    }
});
$('.shape').on('click', function(e) {
    chmode($(this).attr('id'));
});

function chmode(newMode) {
    $('#' + mode).removeClass('selected');
    $('#' + mode).css('background-position-x', '0');
    $('#' + newMode).addClass('selected');
    $('#' + newMode).css('background-position-x', '-30px');
    mode = newMode;
    if (mode == "move")
        $("#canvas").css('cursor', 'default');
}