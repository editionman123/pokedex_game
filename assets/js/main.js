var test;
const loadMoreButton = document.getElementById('loadMoreButton')
const selectGen = document.getElementById('select_gen')
const limit = 20;
const maxRecords = {"gen_1": 152-1, "gen_2": 252-152, "gen_3": 387-252, "gen_4":494-387,"gen_5":650-494,"gen_6":722-650,"gen_7":810-722,"gen_8":906-810,"gen_9":1011-906};
let countRecords = 0
const generations = {"1": 1, "2": 101, "3": 3, "4":4, "5":5,"6":6,"7":7,"8":8,"9":9};
var gen=1;
let offset = 0;
var pokedex={};
var p_monsters=document.getElementById("frame_pokedex");
const pokelist = document.getElementById('pokedex_slots');
var p_details=document.getElementById("frame_monster");
var detlist = document.getElementById('content_boxs');
var action=false;
var url_img2="https://raw.githubusercontent.com/editionman123/pokedex_v3/master/assets/img/pokemons/poke_";
var qualitys={1:"low",2:"mid",3:"monsters"};

/*
https://raw.githubusercontent.com/editionman123/pokemon/main/monsters/101/skin/start/0/1.gif
*/

var url_img='https://raw.githubusercontent.com/editionman123/pokemon/main/'+qualitys[3]+'/';
var url_img_o='/storage/emulated/0/Download/github-pokemon/'+qualitys[3]+'/';
var types={
    0:"",
    1:"Steel",
    2:"Water",
    3:"Bug",
    4:"Dragon",
    5:"Electric",
    6:"Ghost",
    7:"Fire",
    8:"Fairy",
    9:"Ice",
    10:"Fighting",
    11:"Normal",
    12:"Grass",
    13:"Psychic",
    14:"Rock",
    15:"Dark",
    16:"Ground",
    17:"Poison",
    18:"Flying",
};
var colors={
    0:"",
    1:"#B7B7CE",
    2:"#6390F0",
    3:"#A6B91A",
    4:"#6F35FC",
    5:"#F7D02C",
    6:"#735797",
    7:"#EE8130",
    8:"#D685AD",
    9:"#96D9D6",
    10:"#C22E28",
    11:"#A8A77A",
    12:"#7AC74C",
    13:"#F95587",
    14:"#B6A136",
    15:"#705746",
    16:"#E2BF65",
    17:"#A33EA1",
    18:"#A98FF3",
};

var socket=null;
var test;
function connect_socket(host) {
	try{
		socket = io.connect(host,{transports:['websocket']});
		//console.log("Note: ","Connected to Pokemon Universe Cross.");
	}catch(err){
	}
	finally{
		socket_reciver();
	}
}
function socket_reciver(){
	if(!socket)return;
	socket.on("pokedex_id",(data)=>{
	    let monster={};
	    pokedex[data.id]=data.monster;
	    openbox_skin(data.id,data.skin,data.index,0);
	});
	socket.on("pokedex",(data)=>{
	pokedex=Object.assign(pokedex,data.monsters);
		console.log(Object.keys(data.monsters).length);
		//test=data;		
		//i,"start",0
		Object.keys(data.monsters).forEach(i=>{
		    let card=slot_monster_html(i,data.monsters[i]);
		    pokelist.appendChild(card);
		});
		offset=data.index;
	});
}
connect_socket("https://pokemonuniverse-privado.glitch.me/");



function loadPokemonItens(offset, limit, gen) {
    socket.emit("pokedex",{index:offset,qty:limit,gen:gen});
    switcher_details(false);
}

loadPokemonItens(offset, limit,gen);


loadMoreButton.addEventListener('click', () => {
loadPokemonItens(offset, limit, gen);
})

selectGen.addEventListener('change', () => {
    //console.log(selectGen.value)
    pokelist.innerHTML = '';
    countRecords = 0
    offset = generations[selectGen.value]
    gen=parseInt(selectGen.value);
    
    socket.emit("pokedex_gen",{index:0,qty:limit,gen:gen});
    //loadPokemonItens(offset, limit, gen)
})


function openbox_skin(id,skin_name,skin_id,special=0){
    if(!action)return;//no se ejecuta
    //console.log(id,skin_name,skin_id);
    // 
    detlist.innerHTML="";
    
    if(!pokedex[id]){//
        return socket.emit("pokedex_id",{id:id,skin:skin_name,index:skin_id});
    }
    switcher_details(true);
    
    //let skin_name="start";//este debe venir desde la func
    //let skin_id=0;
    box_monsters_html(id,skin_name,skin_id,special,"skin");
}

