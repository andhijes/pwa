$(document).ready(function(){
    var _url = "https://my-json-server.typicode.com/andhijes/pwa-basic/products"

    var dataResults = ''
    var catResults = ''
    var categories = []

    // get unique froma array
    // const unique = (value, index, self) => {
    //   return self.indexOf(value) === index;
    // }

    // const sampleValues = [1, 4, 5, 2, 'a', 'e', 'b', 'e', 2, 2, 4];
    // const uniqueValues = sampleValues.filter(unique);
    function renderPage(data){
      // $.get(_url, function(data){
          $.each(data, function(key, items){
              _cat = items.category
              
              dataResults += "<div>"
                              + "<h3>" + items.name + "</h3>"
                              + "<p>" + _cat + "</p>"
                          "</div>";

              if($.inArray(_cat, categories) == -1){
                  categories.push(_cat)
                  catResults += "<option value='" + _cat + "'>" + _cat + "</option>"
              }
          })
          
          $('#products').html(dataResults)
          $('#cat_select').html(
              "<option value='all'>semua</option>"
              +
              catResults
          )
      // })
    }

    // fresh data from online
    var networkDataReceived = false
    var networkUpdate = fetch(_url).then(function(response){
      return response.json()
    }).then(function(data){
      networkDataReceived = true
      renderPage(data)
    })

    // return data from cache
    caches.match(_url).then(function(response){
      if(!response) throw Error('no data on cache')
      return response.json()
    }).then(function(data){
      if(!networkDataReceived){
        renderPage(data)
        console.log('render data from cache')
      }
    }).catch(function(){
      return networkUpdate
    })

    // filter function
    $("#cat_select").on('change', function(){
      updateProduct($(this).val())
    })

    function updateProduct(cat){
      var dataResults = ''
      var _newUrl = _url
      if(cat != 'all'){
        _newUrl = _url +  "?category=" + cat
      }
    
      $.get(_newUrl, function(data){
          $.each(data, function(key, items){
              _cat = items.category
              
              dataResults += "<div>"
                              + "<h3>" + items.name + "</h3>"
                              + "<p>" + _cat + "</p>"
                          "</div>";
          })
          
          $('#products').html(dataResults)
      })
    }
})

// PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }