<!---
title: Adrian Hanft's Professional Timeline
date: November 24, 2016
published: true
--->

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js">
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.js"></script>
<style type="text/css">
body {
	background-color: #f5f5f5;
}
h1, h2, h3, h4 {
text-transform: none;
}
h3 {
color: #ccc;
font-size: 11px;
}
#cd-timeline a {
color: inherit;
text-decoration: underline;
text-decoration-color: #efefef;
-webkit-text-decoration-color: #ccc;
}
hr {
border-bottom-color: #e2e2e2;
}

.accordion-title::before {
margin-top: 0;
}
a.accordion-title {
padding-top: 15px;
border-top-width: 1px;
border-top-color: #e2e2e2;
border-top-style: solid;
}

*, *:after, *:before {
-webkit-box-sizing: border-box;
-moz-box-sizing: border-box;
box-sizing: border-box;
}

/* -------------------------------- 

Modules - reusable parts of our design

-------------------------------- */
.cd-container {
/* this class is used to give a max-width to the element it is applied to, and center it horizontally when it reaches that max-width */
width: 90%;
max-width: 960px;
margin: 0 auto;
}
.cd-container::after {
/* clearfix */
content: '';
display: table;
clear: both;
}

/* -------------------------------- 

Main components 

-------------------------------- */

#cd-timeline {
position: relative;
padding: 2em 0;
margin-top: 0 auto 2em auto;
}
#cd-timeline::before {
/* this is the vertical line */
content: '';
position: absolute;
top: 0;
left: 18px;
height: 100%;
width: 4px;
background: #ccc;
}
@media only screen and (min-width: 960px) {
#cd-timeline {
margin-top: 0;
margin-bottom: 3em;
}
#cd-timeline::before {
left: 50%;
margin-left: -2px;
}
}

.cd-timeline-block {
position: relative;
margin: 2em 0;
}
.cd-timeline-block:after {
content: "";
display: table;
clear: both;
}
.cd-timeline-block:first-child {
margin-top: 0;
}
.cd-timeline-block:last-child {
margin-bottom: 0;
}
@media only screen and (min-width: 960px) {
.cd-timeline-block {
margin: 4em 0;
}
.cd-timeline-block:first-child {
margin-top: 0;
}
.cd-timeline-block:last-child {
margin-bottom: 0;
}
}

.cd-timeline-img {
position: absolute;
top: 0;
left: 0;
width: 40px;
height: 40px;
border-radius: 50%;
box-shadow: 0 0 0 4px #cccccc, inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05);
}
.cd-timeline-img img {
display: block;
width: 24px;
height: 24px;
position: relative;
left: 50%;
top: 50%;
margin-left: -12px;
margin-top: -12px;
}
.cd-timeline-img.cd-location {
background: #efefef;
}
@media only screen and (min-width: 960px) {
.cd-timeline-img {
width: 60px;
height: 60px;
left: 50%;
margin-left: -30px;
/* Force Hardware Acceleration in WebKit */
-webkit-transform: translateZ(0);
-webkit-backface-visibility: hidden;
}
.cssanimations .cd-timeline-img.is-hidden {
visibility: hidden;
}
.cssanimations .cd-timeline-img.bounce-in {
visibility: visible;
-webkit-animation: cd-bounce-1 0.6s;
-moz-animation: cd-bounce-1 0.6s;
animation: cd-bounce-1 0.6s;
}
}