function openbox_battleskin(id,skin_name,skin_id,special=0){
    if(!action)return;//no se ejecuta
    //console.log(id,skin_name,skin_id);
    // 
    detlist.innerHTML="";
    
    if(!pokedex[id]){//
        return socket.emit("pokedex_id",{id:id,skin:skin_name,index:skin_id});
    }
    switcher_details(true);
    
     box_monsters_html(id,skin_name,skin_id,special,"battle_skin");
}
































































/*
##########################################
SLOTS#####################################
##########################################
*/


function slot_html(){
    let slot = document.createElement("li");
    slot.setAttribute("class", "slot");
    let card = document.createElement("div");
    card.setAttribute("class", "slot_wrapper");

    const slotInfo = document.createElement("div");
    slotInfo.setAttribute("class", "slot_info");
    const slotImg = document.createElement("div");
    slotImg.setAttribute("class", "slot_img");
    const slotBg = document.createElement("div");
    slotBg.setAttribute("class", "slot_bg");
    const slot3d = document.createElement("div");
    slot3d.setAttribute("class", "slot_3d");

    card.appendChild(slotInfo);
    card.appendChild(slotImg);
    card.appendChild(slotBg);
    slot.appendChild(card);
    slot.appendChild(slot3d);
    return slot;
}
//skn-id
function slot_monster_html(index,data){
    //let monster=pokedex[index];
    let skin=data.skin[data.skin_start][0];
    let number_string=index.toString().padStart(4,"0");
		let types_html=type_html(skin.type_1,skin.type_2);
		let types_bg=type_bg(skin.type_1,skin.type_2);
		let slot=slot_html();
		
		
    slot.setAttribute("id", "pokemon");
    slot.onclick = function() {
        openbox_skin(index,data.skin_start,0);
    }
    
    //principal$$$$$$$$
    let slotCard=slot.querySelector(".slot_wrapper");
    let slotInfo=slot.querySelector(".slot_info");
    let slotImg=slot.querySelector(".slot_img");
    let slotBg=slot.querySelector(".slot_bg");
    let slot3d=slot.querySelector(".slot_3d");
    
    slotCard.style.backgroundImage = `linear-gradient(to bottom, ${types_bg[1]} 0%, ${types_bg[1]} 40%, ${types_bg[2]} 75%, ${types_bg[2]} 100%)`;
    //en slotInfo#########
    const nameSpan = document.createElement("span");
    nameSpan.setAttribute("class", "name");
    nameSpan.textContent = data.monstername;
    const numberSpan = document.createElement("span");
    numberSpan.setAttribute("class", "number");
    numberSpan.textContent = `#${number_string}`;

    const types = document.createElement("ol");
    types.setAttribute("class", "types");
    Object.keys(types_html).forEach((e)=>{
        //types.innerHTML = types_html;
        types.appendChild(types_html[e]);
    });
    slotInfo.appendChild(nameSpan);
    slotInfo.appendChild(numberSpan);
    slotInfo.appendChild(types);
		//en slotImg#########
		//test=data;
    const imgMonster = document.createElement("img");
    imgMonster.setAttribute("class", "imgmonster");
    imgMonster.setAttribute("src", `${url_img}${index}/skin/${data.skin_start}/0/0.gif`);
    imgMonster.setAttribute("alt", "");
    /*imgMonster.loading="lazy";*/
    imgMonster.onerror = function() {
        img_error(this);
    };
    console.log("linea 287 falta cambiar start por default o gender o depende del skin_start")
    console.log(imgMonster.src);
    slotImg.appendChild(imgMonster);
    //en slotBg#########
    const imgBackground = document.createElement("img");
    imgBackground.setAttribute("class", "imgbackground");
    imgBackground.setAttribute("src", "https://pokemoncalc.web.app/en/assets/pokeball.svg");
    imgBackground.setAttribute("alt", "");
    slotBg.appendChild(imgBackground);
    //en slot3d########
    const img3d = document.createElement("img");
    img3d.setAttribute("class", "img3d");
    img3d.setAttribute("src", `${url_img}${index}/skin/${data.skin_start}/0/0.gif`);
    img3d.setAttribute("alt", "");
    /*imgMonster.loading="lazy";*/
    img3d.onerror = function() {
        img_error(this);
    };
    slot3d.appendChild(img3d);
    //return
    return slot;
}


