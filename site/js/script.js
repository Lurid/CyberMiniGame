
{ // core
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

}



{ // variables

{ // cell states
var values = ["1C", "55", "E9", "7A", "BD"];
}

{ // field
var FP = false; //field play
var FP_enabled = false;


var FP_fixed_side = true; // true - col; false - row
var FP_start_side;
var FP_fixed_row_number = -1;
var FP_fixed_col_number = -1;

var buffer_size = 6;
var field_top_cell_active

var focused_cell_hovered;
var focused_cell_target;
var focused_cell_click;

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
var FRL_C; //field back rows
var FCL_C; //field back cols
var field_cells_list;
var field_cells_list_by_id;
var field_cells_list_by_coord;

var field_top_cell_list;

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
	
	page_body = document.body;
	
	create_table();
	
    combin_body = document.getElementById("combin-body");
    combin_row_prefab = document.getElementById("combin-row-prefab");
    combin_cell_prefab = document.getElementById("combin-cell-prefab");
	
	
	//document.querySelector(".ground_cell").style.cursor = "default";
	//console.log('style = (' + window.getComputedStyle(document.querySelector(".ground_cell")).cursor + ')'); //removeAttr('cursor')

	/*
	let my_arrr = [1, 2, 3];
	console.log("include (2) = " + my_arrr.includes(2));
	*/

	/*
	let SF = {
		list: [],
		row: [],
		col: []
	};

	let k = 0;
	for(let i = 0; i < sizee; i++) {
		for(let j = 0; j < sizee; j++) {
			if (i == 0) {
				SF.row[j] = [];
				SF.col[j] = [];
			}
			SF.list[k] = {
				r: i,
				c: j,
				value: false,
				data: []
			};

			SF.row[i][j] = SF.list[k];
			SF.col[j][i] = SF.list[k];

			k++;
		}
	}
	
	console.log("SF.list[0] 1 = " + SF.list[0].data.includes(true));
	SF.list[0].data[1] = true;
	console.log("SF.list[0] 2 = " + SF.list[0].data.includes(true));

	
	console.log("SF.list[0] 3 = " + SF.list[0].data[2]);
	*/

	//SF.list[0].value = true;
	//console.log("SF.row[0][0] = " + SF.row[0][1].value);

	//let date = new Date(Date.now() + 86400e3);
	//date = date.toUTCString();
	//document.cookie = "user=John; expires=" + date;

	let in_c = getCookie("in_count");

	if ( isNaN(in_c)) {
		in_c = 0;
	}

	in_c++;

	setCookie("in_count", in_c, {'max-age': 3600});

	console.log("cookie=(" + document.cookie + ")");

	new_game();
});

window.addEventListener('resize', function(event) {
	page_body.style.marginLeft = "-" + (page_body.clientWidth % 2) + "px";
}, true);

function create_table(){
	removeAllChildNodes(field_rows_parent);
	removeAllChildNodes(field_cols_parent);
	removeAllChildNodes(field_cells_parent);
	
	sizee = Number(document.getElementsByClassName('table_size')[0].value);
	
	FRL_C = []
	FCL_C = [];
	field_cells_list = [];
	field_cells_list_by_coord = [];
	let c = 0;
	let tr_cols = field_cols_parent.insertRow();
	for (let i = 0; i < sizee; i++) {
		FRL_C[i] = field_row_prefab.cloneNode(true);
		field_rows_parent.appendChild(FRL_C[i]);
		
		FCL_C[i] = field_col_prefab.cloneNode(true);
		tr_cols.appendChild(FCL_C[i]);
		
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
				b_border: td.children[0],
				s_border: td.children[1],
				x: i,
				y: j,
				value: -1,
				chosen: false
			};
			field_cells_list[c] = obj;
			
			field_cells_list_by_coord[i][j] = obj;
			
			c++;
     	}
   	}
	
	for(let j = 0; j < 4; j++) {
		removeAllChildNodes(arrow_parents[j]);
		for(let i = 0; i < sizee; i++) {
			let chld = arrow_prefabs[j].cloneNode(true);
			chld.querySelector('.tri-poligon-final').style.animation = 
			"1s tyda " + (-1 + (((i + 1) / sizee) / 2)) + "s infinite";
			arrow_parents[j].appendChild(chld);
		}
	}
	
	removeAllChildNodes(field_top_cell_parent);
	field_top_cell_list = [];
	field_top_cell_active = 0;
	for(let i = 0; i < buffer_size; i++) {
		let obj = field_top_cell_prefab.cloneNode(true);
		field_top_cell_list[i] = {
			object: obj,
			text_: obj.querySelector('.top-cell-text'),
			border_clip: obj.querySelector('.poligontc'),
			line_: obj.querySelector('.poligontc2')
		};
		field_top_cell_parent.appendChild(field_top_cell_list[i].object);
	}
	
	synthetic_field = {
		list: [],
		row: [],
		col: []
	};
}
}

