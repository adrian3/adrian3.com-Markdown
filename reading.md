<!---
title: Reading
date: December 26, 2019
published: true
categories: 
tags: 
layout: 
jquery: true
--->

Reading
===============

<p>Below are the books I have been reading. If you use <a href="https://www.goodreads.com/user/show/39560187-adrian-hanft">Goodreads</a>, be sure to follow me.</p>
<div id="shelf"></div>
<script type="text/javascript">
var book = "";

function getBooks() {
  $.getJSON('goodreads/getBooks.php', function(data) {

//  console.log(data);

    $.each(data.reviews.review, function(i, field){

      book ="<h4>" + field.book.title_without_series + "</h4>";
      book += "<p><img align='right' src='" + field.book.image_url + "'>";
      book += "<br />by " + field.book.authors.author.name;
      if (field.rating>0) {
	    book += "<br/>" + field.rating + " stars";
	  }
      book += "<hr />";

      $("#shelf").append(book);

    });

  });
}
getBooks();
</script>