/*
##########################################
BOXS######################################
##########################################
*/


function box_html(){
//h es la altura, por defecto es 100% pero para header debe ser entre 120 y 130px
    let box = document.createElement("div");
    box.setAttribute("class", "box");
    const boxInfo = document.createElement("div");
    boxInfo.setAttribute("class", "box_info");
    const boxImg = document.createElement("div");
    boxImg.setAttribute("class", "box_img");
    const boxBg = document.createElement("div");
    boxBg.setAttribute("class", "box_bg");

    box.appendChild(boxInfo);
    box.appendChild(boxImg);
    box.appendChild(boxBg);
    
    return box;
}


function box_monsters_html(id,skin_name,skin_id,special,type){
    let monster=pokedex[id];
    if(type==="skin")skin_name=(monster[type][skin_name])?skin_name:monster.skin_start;
    
    let skin_monster=monster[type][skin_name][skin_id];
    let skin_default=monster[type][skin_name][0];
    
    let skin=skin_verify(skin_monster,skin_default);
        
    const btnNext=document.createElement("button");
    btnNext.setAttribute("class", "btn_next");
    btnNext.textContent = ">"; btnNext.onclick=function(){
        openbox_skin(parseInt(id)+1,"default",0);
    };
    const btnPrev=document.createElement("button");
    btnPrev.setAttribute("class", "btn_prev");
    btnPrev.textContent = "<"; btnPrev.onclick=function(){
        openbox_skin(parseInt(id)-1,"default",0);
    };
    
    
    let header=box_head_html(id,skin_name,skin_id,special,type);
    let stats=box_stats_html(skin.stats,skin.type_1);
    let evos=box_evos_html(id,skin_name,skin_id,skin.evo);
    let shapes=box_shapes_html(id,monster.skin);
    let specials=box_specials_html(id,skin_name,skin_id,type);
    let battleskin=box_battleskins_html(id,monster.battle_skin);
    
    
    detlist.appendChild(btnNext);
    detlist.appendChild(btnPrev);
    
    detlist.appendChild(header);
    detlist.appendChild(stats);
    detlist.appendChild(evos);
    detlist.appendChild(shapes);
    detlist.appendChild(specials);
    detlist.appendChild(battleskin);
}


function box_head_html(index,skn,id,special,type){
    let box_head=box_html();
    box_head.classList.add("row_midl");
/*VARIABLES*/
    let monster=pokedex[index];
    let skin=monster[type][skn][id];
    let number_string=index.toString().padStart(4,"0");
		let types_html=type_html(skin.type_1,skin.type_2);
		let types_bg=type_bg(skin.type_1,skin.type_2);
		
   box_head.style=`height: 150px; background-image: linear-gradient(to bottom, ${types_bg[1]} 0%, ${types_bg[1]} 40%, ${types_bg[2]} 75%, ${types_bg[2]} 100%);`;
		let head_info=box_head.querySelector(".box_info");
    let head_img=box_head.querySelector(".box_img");
    let head_bg=box_head.querySelector(".box_bg");
		/*---HeadInfo---*/
    const NumberSpan = document.createElement("span");
    NumberSpan.setAttribute("class", "box_number");
    NumberSpan.textContent = `#${number_string}`;
    const NameSpan = document.createElement("span");
    NameSpan.setAttribute("class", "box_name");
    NameSpan.textContent = monster.monstername;
    
    const NameSkinSpan = document.createElement("span");
    NameSkinSpan.setAttribute("class", "box_skin_name");
    NameSkinSpan.textContent = skin.name_skin;
    
    const types = document.createElement("ol");
    types.setAttribute("class", "types");
    Object.keys(types_html).forEach((e)=>{
        types.appendChild(types_html[e]);
    });
    const specieSpan = document.createElement("span");
    specieSpan.setAttribute("class", "specie");
    specieSpan.textContent = skin.specie;
    
    
    head_info.appendChild(NumberSpan);
    head_info.appendChild(NameSkinSpan);
    head_info.appendChild(NameSpan);
    head_info.appendChild(types);
    head_info.appendChild(specieSpan);
		/*---HeadImg---*/
		const imgMonster = document.createElement("img");
    imgMonster.setAttribute("class", "box_imgmonster");
    imgMonster.setAttribute("src", `${url_img}${index}/${type}/${skn}/${id}/${special}.gif`);
    imgMonster.setAttribute("alt", "");
    imgMonster.onerror = function() {
        img_error(this);
    };
    head_img.appendChild(imgMonster);
    /*---HeadBg---*/
		const imgBg = document.createElement("img");
    imgBg.setAttribute("class", "box_imgbackground");
    imgBg.setAttribute("src", "https://pokemoncalc.web.app/en/assets/pokeball.svg");
    imgBg.setAttribute("alt", "");
    imgBg.onerror = function() {
        img_error(this);
    };
    head_bg.appendChild(imgBg);
    //return
    return box_head;
}