var FP_fixed_side_synth = FP_fixed_side;
var FP_fixed_col_number_synth = FP_fixed_col_number;
var FP_fixed_row_number_synth = FP_fixed_row_number;

var my_missions = [];
var synthetic_field;
function CreateMissions() {
	let sizes_of_mission = [2,3,4];
	for(let i= 0; i < 3; i++) {
		my_missions[i] = CreateOneMission(sizes_of_mission[i], i);
	}
}

function CreateOneMission(sizes_of_mission, number_of_mission) {
	//let field_bool1 = Object.assign([], field_bool);
	//console.log("field_bool1 = [" + field_bool1.length + "][" + field_bool1[0].length + "]");

	FP_fixed_side_synth = FP_fixed_side;
	FP_fixed_col_number_synth = FP_fixed_col_number;
	FP_fixed_row_number_synth = FP_fixed_row_number;
	
	
	//buffer_size
	
	let val2 = [];
	//let val3 = "";
	//let val4 = "";
	for(let j = 0; j < buffer_size; j++) {
		let massive;
		if (FP_fixed_side_synth == true) {
			massive = synthetic_field.col[FP_fixed_col_number_synth].filter(function(element) {
				return element.data[number_of_mission] == undefined;
			});
		} else {
			massive = synthetic_field.row[FP_fixed_row_number_synth].filter(function(element) {
				return element.data[number_of_mission] == undefined;
			});
			//FP_fixed_col_number_synth
		}
		//val4 += "["+(FP_fixed_side_synth ? 1 : 0)+" "+(FP_fixed_side_synth ? FP_fixed_col_number_synth : FP_fixed_row_number_synth)+" ("+massive.map(function (x) { return "["+(x.r+1)+","+(x.c+1)+"]-"+values[x.value]+"] "; }).join(',')+") ";
		let rand_value = getRandomInt(0, massive.length);

		let obj = massive.at(rand_value);
		obj.data[number_of_mission] = true;

		val2[j] = obj.value; //values[obj.value] + "["+(obj.r+1)+","+(obj.c+1)+"]"
		//val3 += "["+(obj.r+1)+","+(obj.c+1)+"]-"+values[obj.value]+"] ";
		//val4 += rand_value + "("+values[obj.value]+") ]\r\n";

		if (FP_fixed_side_synth == true) {
			FP_fixed_row_number_synth = obj.r;
		} else {
			FP_fixed_col_number_synth = obj.c;
		}
		FP_fixed_side_synth = !FP_fixed_side_synth;

		//val2[j] = values[getRandomInt(0, values.length)];
	}
	//console.log("val3=( "+val3+" )\r\nval4=( \r\n"+val4+" )");

	let offset = getRandomInt (0, (buffer_size - sizes_of_mission));
	val2 = val2.slice(offset, offset + sizes_of_mission);
	
	

	let h_v;
	
	/*let val1 = [];
	for(let j = 0; j < sizes_of_mission; j++) {
			val1[j] = getRandomInt(0, values.length);
			//field_virtual[i][j]
	}*/
	
	let obj2 = combin_row_prefab.cloneNode(true);
	
	let new_mission = {
			obj: obj2,
			cells_parent: obj2.querySelector('.combin-cell-parent'),
			cells: [],
			value: [],
			stage: 0,
			complited: false,
			tracing: false,
			win: -1,
			
			mission_text: obj2.querySelector('#mission-text'),
			mission_back: obj2.querySelector('#mission-back')
	};
	combin_body.appendChild(new_mission.obj);
		
	for(let j = 0; j < sizes_of_mission; j++) {
			new_mission.cells[j] = combin_cell_prefab.cloneNode(true);
			new_mission.value[j] = val2[j]; // val2
			new_mission.cells[j].innerHTML = values[val2[j]]; // val2
			new_mission.cells[j].style.content = '\"' + val2[j] + '\"' ; // val2
			
			new_mission.cells_parent.appendChild(new_mission.cells[j]);
	}
		
	return new_mission;
}

