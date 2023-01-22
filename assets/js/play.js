var matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [0, 7, 8]
];

var secs = 0;
var currentSeconds = 0;
var currentMinutes = 0;
var timer;

// gọi sự kiện bắt đầu game khi ấn nút play
$("#container-play").bind("click", function () {
    initialize();
    beginTime();
    $("#alert_puzzle").text("");
})

// Khi click vào 1 sô thì gọi đến hàm move để di chuyển
$("#puzzle .cell-puzzle").bind("click", function () {
    if (secs > 0) {
        var obj = $(this);
        move(obj);
    }
})

// hàm init game, gọi 1 dãy số từ 1 đến 8 bất kì, sắp xếp các element theo dãy số đó để bắt đầu game
function initialize() {
    var arrRandomNumber = shuffleMatrix();
    console.log(arrRandomNumber)

    var count = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var number = arrRandomNumber[count];
            matrix[i][j] = number;

            if (i == 2 && j == 2) {
                matrix[i][j] = 0;
            }

            $("#puzzle .cell-puzzle[number=" + number + "]").css("top", i * 110 + "px");
            $("#puzzle .cell-puzzle[number=" + number + "]").css("left", j * 110 + "px");
            count++;
        }
    }
}

// hàm tạo dãy số bất kì từ 1 đến 8
function shuffleMatrix() {
    var arr = [];
    while (arr.length < 8) {
        var r = Math.floor(Math.random() * 8) + 1;
        if (arr.indexOf(r) === -1) arr.push(r);
    }

    return arr;
}

// hàm bắt đầu đếm giờ
function beginTime() {
    secs = 0;
    currentSeconds = 0;
    currentMinutes = 0;
    clearTimeout(timer);
    intervalTime();
}

// hàm đếm giờ
function intervalTime() {
    currentMinutes = Math.floor(secs / 60);
    currentSeconds = secs % 60;

    if (currentMinutes <= 9) {
        currentMinutes = "0" + currentMinutes;
    }

    if (currentSeconds <= 9) {
        currentSeconds = "0" + currentSeconds;
    }

    secs++;
    $("#board-time").text(currentMinutes + ":" + currentSeconds);
    timer = setTimeout('intervalTime()', 1000);
}

// hàm di chuyển các ô.
function move(obj) {
    var numberCell = parseFloat(obj.attr("number"));
    var win = false;

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (matrix[i][j] == numberCell) {
                if (j > 0 && matrix[i][j - 1] == 0) {
                    $("#puzzle .cell-puzzle[number=0]").css("left", j * 110 + "px");
                    obj.animate({
                        'left': (j - 1) * 110 + 'px'
                    }, 300);

                    matrix[i][j - 1] = numberCell;
                    matrix[i][j] = 0;

                } else if (j < 2 && matrix[i][j + 1] == 0) {
                    $("#puzzle .cell-puzzle[number=0]").css("left", j * 110 + "px");
                    obj.animate({
                        'left': (j + 1) * 110 + 'px'
                    }, 300);

                    matrix[i][j + 1] = numberCell;
                    matrix[i][j] = 0;

                } else if (i > 0 && matrix[i - 1][j] == 0) {
                    $("#puzzle .cell-puzzle[number=0]").css("top", i * 110 + "px");
                    obj.animate({
                        'top': (i - 1) * 110 + 'px'
                    }, 300);

                    matrix[i - 1][j] = numberCell;
                    matrix[i][j] = 0;

                } else if (i < 2 && matrix[i + 1][j] == 0) {
                    $("#puzzle .cell-puzzle[number=0]").css("top", i * 110 + "px");
                    obj.animate({
                        'top': (i + 1) * 110 + 'px'
                    }, 300);

                    matrix[i + 1][j] = numberCell;
                    matrix[i][j] = 0;
                }

                win = checkWin();
                if (win) {
                    break;
                }

                return;
            }
        }
    }
}

// hàm kiểm tra và báo chiến thắng
function checkWin() {
    var winner = false;
    var winString = "1,2,3,4,5,6,0,7,8";
    var loseString = "1,2,3,4,5,6,0,8,7";

    var matrixStr = matrix.toString();

    if (winString == matrixStr) {
        clearTimeout(timer);
        // $("#alert_puzzle").text("Bạn đã chiến thắng. Kỷ lục của bạn là " + $("#board-time").text());
        alert("Bạn đã chiến thắng. Kỷ lục của bạn là " + $("#board-time").text())

    } else if (loseString == matrixStr) {
        // $("#alert_puzzle").text('Bạn không có hy vọng để chiến thắng. Ấn nút "click to play" để chơi game mới');
        alert('Bạn không có hy vọng để chiến thắng. Ấn nút "click to play" để chơi game mới')
    }
}