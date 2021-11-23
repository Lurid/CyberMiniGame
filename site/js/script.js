
{ // core
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
}

{ // variables

{ // cell states
var values = ["1C", "55", "E9", "7A", "BD"];
}

{ // field
var FP = false; //field play
var FP_enabled = true;

var FP_fixed_side = true;
var FP_start_side;
var FP_fixed_row_number = -1;
var FP_fixed_col_number = -1;

var field_top_cell_active = 0;

var focused_cell_hovered;
var focused_cell_target;

var sizee;
}

{ // static
var field_row_prefab;
var field_col_prefab;
var field_cell_prefab;
var field_top_cell_prefab;

var field_rows_parent;
var field_cols_parent;
var field_cells_parent;
var field_top_cell_parent;

var arrow_parents = [];
var arrow_prefabs = [];
}
	
{ // dynamic
var field_rows_list;
var field_cols_list;
var field_cells_list;
var field_cells_list_by_id;
var field_cells_list_by_coord;

var field_top_cell_list = [];

var page_body;
var active_sheet;
}
	
}

{ // on create

document.addEventListener("DOMContentLoaded", function(){
	
    field_row_prefab = document.getElementById("field_row_prefab");
    field_col_prefab = document.getElementById("field_col_prefab");
    field_cell_prefab = document.getElementById("field_cell_prefab");
    field_top_cell_prefab = document.getElementById("field_top_cell_prefab");
	field_row_prefab.removeAttribute('id');
	field_col_prefab.removeAttribute('id');
	field_cell_prefab.removeAttribute('id');
	field_top_cell_prefab.removeAttribute('id');
	
	timer_text1 = document.getElementById("timer_text1");
	timer_text2 = document.getElementById("timer_text2");
	timer_bar = document.getElementById("progress_bar");
	
	field_rows_parent = document.getElementById("field_rows_parent");
	field_cols_parent = document.getElementById("field_cols_parent");
	field_cells_parent = document.getElementById("field_cells_parent");
	field_top_cell_parent = document.getElementById("field_top_cell_parent");
	
	arrow_parents[0] = document.getElementById("arrow_top");
    arrow_parents[1] = document.getElementById("arrow_left");
    arrow_parents[2] = document.getElementById("arrow_bottom");
    arrow_parents[3] = document.getElementById("arrow_right");
	
    arrow_prefabs[0] = document.getElementById("arrow_top_prefab");
    arrow_prefabs[1] = document.getElementById("arrow_left_prefab");
    arrow_prefabs[2] = document.getElementById("arrow_bottom_prefab");
    arrow_prefabs[3] = document.getElementById("arrow_right_prefab");
	
	active_sheet = document.createElement('style');
	active_sheet.innerHTML = ".ground_cell { cursor: cell;}"; //default
	document.head.appendChild(active_sheet);
	
	create_table();
	
	for(let j = 0; j < 4; j++) {
		for(let i = 0; i < sizee; i++) {
			let chld = arrow_prefabs[j].cloneNode(true);
			chld.querySelector('.tri-poligon-final').style.animation = 
			"1s tyda " + (-1 + (((i + 1) / sizee) / 2)) + "s infinite";
			arrow_parents[j].appendChild(chld);
		}
	}
	
	//document.querySelector(".ground_cell").style.cursor = "default";
	//console.log('style = (' + window.getComputedStyle(document.querySelector(".ground_cell")).cursor + ')'); //removeAttr('cursor')
	
	for(let i = 0; i < 4; i++) {
		let obj = field_top_cell_prefab.cloneNode(true);
		field_top_cell_list[i] = {
			object: obj,
			text_: obj.querySelector('.top-cell-text'),
			border_clip: obj.querySelector('.poligontc'),
			line_: obj.querySelector('.poligontc2')
		};
		field_top_cell_parent.appendChild(field_top_cell_list[i].object);
	}
	
	FP_start_side = getRandomInt(0, 4);
	
	if ((FP_start_side == 0) | (FP_start_side == 2)) FP_fixed_side = false;
	if ((FP_start_side == 1) | (FP_start_side == 3)) FP_fixed_side = true;
	if (FP_start_side == 0) FP_fixed_row_number = 0;
	if (FP_start_side == 2) FP_fixed_row_number = sizee - 1;
	if (FP_start_side == 1) FP_fixed_col_number = 0;
	if (FP_start_side == 3) FP_fixed_col_number = sizee - 1;
    set_time(field_time/1000);
	
	
	
	for(let j = 0; j < 4; j++) {
		if (j == FP_start_side)
			arrow_parents[j].style.visibility = 'visible';
		else
			arrow_parents[j].style.visibility = 'hidden';
	}
	
	page_body = document.body;
	console.log('page_body = (' + page_body + ')');
	
	new_game();
});

window.addEventListener('resize', function(event) {
	page_body.style.marginLeft = "-" + (page_body.clientWidth % 2) + "px";
}, true);
}

