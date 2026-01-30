for (var i = 0; i < 10; i++) {
  //before console
  console.log(i);
  //after console
  setTimeout(function () {
    console.log(i);
  }, 1);
}
