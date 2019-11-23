/******************************************************************* 
* File    : JSFX_ClickableSlideShow.js © JavaScript-FX.com
* Created : 2002/08/04 
* Author  : Roy Whittle  (Roy@Whittle.com) www.Roy.Whittle.com 
* Purpose : To create a dynamic slide show.
*
* History 
* Date         Version        Description 
* 2002-08-04	1.0		First test version
* 2003-01-14	1.1		Remove all the extra fluff and make it a
*					simple "Automatic" slideshow
* 2003-01-15	1.2		Make the image clickable
***********************************************************************/ 
if(!window.JSFX)
	JSFX = new Object();

document.write('<STYLE TYPE="text/css">.slideTrans{ filter:revealTrans(duration=1,transition=0) }</STYLE>');
document.write('<STYLE TYPE="text/css">.slideBlend{ filter:blendTrans(duration=1) }</STYLE>');

JSFX.ClickableSlide = function(theImg, theUrl, theTarget)
{
	this.theImg  = theImg;
	this.theUrl    = theUrl    == null ? "#" : theUrl;
	this.theTarget = theTarget == null ? "_self" : theTarget;
	this.loadImg = new Image();
}
JSFX.ClickableSlideShow = function()
{
	this.id		= JSFX.ClickableSlideShow.getId();
	this.timeId		= null;
	this.imgName	= this.id + "_I";
	this.urlId		= this.id + "_U";
	this.currSlide	= 0;
	this.slides		= new Array();
	this.startDelay   = 0;
	this.slideDelay	= 2000;
	this.transType	= 24;
	this.transDuration= 1;

	window[this.id] = this;
}
JSFX.ClickableSlideShow.slideNo = 0;
JSFX.ClickableSlideShow.getId                      = function()              {return "JSFX_cs_" + JSFX.ClickableSlideShow.slideNo++;}
JSFX.ClickableSlideShow.prototype.addSlide         = function(theImg, theUrl, theTarget)
{
	this.slides[this.slides.length]=new JSFX.ClickableSlide(theImg, theUrl, theTarget);
}
JSFX.ClickableSlideShow.prototype.setStartDelay    = function(startDelay)    {this.startDelay    = startDelay*1000;}
JSFX.ClickableSlideShow.prototype.setSlideDelay    = function(slideDelay)    {this.slideDelay    = slideDelay*1000;}
JSFX.ClickableSlideShow.prototype.setTransType     = function(transType)     {this.transType     = transType;}
JSFX.ClickableSlideShow.prototype.setTransDuration = function(transDuration) {this.transDuration = transDuration;}
JSFX.ClickableSlideShow.prototype.setTimeout       = function(f, t)          {return setTimeout("window."+this.id+"."+f, t);}

JSFX.ClickableSlideShow.prototype.toHtml           = function()
{
   return('\
<IMG SRC="'+this.slides[0].theImg+'" \
NAME="'+this.imgName+'" \
class="slide'+(this.transType==24?"Blend":"Trans")+'" \
alt="Click for larger picture">');
}
JSFX.ClickableSlideShow.prototype.setSlide = function()
{
	var img = document.images[this.imgName];
	if(img.filters != null)
	{
		if(this.transType < 24)	img.filters[0].Transition=this.transType;
		img.filters[0].Duration = this.transDuration;
		img.filters[0].apply();
	}
	img.src    = this.slides[ this.currSlide ].theImg;
	if(img.filters != null)
		img.filters[0].play();
}

JSFX.ClickableSlideShow.prototype.animate = function()
{
	this.currSlide = (this.currSlide + 1) % this.slides.length;
	this.setSlide();
	this.timeId = this.setTimeout("animate()", this.slideDelay);
}
JSFX.ClickableSlideShow.prototype.start = function()
{
	for(var i=0 ; i<this.slides.length ; i++)
		this.slides[i].loadImg.src = this.slides[i].theImg;
	var theImg         = document.images[this.imgName];
	theImg.onmouseup = this.clickFn;
	theImg.ss          = this;
	this.timeId = this.setTimeout("animate()", this.startDelay + this.slideDelay);
}
JSFX.ClickableSlideShow.prototype.clickFn = function()
{
	var ss = this.ss;
	var slide = ss.slides[ss.currSlide];
	if( slide.theTarget.charAt(0) =="_")
	{
		if(slide.theTarget == "_blank")
			window.open(slide.theUrl, ss.id);
		else
			document.location = slide.theUrl;
	}
	else
	{
		if(this.nw && !this.nw.closed) this.nw.close();
		this.nw=window.open(slide.theUrl, ss.id, slide.theTarget);
		this.nw.focus();
	}
}