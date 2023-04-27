// Shipping Time Countdown
if (!customElements.get("shipping-time")) {
  customElements.define(
    "shipping-time",
    class ShippingTimeUpdate extends HTMLElement {
      constructor() {
        super();
        this.fetchAvailability(this.dataset.variantId);
        this.errorHtml =
          this.querySelector("template").content.firstElementChild.cloneNode(
            true
          );
      }

      fetchAvailability(variantId) {

        let rootUrl = this.dataset.rootUrl;
        if (!rootUrl.endsWith("/")) {
          rootUrl = rootUrl + "/";
        }
        const variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;

        fetch(variantSectionUrl)
          .then(response => {
            return response.text();            
          }).then(text => {
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
        var now = new Date();
        var day = now.getDay();
        var end;
        var diffInHours;
        var diffInMinutes;
    
        var textValue = this.dataset.shippingTime; // "Default text"
        var shippingTimeCountdown = document.getElementById('shipping-time-countdown');
    
        // Walkaround because the JS functions to know if it has childs or not, doesn't work
        var store_availabilities_available = text != '\n' ? true : false; // If there is no stock, we get a div with a line break

        setTimeout(() => { 
          var hasStock = !document.querySelector('.product__inventory').innerHTML.includes(this.dataset.outOfStock); // TODO: este funciona
  
         // TODO: hacelo no dependiente de algo traducible

          console.log('hasStock', hasStock)

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
        }, 500);
      }
    }    
  );
}
