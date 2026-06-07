<!---
title: Easier Web Hosting on Github
template: post
date: February 17, 2018
mediumUrl: https://medium.com/@ade3/easier-web-hosting-on-github-ca8bfa315f18?source=linkShare-f82ce6c25013-1518892761
folder: Writing/2017
description: 
categories: Self Promotion
thumbnail: 
layout: 
--->

# Easier Web Hosting on Github
## How to Use Whisper as a Jekyll Alternative

Last week I introduced you to [Whisper](https://adrian3.github.io/whisper/index.html), a tool that let's you power your website with markdown files stored in a Dropbox folder. Website management doesn't get much easier than that. However, there is one reason why you might want to add a tiny bit of complexity back into this dead-simple approach. That reason is free hosting on Github. Today’s post is a tutorial explaining how to use Whisper to power your free Github-powered website. Should we get started?


## How does Whisper work?

Normally, Whisper works like this:

1. You make a change to a text file in Dropbox
2. Whisper notices the change and updated your wesbite accordingly

Since Github can't monitor your Dropbox folder, the new process is going to be a bit more manual. It will look like this:

1. You make a change to a file in Dropbox
2. From your computer you trigger a Dropbox sync telling Whisper to rebuild your site locally
3. You push the updated files to Github

As you can see, the addition of step 2 is slightly annoying. This is the price we pay for free hosting. Still with me? Let’s continue...


## What you need to understand about free Github hosting

One of the great things about Github is that it allows you to host static HTML files, essentially offering a free way to host your website. Github won't give you any databases or server-side capabilities. The reason the hosting is free is because it just serves up basic, static files. This means you are limited to HTML, javascript, images, and CSS files. It is just the basics.

The typical way to create a Github website is to use [Jekyll](https://jekyllrb.com). Jekyll does a lot of great things but it can be hard for non-developers to understand how to use it. For example, here are Jekyll's Quick-start Instructions:

	$ gem install jekyll bundler
	~ $ jekyll new my-awesome-site
	~ $ cd my-awesome-site
	~/my-awesome-site $ bundle exec jekyll serve
	# => Now browse to http://localhost:4000 

To a developer this code might seem natural. To the rest of us it looks like robot barf. You can read [Jekyll's documentation](https://jekyllrb.com) for yourself, and if you don't come away scratching your head I congratulate you. 

Whisper has comparable features (static files, no database, blog capability) to Jekyll without requiring you to use the command line. The hardest part of using Whisper is going to involve a bit of PHP. But don't worry, I am going to walk you through that part.


## Github Basics

If you have used Github before, you can skip this part. For everybody else, here is the absolute minimum you need to know. Github is a collection of public projects that anyone can download and use. The projects are contained in repositories (repos). You can download or "clone" a repo to your computer where you can view, edit, and run the code. 

Most developers interact with repos using the command line. They type commands into their terminal which in turn performs different tasks. I recommend [learning the basics](https://guides.github.com/activities/hello-world/) but that's not mandatory. You can do everything necessary to run Whisper without ever opening the terminal. Before we go any further, make sure you have done the following:

1. [Create a Github account](https://github.com/join)
2. [Download the Github app](https://desktop.github.com)

With that out of the way, let me show you how easy it is to create a website on Github using Whisper.


## Creating Your Website

The first thing we need to do is download Whisper. Go to [https://github.com/adrian3/whisper](https://github.com/adrian3/whisper). Notice that there is a green button that says "Clone or download" in the upper right. Click this button to download the Whisper repo.

You now have a folder on your computer named "whisper-master." This is going to be the starting point of our website. Rename this folder to whatever you want your website project to be named. Now open the folder and look around. 

First we are going to do a little cleanup. Delete all the files in the main folder except for the folders named _admin, _dropbox, and _themes. Next delete everything inside the _dropbox folder. This gets us to a base state.

Now create a text file inside the _dropbox folder named index.md. Type something in that file, perhaps just, "Hello world." 

Next we need to configure Whisper. To do this look for the file named "config-SAMPLE.php." Rename it "config.php" and open it in your text editor. 

Find these two lines:

	$siteTitle = "Whisper";
	$siteUrl = "https://adrian3.github.io/whisper/";

Change the siteTitle to whatever you want your website to be named. Change siteURL to "http://localhost:8888" which is the address where we will be testing our website. 

Now in your browser, if you go to [http://localhost:8888/_admin/](http://localhost:8888/_admin/) what do you see? You should get an error because we don't have PHP running. Let's fix that.

Running PHP locally on your computer is probably going to be the trickiest part of this whole process. It is a bit beyond the scope of this tutorial but let me point you in the right direction. If you are a Windows user, [start here](https://www.google.com/search?rls=en&q=how+to+run+php+on+windows&ie=UTF-8&oe=UTF-8). If you are on a Mac I recommend using [Mamp](https://www.mamp.info/en/). After you have installed MAMP, open up the preferences section and click on the web server tab. Change the document root so it points at the whisper-master folder we renamed earlier. Click OK then click "Start Servers" if they don't start automatically. 

Now if you go to http://localhost:8888/_admin/ you should see Whisper's admin screen. The index.md file we created earlier should appear in the "Pages" section with an option to "Rebuild" it. Click "Rebuild." Now if you open the main folder you will see that a new "index.html" file. You can view preview this file by going to [http://localhost:8888/index.html](http://localhost:8888/). What is going on here?

Any file that you put in the _dropbox folder is eligible to be processed or "Rebuilt" from Markdown into HTML. Each file that is processed will get a header and a footer appended to it. The header and footer are customizable, simply change the header.php and footer.php files in the _templates/whisper/ folder. 

Experiment with this a bit. Edit the index.md file and rebuild it. Add more markdown files and rebuild them. You could manage your website this way, just by adding, removing and editing files in this _dropbox folder. Or, if you want to use Dropbox, you can [learn more about that setup process here](https://adrian3.github.io/whisper/dropbox.html). One thing to note is that if you decide to use Dropbox later be sure to backup what is currently in the _dropbox folder. That's because Whisper will keep the _dropbox folder in sync with your actual Dropbox folder and it will wipe away anything else.

You are now at a point where you can adjust your website to your liking. Refer to [https://github.com/adrian3/whisper](https://github.com/adrian3/whisper) to learn what else you can do. 


## Publishing Your Website

Once you have your local website just the way you want it you are ready to publish it to Github. Here's how to do it. First, open the config.php file again and find this line: 

	$siteUrl = "http://localhost:8888";

Change it to:

	// $siteUrl = "http://localhost:8888";
	$siteUrl = "https://username.github.io/projectname/";

Be sure to replace "username" with your Github username and "projectname" to the project name (whatever you renamed the whisper-master folder earlier). Notice how the local url is commented out with the two slashes? I like to leave this in my config files so I can quickly go back and forth between my local Whisper files and the Github ready files.

Before we can push everything to Github we need to rebuild once more. The reason has to do with the url we just changed. Every time you rebuild your site it uses the siteURL to know where the files are in relation to each other. If you were to push the files to Github with the local urls the links in your pages would be broken. In order for the links to work on Github they need to point at Github, technically "breaking" your local links.

Now we are ready to push our files to Github. Open up Github desktop. In the upper left click on the plus sign and select "Add." Find your whisper site folder and select "Create and Add Repository." This will create your repo. If you navigate to https://username.github.io/projectname/ you will see your website. 

Now that we have created a repo for our project, future changes to the website are made in a slightly different way. You will see your project in the sidebar of your Github desktop application. When you make changes to the project they will appear in the center column of the screen. When you are ready to update Github with your new files you will add a description then click "Commit and Sync master."

Congratulations, you have successfully created a free website using Whisper and Github. If you have any questions please let me know. And if you found this tutorial helpful, please share this post. _Stay creative._

***

## Additional Resources
- [Markdown Syntax Documentation](https://daringfireball.net/projects/markdown/syntax)
- [How to use a custom domain with Github](https://help.github.com/articles/quick-start-setting-up-a-custom-domain/)
- [Whisper Documentation](https://adrian3.github.io/whisper/index.html)
- [How to create a blog post with Whisper](https://adrian3.github.io/whisper/blog/2018/2018-01-07-How-To-Make-A-Post.php)
