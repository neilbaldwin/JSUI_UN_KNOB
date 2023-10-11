//--------------------------------------
// Include the current "class" file here
//--------------------------------------
include("jsui_un_knob_class.js");


// ┌──────────────────────┐
// │ JSUI/Mgraphics Setup │
// └──────────────────────┘

autowatch = 1;
inlets = 1;
outlets = 2;
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

declareattribute("Shape","get_knobShape","set_knobShape");
declareattribute("Mode", "get_knobMode", "set_knobMode",1)
declareattribute("Indicator Type","get_indicatorType","set_indicatorType",1)
declareattribute("Rotation Angle","get_rotAngle","set_rotAngle",1);
declareattribute("Knob Radius","get_knobRadius","set_knobRadius",1);
declareattribute("Body Color","get_bodyColor","set_bodyColor",1);
declareattribute("Indicator Offset","get_indicatorOffset","set_indicatorOffset",1);
declareattribute("Indicator Segments","get_indicatorSegments","set_indicatorSegments",1);
declareattribute("Indicator Width","get_indicatorWidth","set_indicatorWidth",1);
declareattribute("Indicator Height","get_indicatorHeight","set_indicatorHeight",1);
declareattribute("Indicator Border","get_indicatorBorder","set_indicatorBorder",1);
declareattribute("Indicator Border Color","get_indicatorBorderColor","set_indicatorBorderColor",1);
declareattribute("Indicator Color 1","get_indicatorColor1","set_indicatorColor1",1);
declareattribute("Indicator Color 2","get_indicatorColor2","set_indicatorColor2",1);
declareattribute("Indicator Color 3","get_indicatorColor3","set_indicatorColor3",1);
declareattribute("Indicator Off Alpha","get_indicatorOffAlpha","set_indicatorOffAlpha",1);

declareattribute("Pointer Width","get_pointerWidth","set_pointerWidth",1);
declareattribute("Pointer Length","get_pointerLength","set_pointerLength",1);
declareattribute("Pointer Offset","get_pointerOffset","set_pointerOffset",1);
declareattribute("Pointer Cap","get_pointerCap","set_pointerCap"),1;
declareattribute("Pointer Color","get_pointerColor","set_pointerColor",1);

declareattribute("Outline Width","get_outlineWidth","set_outlineWidth",1);
declareattribute("Outline Offset","get_outlineOffset","set_outlineOffset",1);
declareattribute("Outline Color","get_outlineColor","set_outlineColor",1);

declareattribute("Highlight Width/Flutes","get_highlightWidth","set_highlightWidth",1);
declareattribute("Highlight Offset/Flute Radius","get_highlightOffset","set_highlightOffset",1);
declareattribute("Highlight Color","get_highlightColor","set_highlightColor",1);

declareattribute("Shadow Color","get_shadowColor","set_shadowColor",1);
declareattribute("Shadow X","get_shadowX","set_shadowX",1);
declareattribute("Shadow Y","get_shadowY","set_shadowY",1);

function saveKnobJSON() {
  // Create new empty dict
  var saveDict = new Dict();

  // Populate from knob parameters
  saveDict.replace("version", knob.version);
  saveDict.replace("knobRadius", knob.knobRadius);
  saveDict.replace("rotAngle", knob.rotAngle);
  saveDict.replace("shape", knob.shape);
  saveDict.replace("mode", knob.mode);
  saveDict.replace("bodyColor", knob.bodyColor);
  saveDict.replace("indicatorType", knob.indicatorType);
  saveDict.replace("indicatorSegments", knob.indicatorSegments);
  saveDict.replace("indicatorColor1", knob.indicatorColor1);
  saveDict.replace("indicatorColor2", knob.indicatorColor2);
  saveDict.replace("indicatorColor3", knob.indicatorColor3);
  saveDict.replace("indicatorOffAlpha", knob.indicatorOffAlpha);
  saveDict.replace("indicatorOffset", knob.indicatorOffset);
  saveDict.replace("indicatorWidth", knob.indicatorWidth);
  saveDict.replace("indicatorHeight", knob.indicatorHeight);
  saveDict.replace("indicatorBorder", knob.indicatorBorder);
  saveDict.replace("indicatorBorderColor", knob.indicatorBorderColor);
  saveDict.replace("pointerWidth", knob.pointerWidth);
  saveDict.replace("pointerLength", knob.pointerLength);
  saveDict.replace("pointerCap", knob.pointerCap);
  saveDict.replace("pointerOffset", knob.pointerOffset);
  saveDict.replace("pointerColor", knob.pointerColor);
  saveDict.replace("outlineWidth", knob.outlineWidth);
  saveDict.replace("outlineOffset", knob.outlineOffset);
  saveDict.replace("outlineColor", knob.outlineColor);
  saveDict.replace("highlightWidth", knob.highlightWidth);
  saveDict.replace("highlightOffset", knob.highlightOffset);
  saveDict.replace("highlightColor", knob.highlightColor);
  saveDict.replace("shadowColor", knob.shadowColor);
  saveDict.replace("shadowX", knob.shadowX);
  saveDict.replace("shadowY", knob.shadowY);
  
  // Export
  saveDict.export_json();
  // Destroy dict
  saveDict.freepeer();
}