@-webkit-keyframes cd-bounce-1 {
0% {
opacity: 0;
-webkit-transform: scale(0.5);
}

60% {
opacity: 1;
-webkit-transform: scale(1.2);
}

100% {
-webkit-transform: scale(1);
}
}
@-moz-keyframes cd-bounce-1 {
0% {
opacity: 0;
-moz-transform: scale(0.5);
}

60% {
opacity: 1;
-moz-transform: scale(1.2);
}

100% {
-moz-transform: scale(1);
}
}
@keyframes cd-bounce-1 {
0% {
opacity: 0;
-webkit-transform: scale(0.5);
-moz-transform: scale(0.5);
-ms-transform: scale(0.5);
-o-transform: scale(0.5);
transform: scale(0.5);
}

60% {
opacity: 1;
-webkit-transform: scale(1.2);
-moz-transform: scale(1.2);
-ms-transform: scale(1.2);
-o-transform: scale(1.2);
transform: scale(1.2);
}

100% {
-webkit-transform: scale(1);
-moz-transform: scale(1);
-ms-transform: scale(1);
-o-transform: scale(1);
transform: scale(1);
}
}
.cd-timeline-content {
position: relative;
margin-left: 60px;
background: white;
border-radius: 0.25em;
padding: 1em;
box-shadow: 0 3px 4px rgba(0, 0, 0, 0.2);
max-width: 600px;
}
.cd-timeline-content:after {
content: "";
display: table;
clear: both;
}
.cd-timeline-content h2 {
color: #303e49;
}
.cd-timeline-content p, .cd-timeline-content .cd-read-more, .cd-timeline-content .cd-date {
font-size: 13px;
font-size: 0.8125rem;
}
.cd-timeline-content .cd-read-more, .cd-timeline-content .cd-date {
display: inline-block;
}
.cd-timeline-content p {
margin: 1em 0;
line-height: 1.6;
}
.cd-timeline-content .cd-read-more {
float: right;
padding: .8em 1em;
background: #acb7c0;
color: white;
border-radius: 0.25em;
}
.no-touch .cd-timeline-content .cd-read-more:hover {
background-color: #bac4cb;
}
.cd-timeline-content .cd-date {
float: left;
padding: .8em 0;
opacity: .7;
}
.cd-timeline-content::before {
content: '';
position: absolute;
top: 16px;
right: 100%;
height: 0;
width: 0;
border: 7px solid transparent;
border-right: 7px solid white;
}
.cd-timeline-content .cd-date {
display: none;
}
@media only screen and (min-width: 768px) {
.cd-timeline-content h2 {
font-size: 20px;
font-size: 1.25rem;
}
.cd-timeline-content p {
font-size: 16px;
font-size: 1rem;
}
.cd-timeline-content .cd-read-more, .cd-timeline-content .cd-date {
font-size: 14px;
font-size: 0.875rem;
}
.cd-timeline-content .cd-date {
display: none;
}
}
@media only screen and (min-width: 960px) {
.cd-timeline-content {
margin-left: 0;
padding: 1.6em;
width: 45%;
}
.cd-timeline-content::before {
top: 24px;
left: 100%;
border-color: transparent;
border-left-color: white;
}
.cd-timeline-content .cd-read-more {
float: left;
}
.cd-timeline-content .cd-date {
position: absolute;
width: 100%;
left: 122%;
top: 6px;
font-size: 16px;
font-size: 1rem;
}
.cd-timeline-block:nth-child(even) .cd-timeline-content {
float: right;
}
.cd-timeline-block:nth-child(even) .cd-timeline-content::before {
top: 24px;
left: auto;
right: 100%;
border-color: transparent;
border-right-color: white;
}
.cd-timeline-block:nth-child(even) .cd-timeline-content .cd-read-more {
float: right;
}
.cd-timeline-block:nth-child(even) .cd-timeline-content .cd-date {
left: auto;
right: 122%;
text-align: right;
}
.cssanimations .cd-timeline-content.is-hidden {
visibility: hidden;
}
.cssanimations .cd-timeline-content.bounce-in {
visibility: visible;
-webkit-animation: cd-bounce-2 0.6s;
-moz-animation: cd-bounce-2 0.6s;
animation: cd-bounce-2 0.6s;
}
.cd-timeline-content .cd-date {
display: block;
}
}

