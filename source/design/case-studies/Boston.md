<!---
title: Boston
sub-title: The Marathon Data Project
template: case-study
published: true
unlisted: true
categories: ux design, fitness technology, user research
thumbnail: https://adrian3.com/imgs/case-studies/images/Boston/boston_thumb.jpg
thumbnail-alt: Boston: The Marathon Data Project thumbnail
--->

# Boston: The Marathon Data Project

**Role:** Data engineering, design, development & writing
**When:** 2017–2020
**Results:** a four-part study, an interactive tool, and an open dataset

![The Boston Marathon course traced as a glowing golden line across a dark map of greater Boston, from Hopkinton to the finish line in the city.](https://adrian3.com/imgs/case-studies/images/Boston/01-course-map.jpg)

## Finding the story hidden in the data

I’m a designer, but I’m also a runner — and a Boston qualifier. Every time I’ve lined up at the start line I’ve been struck by the diversity of people around me, and it’s always been the *thousands of runners behind the winners* that interest me more than the podium. So I did what I do when something grabs me: I went looking for the story hidden in the data.

To help me answer my questions, I assembled 121 years of Boston Marathon results and turned the work into a four-part study that uses data to solve mysteries around qualifying for the big race. I also designed **[an interactive tool](https://tread1st.com/boston.html)** that lets anyone explore the numbers themselves, and **[an open dataset](https://github.com/adrian3/Boston-Marathon-Data-Project)** for researchers who want to run their own analysis. 

## Four hard questions, answered with data

### Part 1 — How hard is it *really* to get into Boston?

Boston caps the field around 30,000, with more than 20% reserved for charity and special invitations — leaving roughly 23,000 spots for runners who hit the qualifying standard. But meeting the standard isn’t enough. So many people qualify that the B.A.A. has to turn away runners who *already earned their time*: more than **7,000 rejected in 2019 — nearly 1 in 4**. The field stays remarkably balanced (a consistent 45% women / 55% men), and the data exposes a quirk worth gaming: because runners are bracketed into five-year age groups, being on the *young* edge of a bracket is a real advantage. [Read Part 1 →](https://ade3.medium.com/boston-marathon-data-analysis-part-1-4891d1832eba)

![A table titled “2013–2019 Qualifying Times” listing the Boston Marathon qualifying standards for men and women across eleven age groups, from 3:05:00 for men 18–34 up to 5:25:00 for women 80 and over.](https://adrian3.com/imgs/case-studies/images/Boston/02-part1-qualifying-times.jpg)

### Part 2 — Why is the Boston Marathon so slow?

Here’s the paradox that became the spine of the whole project: every single runner beat a tough qualifying time just to get in — yet on race day only about **29% run that time again**. I split the field by age and gender and overlaid the qualifying standards as stepped lines. Every dot to the *right* of the line is a runner who finished slower than the time that earned their spot — and that’s most of the field. I tested the obvious culprit, weather, and found something counterintuitive: cold, wet years produced *better* times than perfect ones. The bigger factor isn’t the weather, it’s the fact that for most people, Boston is a celebration, not a time trial. [Read Part 2 →](https://ade3.medium.com/why-is-the-boston-marathon-so-slow-6f8512129e24)

![A scatter plot, “2019 Boston Marathon Results By Age & Gender,” plotting finish time against age for every finisher. Blue and red stepped lines mark the men’s and women’s qualifying standards; a dense cloud of thousands of dots spreads to the right of those lines — runners who finished slower than the time that qualified them.](https://adrian3.com/imgs/case-studies/images/Boston/03-part2-scatter.jpg)

### Part 3 — How has the race changed in 121 years?

Expanding the dataset to the full **1897–2018** span tells a story of transformation. The race grew from **~30 finishers to more than 30,000** — all men until 1972, now including 200,000+ women across its history. The winners got steadily faster, then plateaued (the chart’s dotted lines mark the 1924 and 1957 course changes that nudged the distance). The real surprise is in the *averages*: typical finish times have actually gotten **slower since the mid-1970s** — not because runners declined, but because the race opened its doors and stopped being an elite men’s club. Evolution, not decline. [Read Part 3 →](https://ade3.medium.com/bostons-evolution-1897-2018-cdd91aa79f95)

![A line chart, “Winning Finish Times,” from roughly 1897 to 2018, with dotted vertical lines marking the 1924 and 1957 course changes. Winners’ times fall steadily across the century before flattening out in recent decades.](https://adrian3.com/imgs/case-studies/images/Boston/04-part3-winning-times.jpg)

### Part 4 — Is it getting harder to get in — and are we getting faster?

Getting in keeps getting harder. The “cutoff” — how much faster than the standard you actually had to run to be accepted — climbed to a brutal **4:52 in 2019**. The B.A.A. tightened every standard by five minutes for 2020, which reset the cutoff to 1:39, but still turned away another 3,161 qualified runners. The tempting conclusion is that runners are getting faster — but the data says no. Despite Kipchoge’s sub-two-hour run, *average* finishers aren’t improving. The race isn’t getting faster; it’s getting more popular, which only makes a spot there more meaningful. [Read Part 4 →](https://ade3.medium.com/qualifying-for-boston-in-2021-will-be-harder-than-ever-97f7af829b7c)

![A bar chart, “How Much Faster Than The Qualifying Time Was Needed?”, showing the accepted cutoff for 2014–2020. The bars rise to a peak of 4:52 in 2019, then drop sharply to 1:39 in 2020 after the standards were tightened.](https://adrian3.com/imgs/case-studies/images/Boston/05-part4-cutoffs.jpg)

## A tool anyone can explore

This study answered the questions I thought to ask but still leaves many more unanswered. To make it easier for anyone to explore the data I built **[the Boston Marathon Data Project site](https://tread1st.com/boston.html)** — an interactive tool with seven sections (Course, Participation, Demographics, Qualifying, Results, Performance) and a **placement calculator** where any runner can enter a finish time and see where they’d have placed in a given year. The point was to hand the data to the reader and let them chase their own curiosity.

## An open dataset for researchers

Underneath both is the tedious data-cleaning I performed to arrive at consistent, year-by-year results back to **1897**. I [published the entire dataset on GitHub](https://github.com/adrian3/Boston-Marathon-Data-Project), warts and all (the earliest years are winners-only; 2013 splits around the bombing), so other runners and analysts can build on it. I make no claims of ownership — it’s a resource for the whole running community.

Strip away my running-nerd enthusiasm and this is a case study about a specific skill set: **using data to answer hard questions, wrangling messy real-world records into something trustworthy, and designing the visualizations and tools that turn 121 years of numbers into a story a person can actually feel.** It’s the same job I do for products: uncover the value that actually resonates with people. This is why I believe [the hard UX problems are universal](From-Runners-to-Farmers.html) whether you design for runners or farmers. Be sure to look at my other [fitness-tech work](Fitness-Design-Showcase.html) if you are curious about how my design thinking is improving the experience of athletes.

---

**Go deeper:** 

- [Read the four-part study](https://ade3.medium.com/boston-marathon-data-analysis-part-1-4891d1832eba)
- [Explore the interactive tool](https://tread1st.com/boston.html) 
- [Get the open dataset on GitHub](https://github.com/adrian3/Boston-Marathon-Data-Project)