function box_stats_html(stats,type1){
    let box_stats=box_html();
    box_stats.classList.add("row_midr");
    let stats_html=func_stats_html(stats,type1);
    
    const titleSpan = document.createElement("span");
    titleSpan.setAttribute("class", "box_title");
    titleSpan.textContent = "Base Stats";

    const statsDiv = document.createElement("div");
    statsDiv.setAttribute("class", "stats");
    statsDiv.innerHTML = stats_html;
    
    box_stats.appendChild(titleSpan);
    box_stats.appendChild(statsDiv);
    
    let head_info=box_stats.querySelector(".box_info");
    let head_img=box_stats.querySelector(".box_img");
    let head_bg=box_stats.querySelector(".box_bg");
    box_stats.removeChild(head_info);
    box_stats.removeChild(head_img);
    box_stats.removeChild(head_bg);
    
    return box_stats;
}


function box_evos_html(id,skin,index,evos){
    let box_evos=box_html();
    box_evos.classList.add("row_full");
    let evo_html=func_evo_html(id,skin,index, evos);
    const titleSpan = document.createElement("span");
    titleSpan.setAttribute("class", "box_title");
    titleSpan.textContent = "Evolutions";

    const evoDiv = document.createElement("div");
    evoDiv.setAttribute("class", "stats");
    evoDiv.innerHTML = evo_html;
    
    box_evos.appendChild(titleSpan);
    box_evos.appendChild(evoDiv);
    
    let head_info=box_evos.querySelector(".box_info");
    let head_img=box_evos.querySelector(".box_img");
    let head_bg=box_evos.querySelector(".box_bg");
    box_evos.removeChild(head_info);
    box_evos.removeChild(head_img);
    box_evos.removeChild(head_bg);
    
    return box_evos;
}


function box_shapes_html(id,shapes){
    box_forms=box_html();
    box_forms.classList.add("row_full");
    let shape_html=func_shape_html(id, shapes);
    
    const titleSpan = document.createElement("span");
    titleSpan.setAttribute("class", "box_title");
    titleSpan.textContent = "Formes";
    box_forms.appendChild(titleSpan);
    
    const shapeDiv = document.createElement("div");
    shapeDiv.setAttribute("class", "stats");
    shapeDiv.innerHTML = shape_html;
    
    box_forms.appendChild(titleSpan);
    box_forms.appendChild(shapeDiv);
    
    let head_info=box_forms.querySelector(".box_info");
    let head_img=box_forms.querySelector(".box_img");
    let head_bg=box_forms.querySelector(".box_bg");
    box_forms.removeChild(head_info);
    box_forms.removeChild(head_img);
    box_forms.removeChild(head_bg);
    return box_forms;
}
function box_specials_html(id,skin_name,skin_id,type){
    box_sp=box_html();
    box_sp.classList.add("row_full");
    let sp_html=func_special_html(id,skin_name,skin_id,type);
    
    const titleSpan = document.createElement("span");
    titleSpan.setAttribute("class", "box_title");
    titleSpan.textContent = "Specials";
    box_sp.appendChild(titleSpan);
    
    const spDiv = document.createElement("div");
    spDiv.setAttribute("class", "stats");
    spDiv.innerHTML = sp_html;
    
    box_sp.appendChild(titleSpan);
    box_sp.appendChild(spDiv);
    
    let head_info=box_sp.querySelector(".box_info");
    let head_img=box_sp.querySelector(".box_img");
    let head_bg=box_sp.querySelector(".box_bg");
    box_sp.removeChild(head_info);
    box_sp.removeChild(head_img);
    box_sp.removeChild(head_bg);
    return box_sp;
}

