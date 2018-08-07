/*
Copyright (c) 2009, Shlomy Gantz BlueBrick Inc. All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*     * Neither the name of Shlomy Gantz or BlueBrick Inc. nor the
*       names of its contributors may be used to endorse or promote products
*       derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY SHLOMY GANTZ/BLUEBRICK INC. ''AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL SHLOMY GANTZ/BLUEBRICK INC. BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
* JSGantt component is a UI control that displays gantt charts based by using CSS and HTML 
* @module    jsgantt
* @title    JSGantt
*/

Date.prototype.isValidDate = function() {
	if ( Object.prototype.toString.call(this) !== "[object Date]" )
		return false;
	return !isNaN(this.getTime());
}

var JSGantt; 
if (!JSGantt) 
{
    JSGantt = {};
    JSGantt.Charts = {};
}

var vTimeout = 0;
var vBenchTime = new Date().getTime();

/**
* Creates a task (one row) in gantt object
* @class TaskItem 
* @namespace JSGantt
* @constructor
* @for JSGantt

* @param pID {Number} Task unique numeric ID
* @param pName {String} Task Name
* @param pStart {Date} Task start date/time (not required for pGroup=1 )
* @param pEnd {Date} Task end date/time, you can set the end time to 12:00 to indicate half-day (not required for pGroup=1 )
* @param pColor {String} Task bar RGB value
* @param pLink {String} Task URL, clicking on the task will redirect to this url. Leave empty if you do not with the Task also serve as a link
* @param pMile {Boolean} Determines whether task is a milestone (1=Yes,0=No)
* @param pRes {String} Resource to perform the task
* @param pComp {Number} Percent complete (Number between 0 and 100)
* @param pGroup {Boolean}
* @param pParent {Number} ID of the parent task
* @param pOpen {Boolean}
* @param pDepend {String} Comma seperated list of IDs this task depends on
* @param pCaption {String} Caption to be used instead of default caption (Resource). 
* note : you should use setCaption("Caption") in order to display the caption
* @return void
*/
JSGantt.TaskItem = function(pGantt, pID, pInd, pName, pStart, pEnd, pColor, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pBaseStart, pBaseEnd, pIsNewPoint, pInd2, pInd1Text, pInd2Text)
{

var vGantt = pGantt;

/**
* The name of the attribute.
* @property vID 
* @type String 
* @default pID
* @private
*/    
var vID    = pID;

/**
* @property vName 
* @type String 
* @default pName
* @private
*/   
var vName  = pName;

/**
* @property vStart 
* @type Datetime 
* @default new Date()
* @private
*/    
var vStart = new Date();	

/**
* @property vEnd 
* @type Datetime 
* @default new Date()
* @private
*/    
var vEnd   = new Date();

/**
* @property vColor 
* @type String 
* @default pColor
* @private
*/    
var vColor = pColor;

/**
* @property vLink 
* @type String 
* @default pLink
* @private
*/    
var vLink  = pLink;

/**
* @property vMile 
* @type Boolean 
* @default pMile
* @private
*/    
var vMile  = pMile;

/**
* @property vInd 
* @type String 
* @default pInd
* @private
*/    
var vInd = pInd;
    
/**
* @property vInd 
* @type String 
* @default pInd
* @private
*/
var vInd2 = pInd2;
    
/**
* @property vInd 
* @type String 
* @default pInd
* @private
*/    
var vInd1Text = pInd1Text;
    
/**
* @property vInd 
* @type String 
* @default pInd
* @private
*/
var vInd2Text = pInd2Text;

/**
* @property vRes 
* @type String 
* @default pRes
* @private
*/    
var vRes   = pRes;

/**
* @property vComp 
* @type Number 
* @default pComp
* @private
*/    
var vComp  = pComp;

/**
* @property vGroup 
* @type Boolean 
* @default pGroup
* @private
*/    
var vGroup = pGroup;

/**
* @property vParent 
* @type Number 
* @default pParent
* @private
*/    
var vParent = pParent;

/**
* @property vOpen 
* @type Boolean 
* @default pOpen
* @private
*/    
var vOpen   = pOpen;

/**
* @property vDepend 
* @type String 
* @default pDepend
* @private
*/    
var vDepend = pDepend;

/**
* @property vCaption 
* @type String 
* @default pCaption
* @private
*/    
var vCaption = pCaption;
    
/**
* @property vIsNewPoint 
* @type Boolean 
* @default 0
* @private
*/
var vIsNewPoint = pIsNewPoint;

/**
* @property vBaseStart 
* @type Date
* @default pBaseStart
* @private
*/
var vBaseStart = new Date();
    
    /**
* @property vBaseEnd
* @type Date
* @default pBaseEnd
* @private
*/
var vBaseEnd = new Date();
    
/**
* @property vDuration 
* @type Number 
* @default ''
* @private
*/
var vDuration = '';

/**
* @property vLevel 
* @type Number 
* @default 0
* @private
*/    
var vLevel = 0;

/**
* @property vNumKid 
* @type Number 
* @default 0
* @private
*/   
var vNumKid = 0;

/**
* @property vVisible 
* @type Boolean 
* @default 0
* @private
*/   
var vVisible = 1;
    
      var x1, y1, x2, y2;


      if (vGroup != 1)
      { 
        if(!pStart) 
            vStart = "";
        else if((typeof pStart == "object") && (pStart.constructor == Date))
            vStart = pStart;
        else
            vStart = JSGantt.parseDateStr(pStart, vGantt.getDateInputFormat());

        if(!pEnd) 
            vEnd = "";
        else if((typeof pEnd == "object") && (pEnd.constructor == Date))
            vEnd   = pEnd;
        else
            vEnd = JSGantt.parseDateStr(pEnd, vGantt.getDateInputFormat());
          
        if (!pBaseStart)
            vBaseStart = "";
        else if ((typeof pBaseStart == "object") && (pBaseStart.constructor == Date))
            vBaseStart = pBaseStart;
        else
            vBaseStart = JSGantt.parseDateStr(pBaseStart, vGantt.getDateInputFormat());
          
        if (!pBaseEnd)
            vBaseEnd = "";
        else if ((typeof pBaseEnd == "object") && (pBaseEnd.constructor == Date))
            vBaseEnd = pBaseEnd;
        else
            vBaseEnd = JSGantt.parseDateStr(pBaseEnd, vGantt.getDateInputFormat());
      }
/**
* Returns task ID
* @method getID
* @return {Number}
*/
      this.getID       = function(){ return vID };
/**
* Returns task name
* @method getName
* @return {String}
*/
      this.getName     = function(){ return vName; };


      this.prop        = function(name){ return this[name]; };

      this.getTooltip  = function()
      {
            if(this['tooltip'])
                return this['tooltip'];
            else
                return this.getName();
      } 

/**
* Returns task start date
* @method getStart
* @return {Datetime}
*/
this.getStart    = function() {
    return vStart;
};
/**
* Returns task end date
* @method getEnd
* @return {Datetime}
*/    
this.getEnd      = function()
{ 
    if(vMile)
        return vStart;
    else
        return vEnd  
};

this.getFact      = function()
{ 
    return vEnd  
};

/**
* Returns task start date
* @method getStart
* @return {Datetime}
*/
this.getBaseStart = function () {
    return vBaseStart;
};
    
    /**
* Returns task start date
* @method getStart
* @return {Datetime}
*/
this.getBaseEnd = function () {
    return vBaseEnd;
};

/**
* Returns task bar color (i.e. 00FF00)
* @method getColor
* @return {String}
*/    this.getColor    = function(){ return vColor};

/**
* Returns task URL (i.e. http://www.jsgantt.com)
* @method getLink
* @return {String}
*/    this.getLink     = function(){ return vLink };

/**
* Returns whether task is a milestone (1=Yes,0=No)
* @method getMile
* @return {Boolean}
*/    this.getMile     = function(){ return vMile };

/**
* Returns task dependencies as list of values (i.e. 123,122)
* @method getDepend
* @return {String}
*/    this.getDepend   = function(){ if(vDepend) return vDepend; else return null };

/**
* Returns task caption (if it exists)
* @method getCaption
* @return {String}
*/    this.getCaption  = function(){ if(vCaption) return vCaption; else return ''; };

/**
* Returns task flag is new point (for new point accessible checkbox)
* @method getCaption
* @return {String}
*/    this.getIsNewPoint = function () { if (vIsNewPoint) return vIsNewPoint; else return 0; };

/**
* Returns task resource name as string
* @method getResource
* @return {String}
*/    this.getIndex = function(){ if(vInd) return vInd; else return 0;  };

/**
* Returns task resource name as string
* @method getResource
* @return {String}
*/    this.getIndex2 = function () { if (vInd2) return vInd2; else return 0; };

/**
* Returns task resource name as string
* @method getResource
* @return {String}
*/    this.getIndex1Text = function(){ if(vInd1Text) return vInd1Text; else return '';  };

/**
* Returns task resource name as string
* @method getResource
* @return {String}
*/    this.getIndex2Text = function () { if (vInd2Text) return vInd2Text; else return ''; };
/**
* Returns task resource name as string
* @method getResource
* @return {String}
*/    this.getResource = function(){ if(vRes) return vRes; else return '&nbsp';  };

/**
* Returns task completion percent as numeric value
* @method getCompVal
* @return {Boolean}
*/    this.getCompVal  = function(){ if(vComp) return vComp; else return 0; };

/**
* Returns task completion percent as formatted string (##%)
* @method getCompStr
* @return {String}
*/    this.getCompStr  = function(){ if(vComp) return vComp+'%'; else return ''; };

/**
* Returns task duration as a fortmatted string based on the current selected format
* @method getDuration
* @param vFormat {String} selected format (minute,hour,day,week,month)
* @return {String}
*/ 	  this.getDuration = function(vFormat){ 
         if (vMile) 
            vDuration = '-';
            else if (vFormat=='hour')
            {
                tmpPer =  Math.ceil((this.getEnd() - this.getStart()) /  ( 60 * 60 * 1000) );
                if(tmpPer == 1)  
                    vDuration = '1 Hour';
                else
                    vDuration = tmpPer + ' Hours';
            }
            
            else if (vFormat=='minute')
            {
                tmpPer =  Math.ceil((this.getEnd() - this.getStart()) /  ( 60 * 1000) );
                if(tmpPer == 1)  
                    vDuration = '1 Minute';
                else
                    vDuration = tmpPer + ' Minutes';
            }
            
 		   else { //if(vFormat == 'day') {
            tmpPer =  Math.ceil((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 1000) + 1);
            if(tmpPer == 1)  vDuration = '1 Day';
            else             vDuration = tmpPer + ' Days';
         }

         //else if(vFormat == 'week') {
         //   tmpPer =  ((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 1000) + 1)/7;
         //   if(tmpPer == 1)  vDuration = '1 Week';
         //   else             vDuration = tmpPer + ' Weeks'; 
         //}

         //else if(vFormat == 'month') {
         //   tmpPer =  ((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 1000) + 1)/30;
         //   if(tmpPer == 1) vDuration = '1 Month';
         //   else            vDuration = tmpPer + ' Months'; 
         //}

         //else if(vFormat == 'quater') {
         //   tmpPer =  ((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 1000) + 1)/120;
         //   if(tmpPer == 1) vDuration = '1 Qtr';
         //   else            vDuration = tmpPer + ' Qtrs'; 
         //}
         return( vDuration )
      };

/**
* Returns task parent ID
* @method getParent
* @return {Number}
*/      this.getParent   = function(){ return vParent };

/**
* Returns whether task is a group (1=Yes,0=No)
* @method getGroup
* @return {Number}
*/    this.getGroup    = function(){ return vGroup };

/**
* Returns whether task is open (1=Yes,0=No)
* @method getOpen
* @return {Boolean}
*/    this.getOpen     = function(){ return vOpen };

/**
* Returns task tree level (0,1,2,3...)
* @method getLevel
* @return {Boolean}
*/    this.getLevel    = function(){ return vLevel };

/**
* Returns the number of child tasks
* @method getNumKids
* @return {Number}
*/    this.getNumKids  = function(){ return vNumKid };
  /**
* Returns the X position of the left side of the task bar on the graph (right side)
* @method getStartX
* @return {Number}
*/    this.getStartX   = function(){ return x1 };

/**
* Returns the Y position of the top of the task bar on the graph (right side)
* @method getStartY
* @return {Number}
*/    this.getStartY   = function(){ return y1 };

/**
* Returns the X position of the right of the task bar on the graph (right side)
* @method getEndX
* @return {Int}
*/    this.getEndX     = function(){ return x2 };

/**
* Returns the Y position of the bottom of the task bar on the graph (right side)
* @method getEndY
* @return {Number}
*/    this.getEndY     = function(){ return y2 };

/**
* Returns whether task is visible  (1=Yes,0=No)
* @method getVisible
* @return {Boolean}
*/    this.getVisible  = function(){ return vVisible };

/**
* Set task dependencies
* @method setDepend
* @param pDepend {String} A comma delimited list of task IDs the current task depends on.
* @return {void}
*/  this.setDepend   = function(pDepend){ vDepend = pDepend;};

/**
* Set task start date/time
* @method setStart
* @param pStart {Datetime} 
* @return {void}
*/    this.setStart    = function(pStart){ vStart = pStart;};

/**
* Set task end date/time
* @method setEnd
* @param pEnd {Datetime}
* @return {void}
*/    this.setEnd      = function(pEnd)  { vEnd   = pEnd;  };

/**
* Set task tree level (0,1,2,3...)
* @method setLevel
* @param pLevel {Number} 
* @return {void}
*/    this.setLevel    = function(pLevel){ vLevel = pLevel;};

/**
* Set Number of children for the task
* @method setNumKid
* @param pNumKid {Number}
* @return {void}
*/    this.setNumKid   = function(pNumKid){ vNumKid = pNumKid;};

/**
* Set task completion percentage
* @method setCompVal
* @param pCompVal {Number} 
* @return {void}
*/    this.setCompVal  = function(pCompVal){ vComp = pCompVal;};

/**
* Set a task bar starting position (left)
* @method setStartX
* @param pX {Number} 
* @return {void}
*/    this.setStartX = function (pX) { x1 = pX; };

/**
* Set a task bar starting position (top)
* @method setStartY
* @param pY {Number} 
* @return {String}
*/    this.setStartY = function (pY) { y1 = pY; };

/**
* Set a task bar starting position (right)
* @method setEndX
* @param pX {Number} 
* @return {String}
*/    this.setEndX = function (pX) { x2 = pX; };

/**
* Set a task bar starting position (bottom)
* @method setEndY
* @param pY {Number} 
* @return {String}
*/    this.setEndY = function (pY) { y2 = pY; };
      this.setEndYpx = function (pY) { y2 = parseInt(pY.substr(0, pY.indexOf("px"))); };

/**
* Set task open/closed
* @method setOpen
* @param pOpen {Boolean} 
* @return {void}
*/    this.setOpen     = function(pOpen) {vOpen = pOpen; };

/**
* Set task visibility
* @method setVisible
* @param pVisible {Boolean} 
* @return {void}
*/    this.setVisible  = function(pVisible) {vVisible = pVisible; };

  };
	
	