{ // new game
function create_table(){
	removeAllChildNodes(field_rows_parent);
	removeAllChildNodes(field_cols_parent);
	removeAllChildNodes(field_cells_parent);
	
	sizee = Number(document.getElementsByClassName('table_size')[0].value);
	
	field_rows_list = []
	field_cols_list = [];
	field_cells_list = [];
	field_cells_list_by_coord = [];
	let c = 0;
	let tr_cols = field_cols_parent.insertRow();
	for (let i = 0; i < sizee; i++) {
		field_rows_list[i] = field_row_prefab.cloneNode(true);
		field_rows_parent.appendChild(field_rows_list[i]);
		
		field_cols_list[i] = field_col_prefab.cloneNode(true);
		tr_cols.appendChild(field_cols_list[i]);
		
		field_cells_list_by_coord[i] = [];
	}
  	for (let i = 0; i < sizee; i++) {
    	let tr = field_cells_parent.insertRow();
    	for (let j = 0; j < sizee; j++) {
      		let td = field_cell_prefab.cloneNode(true);
			tr.appendChild(td);
			
			td.style.content = "'" + c + "'";
			
			let obj = {
				cell: td,
				b_border: td.children[1],
				s_border: td.children[0],
				x: i,
				y: j,
				value: -1
			};
			field_cells_list[c] = obj;
			
			field_cells_list_by_coord[i][j] = obj;
			
			c++;
     	}
   	}
}

function new_game(){
	field_cells_list_by_id = [];
	
	let type_count = [];
	
	for (let i = 0; i < sizee; i++) {
    	for (let j = 0; j < sizee; j++) {
			let val = getRandomInt(0, values.length);
			
			let obj = field_cells_list_by_coord[i][j];
			
			obj.value = val;
			
			if (field_cells_list_by_id[val] == undefined) 
			{
				field_cells_list_by_id[val] = [];
				type_count[val] = 0;
			}
			//console.log(`field_cells_list_by_id[${val}][${type_count[val]}] = ${obj}`);
			field_cells_list_by_id[val][type_count[val]] = obj;
			type_count[val]++;
			
         	obj.s_border.appendChild(document.createTextNode(values[val]));
		}
		
	}
}

function end_game(){
		timer_bar.style.animationPlayState = "paused";
		set_time(timer_interval/1000);
		clearInterval(timer);
	
		active_sheet.innerHTML = ".ground_cell { cursor: default;}";
			
		FP = false;
		FP_enabled = false;
			
		if (focused_cell_hovered != null) 
			focused_cell_hovered.s_border.style.removeProperty('border-color');
			
		/* удаление стиля для мигания ячеек, и выключение подсвечивания ячеек в правом меню */
			
		RowColFunc(false, focused_cell_hovered);
	}
}

