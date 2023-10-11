{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 8,
			"minor" : 5,
			"revision" : 6,
			"architecture" : "x64",
			"modernui" : 1
		}
,
		"classnamespace" : "box",
		"rect" : [ 997.0, 79.0, 640.0, 480.0 ],
		"bglocked" : 0,
		"openinpresentation" : 0,
		"default_fontsize" : 12.0,
		"default_fontface" : 0,
		"default_fontname" : "Arial",
		"gridonopen" : 1,
		"gridsize" : [ 15.0, 15.0 ],
		"gridsnaponopen" : 1,
		"objectsnaponopen" : 1,
		"statusbarvisible" : 2,
		"toolbarvisible" : 1,
		"lefttoolbarpinned" : 0,
		"toptoolbarpinned" : 0,
		"righttoolbarpinned" : 0,
		"bottomtoolbarpinned" : 0,
		"toolbars_unpinned_last_save" : 0,
		"tallnewobj" : 0,
		"boxanimatetime" : 200,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"description" : "",
		"digest" : "",
		"tags" : "",
		"style" : "",
		"subpatcher_template" : "",
		"assistshowspatchername" : 0,
		"boxes" : [ 			{
				"box" : 				{
					"border" : 0,
					"filename" : "JSUI_UN_KNOB.js",
					"id" : "obj-12",
					"jsarguments" : [ "testKnob3.json" ],
					"maxclass" : "jsui",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 394.0, 167.0, 107.0, 107.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 398.800000071525574, 240.600001096725464, 107.0, 107.0 ]
				}

			}
, 			{
				"box" : 				{
					"border" : 0,
					"filename" : "JSUI_UN_KNOB.js",
					"id" : "obj-11",
					"jsarguments" : [ "testKnob3.json" ],
					"maxclass" : "jsui",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 285.0, 167.0, 107.0, 107.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 289.800000071525574, 240.600001096725464, 107.0, 107.0 ]
				}

			}
, 			{
				"box" : 				{
					"border" : 0,
					"filename" : "JSUI_UN_KNOB.js",
					"id" : "obj-10",
					"jsarguments" : [ "testKnob3.json" ],
					"maxclass" : "jsui",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 176.0, 167.0, 107.0, 107.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 180.800000071525574, 240.600001096725464, 107.0, 107.0 ]
				}

			}
, 			{
				"box" : 				{
					"border" : 0,
					"filename" : "JSUI_UN_KNOB.js",
					"id" : "obj-2",
					"jsarguments" : [ "defaultKnob.json" ],
					"maxclass" : "jsui",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 67.0, 167.0, 107.0, 107.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 71.800000071525574, 240.600001096725464, 107.0, 107.0 ]
				}

			}
, 			{
				"box" : 				{
					"attr" : "jsarguments",
					"id" : "obj-15",
					"maxclass" : "attrui",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 67.0, 137.0, 150.0, 22.0 ]
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-2", 0 ],
					"source" : [ "obj-15", 0 ]
				}

			}
 ],
		"dependency_cache" : [ 			{
				"name" : "JSUI_UN_KNOB.js",
				"bootpath" : "~/Sync/Max/PLAYGROUND/UI Elements",
				"patcherrelativepath" : ".",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "jsui_un_knob_class.js",
				"bootpath" : "~/Sync/Max/PLAYGROUND/UI Elements",
				"patcherrelativepath" : ".",
				"type" : "TEXT",
				"implicit" : 1
			}
 ],
		"autosave" : 0
	}

}
