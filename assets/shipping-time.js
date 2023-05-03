// Shipping Time Countdown
if (!customElements.get("shipping-time")) {
  customElements.define(
    "shipping-time",
    class ShippingTimeUpdate extends HTMLElement {
      constructor() {
        super();
        this.fetchVariantInfo(this.dataset.variantId);
        this.errorHtml =
          this.querySelector("template").content.firstElementChild.cloneNode(
            true
          );
      }

      fetchVariantInfo(variantId) {
        console.log('fetchVariantInfo', variantId)
        const gid = "gid://shopify/ProductVariant/" + variantId
        const query = `
          query getProductVariant($id: ID!){
            node(id: $id) {
              ... on ProductVariant {
                title
                availableForSale
                storeAvailability (first: 5) {
                  nodes {
                    available
                    location {
                      name
                    }
                  }
                }
              }
            }
          }
        `;
        
        fetch('https://velodrom-barcelona.myshopify.com/api/2023-04/graphql.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': 'dadc23c4598a46df4983ad35299b568d',
          },
          body: JSON.stringify({ query, variables: { id: gid } }),
        })
          .then(response => response.json())
          .then(data => {
            this.updateShippingText(data.data.node);
          })
          .catch(error => console.error(error));
      }

      updateShippingText(data) {
        var now = new Date();
        var day = now.getDay();
        var end;
        var diffInHours;
        var diffInMinutes;
    
        var textValue = this.dataset.shippingTime; // "Default text"
        var shippingTimeCountdown = document.getElementById('shipping-time-countdown');
  
        var hasStock = data.availableForSale;
        var store_availabilities_available = data.storeAvailability.nodes.length > 0;          

        if (!hasStock) {
       
          textValue = '';
          shippingTimeCountdown.innerHTML = '';

          var shippingTimeText = document.querySelector('.shipping-time');
          shippingTimeText.style.minHeight = '0px';

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
                extValue = this.dataset.shippingTimeTomorrow;
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
        // }, 500);
      }
    }    
  );
}
