// Shipping Time Countdown
if (!customElements.get("shipping-time")) {
  customElements.define(
    "shipping-time",
    class ShippingTimeUpdate extends HTMLElement {
      constructor() {
        console.log("====================================");
        console.log("ShippingTimeUpdate");
        console.log("====================================");
        super();
        console.log("====================================");
        console.log("dataset", this.dataset);
        console.log("====================================");
        this.fetchAvailability(this.dataset.variantId);
        this.errorHtml =
          this.querySelector("template").content.firstElementChild.cloneNode(
            true
          );
        //   this.onClickRefreshList = this.onClickRefreshList.bind(this);
      }

      fetchAvailability(variantId) {
        console.log("====================================");
        console.log("fetchAvailability", variantId);
        console.log("====================================");

        let rootUrl = this.dataset.rootUrl;
        if (!rootUrl.endsWith("/")) {
          rootUrl = rootUrl + "/";
        }
        const variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;
        console.log("====================================");
        console.log("variantSectionUrl", variantSectionUrl);
        console.log("====================================");

        fetch(variantSectionUrl)
          .then(response => {
            console.log('====================================');
            console.log('response', response);
            console.log('====================================');
            return response.text();            
          }).then(text => {
            console.log('====================================');
            console.log('text', text);
            console.log('TYPE OF TEXT', typeof text);
            console.log('====================================');
            const sectionInnerHTML = new DOMParser()
              .parseFromString(text, 'text/html')
              .querySelector('.shopify-section')
              .innerHTML;
            this.updateShippingText(sectionInnerHTML);
          })
          .catch(e => {
            console.warn('Error fetching pickup availability', e);
          });

      }

      updateShippingText(text) {
        console.log("====================================");
        console.log("updateShippingText", text);
        console.log("====================================");

        var now = new Date();
        var day = now.getDay();
        var end;
        var diffInHours;
        var diffInMinutes;
    
        var textValue = this.dataset.shippingTime; // "Default text"
        var shippingTimeCountdown = document.getElementById('shipping-time-countdown');
    
        // Walkaround because the JS functions to know if it has childs or not, doesn't work
        var store_availabilities_available = text != '\n' ? true : false; // If there is no stock, we get a div with a line break

        // TODO: necesario añadir comprobación si hay stock o no
        /*  
          2 opciones (se me ocurren):
            - fetch (he probado pero no me ha salido)
            - buscar si esta escrito lo del "Out of stock" en la web
        */
        
        // Lo localiza, pero como va muy rápido nos dice el del antiguo... ya que no hay reload del dom
        // quizá poner un event listener que este pendiente del div class=product__inventory en main-product.liquid y que si cambia, cambie el texto? o lo quite
        var hasStock = !document.querySelector('.product__inventory').innerHTML.includes('Out of stock');
        console.log('hasStock', hasStock);
        
        // var hasStock = true; // TODO: quitar esta linea, solo está para que no pete ahora

        // TODO: end TODO


        if (!hasStock) {

          textValue = '';
          shippingTimeCountdown.innerHTML = '';

        } else {
          if (day == 5 && now.getHours() >= 15 || day == 6 || day == 0) {
      
            if(!store_availabilities_available){
      
              textValue = this.dataset.shippingTimeWarehouseWeekend;
              shippingTimeCountdown.innerHTML = 'Thuesday';
        
            } else {
            
              textValue = this.dataset.shippingTimeMonday;
              shippingTimeCountdown.innerHTML = 'Monday';
      
            }
      
          } else {
      
            if(!store_availabilities_available){
      
              textValue = this.dataset.shippingTimeWarehouse;
              shippingTimeCountdown.innerHTML = '48-72HRS';
        
            } else {
      
              if (day >= 1 && day <= 5 && now.getHours() < 15) {
                end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0, 0);
              } else {
                end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0, 0, 0);
                textValue = this.dataset.shippingTimeTomorrow;
              }
      
              var timeleft = end.getTime() - now.getTime();
      
              diffInHours = Math.floor(timeleft / (1000 * 60 * 60));
              diffInMinutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      
              shippingTimeCountdown.innerHTML = diffInHours + 'HRS ' + diffInMinutes + 'MIN ';
            }
          }
        }
    
        var shippingTimeText = document.getElementById('shipping-time-text');
        shippingTimeText.innerHTML = textValue;
      }
    }    
  );
}