@media only screen and (min-width: 960px) {
/* inverse bounce effect on even content blocks */
.cssanimations .cd-timeline-block:nth-child(even) .cd-timeline-content.bounce-in {
-webkit-animation: cd-bounce-2-inverse 0.6s;
-moz-animation: cd-bounce-2-inverse 0.6s;
animation: cd-bounce-2-inverse 0.6s;
}
}
@-webkit-keyframes cd-bounce-2 {
0% {
opacity: 0;
-webkit-transform: translateX(-100px);
}

60% {
opacity: 1;
-webkit-transform: translateX(20px);
}

100% {
-webkit-transform: translateX(0);
}
}
@-moz-keyframes cd-bounce-2 {
0% {
opacity: 0;
-moz-transform: translateX(-100px);
}

60% {
opacity: 1;
-moz-transform: translateX(20px);
}

100% {
-moz-transform: translateX(0);
}
}
@keyframes cd-bounce-2 {
0% {
opacity: 0;
-webkit-transform: translateX(-100px);
-moz-transform: translateX(-100px);
-ms-transform: translateX(-100px);
-o-transform: translateX(-100px);
transform: translateX(-100px);
}

60% {
opacity: 1;
-webkit-transform: translateX(20px);
-moz-transform: translateX(20px);
-ms-transform: translateX(20px);
-o-transform: translateX(20px);
transform: translateX(20px);
}

100% {
-webkit-transform: translateX(0);
-moz-transform: translateX(0);
-ms-transform: translateX(0);
-o-transform: translateX(0);
transform: translateX(0);
}
}
@-webkit-keyframes cd-bounce-2-inverse {
0% {
opacity: 0;
-webkit-transform: translateX(100px);
}

60% {
opacity: 1;
-webkit-transform: translateX(-20px);
}

100% {
-webkit-transform: translateX(0);
}
}
@-moz-keyframes cd-bounce-2-inverse {
0% {
opacity: 0;
-moz-transform: translateX(100px);
}

60% {
opacity: 1;
-moz-transform: translateX(-20px);
}

100% {
-moz-transform: translateX(0);
}
}
@keyframes cd-bounce-2-inverse {
0% {
opacity: 0;
-webkit-transform: translateX(100px);
-moz-transform: translateX(100px);
-ms-transform: translateX(100px);
-o-transform: translateX(100px);
transform: translateX(100px);
}

60% {
opacity: 1;
-webkit-transform: translateX(-20px);
-moz-transform: translateX(-20px);
-ms-transform: translateX(-20px);
-o-transform: translateX(-20px);
transform: translateX(-20px);
}

100% {
-webkit-transform: translateX(0);
-moz-transform: translateX(0);
-ms-transform: translateX(0);
-o-transform: translateX(0);
transform: translateX(0);
}
}
</style>
</div>
<section id="cd-timeline" class="cd-container" style="margin: -85px auto -50px auto;">

<div class="cd-timeline-block">
<div class="cd-timeline-img cd-location">
<img src="images/_logos/fi-marker.svg" class="icon">
</div> 

<div class="cd-timeline-content">
<img src="images/_logos/runcoach.jpg" width="182" height="40">
<hr>
<h3>2018 - Present</h3>

<p class="lead">At Runcoach I am designing the next evolution of the Runcoach apps and website.</p>

<!--<div class="readMoreContainer" style="display: none;">
<p></p>

</div>
<a href="#" class="accordion-title readMore">Read more</a>-->

<span class="cd-date">2018</span>
</div> 
</div> 


<div class="cd-timeline-block">
<div class="cd-timeline-img cd-location">
<img src="images/_logos/fi-marker.svg" class="icon">
</div> 

<div class="cd-timeline-content">
<img src="images/_logos/athlinks-logo.jpg" width="182" height="40">
<hr>
<h3>2016 - 2018</h3>

<p class="lead">At Athlinks I was responsible for the UI and UX of Athlinks' website and native apps.</p>

<div class="readMoreContainer" style="display: none;">
<p>I created a new visual language that helped define the Athlinks brand and products.
I solved complex interactions around the claiming of race results that users save to their profiles.</p>

<p>I collaborated with developers, while striving to build products that delighted users and got results.</p>

<p>I helped define processes and systems for a relatively new UX team at Athlinks.</p>

</div>
<a href="#" class="accordion-title readMore">Read more</a>

