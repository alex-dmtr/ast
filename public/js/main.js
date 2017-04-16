

function getTranspiled($code) {
  
  return new Promise((resolve, reject) => {
    

    $.ajax({
      method: 'POST',
      url: '/api/transpile',
      data: {
        code: $code
      },
      success: function(data) {
        resolve(data);
      },
      error: function(err) {
        reject(err);
      }
    })  
  
  })
}

function transpile() {
  var pseudocode = $("#pseudocode").val();
  console.log(pseudocode);
  return getTranspiled(pseudocode)
    .then((cpp) => {
      $("#cpp").text(cpp);
      console.log(cpp);
      
      // hljs.highlightBlock($("#cpp"));
      hljs.initHighlighting.called = false;
      hljs.initHighlighting();
    })
    .catch((err) => {
      console.log(err);
    })
}


$(document).ready(function() {
  
  $("#pseudocode").text(`inceput

intreg a, b, n, i
citire a, b

daca a > b atunci
  afisare a
altfel
  afisare b
sfarsit daca
  
i <- 1
cat timp i < n + 1 executa
  afisare i
sfarsit cat timp
  
sfarsit `);
  
  transpile();
})