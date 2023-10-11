autowatch = 1;

//----------------------------------------------------------------------------
// ┌──────────────────┐
// │ Class Definition │
// └──────────────────┘
// To create a new knob:
//
// aKnob = new Jsuiknob();
//
// New knob will be initialised with default values unless a JSON definition file
// is supplied as a JS Argument (Max inspector)
//
// Use the JsuiknobEditor to edit and save JSON definition files.
// JSON files need to be in the same folder as the jsuiknob.js file
// or in your Max File Paths settings.
//
//----------------------------------------------------------------------------

function Jsuiknob () {

  var keys = [,
    "version",
    "knobRadius", "rotAngle", "shape", "mode", "bodyColor",
    "indicatorType", "indicatorSegments", "indicatorColor1", "indicatorColor2", "indicatorColor3",
    "indicatorOffAlpha", "indicatorOffset", "indicatorWidth", "indicatorHeight", "indicatorBorder", "indicatorBorderColor",
    "pointerWidth", "pointerLength", "pointerOffset", "pointerCap", "pointerColor",
    "outlineWidth", "outlineOffset", "outlineColor",
    "highlightWidth", "highlightOffset", "highlightColor",
    "shadowColor", "shadowX", "shadowY"
  ]

  var indicators = ["NONE", "LINE1", "LINE2", "ARC", "RNDLED1", "RNDLED2", "RECTLED1", "RECTLED2"];
  var shapes = ["ROUND", "FLUTED"];
  var pointerCaps = ["butt", "round", "square"];
  var modes = ["UNIPOLAR", "BIPOLAR"];
  
  // Version number: future proofing
  this.version = 1.1;
  
  // The actual value of the knob
  this.value = 0;
  
  this.knobRadius = 0.25;
  this.rotAngle = 300;

  this.shape = 0;
  this.mode = 0;
  this.bodyColor = [0.0, 0.0, 0.0, 1.0];

  this.indicatorType = 0;

  this.indicatorSegments = 16;
  this.indicatorColor1 = [0.461143, 0.965517, 0.000000, 1.0];
  this.indicatorColor2 = [1.000000, 0.444159, 0.068966, 1.0];
  this.indicatorColor3 = [1.000000, 0.137931, 0.137931, 1.0];
  this.indicatorOffAlpha = 0.0;
  this.indicatorOffset = 0.1;
  this.indicatorWidth = 0.3;
  this.indicatorHeight = 0.3;
  this.indicatorBorder = 0.2;
  this.indicatorBorderColor = [0.0, 0.0, 0.0, 1.0];

  this.pointerWidth = 0.3;
  this.pointerLength = 0.3;
  this.pointerOffset = 0.2;
  this.pointerCap = 1;
  this.pointerColor = [0.9, 0.9, 0.9, 1.0]

  this.outlineWidth = 0.2;
  this.outlineOffset = 0.0;
  this.outlineColor = [0.0, 0.0, 0.0, 0.0]

  this.highlightWidth = 0.2;
  this.highlightOffset = 0.05;
  this.highlightColor = [1.0, 1.0, 1.0, 0.3]

  this.shadowColor = [0.0, 0.0, 0.0, 0.25]
  this.shadowX = -0.3;
  this.shadowY = 0.4;

  this.getKeys = function() {
    return keys;
  }

  this.getKeyValue = function(key) {
    return this[key];
  }

  this.loadFromDict = function(loadDict) {
    for (var key in keys) {
      this[keys[key]] = loadDict.get(keys[key]);
    }
  }

  this.loadFromJSON = function(jsonFile) {
     var tempDict = new Dict();
     tempDict.import_json(jsonFile);
     this.loadFromDict(tempDict);
     tempDict.freepeer();
  }

  if (jsarguments.length>1) {
    this.loadFromJSON(jsarguments[1]);
  }

  this.setIndicator = function(i) {
    this.indicatorType = clamp(i,0, indicators.length-1);
  }

  this.getShape = function() {
    return (shapes[this.shape]);
  }

  this.setShape = function(s) {
    this.shape = clamp(s, 0, shapes.length-1)    
  }

  this.setCap = function(c) {
    this.pointerCap = clamp(c, 0, pointerCaps.length-1)
  }

  this.setMode = function(m) {
    this.mode = clamp(m, 0, modes.length-1);
  }

  this.getMode = function() {
    return modes[this.mode];
  }

  this.getValue = function() {
    return (modes[this.mode] == "UNIPOLAR") ? this.value : this.value * 2 - 1.0
  }

  this.setValue = function(f) {
    this.value = f;
    notifyclients();
  }

  this.resetValue = function() {
    this.value = (modes[this.mode] == "UNIPOLAR") ? 0 : 0.5
    notifyclients();
  }

  this.updateValue = function(d) {
    this.value = clamp(this.value += d, 0.0, 1.0)
  }

  this.paint = function() {
    this.drawShadow();
    this.drawIndicators();
    this.drawKnob();
  }

  this.drawShadow = function() {
    var kpr = JW * this.knobRadius;
    var distort = 2.0;
    var sx = JMX - kpr + (JMX * this.knobRadius * this.shadowX);
    var sy = JMY - kpr + (JMY * this.knobRadius * this.shadowY);
    mgraphics.set_source_rgba(this.shadowColor);
    mgraphics.ellipse(JMX - (kpr - kpr * this.shadowX), JMY - (kpr - kpr * this.shadowY), kpr * 2, kpr * 2)        
    mgraphics.fill();
  }

  this.drawKnob = function() {
    var kpr = JW * this.knobRadius;

    // Draw Outline
    var eo = JMX * (this.knobRadius * 2 * Math.exp(this.outlineOffset))
    mgraphics.set_source_rgba(this.outlineColor);
    mgraphics.set_line_width(kpr * 0.5 * this.outlineWidth) 
    mgraphics.ellipse(JMX - eo, JMY - eo, eo * 2, eo * 2)
    mgraphics.stroke();

    var shape = shapes[this.shape];

    switch (shape) {
      default:
      case "ROUND":

        // Draw body
        mgraphics.set_source_rgba(this.bodyColor);
        mgraphics.ellipse(JMX-(kpr),JMY-(kpr), kpr * 2, kpr * 2)        
        mgraphics.fill();

        // Draw Highlight
        mgraphics.set_source_rgba(this.highlightColor);
        mgraphics.set_line_width(kpr * 0.25 * this.highlightWidth)
        var invOff = 1 - this.highlightOffset;
        mgraphics.ellipse(JMX-(kpr * invOff),JMY-(kpr * invOff), kpr * invOff * 2, kpr * invOff * 2)        
        mgraphics.stroke();

        break;

      case "FLUTED":
        var fs = Math.floor(3 + (9.0 * this.highlightWidth))
        var fa = (this.rotAngle * this.value)
        mgraphics.save();
        mgraphics.translate(JMX, JMY);
        mgraphics.rotate(degreesToRadians(90-(this.rotAngle/2) + fa + (360/fs/4) - (360/fs/2*(fs%2))))
        mgraphics.set_source_rgba(this.bodyColor);    
        var scr = 0.5
        var scd = 0.6 + (0.4 * this.highlightOffset)
        if (scd == 1) {
          mgraphics.ellipse(0 - kpr, 0 - kpr ,kpr * 2, kpr * 2);
        } else {
            for (a = 0; a <= fs; a++) {
                var t1 = degreesToRadians((a - scr) * ((360/fs)))
                var x1 = (kpr * Math.cos(t1))
                var y1 = (kpr * Math.sin(t1))
                var t2 = degreesToRadians((a + 0.0) * ((360/fs)))
                var x2 = (kpr * Math.cos(t2))
                var y2 = (kpr * Math.sin(t2))
                if (a == 0) {
                    mgraphics.move_to(x2, y2)
                } else {
                    var t3 = degreesToRadians((a - 0.5 - (scr/2)) * ((360/fs)))
                    var x3 = (kpr * scd * Math.cos(t3))
                    var y3 = (kpr * scd * Math.sin(t3))
                    mgraphics.curve_to(x3, y3, x3, y3, x1, y1)
        
                    var t3 = degreesToRadians((a -(scr/2)) * ((360/fs)))
                    var x3 = (kpr * 1 * Math.cos(t3))
                    var y3 = (kpr * 1 * Math.sin(t3))
                    mgraphics.curve_to(x3, y3, x3, y3, x2, y2)                        
                }
            }
        }
        mgraphics.set_line_width(JW * this.knobRadius * 0.05)
        mgraphics.set_source_rgba(this.highlightColor);
        mgraphics.stroke_preserve();
        mgraphics.set_source_rgba(this.bodyColor);
        mgraphics.fill();    
        mgraphics.restore();

        break;
    } 

    // Draw pointer
    mgraphics.set_source_rgba(this.pointerColor);
    mgraphics.set_line_width(kpr * this.pointerWidth);
    mgraphics.set_line_cap(pointerCaps[this.pointerCap]);
    if (modes[this.mode] == "UNIPOLAR") {
        t = degreesToRadians(360 - (this.value * this.rotAngle) + 90 + (this.rotAngle/2))
        invt = degreesToRadians(360 - (this.value * this.rotAngle) + 270 + (this.rotAngle/2))
    } else {
      var vb = this.value * 2 -1;
      t = degreesToRadians(360 - (vb * this.rotAngle / 2) - 270)
      invt = degreesToRadians(360 - (vb * this.rotAngle / 2) - 90)
    }

    var px1 = JMX + ((kpr - (kpr * this.pointerOffset)) * Math.cos(t));
    var py1 = JMY - ((kpr - (kpr * this.pointerOffset)) * Math.sin(t));
    var px2 = px1 + (kpr * ((2.0 - (this.pointerOffset*2)) * (this.pointerLength / 2.0)) * Math.cos(invt))
    var py2 = py1 - (kpr * ((2.0 - (this.pointerOffset*2)) * (this.pointerLength / 2.0)) * Math.sin(invt))

    mgraphics.move_to(px1, py1)
    mgraphics.line_to(px2, py2)
    mgraphics.stroke();
  }

  this.bipolarSegmentAlpha = function(c) {
    var hs = this.indicatorSegments / 2;
    var v = (modes[this.mode] == "UNIPOLAR") ? this.value : this.value * 2 -1;
    var c1 = (c - hs) / hs;
    var c2 = v - c1;
    if ((c1 > 0) && (v < c1)){
        return clamp(1 + (c2 / (1/this.indicatorSegments)), 0, 1)
    } else if ((c1 < 0) && (v > c1)) {
        return clamp(1 - (c2 / (1/this.indicatorSegments)), 0, 1)
    }
    return 1.0
  }
  
  this.unipolarSegmentAlpha = function(c) {
    var c1 = this.value - ((c+1) / (this.indicatorSegments+1))
    if (c1 < 0) {
      if (Math.abs(c1) > (1/this.indicatorSegments)) {
          return this.indicatorOffAlpha
      } else {
          return clamp(1 + this.indicatorOffAlpha + (c1 / (1/this.indicatorSegments)), 0, 1)
      }
    }
    return 1.0
  }

  this.drawIndicators = function() {

    // Some initial setup. A few magic numbers which should be eased out
    var iBase = JW * (this.knobRadius * 0.4)
    var iWidth = iBase * this.indicatorWidth
    var iHeight = iBase * this.indicatorHeight
    var scWidth = iWidth * (this.rotAngle / this.indicatorSegments * 0.05)
    var color = this.indicatorColor1;
    var fade = this.indicatorOffAlpha;
    var indicator = indicators[this.indicatorType];
    switch (indicator) {
      
      // None
      default:
      case "NONE":
          break;
  
      // Simple rectangle (not animated)
      case "LINE1":
        for (c = 0; c <= this.indicatorSegments; c++) {
          var angle = (c / this.indicatorSegments) * this.rotAngle
          var t = degreesToRadians(90 + (this.rotAngle/2) - angle)
          var ir = this.knobRadius * 2 * Math.exp(this.indicatorOffset)
          var ax = (JMX + (JMX * ir * Math.cos(t)))
          var ay = (JMY - (JMY * ir * Math.sin(t)))
          mgraphics.save();
          mgraphics.translate(ax, ay);
          mgraphics.rotate(degreesToRadians(180 - ((this.rotAngle/2)-angle)))
          mgraphics.rectangle(0-(iWidth/2), 0, iWidth, iHeight);
          mgraphics.set_source_rgba(this.indicatorColor1, 1.0);
          mgraphics.fill_preserve();
          mgraphics.set_source_rgba(this.indicatorBorderColor);
          mgraphics.set_line_width(iWidth * this.indicatorBorder);
          mgraphics.stroke();
          mgraphics.restore();
        }
        break;
  
    // Alternating rectangle (not animated)
    case "LINE2":

        for (c = 0; c <= this.indicatorSegments; c++) {
            var angle = (c / this.indicatorSegments) * this.rotAngle
            var t = degreesToRadians(90 + (this.rotAngle/2) - angle)
            var ir = this.knobRadius * 2 * Math.exp(this.indicatorOffset)
            var ax = (JMX + (JMX * ir * Math.cos(t)))
            var ay = (JMY - (JMY * ir * Math.sin(t)))
            var hmod = ((c % 2) == 0) ? iHeight : iHeight * 0.6;
            mgraphics.save();
            mgraphics.translate(ax,ay);
            mgraphics.rotate(degreesToRadians(180 - ((this.rotAngle/2)-angle)))
            mgraphics.rectangle(0-(iWidth/2), 0, iWidth, hmod);

            mgraphics.set_source_rgba(this.indicatorColor1);
            mgraphics.fill_preserve();

            mgraphics.set_source_rgba(this.indicatorBorderColor);
            mgraphics.set_line_width(iWidth * this.indicatorBorder);
            mgraphics.stroke();
            mgraphics.restore();
        }

        break;
    
      // Arc (animated)
      case "ARC":
        var arcWidth = (JW * this.knobRadius / Math.PI)
        var arcCenter = JW * (this.knobRadius + (this.knobRadius * this.indicatorOffset)) 
        var arcBase = 90 + ((360-this.rotAngle)/2)
        var iWidth = JW * this.knobRadius * (this.indicatorWidth / 2)
        
        // Draw background arc
        var a1 = degreesToRadians(arcBase)
        var a2 = degreesToRadians((1 * this.rotAngle) + arcBase)
        mgraphics.set_line_cap("butt");
        mgraphics.set_line_width(arcWidth*this.indicatorBorder*0.5);
        mgraphics.arc(JMX, JMY, arcCenter, a1, a2)
        mgraphics.arc_negative(JMX, JMY, arcCenter+(arcWidth*this.indicatorWidth), a2, a1)
        mgraphics.close_path();            
        mgraphics.set_source_rgba(this.indicatorBorderColor);         
        mgraphics.stroke_preserve();
        mgraphics.set_source_rgba(this.indicatorColor3, 1.0);            
        mgraphics.fill();
        
        // Draw value arc
        if (modes[this.mode] == "UNIPOLAR") {
          mgraphics.set_source_rgba(this.indicatorColor1, 1.0);
          mgraphics.arc(JMX, JMY, arcCenter, a1, degreesToRadians((this.value * this.rotAngle) + arcBase));
          mgraphics.arc_negative(JMX, JMY, arcCenter+(arcWidth*this.indicatorWidth), degreesToRadians((this.value * this.rotAngle) + arcBase),a1);
        }  else {
          var v = this.value * 2 - 1;
          if (v < 0) {
            mgraphics.set_source_rgba(this.indicatorColor1, 1.0);
              mgraphics.arc_negative(JMX, JMY, arcCenter, degreesToRadians(-90), degreesToRadians(-90-(this.rotAngle / 2 * (Math.abs(v)))))
              mgraphics.arc(JMX, JMY, arcCenter+(arcWidth*this.indicatorWidth), degreesToRadians(-90-(this.rotAngle / 2 * (Math.abs(v)))),degreesToRadians(-90))
          } else {
            mgraphics.set_source_rgba(this.indicatorColor2, 1.0);
              mgraphics.arc(JMX, JMY, arcCenter, degreesToRadians(-90), degreesToRadians(-90+(this.rotAngle/2 * (Math.abs(v)))))
              mgraphics.arc_negative(JMX, JMY, arcCenter+(arcWidth*this.indicatorWidth), degreesToRadians(-90+(this.rotAngle/2 * (Math.abs(v)))), degreesToRadians(-90))
          }
        }
        mgraphics.close_path();
        mgraphics.fill();
        break;

      // Round LEDs (animated)
      case "RNDLED1":
      case "RNDLED2":
        for (c = 0; c <= this.indicatorSegments; c++) {
          var angle = (c / this.indicatorSegments) * this.rotAngle
          var t = degreesToRadians(90 + (this.rotAngle/2) - angle)
          var ir = this.knobRadius * 2 *  Math.exp(this.indicatorOffset)
          var ax = (JMX + (JMX * ir * Math.cos(t)))
          var ay = (JMY - (JMY * ir * Math.sin(t)))
          mgraphics.save();
          mgraphics.translate(ax,ay);
          mgraphics.rotate(degreesToRadians(180 - ((this.rotAngle/2)-angle)))
          mgraphics.ellipse(0-(scWidth/2),0, scWidth, scWidth);                
          mgraphics.restore();

          if (c < (this.indicatorSegments - 2)) {
            color = this.indicatorColor1
          } else if (c < (this.indicatorSegments - 1) ) {
            color = this.indicatorColor2
          } else {
            color = this.indicatorColor3
          }

          if ( c / this.indicatorSegments < 0.8) {
            color = this.indicatorColor1
          } else if (c / this.indicatorSegments < 0.9 ) {
            color = this.indicatorColor2
          } else {
            color = this.indicatorColor3
          }

          if (modes[this.mode] == "BIPOLAR") {
            color = (this.value < 0.5) ? this.indicatorColor1 : this.indicatorColor2
            fade = this.bipolarSegmentAlpha(c);
          } else {
            fade = this.unipolarSegmentAlpha(c);
          }

          if (indicator == "RNDLED1") {
            mgraphics.set_source_rgba(color[0]*fade, color[1]*fade, color[2]*fade, 1.0);
          } else {
            mgraphics.set_source_rgba(color[0], color[1], color[2], fade);
          };
          mgraphics.fill_preserve();

          mgraphics.set_source_rgba(this.indicatorBorderColor);
          mgraphics.set_line_width(iWidth * this.indicatorBorder * 0.2);
          mgraphics.stroke();
        }

        break;
          // Square LEDs (animated)
          case "RECTLED1":
          case "RECTLED2":
            for (c = 0; c <= this.indicatorSegments; c++) {
              var angle = (c / this.indicatorSegments) * this.rotAngle
              var t = degreesToRadians(90 + (this.rotAngle/2) - angle)
              var ir = this.knobRadius * 2 *  Math.exp(this.indicatorOffset)
              var ax = (JMX + (JMX * ir * Math.cos(t)))
              var ay = (JMY - (JMY * ir * Math.sin(t)))
              mgraphics.save();
              mgraphics.translate(ax,ay);
              mgraphics.rotate(degreesToRadians(180 - ((this.rotAngle/2)-angle)))
              mgraphics.rectangle(0-(scWidth/2),0, scWidth, iHeight);                
              mgraphics.restore();

              if (c < (this.indicatorSegments - 3)) {
                color = this.indicatorColor1
              } else if (c < (this.indicatorSegments - 1) ) {
                color = this.indicatorColor2
              } else {
                color = this.indicatorColor3
              }

              if (modes[this.mode] == "BIPOLAR") {
                color = (this.value < 0.5) ? this.indicatorColor1 : this.indicatorColor2
                fade = this.bipolarSegmentAlpha(c);
              } else {
                fade = this.unipolarSegmentAlpha(c);
              }

              if (indicator == "RECTLED1") {
                mgraphics.set_source_rgba(color[0]*fade, color[1]*fade, color[2]*fade, 1.0);
              } else {
                mgraphics.set_source_rgba(color[0],color[1],color[2], fade);
              };
              mgraphics.fill_preserve();
              mgraphics.set_source_rgba(this.indicatorBorderColor);
              mgraphics.set_line_width(iWidth * this.indicatorBorder * 0.2);
              mgraphics.stroke();
              
          }

          break;
      
  
    }
  }

  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // clamp: return a value clamped within values
  function clamp (val, min, max) {
    return val > max ? max : val < min ? min : val;
  }
  
}