function MissionsClickEvent(valuee) {
	field_top_cell_list[field_top_cell_active].text_.innerHTML = values[valuee];
	field_top_cell_list[field_top_cell_active].line_.classList.remove("top-blink");
	field_top_cell_active++;
	
	let c = 0;
	my_missions.forEach((missions_a) => {
		if (missions_a.complited == false) {
			if ((missions_a.value[missions_a.stage] != valuee) & (missions_a.stage > 0)) {
				missions_a.cells.forEach((cell_a) => {
					cell_a.classList.toggle("combin-cell-correct", false);
				});
				missions_a.stage = 0;

				/*if (missions_a.tracing) {
					//НЕуспешное завершение миссии
				}*/
			}


			if (missions_a.value[missions_a.stage] == valuee) {
				//подсвечивание ячеек миссии
				missions_a.cells[missions_a.stage].classList.toggle("combin-cell-correct", true);
				missions_a.stage++;
				
				if (missions_a.stage == missions_a.value.length) {
					//успешное завершение миссии
					end_mission(missions_a, true);
				}
			}


			if ((missions_a.value.length - missions_a.stage) > (buffer_size - field_top_cell_active)) {
				end_mission(missions_a, false);
			} else if ((((missions_a.value.length - missions_a.stage) < (buffer_size - field_top_cell_active)) == false) &&
			((missions_a.value.length - missions_a.stage) == (buffer_size - field_top_cell_active))) {
				if (missions_a.tracing == false) {
					missions_a.tracing = true;



					/*
				FP_fixed_side_synth = FP_fixed_side;
				FP_fixed_col_number_synth = FP_fixed_col_number;
				FP_fixed_row_number_synth = FP_fixed_row_number;
				*/

				/*
				for (let a = 0; a < (missions_a.value.length - missions_a.stage); a++) {
				
				if (FP_fixed_side_synth == true) {
						synthetic_field.col[FP_fixed_col_number].filter(function(element) {
							return element.data.includes(number_of_mission) == false;
						});
					} else {
						synthetic_field.row[FP_fixed_row_number]
					}
				}
				*/
				}


				//а затем при непервой проверке сверять ячейки
				if (missions_a.tracing == true) {
					//удалять из списка последовательности, которые не соблюдены

					//если доступных последовательностей оказалось ноль, то завершить миссию с провалом
				}

				//при первом достижении "границ", запустить поиск всех доступных последовательностей
				
				

				
				//console.log("CHECK END OF MISSION ["+c+"]");
			}
			c++;
		}

		if (missions_a.complited == false && ((field_top_cell_active) == field_top_cell_list.length)) {
			end_mission(missions_a, false);
		}
	});
}

function end_mission(mission, win) {
	mission.complited = true;
	if (win) {
		mission.mission_text.innerHTML = "Complited!";
		mission.mission_back.style.background = "lime";
	} else {
		mission.mission_text.innerHTML = "Not complited!";
		mission.mission_back.style.background = "red";
	}
}

function DeleteMissions() {
	my_missions.forEach((missions_d) => {
		combin_body.removeChild(missions_d.obj);
	});
	my_missions = [];
}

