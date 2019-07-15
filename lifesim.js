var SCREEN_SIZE_H = 700;                    // キャンバスの幅
var SIDE_CELLS_H = 50;                     // 一辺のセルの数
var SCREEN_SIZE_W ;                    // キャンバスの幅
var SIDE_CELLS_W ;                     // 一辺のセルの数
var CELL_SIZE = SCREEN_SIZE_H / SIDE_CELLS_H; // セルの幅
var FPS = 6;                             // フレームレート
var canvas;                     //= document.getElementById('world');
var context;                    //= canvas.getContext('2d');
var thrPop = 29;
var maxPop = 7;

window.onload = function() {
    SIDE_CELLS_W = Math.floor(SIDE_CELLS_H*window.innerWidth/window.innerHeight)
    SCREEN_SIZE_W = SCREEN_SIZE_H * SIDE_CELLS_W / SIDE_CELLS_H
    var scaleRate = window.innerHeight/SCREEN_SIZE_H; // Canvas引き伸ばし率の取得
    var field = new Array(SIDE_CELLS_H*SIDE_CELLS_W); // フィールド情報
    var tempField = new Array(SIDE_CELLS_H*SIDE_CELLS_W); // フィールド情報の一時記憶用
    for (var i=0; i<field.length; i++) field[i] = Math.floor(Math.random()*10); // ランダムに「生」「死」を格納
    canvas = document.getElementById('world'); // canvas要素を取得
    canvas.height = SCREEN_SIZE_H; // キャンバスのサイズを設定
    canvas.width  = SCREEN_SIZE_W; // キャンバスのサイズを設定
    canvas.style.width = SCREEN_SIZE_W * scaleRate+'px';
    canvas.style.height = SCREEN_SIZE_H * scaleRate+'px';  // キャンバスを引き伸ばし
    
    context = canvas.getContext('2d');                // コンテキスト
    update(field, tempField);   // ゲームループ開始
}

function update(field, tempField) {
    var n = 0;                    // 自身のまわりにある「生」の数
    tempField = field.slice(); // 複製
    for (var i=0; i<tempField.length; i++) {
        n = 0;
        for (var s=-1; s<2; s++) {
            for (var t=-1; t<2; t++) {
                if (s==0 && t==0) continue; // 自身はカウントしない
                var c = i+s*SIDE_CELLS_W+t;   // チェックするセル
                if (c<0) { c+=tempField.length; }
                if (c>=tempField.length) { c-=tempField.length; }
                if (t==-1 && i%SIDE_CELLS_W==0){c+=SIDE_CELLS_W;}
		if (t==1  && c%SIDE_CELLS_W==0){c-=SIDE_CELLS_W;}
                if (tempField[c]) n +=tempField[c]; // 「生」だったらカウント
            }
        }
        if (n  < thrPop) { 
        	 field[i] = tempField[i] + n - thrPop + maxPop;    // 「生」
        } else { field[i] = tempField[i] + thrPop- n + maxPop; }
	if( field[i] < 0){ field[i] = 0;}
	if( field[i] > 9){ field[i] = 9;}
    }
    draw(field);                                    // canvasを更新
    setTimeout(update, 1000/FPS, field, tempField); // 再帰
}

function draw(field) {
    context.clearRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H); // 画面をクリア
    for (var i=0; i<field.length; i++) {
        var x = (i%SIDE_CELLS_W)*CELL_SIZE;             // x座標
        var y = Math.floor((i/SIDE_CELLS_W))*CELL_SIZE; // y座標
   	 context.fillStyle = 'hsl(100,100%,'+ (field[i] * 8) +'%)';          // 色
        if (field[i]) context.fillRect(x, y, CELL_SIZE, CELL_SIZE); // 「生」を描画
    }
}