function box_battleskins_html(id,battleskin){
    box_battle=box_html();
    box_battle.classList.add("row_full");
    let battle_html=func_battles_html(id, battleskin);
    
    const titleSpan = document.createElement("span");
    titleSpan.setAttribute("class", "box_title");
    titleSpan.textContent = "Battle Formes";
    box_battle.appendChild(titleSpan);
    
    const battleDiv = document.createElement("div");
    battleDiv.setAttribute("class", "stats");
    battleDiv.innerHTML = battle_html;
    
    box_battle.appendChild(titleSpan);
    box_battle.appendChild(battleDiv);
    
    let head_info=box_battle.querySelector(".box_info");
    let head_img=box_battle.querySelector(".box_img");
    let head_bg=box_battle.querySelector(".box_bg");
    box_battle.removeChild(head_info);
    box_battle.removeChild(head_img);
    box_battle.removeChild(head_bg);
    return box_battle;
}




















function type_html(type1,type2){
    let result={};
    if(type2){
        result[1] = document.createElement("li");
    result[1].setAttribute("class", `type bg_type_${type1}`);
        result[1].textContent = types[type1];

        result[2] = document.createElement("li");
        result[2].setAttribute("class", `type bg_type_${type2}`);
        result[2].textContent = types[type2];
    }else{
        result[1] = document.createElement("li");
    result[1].setAttribute("class", `type bg_type_${type1}`);
        result[1].textContent = types[type1];
    }
    return result;
}
function func_stats_html(states,type1){
    let result="";
    let stats=Object.keys(states);
    //console.log(Object.keys(skin.stats).length);
    stats.forEach((stat)=>{
    let qty=states[stat];
    result+=`
        <div class="stat-row">
                    <div class="stat-desc">${stat}</div>
                    <div class="stat-number">${qty}</div>
                    <div class="stat-bar">
                        <div class="bar-outer alpha_type_${type1}">
                            <div class="bar-inner bg_type_${type1}" style="width: ${qty/255*100}%"></div>
                        </div>
                    </div>
        </div>
        `;
    });
    return result;
}
function func_evo_html(id,skin,index,evos){
    let result=``;
    if(!evos){
        return result=`
            <span class="info_text">Not found next evolution.</span>
            `;
    }
    let _evo=Object.keys(evos);
    //console.log(_evo.length);
    
    _evo.forEach((evo)=>{
        let e=evos[evo];
        let conditions=func_evo_conditions(e);
        result+=`
        <span class="info_text">${conditions}</span>
        <div class="evo-row">
            <div class="boxy_img">
                <img class="imgevo" src="${url_img}${id}/skin/${skin}/${index}/0.gif" onerror="img_error(this);" alt="">
            </div>
            <div class="boxy_chain">
               <img class="imgarrow" src="https://raw.githubusercontent.com/editionman123/pokemon/main/ux/right-arrow.png" alt=""> 
            </div>
            <div onclick="openbox_skin(${e.to},'${e.skin}',${e.index},0);" class="boxy_img">
                <img class="imgevo" src="${url_img}${e.to}/skin/${e.skin}/${e.index}/0.gif" onerror="img_error(this);" alt="">
            </div>
        </div>
        `;
        
    });
    //console.log(result);
    return result;
}

function func_evo_conditions(e){
    let result=``;
    if(e.level){
        result+=`In Lv.${e.level}+`;
    }if(e.region){
        result+=` in region ${e.region}`;
    }if(e.hold){
        result+=` holding ${e.hold}`;
    }if(e.item){
        result+=` and using ${e.item}`;
    }
    return result;
}

function func_shape_html(id, shapes){
    let result=``;
    let count = 0;
    let count_all=0;
    if(Object.keys(shapes).length<1){
        result=`
            <span class="info_text">Not found formes.</span>
           `;
    }
    Object.keys(shapes).forEach((skin)=>{
        if(skin==="start")return;
        //result=``;
        let count_max=Object.keys(shapes[skin]).length; Object.keys(shapes[skin]).forEach((index)=>{
         if(!count){
             result+=`<div class="evo-row">`;
         }
         if(!count_all){
             result+=`<span class="tituloevo">${skin}</span>`;
         }
         result+=`
         <div class="boxy_img" onclick="openbox_skin(${id},'${skin}',${index},0);">
             
             <img class="imgevo" src="${url_img}${id}/skin/${skin}/${index}/0.gif" onerror="img_error(this);" alt="">
             <span class="textevo">${shapes[skin][index].name_skin}</span>
             
         </div>
         `;
        count++;
        count_all++;
        if(count>3){
            result+=`</div>`;
            count=0;
        }if(count_all>=count_max){
            result+=`</div>`;
            count_all=0;
            count=0;
        }
        
        });
    });
    return result;
}