/**
* Creates the gant chart. for example:

<p>var g = new JSGantt.GanttChart('g',document.getElementById('GanttChartDIV'), 'day');</p>
 
var g = new JSGantt.GanttChart( - assign the gantt chart to a javascript variable called 'g'
'g' - the name of the variable that was just assigned (will be used later so that gantt object can reference itself)
document.getElementById('GanttChartDIV') - reference to the DIV that will hold the gantt chart
'day' - default format will be by day

*
* @class GanttChart 
* @param pGanttVar {String} the name of the gantt chart variable
* @param pDiv {String} reference to the DIV that will hold the gantt chart
* @param pFormat {String} default format (minute,hour,day,week,month,quarter)
* @return void
*/

JSGantt.GanttChart =  function(options)
{

JSGantt.Charts[pGanttVar] = this;

var pGanttVar			= options.elementId;
var pDiv				= document.getElementById(options.elementId);
var pFormat				= options.format;
var pUseAltInterval		= options.useAltInterval;
var pWidth				= options.width;
var pChartDisplayWidth  = options.chartDisplayWidth;
var pOffsetCurrentDay   = options.OffsetCurrentDay;

/**
* The name of the gantt chart variable
* @property vGanttVar 
* @type String 
* @default pGanttVar
* @private
*/ var vGanttVar		= pGanttVar;

/**
* The name of the gantt chart DIV
* @property vDiv 
* @type String 
* @default pDiv
* @private
*/ var vDiv				= pDiv;

/**
* Selected format (minute,hour,day,week,month)
* @property vFormat 
* @type String 
* @default pFormat
* @private
*/ var vFormat			= pFormat;

/**
* Alt method for calc min\max interval for drawing
* @property vUseAltInterval 
* @type boolean 
* @default pUseAltInterval
* @private
*/ var vUseAltInterval	= (typeof pUseAltInterval == 'undefined') ? false : pUseAltInterval;

var vWidth				= (typeof pWidth === "undefined") ? (25 + 251 + 61 + 61 + 61 + 61 + 61) : pWidth;
var vChartDisplayWidth	= (typeof pChartDisplayWidth === "undefined") ? (500) : pChartDisplayWidth;
var vOffsetCurrentDay = (typeof pOffsetCurrentDay === "undefined") ? false : pOffsetCurrentDay;
/**
* Show resource column 
* @property vShowInd 
* @type Number 
* @default 1
* @private
*/ var vShowInd  = 1;
/**
* Show resource column 
* @property vShowRes 
* @type Number 
* @default 1
* @private
*/ var vShowRes  = 1;
/**
* Show duration column 
* @property vShowDur 
* @type Number 
* @default 1
* @private
*/ var vShowDur  = 1;
/**
* Show percent complete column 
* @property vShowComp 
* @type Number 
* @default 1
* @private
*/ var vShowComp = 1;
/**
* Show start date column 
* @property vShowStartDate 
* @type Number 
* @default 1
* @private
*/ var vShowStartDate = 1;
/**
* Show end date column 
* @property vShowEndDate 
* @type Number 
* @default 1
* @private
*/ var vShowEndDate = 1;
/**
* Date input format 
* @property vDateInputFormat 
* @type String 
* @default "mm/dd/yyyy"
* @private
*/var vDateInputFormat = "mm/dd/yyyy";
/**
* Date display format 
* @property vDateDisplayFormat 
* @type String 
* @default "mm/dd/yy"
* @private
*/var vDateDisplayFormat = "mm/dd/yy";
    
/**
* Date display format 
* @property vDateDisplayFormat 
* @type String 
* @default "mm/dd/yy"
* @private
*/

var vNumUnits  = 0;
var vCaptionType;
var vDepId = 1;
var vTaskList     = new Array();	
var vFormatArr	= new Array("day","week","month","quarter","year");
var vQuarterArr   = new Array("I","I","I","II","II","II","III","III","III","IV","IV","IV");
var vMonthDaysArr = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
//var vMonthArr     = new Array("Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь");
var vMonthArr = new Array(Globa.January.locale(), Globa.February.locale(), Globa.March.locale(), Globa.April.locale(), 
						Globa.May.locale(), Globa.June.locale(), Globa.Jule.locale(), Globa.August.locale(),
						Globa.September.locale(), Globa.October.locale(), Globa.November.locale(), Globa.December.locale());

/**
* Set current display format (minute/hour/day/week/month/quarter)
* Only the first 4 arguments are used, for example:
* <code>
* g.setFormatArr("day","week","month");
* </code>
* will show 3 formatting options (day/week/month) at the bottom right of the gantt chart
* @method setFormatArr
* @return {void}
*/ this.setFormatArr = function() 	 {
										  vFormatArr = new Array();
										  for(var i = 0; i < arguments.length; i++) {vFormatArr[i] = arguments[i];}
										  if(vFormatArr.length>5){vFormatArr.length=5;}
										 };
/**
* Show/Hide resource column
* @param pShow {Number} 1=Show,0=Hide
* @method setShowInd
* @return {void}
*/ this.setShowInd  = function(pShow) { vShowInd  = pShow; };
/**
* Show/Hide resource column
* @param pShow {Number} 1=Show,0=Hide
* @method setShowRes
* @return {void}
*/ this.setShowRes  = function(pShow) { vShowRes  = pShow; };
/**
* Show/Hide duration column
* @param pShow {Number} 1=Show,0=Hide
* @method setShowDur
* @return {void}
*/ this.setShowDur  = function(pShow) { vShowDur  = pShow; };
/**
* Show/Hide completed column
* @param pShow {Number} 1=Show,0=Hide
* @method setShowComp
* @return {void}
*/ this.setShowComp = function(pShow) { vShowComp = pShow; };
/**
* Show/Hide start date column
* @param pShow {Number} 1=Show,0=Hide
* @method setShowStartDate
* @return {void}
*/ this.setShowStartDate = function(pShow) { vShowStartDate = pShow; };
/**
* Show/Hide end date column
* @param pShow {Number} 1=Show,0=Hide
* @method setShowEndDate
* @return {void}
*/ this.setShowEndDate = function(pShow) { vShowEndDate = pShow; };
/**
* Overall date input format 
* @param pShow {String} (mm/dd/yyyy,dd/mm/yyyy,yyyy-mm-dd)
* @method setDateInputFormat
* @return {void}
*/      this.setDateInputFormat = function(pShow) { vDateInputFormat = pShow; };
/**
* Overall date display format 
* @param pShow {String} (mm/dd/yyyy,dd/mm/yyyy,yyyy-mm-dd)
* @method setDateDisplayFormat
* @return {void}
*/      this.setDateDisplayFormat = function(pShow) { vDateDisplayFormat = pShow; };
/**
* Set gantt caption
* @param pType {String} 
<p>Caption-Displays a custom caption set in TaskItem<br>
Resource-Displays task resource<br>
Duration-Displays task duration<br>
Complete-Displays task percent complete</p>
* @method setCaptionType
* @return {void}
*/  this.setCaptionType = function(pType) { vCaptionType = pType };
/**
* Set current display format and redraw gantt chart (minute/hour/day/week/month/quarter)
* @param pFormat {String} (mm/dd/yyyy,dd/mm/yyyy,yyyy-mm-dd)
* @method setFormat
* @return {void}
*/ this.setFormat = function(pFormat){ 
         vFormat = pFormat; 
         this.Draw(); 
      };
/**
* Returns whether resource column is shown
* @method getShowRes
* @return {Number}
*/  this.getShowInd  = function(){ return vShowInd };
/**
* Returns whether resource column is shown
* @method getShowRes
* @return {Number}
*/  this.getShowRes  = function(){ return vShowRes };
/**
* Returns whether duration column is shown
* @method getShowDur
* @return {Number}
*/  this.getShowDur  = function(){ return vShowDur };
/**
* Returns whether percent complete column is shown
* @method getShowComp
* @return {Number}
*/  this.getShowComp = function(){ return vShowComp };
/**
* Returns whether start date column is shown
* @method getShowStartDate
* @return {Number}
*/  this.getShowStartDate = function(){ return vShowStartDate };
/**
* Returns whether end date column is shown
* @method getShowEndDate
* @return {Number}
*/  this.getShowEndDate = function () { return vShowEndDate };
/**
* Returns for use alternative method calculate drawing interval
* @method getUseAltInterval
* @return {Boolean}
*/  this.getUseAltInterval = function () { return vUseAltInterval; };
/**
* Returns date input format 
* @method getDateInputFormat
* @return {String}
*/  this.getDateInputFormat = function() { return vDateInputFormat };
/**
* Returns current display format
* @method getDateDisplayFormat
* @return {String}
*/  this.getDateDisplayFormat = function() { return vDateDisplayFormat };
/**
* Returns current gantt caption type
* @method getCaptionType
* @return {String}
*/  this.getCaptionType = function () { return vCaptionType };

this.getWidth = function() { return vWidth; };
this.getChartDisplayWidth = function () { return vChartDisplayWidth; };
this.getOffsetCurrentDay = function () { return vOffsetCurrentDay; };

/**
* Calculates X/Y coordinates of a task and sets the Start and End properties of the TaskItem
* @method CalcTaskXY
* @return {Void}
*/  this.CalcTaskXY = function () 
      {
         var vList = this.getList();
         var vTaskDiv;
         var vParDiv;
         var vLeft, vTop, vHeight, vWidth;
         
         //функция для размера в пикселах возвращает ширину элемента   
         var parseFromPX = function(str) {
             var res = parseInt(str.substr(0, str.indexOf('px')));
             return isNaN(res) ? 0 : res;
         };
         for(i = 0; i < vList.length; i++)
         {
            vID = vList[i].getID();
            vTaskDiv = document.getElementById("taskbar_"+vID);
            vBarDiv  = document.getElementById("bardiv_"+vID);
            vParDiv  = document.getElementById("childgrid_"+vID);

            if (vBarDiv) {
                vList[i].setStartX(vBarDiv.offsetLeft);
                vList[i].setStartY(vParDiv.offsetTop + vBarDiv.offsetTop + 6);
                vList[i].setEndX(vBarDiv.offsetLeft + vBarDiv.offsetWidth);
                vList[i].setEndY(vParDiv.offsetTop + vBarDiv.offsetTop + 6);
            };
         };
      };

/**
* Adds a TaskItem to the Gantt object task list array
* @method AddTaskItem
* @return {Void}
*/  this.AddTaskItem = function(value)
      {
         vTaskList.push(value);
      };
/**
* Returns task list Array
* @method getList
* @return {Array}
*/ this.getList   = function() { return vTaskList };

/**
* Clears dependency lines between tasks
* @method clearDependencies
* @return {Void}
*/ this.clearDependencies = function()
      {
         var parent = document.getElementById('rightside');
         var depLine;
         var vMaxId = vDepId;
         for ( i=1; i<vMaxId; i++ ) {
            depLine = document.getElementById("line"+i);
            if (depLine) { parent.removeChild(depLine); }
         };
         vDepId = 1;
      };
/**
* Draw a straight line (colored one-pixel wide DIV), need to parameterize doc item
* @method sLine
* @return {Void}
*/  this.sLine = function(x1,y1,x2,y2) {

         vLeft = Math.min(x1,x2);
         vTop  = Math.min(y1,y2);
         vWid  = Math.abs(x2-x1) + 1;
         vHgt  = Math.abs(y2-y1) + 1;

         vDoc = document.getElementById('rightside');

		 // retrieve DIV
		 var oDiv = document.createElement('div');
	
		 oDiv.id = "line"+vDepId++;
			 oDiv.style.position = "absolute";
		 oDiv.style.margin = "0px";
		 oDiv.style.padding = "0px";
		 oDiv.style.overflow = "hidden";
		 oDiv.style.border = "0px";

		 // set attributes
		 oDiv.style.zIndex = 0;
		 oDiv.style.backgroundColor = "#777777";
		
		 oDiv.style.left = vLeft + "px";
		 oDiv.style.top = vTop + "px";
		 oDiv.style.width = vWid + "px";
		 oDiv.style.height = vHgt + "px";
	
		 oDiv.style.visibility = "visible";
		
		 vDoc.appendChild(oDiv);
		 return vDepId-1;
      };

/**
* Draw a diaganol line (calc line x,y pairs and draw multiple one-by-one sLines)
* @method dLine
* @return {Void}
*/  this.dLine = function(x1,y1,x2,y2) {

         var dx = x2 - x1;
         var dy = y2 - y1;
         var x = x1;
         var y = y1;

         var n = Math.max(Math.abs(dx),Math.abs(dy));
         dx = dx / n;
         dy = dy / n;
         for ( i = 0; i <= n; i++ )
         {
            vx = Math.round(x); 
            vy = Math.round(y);
            this.sLine(vx,vy,vx,vy);
            x += dx;
            y += dy;
         };

      };

/**
* Draw dependency line between two points (task 1 end -> task 2 start)
* @method drawDependency
* @return {Void}
*/ this.drawDependency =function(x1,y1,x2,y2)
      {
         if(x1 + 10 < x2)
         { 
            this.sLine(x1,y1,x1+4,y1);
            this.sLine(x1+4,y1,x1+4,y2);
            this.sLine(x1+4,y2,x2,y2);
            this.dLine(x2,y2,x2-3,y2-3);
            this.dLine(x2,y2,x2-3,y2+3);
            this.dLine(x2-1,y2,x2-3,y2-2);
            this.dLine(x2-1,y2,x2-3,y2+2);
         }
         else
         {
            this.sLine(x1,y1,x1+4,y1);
            this.sLine(x1+4,y1,x1+4,y2-10);
            this.sLine(x1+4,y2-10,x2-8,y2-10);
            this.sLine(x2-8,y2-10,x2-8,y2);
            this.sLine(x2-8,y2,x2,y2);
            this.dLine(x2,y2,x2-3,y2-3);
            this.dLine(x2,y2,x2-3,y2+3);
            this.dLine(x2-1,y2,x2-3,y2-2);
            this.dLine(x2-1,y2,x2-3,y2+2);
         }
      };

/**
* Draw all task dependencies 
* @method DrawDependencies
* @return {Void}
*/  this.DrawDependencies = function () {

         //First recalculate the x,y
         this.CalcTaskXY();

         this.clearDependencies();

         var vList = this.getList();
         for(var i = 0; i < vList.length; i++)
         {

            var vDepend = vList[i].getDepend();
            if(vDepend) {
         
               var vDependStr = vDepend + '';
               var vDepList = vDependStr.split(',');
               var n = vDepList.length;

               for(var k=0;k<n;k++) {
                  var vTask = this.getArrayLocationByID(vDepList[k]);
                  if (vTask == null || typeof(vTask) == "undefined")
                      continue;
                  if (vList[vTask].getVisible() == 1 && vList[i].getVisible() == 1)
                     this.drawDependency(vList[vTask].getEndX(),vList[vTask].getEndY()+2,vList[i].getStartX()-1,vList[i].getStartY()+2)
               }
  	        }   
         }
         
         if (this.hasOwnProperty('datePos') && this.hasOwnProperty('scrollPos') && this.getOffsetCurrentDay()) {
             var rs = document.getElementById('rightside');
             var ind = this.sLine(this.datePos, 40, this.datePos, $(rs).height());
             rs.scrollLeft = Math.max(this.scrollPos, 0);
             var el = $('#line' + ind);
             el.css({ 'background-color': 'red' });
         }
      };

/**
* Find location of TaskItem based on the task ID
* @method getArrayLocationByID
* @return {Void}
*/  this.getArrayLocationByID = function(pId)  {

         var vList = this.getList();
         for(var i = 0; i < vList.length; i++)
         {
            if(vList[i].getID()==pId)
               return i;
         }
      };

    this.getTaskByID = function(pId)  {

         var vList = this.getList();
         for(var i = 0; i < vList.length; i++)
         {
            if(vList[i].getID() == pId)
               return vList[i];
         }
         return null;
      };

/**
* Draw gantt chart
* @method Draw
* @return {Void}
*/ this.Draw = function()
   {
      var vMaxDate = new Date();
      var vMinDate = new Date();	
      var vTmpDate = new Date();
      var vNxtDate = new Date();
      var vCurrDate = new Date();
      var vTaskLeft = 0;
      var vTaskLeftBase = 0;
      var vTaskRight = 0;
      var vTaskRightBase = 0;
      var vNumCols = 0;
      var vID = 0;
      var vMainTable = "";
      var vLeftTable = "";
      var vRightTable = "";
      var vDateRowStr = "";
      var vItemRowStr = "";
      var vColWidth = 0;
      var vColUnit = 0;
      var vChartWidth = 0;
      var vNumDays = 0;
      var vDayWidth = 0;
      var vStr = "";
      var vNameWidth = 250;	
      var vStatusWidth = 61;
      
      var vSummeryRowClass = "";

      var daysInMonth = function(date) {
        var d1 = new Date(date);
        d1.setMonth(d1.getMonth() + 1);
        return (d1 - date) / 86400000;
      };
      var getColWidth = function (date) {
          var result;
          if (vFormat == 'day')
              return vDayWidth-1;
          else if (vFormat == 'week')
              return vDayWidth * 7-1;
          else if (vFormat == 'month')
              return vDayWidth * daysInMonth(date) -1;
          else if (vFormat == 'quarter') {
              var qu =Math.floor(date.getMonth()/3);
              return vDayWidth * (daysInMonth(date.setMonth(0 + qu * 3)) + daysInMonth(date.setMonth(1 + qu * 3)) + daysInMonth(date.setMonth(2 + qu * 3))) - 1;
          }
          else if (vFormat == 'year') {
              return vDayWidth * (new Date(date.getFullYear(), 11, 31) - new Date(date.getFullYear(), 0, 0)) / 86400000;
          }else return vDayWidth;
      };
    
      var getDateOffset = function (date) {
          var tmpDate = new Date(vMinDate);
          if (vFormat == 'month' || vFormat == 'quarter')
              tmpDate.setDate(1);
          else
              return Math.floor(((date.getTime() - tmpDate.getTime()) / (1000 * 60 * 60 * 24) +0.5) * vDayWidth);
          
          var result = 0;
          if (vFormat == 'month') {
              for (; tmpDate.getFullYear() * 12 + tmpDate.getMonth() < date.getFullYear() * 12 + date.getMonth(); tmpDate.setMonth(tmpDate.getMonth() + 1)) {
                  //!!! вдруг потребовался jQuery!
                  //хром каждый элемент позиционирует по целым пикселям
                  if (jQuery.browser.webkit)
                      result += Math.ceil(vDayWidth * daysInMonth(tmpDate));
                  else //if (jQuery.browser.msie) а ие и мозилла как-то умудряются юзать дробные
                      result += vDayWidth * daysInMonth(tmpDate);
              }
          }
          else if (vFormat == 'quarter') {
              for (; tmpDate.getFullYear() * 12 + tmpDate.getMonth() < date.getFullYear() * 12 + date.getMonth() ; ) {
                  //!!! вдруг потребовался jQuery!
                  //хром каждый элемент позиционирует по целым пикселям
                  var days = daysInMonth(tmpDate);
                  tmpDate.setMonth(tmpDate.getMonth() + 1);
                  if (tmpDate.getFullYear() * 12 + tmpDate.getMonth() < date.getFullYear() * 12 + date.getMonth()) {
                      days += daysInMonth(tmpDate);
                      tmpDate.setMonth(tmpDate.getMonth() + 1);
                      if (tmpDate.getFullYear() * 12 + tmpDate.getMonth() < date.getFullYear() * 12 + date.getMonth()) {
                          days += daysInMonth(tmpDate);
                          tmpDate.setMonth(tmpDate.getMonth() + 1);
                      }
                  }
                  if (jQuery.browser.webkit)
                      result += Math.ceil(vDayWidth * days);
                  else //if (jQuery.browser.msie) а ие и мозилла как-то умудряются юзать дробные
                      result += vDayWidth * days;
              }
          }

          result += date.getDate() * vDayWidth;
          
          return result;
      };
    

      if(vTaskList.length > 0)
      {
        
		   // Process all tasks preset parent date and completion %
         JSGantt.processRows(vTaskList, 0, -1, 1, 1);

         // get overall min/max dates plus padding
         vMinDate = JSGantt.getMinDate(vTaskList, vFormat, vUseAltInterval);
         vMaxDate = JSGantt.getMaxDate(vTaskList, vFormat, vUseAltInterval);

         // Calculate chart width variables.  vColWidth can be altered manually to change each column width
         // May be smart to make this a parameter of GanttChart or set it based on existing pWidth parameter
         if(vFormat == 'day') {
            vColWidth = 19;
            vColUnit = 1;
            vDayWidth = 20;
         }
         else if(vFormat == 'week') {
            vColWidth = 31;
            vColUnit = 7;
            vDayWidth = 32 / 7;
         }
         else if(vFormat == 'month') {
            vColWidth = 38;
            vColUnit = 30;
            vDayWidth = 1.3;
         }
         else if(vFormat == 'quarter') {
            vColWidth = 60;
            vColUnit = 90;
            vDayWidth = 61 / 90;
         }
         else if (vFormat == 'year') {
             vColWidth = 90;
             vColUnit = 365;
             vDayWidth = 91 / 365;
         }
         
         else if(vFormat=='hour')
         {
            vColWidth = 18;
            vColUnit = 1;
            vDayWidth = 19;//?
         }
         
         else if(vFormat=='minute')
         {
            vColWidth = 18;
            vColUnit = 1;
            vDayWidth = 19;//?
         }
         
         vNumDays = (Date.parse(vMaxDate) - Date.parse(vMinDate)) / ( 24 * 60 * 60 * 1000);
         vNumUnits = vNumDays / vColUnit;
         
         vChartWidth = vNumUnits * vColWidth + 1;
         //vDayWidth = (vColWidth / vColUnit) + (1/vColUnit);

		var vLeftWidth = this.getWidth() - this.getChartDisplayWidth() - 2;
		var vRightWidth = this.getChartDisplayWidth() - 1;

         vMainTable =
            '<TABLE id=theTable cellSpacing=0 cellPadding=0 class="jsGanttTable"><TBODY><TR>' +
            '<TD vAlign=top>';
         		 
		 // DRAW the Left-side of the chart (names, resources, comp%)
         vLeftTable = '<div class="scroll" id="leftside" style="width:' + vLeftWidth + 'px">';
         vLeftTable += '<table cellSpacing=0 cellPadding=0 class="jsGanttTable" style="width:100%"><thead class="jsGanttHead">';
         vLeftTable += '<tr class="jsGantTableRow headerRow">';
         
		 if (vShowInd & 1) vLeftTable += '  <th style="WIDTH: 24px;" class="jsGantTableRow jsGantTableRowHead" rowspan="2" nowrap>&nbsp;</th>';
         if (vShowInd & 2) vLeftTable += '  <th style="WIDTH: 24px;" class="jsGantTableRow jsGantTableRowHead" rowspan="2" nowrap>&nbsp;</th>';

		 vNameWidth = 0;
         
		 /*
		 if (!vShowInd & 1) { vLeftWidth -= 25; } else { vNameWidth -= 25; } //for first indicator
         if (!vShowInd & 2) { vLeftWidth -= 25; } else { vNameWidth -= 25; } //for second indicator
        
		 if (vShowRes != 1) { vLeftWidth -= vStatusWidth; } else { vNameWidth -= 25; }
         if (vShowDur != 1) { vLeftWidth -= vStatusWidth; } else { vNameWidth -= 25; }
         if (vShowComp != 1) { vLeftWidth -= vStatusWidth; } else { vNameWidth -= 25; }
         if (vShowStartDate != 1) { vLeftWidth -= vStatusWidth; } else { vNameWidth -= 25; }
         if (vShowEndDate != 1) { vLeftWidth -= vStatusWidth; } else { vNameWidth -= 25; }
		 */

		 if (vShowInd & 1) { vNameWidth -= 25; } //for first indicator
         if (vShowInd & 2) { vNameWidth -= 25; } //for second indicator
        
		 if (vShowRes == 1) { vNameWidth -= 60; }
         if (vShowDur == 1) { vNameWidth -= 60; }
         if (vShowComp == 1) { vNameWidth -= 60; }
         if (vShowStartDate == 1) { vNameWidth -= 60; }
         if (vShowEndDate == 1) { vNameWidth -= 60; }

	     vNameWidth -= 25; //for checkbox
         vNameWidth += vLeftWidth;

		 vLeftTable += '<th style="WIDTH: ' + vNameWidth + 'px;"  class="jsGantTableRow jsGantTableRowHead" rowspan="2" colspan="2">' + Globa.Naming.locale() + '</th>';

         if(vShowRes ==1) vLeftTable += '  <th style="WIDTH: 60px;" class="jsGantTableRow jsGantTableRowHead" rowspan="2" colspan="2" nowrap>' + Globa.Executor.locale() +'</th>' ;
         if (vShowDur == 1) vLeftTable += '  <th style="WIDTH: 60px;" class="jsGantTableRow jsGantTableRowHead" rowspan="2" colspan="2" nowrap>' + Globa.Dur.locale() + '</th>';
         if (vShowComp == 1) vLeftTable += '  <th style="WIDTH: 60px" class="jsGantTableRow jsGantTableRowHead" rowspan="2" colspan="2" nowrap>' + Globa.FinishPercent.locale() + '</th>';
         if(vShowStartDate==1) vLeftTable += '  <th style="WIDTH: 60px;" class="jsGantTableRow jsGantTableRowHead" rowspan="2" colspan="2" nowrap>' + Globa.Begin.locale() + '</th>' ;
         if(vShowEndDate==1) vLeftTable += '  <th style="WIDTH: 60px;" class="jsGantTableRow jsGantTableRowHead" rowspan="2" colspan="2" nowrap>' + Globa.End.locale() + '</th>' ;
 
         vLeftTable += '</tr><tr class="jsGantTableRow headerRow"></tr></thead><tbody>';

            for(i = 0; i < vTaskList.length; i++)
            {
               if( vTaskList[i].getGroup()) {
                  vRowType = "group";
                  vSummeryRowClass = "jsGantTableRow jsGantSummaryTableRow";
               } else {
                  vRowType  = "row";
                  vSummeryRowClass = "jsGantTableRow";
               }
                
               // ROWS WITH TASKS AND MILESTONES
               vID = vTaskList[i].getID();

                var padding = (vTaskList[i].getLevel()-1)*13 + 5;

  		         if(vTaskList[i].getVisible() == 0) 
                  vLeftTable += '<TR id=child_' + vID + ' class="' + vSummeryRowClass + '" style="display:none"  onMouseover=JSGantt.Charts.' + vGanttVar + '.mouseOver(this,' + vID + ',"left","' + vRowType + '") onMouseout=JSGantt.Charts.' + vGanttVar + '.mouseOut(this,' + vID + ',"left","' + vRowType + '")>' ;
			      else
                 vLeftTable += '<TR id=child_' + vID + ' class="' + vSummeryRowClass + '" onMouseover=JSGantt.Charts.' + vGanttVar + '.mouseOver(this,' + vID + ',"left","' + vRowType + '") onMouseout=JSGantt.Charts.' + vGanttVar + '.mouseOut(this,' + vID + ',"left","' + vRowType + '")>' ;

               if(vShowInd & 1){
                    var val = vTaskList[i].getIndex();
                    vLeftTable += '  <TD class="jsGantTableRow jsGantTableRowResource ' + vSummeryRowClass + '" style="WIDTH: 16px; "><img src="/asyst/gantt/img/' + val + '.png" title="' + vTaskList[i].getIndex1Text() + '"/></TD>'
               };
               if (vShowInd & 2) {
                   var val = vTaskList[i].getIndex2();
                   vLeftTable += '  <TD class="jsGantTableRow jsGantTableRowResource ' + vSummeryRowClass + '" style="WIDTH: 16px; "><img src="/asyst/gantt/img/' + val + '.png" title="' + vTaskList[i].getIndex2Text() + '"/></TD>'
               };

			      vLeftTable += 
                  //'  <TD class="' + vSummeryRowClass + '" style="WIDTH: ' + vNameWidth + 'px; position:relative; left:' + padding + 'px; HEIGHT: 20px;" nowrap>';
			          '  <TD class="' + vSummeryRowClass + '" style="padding-left:' + padding + 'px; HEIGHT: 20px;" nowrap>';

               //for(j=1; j<vTaskList[i].getLevel(); j++) {
               //   vLeftTable += '&nbsp&nbsp&nbsp&nbsp';
               //}

               if( vTaskList[i].getGroup()) {
                   if (vTaskList[i].getOpen() == 1)
                       //jsGantSummaryCollapser
                       vLeftTable += '<SPAN id="group_' + vID + '" class="jsGantTableRow jsGantSummaryCollapser" onclick="JSGantt.folder(' + vID + ', JSGantt.Charts.' + vGanttVar + '); JSGantt.Charts.' + vGanttVar + '.DrawDependencies();">&ndash;</span><span style="color:#000000">&nbsp</SPAN>';
                  else
                       vLeftTable += '<SPAN id="group_' + vID + '" class="jsGantTableRow jsGantSummaryCollapser" onclick="JSGantt.folder(' + vID + ', JSGantt.Charts.' + vGanttVar + '); JSGantt.Charts.' + vGanttVar + '.DrawDependencies();">+</span><span style="color:#000000">&nbsp</SPAN>';
               } 
               
			   vLinkWidth = vNameWidth;
			   vLinkWidth -= 5; //padding left
               
			   vLeftTable += 
                  '<a href="' + vTaskList[i].getLink() + '" rel="tooltip" data-html="true" title="' + vTaskList[i].getTooltip() + '" class="jsTaskName" style="width:' + vLinkWidth + 'px;">' + JSGantt.formatName(vTaskList[i].getName()) + '</a></TD>';
                //'<a href="#" rel="tooltip" data-html="true" title="' + vTaskList[i].getTooltip() + '" onclick="JSGantt.taskLink(JSGantt.Charts.' + vGanttVar + ', \'' + vTaskList[i].getID() + '\')"  class="jsTaskName">' + JSGantt.formatName(vTaskList[i].getName()) + '</a></TD>';
               
               if(vShowRes ==1){
                    var val = vTaskList[i].getResource();
                    if (val.length == 0)
                        val = "&nbsp;";
                    vLeftTable += '  <TD class="jsGantTableRow jsGantTableRowResource ' + vSummeryRowClass + '" style="WIDTH: 60px; ">' + val + '</TD>'
               };
               if(vShowDur ==1){
                   var val = vTaskList[i].getDuration(vFormat);
                   if (val.length == 0)
                       val = "&nbsp;";
                    vLeftTable += '  <TD class="jsGantTableRow jsGantTableRowDuration ' + vSummeryRowClass + '" style="WIDTH: 60px;">' + val + '</TD>'
               };
               if(vShowComp==1){
                    var val = vTaskList[i].getCompStr();
                    if (val.length == 0)
                        val = "&nbsp;";
                    vLeftTable += '  <TD class="jsGantTableRow jsGantTableRowCompStr ' + vSummeryRowClass + '" style="WIDTH: 60px;">' + val  + '</TD>'
               };
               if(vShowStartDate==1){
                    var val = JSGantt.formatDateStr(vTaskList[i].getStart(), vDateDisplayFormat);
                    if (val.length == 0)
                        val = "&nbsp;";
                    vLeftTable += '  <TD class="jsGantTableRow jsGantTableRowStart ' + vSummeryRowClass + '" style="WIDTH: 60px;">' + JSGantt.formatDateStr( vTaskList[i].getStart(), vDateDisplayFormat) + '</TD>'
               };
               if(vShowEndDate==1){
                    var val = JSGantt.formatDateStr(vTaskList[i].getEnd(), vDateDisplayFormat);
                    if (val.length == 0)
                        val = "&nbsp;";
                    vLeftTable += '  <TD class="jsGantTableRow jsGantTableRowEnd ' + vSummeryRowClass + '" style="WIDTH: 60px;">' + JSGantt.formatDateStr( vTaskList[i].getEnd(), vDateDisplayFormat) + '</TD>'
               };

               vLeftTable += '<td class="jsGantTableRowCheckbox">';
               if (vTaskList[i].getIsNewPoint() == 1) {
                   vLeftTable += '<input type="checkbox" id="jsGantCheckbox' + vTaskList[i].getID() + '"/>';
               }
               vLeftTable += '</td>';
               vLeftTable += '</TR>';
            }

            // DRAW the date format selector at bottom left.  Another potential GanttChart parameter to hide/show this selector
            vLeftTable += '</TD></TR>';

            vLeftTable += '<TR><TD colspan=5>';
		
            vLeftTable += '<div class="format-selector">';
            vLeftTable += '    <ul class="nav nav-pills">';
                        
            if (vFormatArr.join().indexOf("day")!=-1) { 
                if (vFormat=='day') 
                    vLeftTable += '        <li class="active"><a href="#">' + Globa.Day.locale() + '</a></li>';
                else
                    vLeftTable += '        <li><a href="javascript:JSGantt.changeFormat(\'day\', JSGantt.Charts.' + vGanttVar + ')">' + Globa.Day.locale() + '</a></li>';
			}

            if (vFormatArr.join().indexOf("week")!=-1) { 
                if (vFormat=='week') 
                    vLeftTable += '        <li class="active"><a href="#">' + Globa.Week.locale() + '</a></li>';
                else
                    vLeftTable += '        <li><a href="javascript:JSGantt.changeFormat(\'week\', JSGantt.Charts.' + vGanttVar + ')">' + Globa.Week.locale() + '</a></li>';
			}

            if (vFormatArr.join().indexOf("month")!=-1) { 
                if (vFormat=='month') 
                    vLeftTable += '        <li class="active"><a href="#">' + Globa.Month.locale() + '</a></li>';
                else
                    vLeftTable += '        <li><a href="javascript:JSGantt.changeFormat(\'month\', JSGantt.Charts.' + vGanttVar + ')">' + Globa.Month.locale() + '</a></li>';
			}

            if (vFormatArr.join().indexOf("quarter")!=-1) { 
                if (vFormat=='quarter') 
                    vLeftTable += '        <li class="active"><a href="#">' + Globa.Quarter.locale() + '</a></li>';
                else
                    vLeftTable += '        <li><a href="javascript:JSGantt.changeFormat(\'quarter\', JSGantt.Charts.' + vGanttVar + ')">' + Globa.Quarter.locale() + '</a></li>';
            }
            if (vFormatArr.join().indexOf("year") != -1) {
                if (vFormat == 'year')
                    vLeftTable += '        <li class="active"><a href="#">' + Globa.Year.locale() + '</a></li>';
                else
                    vLeftTable += '        <li><a href="javascript:JSGantt.changeFormat(\'year\', JSGantt.Charts.' + vGanttVar + ')">' + Globa.Year.locale() + '</a></li>';
            }

            vLeftTable += '    </ul>';
            vLeftTable += '</div>';

//            vLeftTable += '<INPUT TYPE=RADIO NAME="other" VALUE="other" style="display:none"> .';

            vLeftTable += '</TD></TR>';
            
            
            vLeftTable += '</TBODY></TABLE></TD>';

            vMainTable += vLeftTable;

            // Draw the Chart Rows
            vRightTable = 
            '<TD style="width: ' + vRightWidth + 'px;" vAlign=top bgColor=#ffffff>' +
            '<DIV class="scroll2" id="rightside" style="width: ' + vRightWidth + 'px;">' +
            '<table style="width: ' + vChartWidth + 'px;" cellSpacing=0 cellPadding=0 class="jsGanttTable">' +
            '<thead class="jsGanttHead"><tr class="jsGantTableRowHead headerRow">';

            vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
            vTmpDate.setHours(0);
            vTmpDate.setMinutes(0);

         // Major Date Header
         while(Date.parse(vTmpDate) <= Date.parse(vMaxDate))
         {	
            vStr = vTmpDate.getFullYear() + '';
            //vStr = vStr.substring(2,4);
            
            if(vFormat == 'minute')
            {
                vRightTable += '<th class="jsGantTableRow jsGantTableRowHead" colspan=60>' ;
                vRightTable += JSGantt.formatDateStr(vTmpDate, vDateDisplayFormat) + ' ' + vTmpDate.getHours() + ':00 -' + vTmpDate.getHours() + ':59 </th>';
                vTmpDate.setHours(vTmpDate.getHours()+1);
            }
            
            if(vFormat == 'hour')
            {
                vRightTable += '<th class="jsGantTableRow jsGantTableRowHead" colspan=24>' ;
                vRightTable += JSGantt.formatDateStr(vTmpDate, vDateDisplayFormat) + '</th>';
                vTmpDate.setDate(vTmpDate.getDate()+1);
            }
            
  	         if(vFormat == 'day')
            {
			      vRightTable += '<th class="jsGantTableRow jsGantTableRowHead" colspan=7>' +
			      JSGantt.formatDateStr(vTmpDate,vDateDisplayFormat.substring(0,5)) + ' - ';
               vTmpDate.setDate(vTmpDate.getDate()+6);
		         vRightTable += JSGantt.formatDateStr(vTmpDate, vDateDisplayFormat) + '</th>';
               vTmpDate.setDate(vTmpDate.getDate()+1);
            }
            else if(vFormat == 'week')
            {
                vRightTable += '<th class="jsGantTableRow jsGantTableRowHead" width=' + getColWidth(vTmpDate) + 'px>' + vStr + '</th>';
               vTmpDate.setDate(vTmpDate.getDate()+7);
            }
            else if(vFormat == 'month')
            {
                vRightTable += '<th class="jsGantTableRow jsGantTableRowHead" width=' + getColWidth(vTmpDate) + 'px>' + vStr + '</th>';
               vTmpDate.setDate(vTmpDate.getDate() + 1);
               while(vTmpDate.getDate() > 1)
               {
                 vTmpDate.setDate(vTmpDate.getDate() + 1);
               }
            }
            else if(vFormat == 'quarter')
            {
                vStr = vTmpDate.getFullYear() + '';
                vRightTable += '<th class="jsGantTableRow jsGantTableRowHead" width=' + getColWidth(vTmpDate) + 'px>' + vStr + '</th>';
               vTmpDate.setDate(vTmpDate.getDate() + 81);
               while(vTmpDate.getDate() > 1)
               {
                 vTmpDate.setDate(vTmpDate.getDate() + 1);
               }
            }
             //todo?
            else if (vFormat == 'year') {
                vStr = vTmpDate.getFullYear() + '';
                vRightTable += '<th class="jsGantTableRow jsGantTableRowHead" width=' + getColWidth(vTmpDate) + 'px>' + vStr + '</th>';
                vTmpDate.setDate(vTmpDate.getDate() + 365);
                while (vTmpDate.getDate() > 1) {
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
            }

         }

         vRightTable += '</tr><tr class="headerRow">';

         // Minor Date header and Cell Rows
         vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
         vNxtDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
         vNumCols = 0;
 
         while(Date.parse(vTmpDate) <= Date.parse(vMaxDate))
         {	
            if (vFormat == 'minute')
            {
			
			  if( vTmpDate.getMinutes() ==0 ) 
                  vWeekdayColor = "weekendStyle";
               else
                  vWeekdayColor = "weekdayStyle";
				  
				  
			    vDateRowStr += '<th class="jsGantTableRow jsGantTableRowHead ' + vWeekdayColor + '"><div style="width: ' + getColWidth(vTmpDate) + 'px">' + vTmpDate.getMinutes() + '</div></th>';
			    vItemRowStr += '<th class="jsGantTableRow jsGantTableRowHead ' + vWeekdayColor + '"><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
                vTmpDate.setMinutes(vTmpDate.getMinutes() + 1);
            }
          
            else if (vFormat == 'hour')
            {
			
			   if(  vTmpDate.getHours() ==0  ) 
                  vWeekdayColor = "weekendStyle";
               else
                  vWeekdayColor = "weekdayStyle";
				  
				  
			   vDateRowStr += '<th class="ghead ' + vWeekdayColor + '" style="BORDER-TOP: #efefef 1px solid; FONT-SIZE: 12px; HEIGHT: 19px; BORDER-LEFT: #efefef 1px solid;" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">' + vTmpDate.getHours() + '</div></th>';
			   vItemRowStr += '<th class="ghead ' + vWeekdayColor + '" style="BORDER-TOP: #efefef 0px solid; FONT-SIZE: 12px; BORDER-LEFT: #efefef 0px solid; cursor: default;" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
                vTmpDate.setHours(vTmpDate.getHours() + 1);
            }

	        else if(vFormat == 'day' )
             {
               if( JSGantt.formatDateStr(vCurrDate,'mm/dd/yyyy') == JSGantt.formatDateStr(vTmpDate,'mm/dd/yyyy')) {
                  vWeekdayColor  = "ccccff";
                  vWeekendColor  = "9999ff";
                  vWeekdayGColor  = "bbbbff";
                  vWeekendGColor = "8888ff";
               } else {
                  vWeekdayColor = "ffffff";
                  vWeekendColor = "cfcfcf";
                  vWeekdayGColor = "f3f3f3";
                  vWeekendGColor = "c3c3c3";
               }
               
               if(vTmpDate.getDay() % 6 == 0) {
                   vDateRowStr += '<th class="ghead gheadwkend" bgcolor=#' + vWeekendColor + ' align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">' + vTmpDate.getDate() + '</div></th>';
                   vItemRowStr += '<th class="ghead gheadwkend" bgcolor=#' + vWeekendColor + ' align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp</div></th>';
               }
               else {
                   vDateRowStr += '<th class="ghead day" bgcolor=#' + vWeekdayColor + ' align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">' + vTmpDate.getDate() + '</div></th>';
                  if( JSGantt.formatDateStr(vCurrDate,'mm/dd/yyyy') == JSGantt.formatDateStr(vTmpDate,'mm/dd/yyyy')) 
                      vItemRowStr += '<th class="ghead day" bgcolor=#' + vWeekdayColor + ' align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
                  else
                      vItemRowStr += '<th class="ghead day" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
               }

               vTmpDate.setDate(vTmpDate.getDate() + 1);

            }

	         else if(vFormat == 'week')
            {

               vNxtDate.setDate(vNxtDate.getDate() + 7);

               if( vCurrDate >= vTmpDate && vCurrDate < vNxtDate ) 
                  vWeekdayColor = "weekendStyle";
               else
                  vWeekdayColor = "weekdayStyle";

               if(vNxtDate <= vMaxDate) {
                   vDateRowStr += '<th class="ghead weekend ' + vWeekdayColor + '" align=center width:' + getColWidth(vTmpDate) + 'px><div style="width: ' + getColWidth(vTmpDate) + 'px">' + vTmpDate.getDate() + '.' + AddLeadingZero(vTmpDate.getMonth() + 1) + '</div></th>';
                  if( vCurrDate >= vTmpDate && vCurrDate < vNxtDate ) 
                      vItemRowStr += '<th class="ghead weekend ' + vWeekdayColor + '" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
                  else
                      vItemRowStr += '<th class="ghead weekend" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';

               } else {
                   vDateRowStr += '<th class="ghead ' + vWeekdayColor + '" align=center width:' + getColWidth(vTmpDate) + 'px><div style="width: ' + getColWidth(vTmpDate) + 'px">' + vTmpDate.getDate() + '.' + AddLeadingZero(vTmpDate.getMonth() + 1) + '</div></th>';
                  if( vCurrDate >= vTmpDate && vCurrDate < vNxtDate ) 
                      vItemRowStr += '<th class="ghead weekend ' + vWeekdayColor + '" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
                  else
                      vItemRowStr += '<th class="ghead weekend" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';

               }

               vTmpDate.setDate(vTmpDate.getDate() + 7);

            }

	         else if(vFormat == 'month')
            {

               vNxtDate.setFullYear(vTmpDate.getFullYear(), vTmpDate.getMonth(), vMonthDaysArr[vTmpDate.getMonth()]);
               if( vCurrDate >= vTmpDate && vCurrDate < vNxtDate ) 
                  vWeekdayColor = "weekendStyle";
               else
                  vWeekdayColor = "weekdayStyle";

               if(vNxtDate <= vMaxDate) {
                   vDateRowStr += '<th class="jsGantTableRow jsGantTableRowHead ghead month ' + vWeekdayColor + '" width:' + getColWidth(vTmpDate) + 'px><div style="width: ' + getColWidth(vTmpDate) + 'px">' + vMonthArr[vTmpDate.getMonth()].substr(0, 3) + '</div></th>';
                  if( vCurrDate >= vTmpDate && vCurrDate < vNxtDate ) 
                      vItemRowStr += '<th class="jsGantTableRow jsGantTableRowHead ghead month ' + vWeekdayColor + '" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
                  else
                      vItemRowStr += '<th class="ghead month" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
               } else {
                   vDateRowStr += '<th class="jsGantTableRow jsGantTableRowHead ghead month ' + vWeekdayColor + '" align=center width:' + getColWidth(vTmpDate) + 'px><div style="width: ' + getColWidth(vTmpDate) + 'px">' + vMonthArr[vTmpDate.getMonth()].substr(0, 3) + '</div></th>';
                  if( vCurrDate >= vTmpDate && vCurrDate < vNxtDate ) 
                      vItemRowStr += '<th class="jsGantTableRow jsGantTableRowHead ghead month ' + vWeekdayColor + '" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
                  else
                      vItemRowStr += '<th class="ghead month"><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
               }

               vTmpDate.setDate(vTmpDate.getDate() + 1);

               while(vTmpDate.getDate() > 1) 
               {
                  vTmpDate.setDate(vTmpDate.getDate() + 1);
               }

            }

	         else if(vFormat == 'quarter')
            {

               vNxtDate.setDate(vNxtDate.getDate() + 122);
               if( vTmpDate.getMonth()==0 || vTmpDate.getMonth()==1 || vTmpDate.getMonth()==2 )
                  vNxtDate.setFullYear(vTmpDate.getFullYear(), 2, 31);
               else if( vTmpDate.getMonth()==3 || vTmpDate.getMonth()==4 || vTmpDate.getMonth()==5 )
                  vNxtDate.setFullYear(vTmpDate.getFullYear(), 5, 30);
               else if( vTmpDate.getMonth()==6 || vTmpDate.getMonth()==7 || vTmpDate.getMonth()==8 )
                  vNxtDate.setFullYear(vTmpDate.getFullYear(), 8, 30);
               else if( vTmpDate.getMonth()==9 || vTmpDate.getMonth()==10 || vTmpDate.getMonth()==11 )
                  vNxtDate.setFullYear(vTmpDate.getFullYear(), 11, 31);

               if( vCurrDate >= vTmpDate && vCurrDate < vNxtDate ) 
                  vWeekdayColor = "weekendStyle";
               else
                  vWeekdayColor = "weekdayStyle";

               if(vNxtDate <= vMaxDate) {
                   vDateRowStr += '<th class="ghead quarter ' + vWeekdayColor + '" align=center width:' + getColWidth(vTmpDate) + 'px><div style="width: ' + getColWidth(vTmpDate) + 'px">' + Globa.Qu.locale() + vQuarterArr[vTmpDate.getMonth()] + '</div></th>';
                  if( vCurrDate >= vTmpDate && vCurrDate < vNxtDate ) 
                      vItemRowStr += '<th class="ghead quarter ' + vWeekdayColor + '" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
                  else
                      vItemRowStr += '<th class="ghead quarter" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
               } else {
                   vDateRowStr += '<th class="ghead quarter ' + vWeekdayColor + '" align=center width:' + getColWidth(vTmpDate) + 'px><div style="width: ' + getColWidth(vTmpDate) + 'px">' + Globa.Qu.locale() + vQuarterArr[vTmpDate.getMonth()] + '</div></th>';
                  if( vCurrDate >= vTmpDate && vCurrDate < vNxtDate ) 
                      vItemRowStr += '<th class="ghead quarter ' + vWeekdayColor + '" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
                  else 
                      vItemRowStr += '<th class="ghead quarter" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
               }

               vTmpDate.setDate(vTmpDate.getDate() + 81);

               while(vTmpDate.getDate() > 1) 
               {
                  vTmpDate.setDate(vTmpDate.getDate() + 1);
               }

	         }

             //todo?
	         else if (vFormat == 'year') {

	             vNxtDate.setDate(vNxtDate.getDate() + 366);

	             if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
	                 vWeekdayColor = "weekendStyle";
	             else
	                 vWeekdayColor = "weekdayStyle";

	             if (vNxtDate <= vMaxDate) {
	                 vDateRowStr += '<th class="ghead year ' + vWeekdayColor + '" align=center width:' + getColWidth(vTmpDate) + 'px><div style="width: ' + getColWidth(vTmpDate) + 'px">'/* + vTmpDate.getFullYear()*/ + '</div></th>';
	                 if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
	                     vItemRowStr += '<th class="ghead year ' + vWeekdayColor + '" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
	                 else
	                     vItemRowStr += '<th class="ghead year" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
	             } else {
	                 vDateRowStr += '<th class="ghead year ' + vWeekdayColor + '" align=center width:' + getColWidth(vTmpDate) + 'px><div style="width: ' + getColWidth(vTmpDate) + 'px">'/* + vTmpDate.getFullYear()*/ + '</div></th>';
	                 if (vCurrDate >= vTmpDate && vCurrDate < vNxtDate)
	                     vItemRowStr += '<th class="ghead year ' + vWeekdayColor + '" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
	                 else
	                     vItemRowStr += '<th class="ghead year" align=center><div style="width: ' + getColWidth(vTmpDate) + 'px">&nbsp&nbsp</div></th>';
	             }

	             vTmpDate.setDate(vTmpDate.getDate() + 366);

	             while (vTmpDate.getDate() > 1) {
	                 vTmpDate.setDate(vTmpDate.getDate() + 1);
	             }

	         }
         }

         vRightTable += vDateRowStr + '</tr>';
         vRightTable += '</thead></table>';

         // Draw each row

         for(i = 0; i < vTaskList.length; i++)

         {

            vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
            vTaskStart = vTaskList[i].getStart();
            vTaskEnd   = vTaskList[i].getEnd();

            vNumCols = 0;
            vID = vTaskList[i].getID();

           // vNumUnits = Math.ceil((vTaskList[i].getEnd() - vTaskList[i].getStart()) / (24 * 60 * 60 * 1000)) + 1;
            vNumUnits = (vTaskList[i].getEnd() - vTaskList[i].getStart()) / (24 * 60 * 60 * 1000) + 1;
	       if (vFormat=='hour')
	       {
                vNumUnits = (vTaskList[i].getEnd() - vTaskList[i].getStart()) / (  60 * 1000) + 1;
	       }
	       else if (vFormat=='minute')
	       {
                vNumUnits = (vTaskList[i].getEnd() - vTaskList[i].getStart()) / (  60 * 1000) + 1;
	       }
	       
           var isLast = i == vTaskList.length - 1;
           var childGridClass = 'ganttRow';
           if (isLast)
            childGridClass = 'ganttRow bottomGanttRow';
	         if(vTaskList[i].getVisible() == 0) 
               vRightTable += '<DIV id=childgrid_' + vID + ' class="' + childGridClass + '" style="position:relative; display:none;">';
            else
		         vRightTable += '<DIV id=childgrid_' + vID + ' class="' + childGridClass + '" style="position:relative">';
            
            if( vTaskList[i].getMile()) {

               vRightTable += '<DIV><TABLE style="position:relative; top:0px; width: ' + vChartWidth + 'px;" cellSpacing=0 cellPadding=0 class="jsGanttTable">' +
                  '<TR id=childrow_' + vID + ' class=yesdisplay style="HEIGHT: 20px" onMouseover=JSGantt.Charts.' + vGanttVar + '.mouseOver(this,' + vID + ',"right","mile") onMouseout=JSGantt.Charts.' + vGanttVar + '.mouseOut(this,' + vID + ',"right","mile")>' + vItemRowStr + '</TR></TABLE></DIV>';

               // Build date string for Title
               vDateRowStr = JSGantt.formatDateStr(vTaskStart,vDateDisplayFormat);
               var val = vTaskList[i].getIndex();
               var tmpDate = new Date(vMinDate);
               tmpDate.setDate(1);
               vTaskLeft = getDateOffset(new Date(vTaskList[i].getStart()));
               vTaskLeftBase = getDateOffset(new Date(vTaskList[i].getBaseStart()));
               

               //vTaskLeft = (Date.parse(vTaskList[i].getStart()) - Date.parse(vMinDate)) / (24 * 60 * 60 * 1000) +0.5;
                //vTaskLeftBase = (Date.parse(vTaskList[i].getBaseStart()) - Date.parse(vMinDate)) / (24 * 60 * 60 * 1000) + 0.5;
               //vTaskRight = 1;

               //var taskLeft = Math.ceil((vTaskLeft * (vDayWidth) + 1));
               //var taskLeftBase = Math.ceil((vTaskLeftBase * (vDayWidth) + 1));
                //if (vTaskList[i].getMile()) {
                    vTaskLeft -= 9;
                    vTaskLeftBase -= 9;
                //}

                if (vTaskList[i].getBaseStart()) {
                   vRightTable +=
                       '<div id=pbardiv_' + vID + ' style="position:absolute; top:0px; left:' + vTaskLeftBase + 'px; height: 20px; width:16px; overflow:hidden;">' +
                           '  <div id=ptaskbar_' + vID + ' class="milestone indicatorP" title="' + vTaskList[i].getTooltip() + '" style="color: ' + vTaskList[i].getColor() + '">';
                   vRightTable += '</div></div>';
               }
                 
               vRightTable +=
                 '<div id=bardiv_' + vID + ' style="position:absolute; top:0px; left:' + vTaskLeft + 'px; height: 20px; width:16px; overflow:hidden;">' +
                 '  <div id=taskbar_' + vID + ' class="milestone indicator' + val + '" title="' + vTaskList[i].getTooltip() + '" style="color: ' + vTaskList[i].getColor() + '" onclick="JSGantt.taskLink(JSGantt.Charts.' + vGanttVar + ', \'' + vTaskList[i].getID() + '\')">';
  	           vRightTable += '</div>';
               

               /*if(vTaskList[i].getCompVal() < 100)
 		            {vRightTable += '&diams;</div>' ;}
               else
 		           { vRightTable += '&diams;</div>' ;}
                */
                        if( this.getCaptionType() ) {
                           vCaptionStr = '';
                           switch( this.getCaptionType() ) {           
                              case 'Caption':    vCaptionStr = vTaskList[i].getCaption();  break;
                              case 'Resource':   vCaptionStr = vTaskList[i].getResource();  break;
                              case 'Duration':   vCaptionStr = vTaskList[i].getDuration(vFormat);  break;
                              case 'Complete':   vCaptionStr = vTaskList[i].getCompStr();  break;
		                     }
                           //vRightTable += '<div style="FONT-SIZE:12px; position:absolute; left: 6px; top:1px;">' + vCaptionStr + '</div>';
                           vRightTable += '<div style="FONT-SIZE:12px; position:absolute; top:2px; width:120px; left:12px">' + vCaptionStr + '</div>';
	                  };

  	            vRightTable += '</div>';


            } else {

               // Build date string for Title
               vDateRowStr = JSGantt.formatDateStr(vTaskStart,vDateDisplayFormat) + ' - ' + JSGantt.formatDateStr(vTaskEnd,vDateDisplayFormat);

                if (vFormat=='minute') {
                    vTaskRight = (Date.parse(vTaskList[i].getEnd()) - Date.parse(vTaskList[i].getStart())) / (60 * 1000) + 0.5;//1 / vColUnit;
                    vTaskRightBase = (Date.parse(vTaskList[i].getBaseEnd()) - Date.parse(vTaskList[i].getBaseStart())) / (60 * 1000) + 0.5;//1 / vColUnit;
                    vTaskLeft = Math.ceil((Date.parse(vTaskList[i].getStart()) - Date.parse(vMinDate)) / (60 * 1000));
                    vTaskLeftBase = Math.ceil((Date.parse(vTaskList[i].getBaseStart()) - Date.parse(vMinDate)) / (60 * 1000));
                }
                else if (vFormat=='hour')
                {
                    vTaskRight = (Date.parse(vTaskList[i].getEnd()) - Date.parse(vTaskList[i].getStart())) / (60 * 60 * 1000) + 0.5;//1 / vColUnit;
                    vTaskRightBase = (Date.parse(vTaskList[i].getBaseEnd()) - Date.parse(vTaskList[i].getBaseStart())) / (60 * 60 * 1000) + 0.5;//1 / vColUnit;
                    vTaskLeft = (Date.parse(vTaskList[i].getStart()) - Date.parse(vMinDate)) / (60 * 60 * 1000);
                    vTaskLeftBase = (Date.parse(vTaskList[i].getBaseStart()) - Date.parse(vMinDate)) / (60 * 60 * 1000);
                }
                else {
                    vTaskRight = getDateOffset(new Date(vTaskList[i].getEnd()));
                    vTaskRightBase = getDateOffset(new Date(vTaskList[i].getBaseEnd()));
                    vTaskLeft = getDateOffset(new Date(vTaskList[i].getStart()));
                    vTaskLeftBase = getDateOffset(new Date(vTaskList[i].getBaseStart()));
                    //vTaskRight = (Date.parse(vTaskList[i].getEnd()) - Date.parse(vTaskList[i].getStart())) / (24 * 60 * 60 * 1000) + 0.5;//1 / vColUnit;
                    //vTaskRightBase = (Date.parse(vTaskList[i].getBaseEnd()) - Date.parse(vTaskList[i].getBaseStart())) / (24 * 60 * 60 * 1000) + 0.5;//1 / vColUnit;
                    //vTaskLeft = Math.ceil((Date.parse(vTaskList[i].getStart()) - Date.parse(vMinDate)) / (24 * 60 * 60 * 1000));
                    //vTaskLeftBase = Math.ceil((Date.parse(vTaskList[i].getBaseStart()) - Date.parse(vMinDate)) / (24 * 60 * 60 * 1000));
                    if (vFormat == 'day')
                    {
                        var tTime=new Date();
                        tTime.setTime(Date.parse(vTaskList[i].getStart()));
                        if (tTime.getMinutes() > 29)
                            vTaskLeft += .5;
                        tTime.setTime(Date.parse(vTaskList[i].getBaseStart()));
                        if (tTime.getMinutes() > 29)
                            vTaskLeftBase += .5;
                    }
                }

               // Draw Group Bar  which has outer div with inner group div and several small divs to left and right to create angled-end indicators
               if( vTaskList[i].getGroup()) {
                  vRightTable += '<DIV><TABLE style="position:relative; top:0px; width: ' + vChartWidth + 'px;" cellSpacing=0 cellPadding=0 class="jsGanttTable">' +
                     '<TR id=childrow_' + vID + ' class=yesdisplay style="HEIGHT: 20px" onMouseover=JSGantt.Charts.' + vGanttVar + '.mouseOver(this,' + vID + ',"right","group") onMouseout=JSGantt.Charts.' + vGanttVar + '.mouseOut(this,' + vID + ',"right","group")>' + vItemRowStr + '</TR></TABLE></DIV>';
                  vRightTable +=
                     '<div id=bardiv_' + vID + ' style="position:absolute; top:5px; left:' + vTaskLeft + 'px; height: 7px; width:' + (vTaskRight - vTaskLeft) + 'px" onclick="JSGantt.taskLink(JSGantt.Charts.' + vGanttVar + ', \'' + vTaskList[i].getID() + '\')">' +
                       '<div id=taskbar_' + vID + /*' title="' + JSGantt.formatName(vTaskList[i].getName()) + ': ' + vDateRowStr + '"' +*/ ' class=gtask ' +
							'style="background-color:#222222; height: 7px; width:' + (vTaskRight - vTaskLeft) + 'px;  cursor: pointer; opacity:0.9; border-top-left-radius: 3px; border-top-right-radius: 3px; ' + 
							'background-image: -ms-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,0.8)), to(rgba(0,0,0,0.1)) ); ' +
							'background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: -o-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: -moz-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1));" ' +
							'>' +
                        '</div>' +
                        '<div style="Z-INDEX: -4; float:left; background-color:#000000; height:4px; overflow: hidden; width:1px;"></div>' +
                        '<div style="Z-INDEX: -4; float:right; background-color:#000000; height:4px; overflow: hidden; width:1px;"></div>' +
                        '<div style="Z-INDEX: -4; float:left; background-color:#000000; height:3px; overflow: hidden; width:1px;"></div>' +
                        '<div style="Z-INDEX: -4; float:right; background-color:#000000; height:3px; overflow: hidden; width:1px;"></div>' +
                        '<div style="Z-INDEX: -4; float:left; background-color:#000000; height:2px; overflow: hidden; width:1px;"></div>' +
                        '<div style="Z-INDEX: -4; float:right; background-color:#000000; height:2px; overflow: hidden; width:1px;"></div>' +
                        '<div style="Z-INDEX: -4; float:left; background-color:#000000; height:1px; overflow: hidden; width:1px;"></div>' +
                        '<div style="Z-INDEX: -4; float:right; background-color:#000000; height:1px; overflow: hidden; width:1px;"></div>' ;

                        if( this.getCaptionType() ) {
                           vCaptionStr = '';
                           switch( this.getCaptionType() ) {           
                              case 'Caption':    vCaptionStr = vTaskList[i].getCaption();  break;
                              case 'Resource':   vCaptionStr = vTaskList[i].getResource();  break;
                              case 'Duration':   vCaptionStr = vTaskList[i].getDuration(vFormat);  break;
                              case 'Complete':   vCaptionStr = vTaskList[i].getCompStr();  break;
		                     }
                           //vRightTable += '<div style="FONT-SIZE:12px; position:absolute; left: 6px; top:1px;">' + vCaptionStr + '</div>';
                           vRightTable += '<div style="FONT-SIZE:12px; position:absolute; top:-3px; width:120px; left:' + (vTaskRight - vTaskLeft + 6) + 'px">' + vCaptionStr + '</div>';
	                  };

                  vRightTable += '</div>' ;

               } else {

                  vDivStr = '<DIV><TABLE style="position:relative; top:0px; width: ' + vChartWidth + 'px;" cellSpacing=0 cellPadding=0 class="jsGanttTable">' +
                     '<TR id=childrow_' + vID + ' class=yesdisplay style="HEIGHT: 20px" bgColor=#ffffff onMouseover=JSGantt.Charts.' + vGanttVar + '.mouseOver(this,' + vID + ',"right","row") onMouseout=JSGantt.Charts.' + vGanttVar + '.mouseOut(this,' + vID + ',"right","row")>' + vItemRowStr + '</TR></TABLE></DIV>';
                  vRightTable += vDivStr;
                  
                  // Draw Task Bar  which has outer DIV with enclosed colored bar div, and opaque completion div
	              vRightTable +=
                     '<div id=bardiv_' + vID + ' style="position:absolute; top:2px; left:' + vTaskLeft + 'px; height:18px; width:' + (vTaskRight - vTaskLeft) + 'px">' +
                         //rel="tooltip" data-html="true" title="' + vTaskList[i].getTooltip() + 
                        '<div id=taskbar_' + vID + ' class=gtask style="background-color:' + vTaskList[i].getColor() + '; height: 7px; width:' + (vTaskRight - vTaskLeft) + 'px; cursor: pointer; border-radius: 3px; ' +
							'background-image: -ms-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,0.8)), to(rgba(0,0,0,0.1)) ); ' +
							'background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: -o-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: -moz-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1));" ' +
							'onclick="JSGantt.taskLink(JSGantt.Charts.' + vGanttVar + ', \'' + vTaskList[i].getID() + '\')">' +
							//'<div class=gcomplete style="Z-INDEX: -4; float:left; background-color:black; height:5px; overflow: auto; margin-top:4px; filter: alpha(opacity=40); opacity:0.4; width:' + vTaskList[i].getCompStr() + '; overflow:hidden">' +
							//'</div>' +
                        '</div>';
                   

                        if( this.getCaptionType() ) {
                           vCaptionStr = '';
                           switch( this.getCaptionType() ) {           
                              case 'Caption':    vCaptionStr = vTaskList[i].getCaption();  break;
                              case 'Resource':   vCaptionStr = vTaskList[i].getResource();  break;
                              case 'Duration':   vCaptionStr = vTaskList[i].getDuration(vFormat);  break;
                              case 'Complete':   vCaptionStr = vTaskList[i].getCompStr();  break;
		                     }
                           //vRightTable += '<div style="FONT-SIZE:12px; position:absolute; left: 6px; top:-3px;">' + vCaptionStr + '</div>';
                           vRightTable += '<div style="FONT-SIZE:12px; position:absolute; top:-3px; width:120px; left:' + (vTaskRight - vTaskLeft +6) + 'px">' + vCaptionStr + '</div>';
	                  }
                  vRightTable += '</div>' ;

                  vRightTable +=
                     '<div id=pbardiv_' + vID + ' style="position:absolute; top:11px; left:' + vTaskLeftBase + 'px; height:9px; width:' + (vTaskRightBase - vTaskLeftBase) + 'px">' +
                        '<div id=ptaskbar_' + vID + ' class=gtask style="background-color:#aaa; height: 7px; width:' + (vTaskRightBase - vTaskLeftBase) + 'px; cursor: pointer; border-radius: 3px; ' +
							'background-image: -ms-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,0.8)), to(rgba(0,0,0,0.1)) ); ' +
							'background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: -o-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1)); ' +
							'background-image: -moz-linear-gradient(top, rgba(255,255,255,0.8), rgba(0,0,0,0.1));" ' +
							'onclick="JSGantt.taskLink(JSGantt.Charts.' + vGanttVar + ', \'' + vTaskList[i].getID() + '\')">' +
                        '</div>';


                  if (this.getCaptionType()) {
                      vCaptionStr = '';
                      switch (this.getCaptionType()) {
                          case 'Caption': vCaptionStr = vTaskList[i].getCaption(); break;
                          case 'Resource': vCaptionStr = vTaskList[i].getResource(); break;
                          case 'Duration': vCaptionStr = vTaskList[i].getDuration(vFormat); break;
                          case 'Complete': vCaptionStr = vTaskList[i].getCompStr(); break;
                      }
                      //vRightTable += '<div style="FONT-SIZE:12px; position:absolute; left: 6px; top:-3px;">' + vCaptionStr + '</div>';
                      vRightTable += '<div style="FONT-SIZE:12px; position:absolute; top:-3px; width:120px; left:' + (vTaskRight - vTaskLeft +6) + 'px">' + vCaptionStr + '</div>';
                  }
                  vRightTable += '</div>';

               }
            }

            vRightTable += '</DIV>';

         }

         vMainTable += vRightTable + '</DIV></TD></TR></TBODY></TABLE></BODY></HTML>';
         
         vDiv.innerHTML = vMainTable;

         var curDate = new Date();
         if (curDate > vMinDate && curDate < vMaxDate) {
             this.datePos = getDateOffset(new Date());
             this.scrollPos = this.datePos - getColWidth(curDate);
         }

         $(".jsTaskName").tooltip({animation:true, trigger:"hover", delay: { show: 500, hide: 100 }});
         $(".milestone").tooltip({animation:true, trigger:"hover", delay: { show: 500, hide: 100 }});
      }

   }; //this.draw

/**
* Mouseover behaviour for gantt row
* @method mouseOver
* @return {Void}
*/  this.mouseOver = function( pObj, pID, pPos, pType ) {
      
      $('#child_' + pID).css('background-color','#e8e8e8');
      $('#childrow_' + pID).css('background-color','#e8e8e8');

      /*
      if( pPos == 'right' )  vID = 'child_' + pID;
      else vID = 'childrow_' + pID;

      pObj.bgColor = "#e8e8e8";
      vRowObj = JSGantt.findObj(vID);
      if (vRowObj) {
        vRowObj.bgColor = "#e8e8e8";
      }
      */

   };

/**
* Mouseout behaviour for gantt row
* @method mouseOut
* @return {Void}
*/  this.mouseOut = function( pObj, pID, pPos, pType ) {

      $('#child_' + pID).css('background-color','#ffffff');
      $('#childrow_' + pID).css('background-color','#ffffff');
      
      /*
      if( pPos == 'right' )  vID = 'child_' + pID;
      else vID = 'childrow_' + pID;

      pObj.bgColor = "#ffffff";
      vRowObj = JSGantt.findObj(vID);
      if (vRowObj) {
         if ( pType == 'group' ) {
            pObj.bgColor = "#ffffff";
            vRowObj.bgColor = "#ffffff";
         } else {
            pObj.bgColor = "#ffffff";
            vRowObj.bgColor = "#ffffff";
         }
      }
      */
   };

}; //GanttChart


/**
* 
@class 
*/

/**
* Checks whether browser is IE
* 
* @method isIE 
*/
JSGantt.isIE = function () {
	
	if(typeof document.all != 'undefined')
		{return true;}
	else
		{return false;}
};
	
/**
* Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
*
* @method processRows
* @param pList {Array} - Array of TaskItem Objects
* @param pID {Number} - task ID
* @param pRow {Number} - Row in chart
* @param pLevel {Number} - Current tree level
* @param pOpen {Boolean}
* @return void
*/ 
JSGantt.processRows = function(pList, pID, pRow, pLevel, pOpen)
{

   var vMinDate = new Date();
   var vMaxDate = new Date();
   var vMinSet  = 0;
   var vMaxSet  = 0;
   var vList    = pList;
   var vLevel   = pLevel;
   var i        = 0;
   var vNumKid  = 0;
   var vCompSum = 0;
   var vVisible = pOpen;
   
   for(i = 0; i < pList.length; i++)
   {
      if(pList[i].getParent() == pID) {
		 vVisible = pOpen;
         pList[i].setVisible(vVisible);
         if(vVisible==1 && pList[i].getOpen() == 0) 
           {vVisible = 0;}
            
         pList[i].setLevel(vLevel);
         vNumKid++;

         if(pList[i].getGroup() == 1) {
            JSGantt.processRows(vList, pList[i].getID(), i, vLevel+1, vVisible);
         };

         if( vMinSet==0 || Date.parse(pList[i].getStart()) < Date.parse(vMinDate)) {
            vMinDate = pList[i].getStart();
            vMinSet = 1;
         };

         if( vMaxSet==0 || Date.parse(pList[i].getEnd()) > Date.parse(vMaxDate)) {
            vMaxDate = pList[i].getEnd();
            vMaxSet = 1;
         };

         vCompSum += pList[i].getCompVal();

      }
   }

   if(pRow >= 0) {
      pList[pRow].setStart(vMinDate);
      pList[pRow].setEnd(vMaxDate);
      pList[pRow].setNumKid(vNumKid);
      pList[pRow].setCompVal(Math.ceil(vCompSum/vNumKid));
   }

};

/**
* Determine the minimum date of all tasks and set lower bound based on format
*
* @method getMinDate
* @param pList {Array} - Array of TaskItem Objects
* @param pFormat {String} - current format (minute,hour,day...)
* @return {Datetime}
*/
JSGantt.getMinDate = function getMinDate(pList, pFormat, pUseAltInterval)  
      {

         var vDate = new Date();
         for (var j = 0; j < pList.length; j++) {
             var lDate = pList[j].getStart();
             if (lDate.constructor == Date) {
                 vDate.setFullYear(lDate.getFullYear(), lDate.getMonth(), lDate.getDate());
                 break;
             }
         }
         // Parse all Task Begin dates to find min
         for(var i = 0; i < pList.length; i++)
         {
            if(Date.parse(pList[i].getStart()) < Date.parse(vDate))
               vDate.setFullYear(pList[i].getStart().getFullYear(), pList[i].getStart().getMonth(), pList[i].getStart().getDate());
         }
    
         //if (pUseAltInterval)
         {
             for (i = 0; i < pList.length; i++) {
                 if (Date.parse(pList[i].getEnd()) < Date.parse(vDate))
                     vDate.setFullYear(pList[i].getEnd().getFullYear(), pList[i].getEnd().getMonth(), pList[i].getEnd().getDate());
             }
             for (i = 0; i < pList.length; i++) {
                 if (Date.parse(pList[i].getBaseStart()) < Date.parse(vDate))
                     vDate.setFullYear(pList[i].getBaseStart().getFullYear(), pList[i].getBaseStart().getMonth(), pList[i].getBaseStart().getDate());
             }
             for (i = 0; i < pList.length; i++) {
                 if (Date.parse(pList[i].getBaseEnd()) < Date.parse(vDate))
                     vDate.setFullYear(pList[i].getBaseEnd().getFullYear(), pList[i].getBaseEnd().getMonth(), pList[i].getBaseEnd().getDate());
             }
             
         }

         if ( pFormat== 'minute')
         {
            vDate.setHours(0);
            vDate.setMinutes(0);
         }
		 else if (pFormat == 'hour' )
         {
            vDate.setHours(0);
            vDate.setMinutes(0);
         }
         // Adjust min date to specific format boundaries (first of week or first of month)
         else if (pFormat=='day')
         {
            vDate.setDate(vDate.getDate() - 1);
            while(vDate.getDay() % 7 > 0)
            {
                vDate.setDate(vDate.getDate() - 1);
            }

         }

         else if (pFormat=='week')
         {
            vDate.setDate(vDate.getDate() - 7);
            while(vDate.getDay() % 7 > 0)
            {
                vDate.setDate(vDate.getDate() - 1);
            }

         }

         else if (pFormat=='month')
         {
            while(vDate.getDate() > 1)
            {
                vDate.setDate(vDate.getDate() - 1);
            }
         }

         else if (pFormat=='quarter')
         {
            if( vDate.getMonth()==0 || vDate.getMonth()==1 || vDate.getMonth()==2 )
               {vDate.setFullYear(vDate.getFullYear(), 0, 1);}
            else if( vDate.getMonth()==3 || vDate.getMonth()==4 || vDate.getMonth()==5 )
               {vDate.setFullYear(vDate.getFullYear(), 3, 1);}
            else if( vDate.getMonth()==6 || vDate.getMonth()==7 || vDate.getMonth()==8 )
               {vDate.setFullYear(vDate.getFullYear(), 6, 1);}
            else if( vDate.getMonth()==9 || vDate.getMonth()==10 || vDate.getMonth()==11 )
               {vDate.setFullYear(vDate.getFullYear(), 9, 1);}

         }
    
         else if (pFormat == 'year') {
             vDate.setFullYear(vDate.getFullYear(), 0, 1);
         }
         vDate.setHours(0, 0, 0, 0);
         return(vDate);

      };




/**
* Used to determine the minimum date of all tasks and set lower bound based on format
*
* @method getMaxDate
* @param pList {Array} - Array of TaskItem Objects
* @param pFormat {String} - current format (minute,hour,day...)
* @return {Datetime}
*/
JSGantt.getMaxDate = function (pList, pFormat, pUseAltInterval)
{
         var vDate = new Date();

         for (var j = 0; j < pList.length; j++) {
             var lDate = pList[j].getStart();
             if (pList[j].getMile() == true) {
                 if (lDate.constructor == Date) {
                     vDate.setFullYear(lDate.getFullYear(), lDate.getMonth(), lDate.getDate());
                     break;
                 }
             } else {
                 lDate = pList[j].getEnd();
                 if (lDate.constructor == Date) {
                     vDate.setFullYear(lDate.getFullYear(), lDate.getMonth(), lDate.getDate());
                     break;
                 }
             }
         }
         //if(pList[0].getMile() == true)
         //   vDate.setFullYear(pList[0].getStart().getFullYear(), pList[0].getStart().getMonth(), pList[0].getStart().getDate());
         //else
         //   vDate.setFullYear(pList[0].getEnd().getFullYear(), pList[0].getEnd().getMonth(), pList[0].getEnd().getDate());
         
         
         // Parse all Task End dates to find max
         for(var i = 0; i < pList.length; i++)
         {
             if(Date.parse(pList[i].getEnd()) > Date.parse(vDate))
             {
                 vDate.setTime(Date.parse(pList[i].getEnd()));
             }		
         }
         //if (pUseAltInterval)
         {
             for (i = 0; i < pList.length; i++) {
                 if (Date.parse(pList[i].getStart()) > Date.parse(vDate))
                     vDate.setFullYear(pList[i].getStart().getFullYear(), pList[i].getStart().getMonth(), pList[i].getStart().getDate());
             }
             for (i = 0; i < pList.length; i++) {
                 if (Date.parse(pList[i].getBaseStart()) > Date.parse(vDate))
                     vDate.setFullYear(pList[i].getBaseStart().getFullYear(), pList[i].getBaseStart().getMonth(), pList[i].getBaseStart().getDate());
             }
             for (i = 0; i < pList.length; i++) {
                 if (Date.parse(pList[i].getBaseEnd()) > Date.parse(vDate))
                     vDate.setFullYear(pList[i].getBaseEnd().getFullYear(), pList[i].getBaseEnd().getMonth(), pList[i].getBaseEnd().getDate());
             }
         }
    

	     
	     if (pFormat == 'minute')
         {
            vDate.setHours(vDate.getHours() + 1);
            vDate.setMinutes(59);
         }	
	     
         if (pFormat == 'hour')
         {
            vDate.setHours(vDate.getHours() + 2);
         }				
				
         // Adjust max date to specific format boundaries (end of week or end of month)
         if (pFormat=='day')
         {
            vDate.setDate(vDate.getDate() + 1);

            while(vDate.getDay() % 6 > 0)
            {
                vDate.setDate(vDate.getDate() + 1);
            }

         }

         if (pFormat=='week')
         {
            //For weeks, what is the last logical boundary?
            vDate.setDate(vDate.getDate() + 11);

            while(vDate.getDay() % 6 > 0)
            {
                vDate.setDate(vDate.getDate() + 1);
            }

         }

         // Set to last day of current Month
         if (pFormat=='month')
         {
            while(vDate.getDay() > 1)
            {
                vDate.setDate(vDate.getDate() + 1);
            }

            //vDate.setDate(vDate.getDate() - 1);
         }

         // Set to last day of current Quarter
         if (pFormat=='quarter')
         {
             if( vDate.getMonth()==0 || vDate.getMonth()==1 || (vDate.getMonth()==2 && vDate.getDate()<25) )
               vDate.setFullYear(vDate.getFullYear(), 2, 31);
            else if( (vDate.getMonth()==2 && vDate.getDate()>=25) || vDate.getMonth()==3 || vDate.getMonth()==4 || (vDate.getMonth()==5 && vDate.getDate() < 25) )
               vDate.setFullYear(vDate.getFullYear(), 5, 30);
            else if( (vDate.getMonth()==5 && vDate.getDate() >= 25) || vDate.getMonth()==6 || vDate.getMonth()==7 || (vDate.getMonth()==8 && vDate.getDate() < 25)  )
               vDate.setFullYear(vDate.getFullYear(), 8, 30);
           else if( (vDate.getMonth()==8 && vDate.getDate() >= 25) || vDate.getMonth()==9 || vDate.getMonth()==10 || (vDate.getMonth()==11 && vDate.getDate() < 25) )
               vDate.setFullYear(vDate.getFullYear(), 11, 31);
           else vDate.setFullYear(vDate.getFullYear()+1, 2, 31);

         }

         else if (pFormat == 'year') {
             vDate.setFullYear(vDate.getFullYear(), 11, 31);
         }
         vDate.setHours(0, 0, 0, 0);
         return(vDate);

      };


/**
* Returns an object from the current DOM
*
* @method findObj
* @param theObj {String} - Object name
* @param theDoc {Document} - current document (DOM)
* @return {Object}
*/
JSGantt.findObj = function (theObj, theDoc)

      {

         var p, i, foundObj;

         if(!theDoc) {theDoc = document;}

         if( (p = theObj.indexOf("?")) > 0 && parent.frames.length){

            theDoc = parent.frames[theObj.substring(p+1)].document;

            theObj = theObj.substring(0,p);

         }

         if(!(foundObj = theDoc[theObj]) && theDoc.all) 

            {foundObj = theDoc.all[theObj];}



         for (i=0; !foundObj && i < theDoc.forms.length; i++) 

            {foundObj = theDoc.forms[i][theObj];}



         for(i=0; !foundObj && theDoc.layers && i < theDoc.layers.length; i++)

            {foundObj = JSGantt.findObj(theObj,theDoc.layers[i].document);}



         if(!foundObj && document.getElementById)

            {foundObj = document.getElementById(theObj);}



         return foundObj;

      };


/**
* Change display format of current gantt chart
*
* @method changeFormat
* @param pFormat {String} - Current format (minute,hour,day...)
* @param ganttObj {GanttChart} - The gantt object
* @return {void}
*/
JSGantt.changeFormat =      function(pFormat,ganttObj) {

        if(ganttObj) 
		{
		ganttObj.setFormat(pFormat);
		ganttObj.DrawDependencies();
		}
        else
        {alert('Chart undefined');};
      };


/**
* Open/Close and hide/show children of specified task
*
* @method folder
* @param pID {Number} - Task ID
* @param ganttObj {GanttChart} - The gantt object
* @return {void}
*/
JSGantt.folder= function (pID,ganttObj) {

   var vList = ganttObj.getList();

   for(i = 0; i < vList.length; i++)
   {
      if(vList[i].getID() == pID) {

         if( vList[i].getOpen() == 1 ) {
            vList[i].setOpen(0);
            JSGantt.hide(pID,ganttObj);

            if (JSGantt.isIE()) 
               {JSGantt.findObj('group_'+pID).innerText = '+';}
            else
               {JSGantt.findObj('group_'+pID).textContent = '+';}
				
         } else {

            vList[i].setOpen(1);

            JSGantt.show(pID, 1, ganttObj);

               if (JSGantt.isIE()) 
                  {JSGantt.findObj('group_'+pID).innerText = '–';}
               else
                  {JSGantt.findObj('group_'+pID).textContent = '–';}

         }

      }
   }
};

/**
* Hide children of a task
*
* @method hide
* @param pID {Number} - Task ID
* @param ganttObj {GanttChart} - The gantt object
* @return {void}
*/
JSGantt.hide=     function (pID,ganttObj) {
   var vList = ganttObj.getList();
   var vID   = 0;

   for(var i = 0; i < vList.length; i++)
   {
      if(vList[i].getParent() == pID) {
         vID = vList[i].getID();
         JSGantt.findObj('child_' + vID).style.display = "none";
         JSGantt.findObj('childgrid_' + vID).style.display = "none";
         vList[i].setVisible(0);
         if(vList[i].getGroup() == 1) 
            {JSGantt.hide(vID,ganttObj);}
      }

   }
};

/**
* Show children of a task
*
* @method show
* @param pID {Number} - Task ID
* @param ganttObj {GanttChart} - The gantt object
* @return {void}
*/
JSGantt.show =  function (pID, pTop, ganttObj) {
   var vList = ganttObj.getList();
   var vID   = 0;

   for(var i = 0; i < vList.length; i++)
   {
      if(vList[i].getParent() == pID) {
         vID = vList[i].getID();
         if(pTop == 1) {
            if (JSGantt.isIE()) { // IE;

               if( JSGantt.findObj('group_'+pID).innerText == '+') {
                  JSGantt.findObj('child_'+vID).style.display = "";
                  JSGantt.findObj('childgrid_'+vID).style.display = "";
                  vList[i].setVisible(1);
               }

            } else {
 
               if( JSGantt.findObj('group_'+pID).textContent == '+') {
                  JSGantt.findObj('child_'+vID).style.display = "";
                  JSGantt.findObj('childgrid_'+vID).style.display = "";
                  vList[i].setVisible(1);
               }

            }

         } else {

            if (JSGantt.isIE()) { // IE;
               if( JSGantt.findObj('group_'+pID).innerText == '–') {
                  JSGantt.findObj('child_'+vID).style.display = "";
                  JSGantt.findObj('childgrid_'+vID).style.display = "";
                  vList[i].setVisible(1);
               }

            } else {

               if( JSGantt.findObj('group_'+pID).textContent == '–') {
                  JSGantt.findObj('child_'+vID).style.display = "";
                  JSGantt.findObj('childgrid_'+vID).style.display = "";
                  vList[i].setVisible(1);
               }
            }
         }

         if(vList[i].getGroup() == 1) 
            {JSGantt.show(vID, 0,ganttObj);}

      }
   }
};

JSGantt.taskLink = function(chart, pId) 
{
    var task = chart.getTaskByID(pId)
    if (task)
    {
        var link = task.getLink();
        location.href = link;
    }
};

/**
* Parse dates based on gantt date format setting as defined in JSGantt.GanttChart.setDateInputFormat()
*
* @method parseDateStr
* @param pDateStr {String} - A string that contains the date (i.e. "01/01/09")
* @param pFormatStr {String} - The date format (mm/dd/yyyy,dd/mm/yyyy,yyyy-mm-dd)
* @return {Datetime}
*/
JSGantt.parseDateStr = function(pDateStr,pFormatStr) {
   var vDate =new Date();	
   vDate.setTime( Date.parse(pDateStr));

   switch(pFormatStr) 
   {
	  case 'mm/dd/yyyy':
	     var vDateParts = pDateStr.split('/');
         vDate.setFullYear(parseInt(vDateParts[2], 10), parseInt(vDateParts[0], 10) - 1, parseInt(vDateParts[1], 10));
         break;
	  case 'dd/mm/yyyy':
	     var vDateParts = pDateStr.split('/');
         vDate.setFullYear(parseInt(vDateParts[2], 10), parseInt(vDateParts[1], 10) - 1, parseInt(vDateParts[0], 10));
         break;
	  case 'dd.mm.yyyy':
	     var vDateParts = pDateStr.split('.');
         vDate.setFullYear(parseInt(vDateParts[2], 10), parseInt(vDateParts[1], 10) - 1, parseInt(vDateParts[0], 10));
         break;
	  case 'yyyy-mm-dd':
	     var vDateParts = pDateStr.split('-');
         vDate.setFullYear(parseInt(vDateParts[0], 10), parseInt(vDateParts[1], 10) - 1, parseInt(vDateParts[1], 10));
         break;
    }

    return(vDate);
    
};

JSGantt.formatName = function(name) {
    return name.replace(/'/g, "&apos;").replace(/"/g, '&quot;')
}

/**
* Display a formatted date based on gantt date format setting as defined in JSGantt.GanttChart.setDateDisplayFormat()
*
* @method formatDateStr
* @param pDate {Date} - A javascript date object
* @param pFormatStr {String} - The date format (mm/dd/yyyy,dd/mm/yyyy,yyyy-mm-dd...)
* @return {String}
*/
JSGantt.formatDateStr = function(pDate,pFormatStr) {
       if(!pDate)
            return "";

       vYear4Str = pDate.getFullYear() + '';
 	   vYear2Str = vYear4Str.substring(2,4);
       vMonthStr = (pDate.getMonth()+1) + '';
       vDayStr   = pDate.getDate() + '';
       if (vDayStr.length < 2)
            vDayStr = '0' + vDayStr;
       if (vMonthStr.length < 2)
            vMonthStr = '0' + vMonthStr;

      var vDateStr = "";	

      switch(pFormatStr) {
	        case 'mm/dd/yyyy':
               return( vMonthStr + '/' + vDayStr + '/' + vYear4Str );
	        case 'dd/mm/yyyy':
               return( vDayStr + '/' + vMonthStr + '/' + vYear4Str );
	        case 'dd.mm.yyyy':
               return( vDayStr + '.' + vMonthStr + '.' + vYear4Str );
	        case 'yyyy-mm-dd':
               return( vYear4Str + '-' + vMonthStr + '-' + vDayStr );
	        case 'mm/dd/yy':
               return( vMonthStr + '/' + vDayStr + '/' + vYear2Str );
	        case 'dd/mm/yy':
               return( vDayStr + '/' + vMonthStr + '/' + vYear2Str );
	        case 'yy-mm-dd':
               return( vYear2Str + '-' + vMonthStr + '-' + vDayStr );
	        case 'mm/dd':
               return( vMonthStr + '/' + vDayStr );
	        case 'dd/mm':
               return( vDayStr + '/' + vMonthStr );
	        case 'dd.mm':
               return( vDayStr + '.' + vMonthStr );
      }		 
	  
};

/**
* Parse an external XML file containing task items.
*
* @method parseXML
* @param ThisFile {String} - URL to XML file
* @param pGanttVar {Gantt} - Gantt object
* @return {void}
*/
JSGantt.parseXML = function(ThisFile,pGanttVar){
	var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;   // Is this Chrome 
	
	try { //Internet Explorer  
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		}
	catch(e) {
		try { //Firefox, Mozilla, Opera, Chrome etc. 
			if (is_chrome==false) {  xmlDoc=document.implementation.createDocument("","",null); }
		}
		catch(e) {
			alert(e.message);
			return;
		}
	}

	if (is_chrome==false) { 	// can't use xmlDoc.load in chrome at the moment
		xmlDoc.async=false;
		xmlDoc.load(ThisFile);		// we can use  loadxml
		JSGantt.AddXMLTask(pGanttVar);
		xmlDoc=null;			// a little tidying
		Task = null;
	}
	else {
		JSGantt.ChromeLoadXML(ThisFile,pGanttVar);	
		ta=null;	// a little tidying	
	}
};

/**
* Add a task based on parsed XML doc
*
* @method AddXMLTask
* @param pGanttVar {Gantt} - Gantt object
* @return {void}
*/
JSGantt.AddXMLTask = function(pGanttVar){

	Task=xmlDoc.getElementsByTagName("task");
	
	var n = xmlDoc.documentElement.childNodes.length;	// the number of tasks. IE gets this right, but mozilla add extra ones (Whitespace)
	
	for(var i=0;i<n;i++) {
	
		// optional parameters may not have an entry (Whitespace from mozilla also returns an error )
		// Task ID must NOT be zero other wise it will be skipped
		try { pID = Task[i].getElementsByTagName("pID")[0].childNodes[0].nodeValue;
		} catch (error) {pID =0;}
		pID *= 1;	// make sure that these are numbers rather than strings in order to make jsgantt.js behave as expected.

		if(pID!=0){
	 		try { pName = Task[i].getElementsByTagName("pName")[0].childNodes[0].nodeValue;
			} catch (error) {pName ="No Task Name";}			// If there is no corresponding entry in the XML file the set a default.
		
			try { pColor = Task[i].getElementsByTagName("pColor")[0].childNodes[0].nodeValue;
			} catch (error) {pColor ="#0000ff";}
			
			try { pParent = Task[i].getElementsByTagName("pParent")[0].childNodes[0].nodeValue;
			} catch (error) {pParent =0;}
			pParent *= 1;
	
			try { pStart = Task[i].getElementsByTagName("pStart")[0].childNodes[0].nodeValue;
			} catch (error) {pStart ="";}

			try { pEnd = Task[i].getElementsByTagName("pEnd")[0].childNodes[0].nodeValue;
			} catch (error) { pEnd ="";}

			try { pLink = Task[i].getElementsByTagName("pLink")[0].childNodes[0].nodeValue;
			} catch (error) { pLink ="";}
	
			try { pMile = Task[i].getElementsByTagName("pMile")[0].childNodes[0].nodeValue;
			} catch (error) { pMile=0;}
			pMile *= 1;

			try { pInd = Task[i].getElementsByTagName("pInd")[0].childNodes[0].nodeValue;
			} catch (error) { pInd ="";}

			try { pRes = Task[i].getElementsByTagName("pRes")[0].childNodes[0].nodeValue;
			} catch (error) { pRes ="";}

			try { pComp = Task[i].getElementsByTagName("pComp")[0].childNodes[0].nodeValue;
			} catch (error) {pComp =0;}
			pComp *= 1;

			try { pGroup = Task[i].getElementsByTagName("pGroup")[0].childNodes[0].nodeValue;
			} catch (error) {pGroup =0;}
			pGroup *= 1;

			try { pOpen = Task[i].getElementsByTagName("pOpen")[0].childNodes[0].nodeValue;
			} catch (error) { pOpen =1;}
			pOpen *= 1;

			try { pDepend = Task[i].getElementsByTagName("pDepend")[0].childNodes[0].nodeValue;
			} catch (error) { pDepend =0;}
			//pDepend *= 1;
			if (pDepend.length==0){pDepend=''} // need this to draw the dependency lines
			
			try { pCaption = Task[i].getElementsByTagName("pCaption")[0].childNodes[0].nodeValue;
			} catch (error) { pCaption ="";}
			
			
			// Finally add the task
			pGanttVar.AddTaskItem(new JSGantt.TaskItem(pID, pInd, pName, pStart, pEnd, pColor,  pLink, pMile, pRes,  pComp, pGroup, pParent, pOpen, pDepend,pCaption));
		}
	}
};

/**
* Load an XML document in Chrome
*
* @method ChromeLoadXML
* @param ThisFile {String} - URL to XML file
* @param pGanttVar {Gantt} - Gantt object
* @return {void}
*/
JSGantt.ChromeLoadXML = function(ThisFile,pGanttVar){
// Thanks to vodobas at mindlence,com for the initial pointers here.
	XMLLoader = new XMLHttpRequest();
	XMLLoader.onreadystatechange= function(){
    JSGantt.ChromeXMLParse(pGanttVar);
	};
	XMLLoader.open("GET", ThisFile, false);
	XMLLoader.send(null);
};

/**
* Parse XML document in Chrome
*
* @method ChromeXMLParse
* @param pGanttVar {Gantt} - Gantt object
* @return {void}
*/

JSGantt.ChromeXMLParse = function (pGanttVar){
// Manually parse the file as it is loads quicker
	if (XMLLoader.readyState == 4) {
		var ta=XMLLoader.responseText.split(/<task>/gi);

		var n = ta.length;	// the number of tasks. 
		for(var i=1;i<n;i++) {
			Task = ta[i].replace(/<[/]p/g, '<p');	
			var te = Task.split(/<pid>/i);
	
			if(te.length> 2){var pID=te[1];} else {var pID = 0;}
			pID *= 1;
	
			var te = Task.split(/<pName>/i);
			if(te.length> 2){var pName=te[1];} else {var pName = "No Task Name";}
	
			var te = Task.split(/<pstart>/i);
			if(te.length> 2){var pStart=te[1];} else {var pStart = "";}
	
			var te = Task.split(/<pEnd>/i);
			if(te.length> 2){var pEnd=te[1];} else {var pEnd = "";}
	
			var te = Task.split(/<pColor>/i);
			if(te.length> 2){var pColor=te[1];} else {var pColor = '#0000ff';}

			var te = Task.split(/<pLink>/i);
			if(te.length> 2){var pLink=te[1];} else {var pLink = "";}
	
			var te = Task.split(/<pMile>/i);
			if(te.length> 2){var pMile=te[1];} else {var pMile = 0;}
			pMile  *= 1;
	
			var te = Task.split(/<pInd>/i);
			if(te.length> 2){var pInd=te[1];} else {var pInd = "";}	
	
			var te = Task.split(/<pRes>/i);
			if(te.length> 2){var pRes=te[1];} else {var pRes = "";}	
	
			var te = Task.split(/<pComp>/i);
			if(te.length> 2){var pComp=te[1];} else {var pComp = 0;}	
			pComp  *= 1;
	
			var te = Task.split(/<pGroup>/i);
			if(te.length> 2){var pGroup=te[1];} else {var pGroup = 0;}	
			pGroup *= 1;

			var te = Task.split(/<pParent>/i);
			if(te.length> 2){var pParent=te[1];} else {var pParent = 0;}	
			pParent *= 1;
	
			var te = Task.split(/<pOpen>/i);
			if(te.length> 2){var pOpen=te[1];} else {var pOpen = 1;}
			pOpen *= 1;
	
			var te = Task.split(/<pDepend>/i);
			if(te.length> 2){var pDepend=te[1];} else {var pDepend = "";}	
			//pDepend *= 1;
			if (pDepend.length==0){pDepend=''} // need this to draw the dependency lines
			
			var te = Task.split(/<pCaption>/i);
			if(te.length> 2){var pCaption=te[1];} else {var pCaption = "";}
			
			// Finally add the task
			pGanttVar.AddTaskItem(new JSGantt.TaskItem(pID , pName, pStart, pEnd, pColor,  pLink, pMile, pRes,  pComp, pGroup, pParent, pOpen, pDepend,pCaption 	));
		};
	};
};
/**
* Used for benchmarking performace
*
* @method benchMark
* @param pItem {TaskItem} - TaskItem object
* @return {void}
*/
JSGantt.benchMark = function(pItem){
   var vEndTime=new Date().getTime();
   alert(pItem + ': Elapsed time: '+((vEndTime-vBenchTime)/1000)+' seconds.');
   vBenchTime=new Date().getTime();
};

function AddLeadingZero(val)
{
    if (val.toString().length == 1)
        val = '0' + val;
    return val;
}