<span class="cd-date">2016</span>
</div> 
</div> 


<div class="cd-timeline-block">
<div class="cd-timeline-img cd-location">
<img src="images/_logos/fi-marker.svg" class="icon">
</div> 

<div class="cd-timeline-content">
<img src="images/_logos/trainingpeaks-logo.jpg" width="182" height="40">
<hr>
<h3>2014 - 2016</h3>

<p class="lead">While at TrainingPeaks <a href="https://www.behance.net/gallery/42780579/TrainingPeaks"> I crafted experiences for endurance athletes and coaches</a>. I strove for clean design and clean code.</p>

<div class="readMoreContainer" style="display: none;">
<p>Why is a designer like myself talking about code? Well, I am one of those hybrid designer/developers. I believe that products are better when they are guided by a designer with a firm grasp of the underlying structure as well as a clear design vision.</p>

<p>Most of my work at TrainingPeaks revolved around the website, <a href="http://www.trainingpeaks.com">trainingpeaks.com</a>. Because this was such a massive entity it was more work than even I can tackle alone. This is where speaking the languages of design and code really helps. I could collaborate across teams and leapfrog the silos that could sink a project with so many stakeholders.</p>

<p>I also created smaller websites for initiatives like the <a href="http://summit.trainingpeaks.com">Endurance Coaching Summit</a>. I also launched <a href="http://thankscoach.trainingpeaks.com">a "Thanks Coach" tool</a> that allowed athletes to create images with a custom #ThanksCoach stamp and share it in their social feeds. I designed the website and did the majority of the development. The site was produced from concept to completion in about one month. In the first two weeks the site generated 3,000 photos and countless shares.</p>

</div>
<a href="#" class="accordion-title readMore">Read more</a>

<span class="cd-date">2014</span>
</div> 
</div> 

<div class="cd-timeline-block">
<div class="cd-timeline-img cd-location">
<img src="images/_logos/fi-marker.svg" class="icon">
</div> 

<div class="cd-timeline-content">
<img src="images/_logos/zila-logo.jpg" width="182" height="40">
<hr>
<h3>2012-2014</h3>
<p class="lead">Before they went out of business I worked for a dental technology company called Zila. As creative director I <a href="https://www.behance.net/gallery/6657455/Zila">rebranded the company</a> and helped modernize their websites and products.</p>

<div class="readMoreContainer" style="display: none;">
<p>This was my first experience working "in-house," as they say. <a href="https://medium.com/@ade3/five-things-i-learned-after-i-left-the-marketing-agency-world-185dc889bfd#.mqud6hh4y">Why did I move in-house?</a> After working at design agencies for close to a decade I realized I could have a bigger impact at the "ground level" than when I was billing in hourly increments and separated from the decision makers by layers of bureaucracy. I was right. My time at Zila left me with one of the deepest case studies in my portfolio.</p>
<p>In addition to the <a href="https://www.behance.net/gallery/6657455/Zila">rebrand project</a> you can see some of the Zila product lines I designed for in these galleries of <a href="https://www.behance.net/gallery/11396117/Rotadent-Contour">Rotadent projects</a>, <a href="https://www.behance.net/gallery/10608405/ViziLite">ViziLite work</a>, or <a href="https://www.behance.net/gallery/13799067/Zila-Product-Photography">this gallery of my product photography</a>.</p>
</div>
<a href="#" class="accordion-title readMore">Read more</a>
<span class="cd-date">2012</span>
</div> 
</div> 

<div class="cd-timeline-block">
<div class="cd-timeline-img cd-location">
<img src="images/_logos/fi-marker.svg" class="icon">
</div> 

<div class="cd-timeline-content">
<img src="images/_logos/burns-marketing-logo.jpg" width="182" height="40">
<hr>
<h3>2011-2012</h3>
<p class="lead">My "big agency" experience came from working at Burns Marketing. I designed apps and websites for big clients like <a href="https://www.behance.net/gallery/5173495/HP-Mobile-Apps">HP</a> and Lenovo as well as <a href="https://www.behance.net/gallery/5173527/Baxa">smaller businesses</a>.</p>