{ // new game
function recreate_table(){
	create_table();
	new_game();
}

function test_function(){
	
}

function GeneratePseudoNumberList() {
	let percentes = [];
	for (let i = 0; i < values.length; i++) {
		percentes[i] = {
			number: i,
			percent: 100
		};
	}

	let cap = 66.6;
	let randomize_values = 1.5; //1 - все элементы будут в максимально равном количестве, чем больше - тем больше может быть разница (больше 20 - абсолютный рандом)
	let count_of_randomize = 2; //количество сгенерированных чисел, для поиска наименьшего (левого) значения

	//console.log("summ = ("+(percentes.map(function(elem){ return elem.percent;}).reduce((accumulator, curr) => accumulator + curr))+")");

	let my_list = [];
	let prev_percent, summ, random_value, actual_percent;
	let percent_reduce_value = 100 / (((sizee*sizee) / values.length)*1.5);
	
	//console.log("percent_reduce_value="+percent_reduce_value+"");
	for (let i = 0; i < (sizee*sizee); i++) {
		let rand_massive = [];
		for (let l = 0; l < count_of_randomize; l++) {
			rand_massive[l] = getRandomFloat(0, cap);
		}
		random_value = Math.min(...rand_massive); //Math.min(getRandomFloat(0, cap), getRandomFloat(0, cap));

		prev_percent = 0;
		summ = (percentes.map(function(elem){ return elem.percent;}).reduce((accumulator, curr) => accumulator + curr)) + 0.0;
		//console.log("["+i+"] summ="+summ+"");
		let j;
		for (j = 0; j < values.length; j++) {
			actual_percent = (100 * (percentes[j].percent/summ));
			
			if ((random_value >= prev_percent) & (random_value <= (prev_percent + actual_percent))) {
				break;
			}
			prev_percent += actual_percent;
		}
		
		//console.log("{"+random_value.toFixed(2)+"}\tpercentes =[ " + percentes.map(function(elem){ return "[" + elem.number + "]" + (100*(elem.percent/summ)).toFixed(2);}).join(' \t') + " ]"); //

		my_list[i] = percentes[j].number;
		percentes[j].percent -= percent_reduce_value;
		if (percentes[j].percent < 0)
			percentes[j].percent = 0;
		//console.log("["+i+", "+j+"] random_value=( "+random_value+" ) prev_percent=( "+prev_percent+" ) max=( "+(prev_percent + actual_percent)+" ) test=( "+percentes[j].number+", "+percentes[j].percent+" )");
		//console.log("break !!!");

		percentes.sort(function(obj1, obj2) { return obj2.percent - obj1.percent; });
	}

	my_list = my_list.sort(function(){ return Math.random() - 0.5; });

	return my_list;

	//console.log("my_list test = [" + my_list.join(' , ') + "]"); //.map(function(elem){ return elem.name;})
}

var game_created;

var field_virtual;
function new_game(){
	if (FP_enabled == true) {
		end_game();
	}
	
	
	field_cells_list_by_id = [];
	
	FP = false;
	FP_enabled = true;
	
	active_sheet.innerHTML = ".ground_cell { cursor: cell;}";
	
	let my_list = GeneratePseudoNumberList();
	/*for (let i = 0; i < (sizee*sizee); i++) {
		my_list[i] = getRandomInt(0, values.length);
	}*/

	field_virtual = [];
	let k = 0;
	for (let i = 0; i < sizee; i++) {
		field_virtual[i] = [];
    	for (let j = 0; j < sizee; j++) {
			field_virtual[i][j] = my_list[k];
			k++;
		}
	}
	
	let type_count = [];
	for (let i = 0; i < sizee; i++) {
    	for (let j = 0; j < sizee; j++) {
			let obj = field_cells_list_by_coord[i][j];
			
			obj.value = field_virtual[i][j];
			obj.b_border.classList.toggle('ground_cell_text', false);
			obj.chosen = false;
			
			if (field_cells_list_by_id[field_virtual[i][j]] == undefined)
			{
				field_cells_list_by_id[field_virtual[i][j]] = [];
				type_count[field_virtual[i][j]] = 0;
			}
			//console.log(`field_cells_list_by_id[${field_virtual[i][j]}][${type_count[field_virtual[i][j]]}] = ${obj}`);
			field_cells_list_by_id[field_virtual[i][j]][type_count[field_virtual[i][j]]] = obj;
			type_count[field_virtual[i][j]]++;
			
         	obj.b_border.innerHTML = values[field_virtual[i][j]];
		}
		
	}
	
	FP_start_side = getRandomInt(0, 4);
	
	if ((FP_start_side == 0) | (FP_start_side == 2)) FP_fixed_side = false;
	if ((FP_start_side == 1) | (FP_start_side == 3)) FP_fixed_side = true;
	if (FP_start_side == 0) FP_fixed_row_number = 0;
	if (FP_start_side == 2) FP_fixed_row_number = sizee - 1;
	if (FP_start_side == 1) FP_fixed_col_number = 0;
	if (FP_start_side == 3) FP_fixed_col_number = sizee - 1;
    set_time(field_time/1000);
	
	timer_bar.style.animation = "0";
	timer_bar.style.width = '100%';
	
	for(let j = 0; j < 4; j++) {
		if (j == FP_start_side) {
			arrow_parents[j].style.opacity = '1';
		}
		else {
			arrow_parents[j].style.opacity = '0';
		}
	}
	
	//стартовое подсвечивание начальной линии
	strange_func(true);
	
	//active_sheet.innerHTML = ".ground_cell { cursor: cell;}";

	k = 0;
	for(let i = 0; i < sizee; i++) {
		for(let j = 0; j < sizee; j++) {
			if (i == 0) {
				synthetic_field.row[j] = [];
				synthetic_field.col[j] = [];
			}
			synthetic_field.list[k] = {
				r: i,
				c: j,
				value: field_cells_list_by_coord[i][j].value,
				data: []
			};

			synthetic_field.row[i][j] = synthetic_field.list[k];
			synthetic_field.col[j][i] = synthetic_field.list[k];

			k++;
		}
	}
	
	DeleteMissions();
	
	CreateMissions();
	
	field_top_cell_active = 0;
	
	field_top_cell_list.forEach((top_cell) => {
		top_cell.text_.innerHTML = "";
	});
}

function end_game(){
	timer_bar.style.animationPlayState = "paused";
	set_time(timer_interval/1000);
	clearInterval(timer);
	
	active_sheet.innerHTML = ".ground_cell { cursor: default;}";
			
	/* удаление стиля для мигания ячеек, и выключение подсвечивания ячеек в правом меню */
	
	RowColFunc(false, focused_cell_hovered, true);
	
	strange_func(false, true);
	
	FP = false;
	FP_enabled = false;
	
	//active_sheet.innerHTML = ".ground_cell { cursor: default; pointer-events: 'none';}";
	
	//console.log('game is ended 6 !');
}

function strange_func (enable, extra = false) {
	let r = 0, c = 0;
	let r_state = false, c_state = false;
	if (FP_fixed_side == false) {
		r = FP_fixed_row_number;
		r_state = enable;
	} else {
		c = FP_fixed_col_number;
		c_state = enable;
	}
	
	if (extra == true) {
		r_state = false;
		c_state = false;
	}
	
	RowColSimpleFunction(r, c, r_state, c_state);
}

}

