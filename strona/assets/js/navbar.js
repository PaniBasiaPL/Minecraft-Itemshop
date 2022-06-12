$(".hb").click(function () {
  $(this)
    .children()
    .each(function () {
      $(this).toggleClass("active");
    });
  $("#navbar")
    .children()
    .each(function () {
      $(this).toggleClass("show");
    });
});