<div class="readMoreContainer" style="display: none;">
<p>It seems funny in hindsight, but I remember a time when clients had to be persuaded that they needed an app. Some of the best projects at Burns were spec work where I was free to simply <a href="https://www.behance.net/gallery/5173299/Ghost-O-Meter">create things</a> that demonstrated the power of apps and the magic of a brand new device known as the iPad.</p>
</div>
<a href="#" class="accordion-title readMore">Read more</a>
<span class="cd-date">2011</span>
</div> 
</div> 

<div class="cd-timeline-block">
<div class="cd-timeline-img cd-location">
<img src="images/_logos/fi-marker.svg" class="icon">
</div> 

<div class="cd-timeline-content">
<img src="images/_logos/red-rocket-logo.jpg" width="182" height="40">
<hr>
<h3>2009-2011</h3>
<p class="lead">As creative director at Red Rocket I helped <a href="https://www.behance.net/gallery/615631/Red-Rocket-Web-Specialists">rebrand the company</a> as web specialists and designed dozens of websites for <a href="https://www.behance.net/gallery/10588981/Encore-Sight-Sound">small</a> to <a href="https://www.behance.net/gallery/5173245/Keeton-Industries">mid-sized businesses</a> in Northern Colorado. </p>

<div class="readMoreContainer" style="display: none;">
<p>You learn so much when you are at a small company powered by ambitions founders. You do whatever it takes to deliver what the client needs whether you know how to do what you are promising or not. Sometimes the work is great, sometimes you fail. The only guarantee is that you will learn something new every day. </p>

<p>In addition to our internal projects I created dozens of websites with ambitions goals and quick turnaround times for our clients. We created the sites in Wordpress, and I got pretty good at bending that CMS to my will. <a href="https://www.behance.net/gallery/10588641/Website-Design">Here is a gallery of the websites</a> I created from 2008-2012.</p>
</div>
<a href="#" class="accordion-title readMore">Read more</a>
<span class="cd-date">2009</span>
</div> 
</div> 

<div class="cd-timeline-block">
<div class="cd-timeline-img cd-location">
<img src="images/_logos/fi-marker.svg" class="icon">
</div> 

<div class="cd-timeline-content">
<img src="images/_logos/huebnerpetersen-logo.jpg" width="182" height="40">
<hr>
<h3>2003-2009</h3>
<p class="lead">HuebnerPetersen is where I learned the ropes by hacking together websites and fighting to develop my design chops.</p>

<div class="readMoreContainer" style="display: none;">
<p>HuebnerPetersen's main client was Jayco RVs. Branding, literature, <a href="https://www.behance.net/gallery/13798831/Jayco-Product-Photography">photography</a>, advertising, websites&mdash;we did it all. I still think <a href="https://www.behance.net/gallery/5173073/Jayco">the work</a> holds up pretty well after all these years.</p>
</div>
<a href="#" class="accordion-title readMore">Read more</a>
<span class="cd-date">2003</span>
</div> 
</div> 

</section>

<script type="text/javascript">
jQuery(document).ready(function($){
var timelineBlocks = $('.cd-timeline-block'),
offset = 0.8;

//hide timeline blocks which are outside the viewport
hideBlocks(timelineBlocks, offset);

//on scolling, show/animate timeline blocks when enter the viewport
$(window).on('scroll', function(){
(!window.requestAnimationFrame) 
? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
});

function hideBlocks(blocks, offset) {
blocks.each(function(){
( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
});
}

function showBlocks(blocks, offset) {
blocks.each(function(){
( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
});
}
}); 

jQuery(document).ready(function($) {
$('.readMore').click(function(event) {
event.preventDefault();
var $this = $(this);
$this.toggleClass('readMore');
if($this.hasClass('readMore')){
$this.text('Read more'); 
$this.siblings('.readMoreContainer').slideUp();
} else {
$this.text('Read less');
$this.siblings('.readMoreContainer').slideDown();
}
});
});

</script>