{ // events

function mouseenterF(event) {
	if (FP_enabled != false) {
	focused_cell_hovered = field_cells_list[parseInt((event.target.style.content).replace('\"', ''))];
	focused_cell_hovered.s_border.style.borderColor = 'var(--main-color2)';
	
	/* добавление стиля для мигания ячеек, и включение подсвечивания ячеек в правом меню */
	
	RowColFunc(true, focused_cell_hovered);
	}
}

function mouseleaveF(event) {
	if (FP_enabled != false) {
	focused_cell_hovered = field_cells_list[parseInt((event.target.style.content).replace('\"', ''))];
	focused_cell_hovered.s_border.style.removeProperty('border-color');
	
	/* удаление стиля для мигания ячеек, и выключение подсвечивания ячеек в правом меню */
	
	//focused_cell_hovered.b_border.style.removeProperty('opacity');
	
	RowColFunc(false, focused_cell_hovered);
	}
}

function RowColFunc(enter_or_exit, selected_obj1, by_clicked = false) {
	let r = selected_obj1.x;
	if (FP_fixed_side == false) r = FP_fixed_row_number;
	let c = selected_obj1.y;
	if (FP_fixed_side == true) c = FP_fixed_col_number;
	
	focused_cell_target = field_cells_list_by_coord[r][c];
	
	if (FP_enabled != false) {
	field_top_cell_list[field_top_cell_active].text_.classList.toggle("top-cell-text-active");
	field_top_cell_list[field_top_cell_active].line_.classList.toggle("top-blink");
	field_top_cell_list[field_top_cell_active].border_clip.classList.toggle("poligontc-focus");
	if (enter_or_exit == true) {
		field_top_cell_list[field_top_cell_active].text_.innerHTML = values[focused_cell_target.value];
		//field_top_cell_list[field_top_cell_active].text_.style.opacity = '1';
	} else {
		field_top_cell_list[field_top_cell_active].text_.innerHTML = "";
		if (by_clicked == false) {
			//field_top_cell_list[field_top_cell_active].text_.style.opacity = '0';
		}
	}
	}
	
	if ((enter_or_exit == true) & (focused_cell_target.cell.style.pointerEvents != 'none')) {
	if (FP_enabled == true) {
	focused_cell_target.b_border.style.opacity = '1';
	field_rows_list[r].style.opacity = '1';
	field_cols_list[c].style.opacity = '1';
	}
	} else {
	focused_cell_target.b_border.style.removeProperty('opacity');
	field_rows_list[r].style.removeProperty('opacity');
	field_cols_list[c].style.removeProperty('opacity');
	}
}

	
function mouseenterWT(event) { //watch type
	if (FP_enabled != false) {
		let selected_obj = parseInt((event.target.style.content).replace('\"', ''));
		field_cells_list_by_id[selected_obj].forEach((cell_f) => {
			if (cell_f.cell == event.target) 
				cell_f.s_border.style.borderColor = 'var(--main-color3)';
				else
				cell_f.s_border.style.borderColor = 'var(--main-color1)';
		})
	}
}
function mouseleaveWT(event) {
	if (FP_enabled != false) {
		let selected_obj = parseInt((event.target.style.content).replace('\"', ''));
		field_cells_list_by_id[selected_obj].forEach((cell_f) => {
				cell_f.s_border.style.removeProperty('border-color');
		})
	}
}


function mouseclickF(event) {
	let selected_obj = field_cells_list[parseInt((event.target.style.content).replace('\"', ''))];
	
	let r = selected_obj.x;
	if (FP_fixed_side == false) r = FP_fixed_row_number;
	let c = selected_obj.y;
	if (FP_fixed_side == true) c = FP_fixed_col_number;
	
	let selected_obj1 = field_cells_list_by_coord[r][c];
	
	
	if (FP == false & FP_enabled == true) { // start timer action
	 // elfkbnm cnhtkrb
	
		arrow_parents[FP_start_side].style.opacity = '0';
	
		FP = true;
	
		timer_interval = field_time;
		/* selected_obj.value */
		timer_bar.style.animation = "bar-animation " + (field_time / 1000) + "s linear";
		timer_bar.style.width = '0%';
	
		timer = setInterval(function () {
		let seconds = timer_interval/1000;
		
		
		
		// остановка таймера 
		if (timer_interval <= 0) {
			end_game();
		} else {
			set_time(seconds);
		}
		timer_interval -= field_time_step;
		}, field_time_step);
	}
	
	if (FP == true & FP_enabled == true) {
		selected_obj1.s_border.innerHTML = "(  )";
		selected_obj1.s_border.style.color = "var(--main-color5)";
		selected_obj1.cell.style.pointerEvents = 'none';
		
		RowColFunc(false, selected_obj1, true);
		
		field_top_cell_list[field_top_cell_active].text_.innerHTML = values[selected_obj1.value];
		field_top_cell_list[field_top_cell_active].line_.classList.remove("top-blink");
		field_top_cell_active++;
		
		if ((field_top_cell_active + 1) > field_top_cell_list.length) { // "или" (проверка возможности закрыть оставшиеся комбинации)
			end_game();
		} else {
		FP_fixed_side = !FP_fixed_side;
		
		if (FP_fixed_side == false) {
			FP_fixed_row_number = selected_obj1.x;
		} else {
			FP_fixed_col_number = selected_obj1.y;
		}
		RowColFunc(true, selected_obj);
		}
	} 	
}

}

{ // time
var timer_text1;
var timer_text2;
var timer_bar;

var field_time = 10000;
var field_time_step = 100; //длина шага

var timer;
var timer_interval = 0;

function set_time(seconds) {
	let strTimer = (seconds.toFixed(1)).toString().split(".");
        timer_text1.innerHTML = strTimer[0];
        timer_text2.innerHTML = strTimer[1];
}

}
