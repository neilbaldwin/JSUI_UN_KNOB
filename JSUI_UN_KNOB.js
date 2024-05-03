// ┌──────────────────────┐
// │ JSUI/Mgraphics Setup │
// └──────────────────────┘

autowatch = 1;
inlets = 1;
outlets = 1;
mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

// Various JSUI window dimensions
var JW = this.box.rect[2] - this.box.rect[0];
var JH = this.box.rect[3] - this.box.rect[1];
// Mid-points of JSUI window for center-based calculations
var JMX = JW / 2;
var JMY = JW / 2;

// Mouse Interation variables
var last_x = 0;
var last_y = 0;
var dx = 0;
var dy = 0;

//--------------------------------------
// Include the current "class" file here
//--------------------------------------
include("jsui_un_knob_class.js");

//------------------------------------------------------------------------------
// Instanciate a new knob using the name 'knob'. You can change this to anything
// but it's referenced in the JSUI functions below so you'll need to change it  
// there too.                                                                   
//                                                                              
// LOADING: Specify a JSON file (created by the JSUI_UN_KNOB_EDITOR patcher)    
// in the JavaScriptArguments attribute (Max inspector)                         
//                                                                              
//------------------------------------------------------------------------------
var knob = new Jsuiknob();

// Call the refresh function for the initial mgraphcis draw
refresh();

//----------------------------------------------------------------------------
// JSUI-specific Functions 
//----------------------------------------------------------------------------

function paint() {
    knob.paint();
}

function ondrag(x, y, button, cmd, shift, capslock, option, ctrl) {
    dx = last_x - x;
    dy = last_y - y;

    if (shift) {
        dy *= 0.001
    } else {
        dy *= 0.006
    }

    knob.updateValue(dy);
    // Required for pattr support so that pattr clients know when knob value has been changed
    this.notifyclients();

    last_x = x;
    last_y = y;

    msg_bang();
    refresh();
    
}

function ondblclick(x, y, button, cmd, shift, capslock, option, ctrl) {
    // Reset value
    knob.resetValue();
    this.notifyclients();
    refresh();
}

function onclick(x, y, button, cmd, shift, capslock, option, ctrl) {
    last_x = x;
    last_y = y;
}

function onidle(x, y, button, cmd, shift, capslock, option, ctrl) {
    return
}

function onresize(width, height) {
    this.box.size(width,width);
    JW = this.box.rect[2] - this.box.rect[0];
    JH = this.box.rect[3] - this.box.rect[1];
    JMX = JW / 2;
    JMY = JH / 2;
    mgraphics.redraw();
    refresh();
}

function redrawAll() {
    mgraphics.redraw();
    refresh();
}

function pointercolor(r, g, b, a) {
    knob.setPointerColor(r, g, b, a);
    refresh();
}

function msg_bang() {
  var output = (knob.getMode() == "UNIPOLAR") ? knob.value : knob.value * 2 - 1.0
  outlet(0, output);
}

function msg_float(f) {
    knob.setValue(f);
    mgraphics.redraw();
    msg_bang();
    refresh();
}

function getvalueof(){
    return knob.getValue();
}

function setvalueof(f){
    knob.setValue(f);
    this.notifyclients();
    refresh();
}