function func_special_html(id,skin,index,type){
    let result=``;
    let fun="";
    if(type==="skin")fun="openbox_skin";
    else if(type==="battle_skin")fun="openbox_battleskin";
    result+=`<div class="evo-row">`;
         result+=`
         <div onclick="${fun}(${id},'${skin}',${index},0);" class="boxy_img">
                <img class="imgevo" src="${url_img}${id}/${type}/${skin}/${index}/0.gif" onerror="img_error(this);" alt="">
                <span class="textevo">Regular</span>
         </div>
         <div onclick="${fun}(${id},'${skin}',${index},1,'${type}');" class="boxy_img">
                <img class="imgevo" src="${url_img}${id}/${type}/${skin}/${index}/1.gif" onerror="img_error(this);" alt="">
                <span class="textevo">Shiny</span>
         </div>
         `;
        //console.log(shapes[skin][index]);
    result+=`</div>`;
    return result;
}

function func_battles_html(id, battleskin){
    let result=``;
    let count_all=0;
    let count = 0;
    if(!Object.keys(battleskin).length){
        return result=`
            <span class="info_text">Not found battle formes.</span>
            `;
    } Object.keys(battleskin).forEach((bskin)=>{
    let count_max=Object.keys(battleskin[bskin]).length;
         Object.keys(battleskin[bskin]).forEach((index)=>{
         if(!count){
             result+=`<div class="evo-row">`;
         }
         if(!count_all){
             result+=`<p class="tituloevo">${bskin}</p>`;
         }
         result+=`
         <div class="boxy_img" onclick="openbox_battleskin(${id},'${bskin}',${index},0);">
             
             <img class="imgevo" src="${url_img}${id}/battle_skin/${bskin}/${index}/0.gif" onerror="img_error(this);" alt="">
             <span class="textevo">${battleskin[bskin][index].name_skin}</span>
             
         </div>
         `;
        count++;
        count_all++;
        if(count>3){
            result+=`</div>`;
            count=0;
        }if(count_all>=count_max){
            result+=`</div>`;
            count_all=0;
            count=0;
        }
        });
    });
    return result;
}





















function type_bg(type1,type2){
    let result={};
    if(type2){
        result[1]=colors[type1];
        result[2]=colors[type2];
    }else{
        result[1]=colors[type1];
        result[2]=colors[type1];
    }
    return result;
}




function next_qlty(qlty){//1:low-2:mid-3:monsters
if(!qualitys[qlty])qlty=1; url_img='https://raw.githubusercontent.com/editionman123/pokemon/main/'+qualitys[qlty]+'/';
   console.log(url_img);
   /*reload slots*/
   //delete slots and volver a cargarlos
   //reiniciando los contadores de pokedex
   //se copio del change generation method
   pokelist.innerHTML = '';
    countRecords = 0
    offset = generations[selectGen.value]
    loadPokemonItens(offset, limit)
}

function close_details(){
    if(!action)return;
    switcher_details(false);
}


function switcher_details(bool){
    if(bool){
        action=false;
        p_details.classList.remove("Off");
        p_details.classList.add("On");
        p_monsters.classList.remove("on_static");
p_monsters.classList.add("off_static");
        setTimeout(()=>{
           action=true; p_details.classList.remove("On"); p_details.classList.add("on_static"); p_monsters.classList.remove("off_static");
p_monsters.classList.add("Off");
        },300);
        
    }else{
       action=false;                 p_details.classList.remove("on_static");         p_details.classList.add("off_static"); p_monsters.classList.remove("Off");
p_monsters.classList.add("On");
        setTimeout(()=>{
            action=true;         p_details.classList.remove("off_static"); p_details.classList.add("Off"); p_monsters.classList.remove("On");
p_monsters.classList.add("on_static");
        },300);
    }
}
function img_error(e){
    e.onerror="";
    //test=e.src;
    e.src=url_img+`error.gif`;
}


function skin_verify(skin,zero){
    let result=skin;
    //"battle_skin" va adentro de cada skin
    //let notcopy=["evo","battle_evo"];
    let notcopy=[];
    Object.keys(zero).forEach(e=>{
        if(!result[e] && !notcopy.includes(e)){
            result[e]=zero[e];
        }
    });
    return result;
}