//
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

    last_x = x;
    last_y = y;

    msg_bang();
    refresh();
    
}

function ondblclick(x, y, button, cmd, shift, capslock, option, ctrl) {
    // Reset value
    knob.resetValue();
    notifyclients();
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

function saveKnob() {
  saveKnobJSON();
}

function loadKnob() {
  var loadDict = new Dict();
  loadDict.import_json();
  if (loadDict.contains("version")) {
    knob.loadFromDict(loadDict);
  }
  loadDict.freepeer();
  refresh();
  notifyclients();
  dumpParameters();
}

function msg_bang() {
  outlet(0, knob.getValue())
}

function msg_float(f) {
    knob.setValue(f);
    mgraphics.redraw();
    refresh();
    notifyclients();
}

//----------------------------------------------------------------------------
// Getter and setter routines for editor only
//----------------------------------------------------------------------------

// clamp: return a value clamped within values
function clamp (val, min, max) {
  return val > max ? max : val < min ? min : val;
}

function dumpParameters() {
  var keys = knob.getKeys();
  for (var key in keys) {
    var v = knob.getKeyValue(keys[key]);
    if (typeof(v) == "object") {
      outlet(1, [keys[key], v[0], v[1], v[2], v[3]])
    } else {
      outlet(1, [keys[key], v])
    }
  }
}

function get_knobShape() {
  return knob.shape;
}
function get_knobMode() {
    return knob.mode
}

function get_indicatorType() {
  return knob.indicatorType
}

function set_indicatorType(f) {
  knob.setIndicator(f)
  redrawAll();
}

function get_rotAngle() {
    return knob.rotAngle
}

function get_knobRadius() {
    return knob.knobRadius
}

function get_bodyColor() {
  return knob.bodyColor
}

function get_indicatorOffset() {
    return knob.indicatorOffset
}

function get_indicatorSegments() {
    return knob.indicatorSegments
}

function get_indicatorWidth() {
    return knob.indicatorWidth
}

function get_indicatorHeight() {
    return knob.indicatorHeight
}

function get_indicatorBorder() {
    return knob.indicatorBorder
}

function get_indicatorBorderColor() {
    return knob.indicatorBorderColor
}

function get_indicatorColor1() {
    return knob.indicatorColor1
}

function get_indicatorColor2() {
    return knob.indicatorColor2
}

function get_indicatorColor3() {
    return knob.indicatorColor3
}

function get_indicatorOffAlpha() {
    return knob.indicatorOffAlpha
}

function get_pointerWidth() {
    return knob.pointerWidth
}

function get_pointerLength() {
    return knob.pointerLength
}

function get_pointerOffset() {
    return knob.pointerOffset
}

function get_pointerCap() {
    return knob.pointerCap
}

function get_pointerColor() {
    return knob.pointerColor
}

function get_outlineWidth() {
    return knob.outlineWidth
}

function get_outlineOffset() {
    return knob.outlineOffset
}

function get_outlineColor() {
    return knob.outlineColor
}

function get_highlightOffset() {
    return knob.highlightOffset
}

function get_highlightWidth() {
    return knob.highlightWidth
}

function get_highlightColor() {
    return knob.highlightColor
}

function get_shadowColor() {
    return knob.shadowColor
}

function get_shadowX() {
    return knob.shadowX
}

function get_shadowY() {
    return knob.shadowY
}

//----------------------------------------------------------------------------
// Setters
//----------------------------------------------------------------------------


function set_knobMode(f) {
  knob.setMode(f);
  redrawAll();
}

function set_rotAngle(f) {
  knob.rotAngle = clamp(f, 90, 340);
  redrawAll();
}

function set_indicatorWidth(f) {
  knob.indicatorWidth = clamp(f,0.0,1.0);
  redrawAll();
}

function set_indicatorHeight(f) {
  knob.indicatorHeight = clamp(f,0.0,1.0);
  redrawAll();
}

function set_indicatorSegments(f) {
  knob.indicatorSegments = clamp(f,8,32);
  redrawAll();
}

function set_indicatorBorder(f) {
  knob.indicatorBorder = clamp(f,0.0, 1.0);
  redrawAll()
}

function set_indicatorBorderColor(r,g,b,a) {
  knob.indicatorBorderColor[0] = r;
  knob.indicatorBorderColor[1] = g;
  knob.indicatorBorderColor[2] = b;
  knob.indicatorBorderColor[3] = a;
  redrawAll()
}

function set_indicatorColor1(r,g,b,a) {
  knob.indicatorColor1[0] = r;
  knob.indicatorColor1[1] = g;
  knob.indicatorColor1[2] = b;
  knob.indicatorColor1[3] = a;
  redrawAll()
}

function set_indicatorColor2(r,g,b,a) {
  knob.indicatorColor2[0] = r;
  knob.indicatorColor2[1] = g;
  knob.indicatorColor2[2] = b;
  knob.indicatorColor2[3] = a;
  redrawAll()
}
function set_indicatorColor3(r,g,b,a) {
  knob.indicatorColor3[0] = r;
  knob.indicatorColor3[1] = g;
  knob.indicatorColor3[2] = b;
  knob.indicatorColor3[3] = a;
  redrawAll()
}

function set_indicatorOffAlpha(f) {
  knob.indicatorOffAlpha = clamp(f,0.0, 1.0)
  redrawAll();
}


function set_indicatorOffset(f) {
  knob.indicatorOffset = clamp(f,0.0, 1.0)
  redrawAll();
}


function set_knobRadius(f) {
  knob.knobRadius = clamp(f, 0.1, 0.5);
  redrawAll();
}

function set_bodyColor(r,g,b,a) {
  knob.bodyColor[0] = r;
  knob.bodyColor[1] = g;
  knob.bodyColor[2] = b;
  knob.bodyColor[3] = a;
  redrawAll();
}

function set_pointerColor(r,g,b,a) {
  knob.pointerColor[0] = r;
  knob.pointerColor[1] = g;
  knob.pointerColor[2] = b;
  knob.pointerColor[3] = a;
  redrawAll()
}

function set_pointerWidth(f) {
  knob.pointerWidth = clamp(f,0.0, 1.0)
  redrawAll()
}

function set_pointerLength(f) {
  knob.pointerLength = clamp(f,0.0,2.0)
  redrawAll()
}

function set_pointerOffset(f) {
  knob.pointerOffset = clamp(f,0, 0.99)
  redrawAll()
}

function set_pointerCap(f) {
  knob.setCap(f);
  redrawAll()
}

function set_outlineWidth(f) {
  knob.outlineWidth = clamp(f, 0.0, 1.0)
  redrawAll();
}
function set_outlineOffset(f) {
  knob.outlineOffset = clamp(f, 0.0, 1.0)
  redrawAll();
}
function set_outlineColor(r,g,b,a) {
  knob.outlineColor[0] = r;
  knob.outlineColor[1] = g;
  knob.outlineColor[2] = b;
  knob.outlineColor[3] = a;
  redrawAll();
}

function set_highlightWidth(f) {
  knob.highlightWidth = clamp(f, 0.0, 1.0)
  redrawAll()
}

function set_highlightOffset(f) {
  knob.highlightOffset = clamp(f, 0.0, 1.5)
  redrawAll()
}

function set_highlightColor(r,g,b,a) {
  knob.highlightColor[0] = r
  knob.highlightColor[1] = g
  knob.highlightColor[2] = b
  knob.highlightColor[3] = a
  redrawAll()
}

function set_shadowColor(r,g,b,a) {
  knob.shadowColor[0] = r;
  knob.shadowColor[1] = g;
  knob.shadowColor[2] = b;
  knob.shadowColor[3] = a;
  redrawAll()
}

function set_shadowX(f) {
  knob.shadowX = clamp(f,-1.0, 1.0)
  redrawAll();
}

function set_shadowY(f) {
  knob.shadowY = clamp(f, -1.0, 1.0)
  redrawAll();
}

function set_knobShape(f) {
  knob.setShape(f);
  redrawAll();
}