// function updateShippingTime(){
// var now = new Date();
// var day = now.getDay();
// var end;
// var diffInHours;
// var diffInMinutes;

// var textValue = '{{ 'products.product.shipping_time' | t }}'; // "Default text"
// var shippingTimeCountdown = document.getElementById('shipping-time-countdown');

// var store_availabilities_available = {{ product.selected_or_first_available_variant.store_availabilities | where: "available", true | json }};
// console.log(store_availabilities_available);

// if (day == 5 && now.getHours() >= 15 || day == 6 || day == 0) {

//   if(store_availabilities_available.length == 0){

//     textValue = '{{ 'products.product.shipping_time_warehouse_weekend' | t }}';
//     shippingTimeCountdown.innerHTML = 'Thuesday';

//   } else {

//     textValue = '{{ 'products.product.shipping_time_monday' | t }}';
//     shippingTimeCountdown.innerHTML = 'Monday';

//   }

// } else {

//   if(store_availabilities_available.length == 0){

//     textValue = '{{ 'products.product.shipping_time_warehouse' | t }}';
//     shippingTimeCountdown.innerHTML = '48-72HRS';

//   } else {

//     if (day >= 1 && day <= 5 && now.getHours() < 15) {
//       end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0, 0);
//     } else {
//       end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0, 0, 0);
//       textValue = '{{ 'products.product.shipping_time_tomorrow' | t }}';
//     }

//     var timeleft = end.getTime() - now.getTime();

//     diffInHours = Math.floor(timeleft / (1000 * 60 * 60));
//     diffInMinutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));

//     shippingTimeCountdown.innerHTML = diffInHours + 'HRS ' + diffInMinutes + 'MIN ';
//   }
// }

// var shippingTimeText = document.getElementById('shipping-time-text');
//                 shippingTimeText.innerHTML = textValue;
// }

// updateShippingTime();

// console.log(document.getElementsByTagName('variant-radios'));

// document.getElementsByTagName('variant-radios')[0].addEventListener('change', function (event) {
//     console.log('changed');
//     // updateShippingTime();
// });





// var now = new Date();
// var day = now.getDay();
// var end;
// var diffInHours;
// var diffInMinutes;

// var textValue = '{{ 'products.product.shipping_time' | t }}'; // "Default text"
// var shippingTimeCountdown = document.getElementById('shipping-time-countdown');

// var store_availabilities_available = {{ store_availabilities_available | json }};

// if (day == 5 && now.getHours() >= 15 || day == 6 || day == 0) {

//   if(store_availabilities_available.length == 0){

//     textValue = '{{ 'products.product.shipping_time_warehouse_weekend' | t }}';
//     shippingTimeCountdown.innerHTML = 'Thuesday';

//   } else {
  
//     textValue = '{{ 'products.product.shipping_time_monday' | t }}';
//     shippingTimeCountdown.innerHTML = 'Monday';

//   }

// } else {

//   if(store_availabilities_available.length == 0){

//     textValue = '{{ 'products.product.shipping_time_warehouse' | t }}';
//     shippingTimeCountdown.innerHTML = '48-72HRS';

//   } else {

//     if (day >= 1 && day <= 5 && now.getHours() < 15) {
//       end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0, 0);
//     } else {
//       end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0, 0, 0);
//       textValue = '{{ 'products.product.shipping_time_tomorrow' | t }}';
//     }

//     var timeleft = end.getTime() - now.getTime();

//     diffInHours = Math.floor(timeleft / (1000 * 60 * 60));
//     diffInMinutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));

//     shippingTimeCountdown.innerHTML = diffInHours + 'HRS ' + diffInMinutes + 'MIN ';
//   }
// }

// var shippingTimeText = document.getElementById('shipping-time-text');
// shippingTimeText.innerHTML = textValue;

