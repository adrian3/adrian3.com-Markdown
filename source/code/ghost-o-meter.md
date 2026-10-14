<!---
title: Ghost-O-Meter
show-in-nav: true
--->

# Ghost-O-Meter

The Ghost-O-Meter is a ghost detector for your phone. I designed and built it in 2011 while I was at Burns Marketing, an agency that had never shipped an app. The App Store listing told the origin story with a straight face: unexplained noises around the office, flickering monitors, cryptic messages on the bathroom mirrors, until “we had to confront the possibility that maybe, just maybe, the building was haunted.” What we built in response is a brass-and-leather gauge with a P.K.E. needle that swings as you sweep the room, a bulb that glows brighter the closer you get, and a mechanical counter that ticks up every time you find a ghost. Under the steampunk surface it is a game of hot and cold. The app hides a ghost at a random compass heading and height, then reads your phone’s compass and tilt sensors to decide how warm you are. Hold a strong reading for five seconds and the ghost is yours. Take too long and it escapes.

It became the most popular thing I have ever made. It launched as a free app, later moved to 99¢, and was downloaded more than 550,000 times on the App Store, which is more than my other 27 apps combined. Seven out of ten of those downloads came from the US and Canada, with the rest spread across Europe, Asia and beyond. At its peak it reached #1 in the Entertainment category in six countries and the top 10 overall in five, and it won a 2012 Art Directors Club of Denver award. The biggest month was October 2012, when downloads across my apps passed 100,000, more than double the month before. Halloween will do that for a ghost detector. It also gave the agency the proof it needed to start selling app work to clients. What I didn’t expect was how seriously people would take it. They filmed earnest field tests in cemeteries and old buildings and posted them to YouTube. They wrote reviews like “I found 11 ghosts in 1 minute. It saved my life.” One couple took it on their own tour of the Stanley Hotel and reported that it was “100% ‘dead on’ outside rooms 217, 401 and 428.” I had made a prop for a story people wanted to tell, and they told it.

Apps don’t last forever, though. The original was built with PhoneGap, a tool from the early days of mobile development, and its last update shipped in 2015. That update is one I’m still proud of: it removed the Google Analytics tracking I had quietly shipped inside the app, a decision I wrote about in [A Confession from Ghost-O-Meter’s Creator](/writing/blog/2015/2015-10-11-a-confession-from-ghost-o-meters-creator.html).

In 2026 I rebuilt the Ghost-O-Meter as a progressive web app so it can keep running without an app store. The goal was preservation, not a remake. It uses the original artwork, the original sounds, and the same detection logic and timings, taken straight from the 2011 source. Only the plumbing changed: the old plugins were swapped for the motion and orientation sensors that browsers now provide. There is no tracking of any kind, and once you add it to your home screen it works offline like the app it used to be. [Open it on your phone](https://adrian3.github.io/ghost-o-meter/), tap the gauge to power it on, and see how many ghosts you can find. On a computer, your mouse stands in for the compass. The disclaimer from the original listing still applies: “while we can’t guarantee true ghost metering/locating functionality, it definitely has an uncanny ability to give unexplained feedback.”

Play it: [Ghost-O-Meter web app](https://adrian3.github.io/ghost-o-meter/)  
Source code: [adrian3/ghost-o-meter on GitHub](https://github.com/adrian3/ghost-o-meter)  
Case study: [The Spooky App That Turned an Agency Into an App Studio](/design/case-studies/Ghost-O-Meter.html)

<img src="https://adrian3.com/imgs/code-thumbnails/ghost-o-meter.webp" alt="The Ghost-O-Meter app: a vintage brass gauge with a swinging needle, a glowing bulb and a ghost counter">