{ // events

function new_game_click() {
	new_game();
}

function mouseenterF(event) {
	if (FP_enabled != false) {
		focused_cell_hovered = field_cells_list[parseInt((event.target.style.content).replace('\"', ''))];
		RowColFunc(true, focused_cell_hovered);
	}
}

function mouseleaveF(event) {
	if (FP_enabled != false) {
		focused_cell_hovered = field_cells_list[parseInt((event.target.style.content).replace('\"', ''))];
		RowColFunc(false, focused_cell_hovered);
	}
}

function RowColFunc(enter_or_exit, selected_obj1, by_clicked = false) {
	selected_obj1.b_border.classList.toggle("ground_cell_border", enter_or_exit);
	
	let r = selected_obj1.x;
	if (FP_fixed_side == false) r = FP_fixed_row_number;
	let c = selected_obj1.y;
	if (FP_fixed_side == true) c = FP_fixed_col_number;
	
	//if (field_cells_list_by_coord[r][c].cell.style.pointerEvents != 'none') {
	focused_cell_target = field_cells_list_by_coord[r][c];
	
	if (FP_enabled != false) {
	if (enter_or_exit == true) {
		RowColTopCell(true, focused_cell_target.value);
	} else {
		RowColTopCell(false);
	}
	
	if (enter_or_exit == true && focused_cell_target.chosen == false) {
		focused_cell_target.s_border.style.opacity = '1';
	}
	else {
		focused_cell_target.s_border.style.removeProperty('opacity');
	}
	RowColBackground(enter_or_exit, r, c, by_clicked, focused_cell_target.chosen);
	}
	
	
	//}
}

function RowColTopCell(enter_or_exit, value = -1) {
	if ((field_top_cell_active + 1) < field_top_cell_list.length) {
		if (enter_or_exit == true & value != -1)
			field_top_cell_list[field_top_cell_active].text_.innerHTML = values[value];
		else
			field_top_cell_list[field_top_cell_active].text_.innerHTML = "";
		field_top_cell_list[field_top_cell_active].text_.classList.toggle("top-cell-text-active", enter_or_exit);
		field_top_cell_list[field_top_cell_active].line_.classList.toggle("top-blink", enter_or_exit);
		field_top_cell_list[field_top_cell_active].border_clip.classList.toggle("poligontc-focus", enter_or_exit);
	}
}

function RowColBackground(enter_or_exit, r, c, by_clicked, is_chosen) {
	if (FP_enabled != false) {
	if ((enter_or_exit == true)) {
		if (is_chosen != true) {
			RowColSimpleFunction(r, c, true, true);
		}
	} else 
	{
		if (by_clicked == true) 
				RowColSimpleFunction(r, c, false, false);
		 else {
			if(FP_fixed_side == true) 
				RowColSimpleFunction(r, c, false, true);
			 else 
				RowColSimpleFunction(r, c, true, false);
			
		}
		
	}
	}
}

function RowColSimpleFunction(r, c, r_state, c_state) {
	if (r_state == false)
		FRL_C[r].style.removeProperty('opacity');
	else
		FRL_C[r].style.opacity = '1';
	if (c_state == false)
		FCL_C[c].style.removeProperty('opacity');
	else
		FCL_C[c].style.opacity = '1';		
}

	
function mouseenterWT(event) { //watch type
	if (FP_enabled != false) {
		let selected_obj = parseInt((event.target.style.content).replace('\"', ''));
		field_cells_list_by_id[selected_obj].forEach((cell_f) => {
			if (cell_f.chosen == false)
				cell_f.b_border.classList.toggle('ground_cell_highlight', true);
		});
	}
}
function mouseleaveWT(event) {
	if (FP_enabled != false) {
		let selected_obj = parseInt((event.target.style.content).replace('\"', ''));
		field_cells_list_by_id[selected_obj].forEach((cell_f) => {
				cell_f.b_border.classList.toggle('ground_cell_highlight', false);
		})
	}
}


function mouseclickF(event) {
	let selected_obj = field_cells_list[parseInt((event.target.style.content).replace('\"', ''))];
	
	let r = selected_obj.x;
	if (FP_fixed_side == false) r = FP_fixed_row_number;
	let c = selected_obj.y;
	if (FP_fixed_side == true) c = FP_fixed_col_number;
	
	focused_cell_click = field_cells_list_by_coord[r][c];
	
	
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
		if (focused_cell_click.chosen == false) {
		RowColFunc(false, focused_cell_click, true);
		
		focused_cell_click.b_border.innerHTML = "(" + (field_top_cell_active + 1) + ")";
		focused_cell_click.b_border.classList.toggle("ground_cell_text", true);
		focused_cell_click.chosen = true;
		//focused_cell_click.cell.style.pointerEvents = 'none';
		
		MissionsClickEvent(focused_cell_click.value);
		
		
			FP_fixed_side = !FP_fixed_side;
		
			if (FP_fixed_side == false) {
				FP_fixed_row_number = focused_cell_click.x;
			} else {
				FP_fixed_col_number = focused_cell_click.y;
			}
			
			RowColFunc(true, selected_obj);

		if (my_missions.filter(d => d.complited == false).length == 0) {
			RowColFunc(false, selected_obj);

			end_game();
		}
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
