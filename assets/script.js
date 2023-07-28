(async() => {         
    const cart = await getCart();    
    document.querySelector('.cart-icon-btn span.cart-icon-badge').innerHTML = cart.item_count;             
})();

var header = document.querySelector('.header-wrapper');

window.addEventListener('scroll', function () {
    if (document.getElementsByClassName('header-wrapper').length) {
        if (window.scrollY > header.offsetHeight * 2) {
            header.classList.add('header-fixed');
            setTimeout(function(){
                header.classList.add('header-fixed-openning');
            },100)
            
        } else {
            header.classList.remove('header-fixed-openning');
            header.classList.remove('header-fixed');
        }
    }
});

/* Modal opener*/
customElements.define('modal-opener', class extends HTMLElement {
    constructor() {            
        super();               
        let modalClosebuttons = this.querySelectorAll('[data-modal-dismiss="modal"]');   
        let modalbuttons = document.querySelectorAll('[data-modal-target]');   
        this.body = document.querySelector('body');    
        modalClosebuttons.forEach((element) => {
            element.addEventListener('click', this.close.bind(this));            
        });
        modalbuttons.forEach((element) => {          
            element.addEventListener('click', this.open.bind(this,element));                       
        });                     
    }     
    open(event,element){     
        element.preventDefault();     
        console.log(event);   
        
        var target = event.getAttribute("data-modal-target");// event.explicitOriginalTarget.dataset.modalTarget;
        var modal = document.querySelector(target);  
        var id =  event.getAttribute("data-product-id"); //event.explicitOriginalTarget.dataset.productId;  
        if(id != undefined){ 
            this.get_data(id);
        }  
        this.body.classList.add('noscroll');
        modal.classList.remove('hidden');
        setTimeout(function () {
            modal.classList.add('open');
        }, 100)
        clearTimeout();        
    }
    close(){              
        this.body.classList.remove('noscroll');        
        this.classList.remove('open');           
        this.classList.add('hidden');           
    }
    get_data(id){
        console.log(id);
        (async() => {         
            var result = await getProduct(id);
            console.log(result);    
            var img = document.querySelector('.quickview_product_slider_slide.slideshow_slide img');
            var title = document.querySelector('h3.quickview_product_title');    
            var price_regular = document.querySelector('.quickview_product_price .price .price__regular');
            var price_sale = document.querySelector('.quickview_product_price .price .price__sale');    
            var description = document.querySelector('.quickview_product_description'); 
            var variantpicker = document.querySelector('variant-picker');    
            img.src =  result.product.image.src;           
            title.innerHTML = result.product.title; 
            price_regular.innerHTML = currency+result.product.variants[0].price;
            if(result.product.variants[0].compare_at_price != ''){
                price_sale.innerHTML = currency+result.product.variants[0].compare_at_price;
            }else{
                price_sale.innerHTML = result.product.variants[0].compare_at_price;
            }    
            description.innerHTML = result.product.body_html;
            var option = result.product.options;   
            var html = '';        
            option.forEach(function(item){                
                if(item.name == 'Color' || item.name == 'color'){
                    html+=' <div class="quickview_product_color_selector_wrap">';
                    html+='<div class="quickview_product_color_selector_title">'+item.name+': </div>';
                    html+='<div class="quickview_product_color_selector">';
                        item.values.forEach(function(num){
                            html+=' <div class="quickview_product_color_selector_radio">';
                                html+=' <input id="'+num+'-'+item.name+'" type="radio" name="'+item.name+'" value="'+num+'">';
                                html+=' <label for="'+num+'-'+item.name+'" class="quickview_product_color_selector_label" style="background:'+num+';"></label>';
                            html+='</div>'; 
                        });
                    html+= '</div> </div>';                   
                }else{
                    html+=' <div class="quickview_product_size_selector_wrap">';
                    html+='<div class="quickview_product_size_selector_title">'+item.name+': </div>';
                    html+='<div class="quickview_product_size_selector">';
                        var i = 0; 
                        item.values.forEach(function(num){
                            html+=' <div class="quickview_product_size_selector_radio">';
                                html+=' <input id="'+num+'-'+item.name+'" type="radio" name="'+item.name+'" value="'+num+'">';
                                html+=' <label for="'+num+'-'+item.name+'" class="quickview_product_size_selector_label">'+num+'</label>';
                            html+='</div>'; 
                        i++; });
                    html+= '</div> </div>';                    
                }                            
            });
            html+= '<select name="variant-value-id" class="d-none">';
                result.product.variants.forEach(function(item){
                    html+= '<option value="'+item.id+'" data-name="'+item.title.replaceAll(/\s/g,'')+'">'+item.title+'</option>'; 
                });                               
            html+= '</select>';
            variantpicker.innerHTML = html; 
        })();  
    }
});
/* End Modal opener */

/* Quantity */
customElements.define('quantity-input', class extends HTMLElement {
    constructor() { 
        super(); 
        var count = this.querySelectorAll("button");        
        count.forEach((element) => {          
            element.addEventListener('click', this.qty.bind(this,element));            
        });
    }
    qty(e,element){
        let data = e.getAttribute("data");       
        var qty = this.querySelector('input[name="quantity"]').value;
        if(data == 'min'){
            if(qty != 1){
                var t = parseInt(qty) - 1;
                this.querySelector('input[name="quantity"]').value = t;                 
            } 
        }else{
            var t = parseInt(qty) + 1;
            this.querySelector('input[name="quantity"]').value = t;              
        }
    }   
});         
/* End Quantity */

document.addEventListener('DOMContentLoaded', function () {   

    /* Navigation Menu Dropdown */
    const dropdown = document.querySelectorAll(".dropdown");
    const subdropdown = document.querySelectorAll(".sub_dropdown");
    const megamenu_dropdown = document.querySelectorAll(".megamenu_dropdown");
    document.body.addEventListener('click', function () {
        remove_dropdown(dropdown);
        remove_megamenu(megamenu_dropdown);
    });

    dropdown.forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (!item.querySelector('.dropdown-menu').classList.contains('active')) {
                remove_dropdown(dropdown);
                remove_megamenu(megamenu_dropdown);
            }
            item.querySelector('.dropdown-toggle').classList.toggle('opened');
            item.querySelector('.dropdown-menu').classList.toggle('active');
            e.stopPropagation();
        });
        item.querySelector('.dropdown-menu').addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    subdropdown.forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.stopPropagation();
            item.querySelector('.sub_dropdown-toggle').classList.toggle('opened');
            item.querySelector('.sub_dropdown-menu').classList.toggle('active');
        });
        item.querySelector('.sub_dropdown-menu').addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });
    megamenu_dropdown.forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!item.querySelector('.megamenu_dropdown_wrap').classList.contains('active')) {
                remove_dropdown(dropdown);
                remove_megamenu(megamenu_dropdown);
            }
            item.querySelector('.megamenu_dropdown-toggle').classList.toggle('opened');
            item.querySelector('.megamenu_dropdown_wrap').classList.toggle('active');
        });
        item.querySelector('.megamenu_dropdown_wrap ').addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    function remove_dropdown(dropdown) {
        dropdown.forEach(function ($item) {
            $item.querySelector('.dropdown-toggle').classList.remove('opened');
            $item.querySelector('.dropdown-menu').classList.remove('active');
        });
    }
    function remove_megamenu(megamenu_dropdown) {
        megamenu_dropdown.forEach(function ($item) {
            $item.querySelector('.megamenu_dropdown-toggle').classList.remove('opened');
            $item.querySelector('.megamenu_dropdown_wrap').classList.remove('active');
        });
    }

    // navigation menu js end
    
});//DOMContentLoaded end


document.addEventListener('DOMContentLoaded', function () { 
    const look_point = document.querySelectorAll('.look_point_one');
    const product = document.querySelectorAll('.look_section_right .grid-row .product_card');
    look_point.forEach((element) => { 
        element.addEventListener('click', function (e) {   
            console.log('click');
            focus_call(1);            
        });            
    });
    function focus_call(item){
        console.log(item);
        product.forEach((element) => { 
            console.log(element);
            element.addEventListener('focus', () => {
              //  console.log(event);
                element.target.style.background = 'pink';
            });
        });    
    }
});

class ProductRecommendations extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      const handleIntersection = (entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);
  
        fetch(this.dataset.url)
          .then(response => response.text())
          .then(text => {
            const html = document.createElement('div');
            html.innerHTML = text;
            const recommendations = html.querySelector('product-recommendations');
  
            if (recommendations && recommendations.innerHTML.trim().length) {
              this.innerHTML = recommendations.innerHTML;
            }
  
            if (!this.querySelector('slideshow-component') && this.classList.contains('complementary-products')) {
              this.remove();
            }
  
            if (html.querySelector('.grid__item')) {
              this.classList.add('product-recommendations--loaded');
            }
          })
          .catch(e => {
            console.error(e);
          });
      }
  
      new IntersectionObserver(handleIntersection.bind(this), {rootMargin: '0px 0px 400px 0px'}).observe(this);
    }
}  
customElements.define('product-recommendations', ProductRecommendations);

document.addEventListener('DOMContentLoaded', function () {          
    let add = document.querySelector('button.btn-add-to-cart'); 
    add.addEventListener('click', function (e) {        
        if(get_variant() != ''){
          var id = get_variant();
        }else{
          var id = add.dataset.id;
        } 
        let qty = document.querySelector('input[name="quantity"]').value;                 
        const lineItem = addItem(id,qty);       
        
        (async() => {         
            const cart = await getCart();
            console.log(cart.item_count);
            document.querySelector('.cart-icon-btn span.cart-icon-badge').innerHTML = cart.item_count;             
        })();    
    });
});   
async function addItem(variantId, quantity, newProperties = {}) {
    var result = await fetch("/cart/add.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            id: variantId,
            quantity: quantity,
            properties: newProperties
        }) 
    })
}
async function getCart() {
    const result = await fetch("/cart.json");

    if (result.status === 200) {
        return result.json();
    }

    throw new Error(`Failed to get request, Shopify returned ${result.status} ${result.statusText}`);
}    
async function getProduct(handle) {
    var result = await fetch(`/products/${handle}.json`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    return result.json();
}   
function get_variant(){
    var count = document.querySelectorAll('variant-picker input[type="radio"]:checked'); 
    var set_val = [];
    count.forEach((element) => {
        set_val.push(element.value);    
    });
    
    if(count.length == 3){
        var variant = set_val[0]+'/'+set_val[1]+'/'+set_val[2];
    }else if(count.length == 2){
        var variant = set_val[0]+'/'+set_val[1];
    }else{
        var variant = set_val[0];
    } 
    console.log(variant);
    var id = document.querySelector('variant-picker select option[data-name="'+variant+'"]');
    return id.value;
}

jQuery(document).ready(function(){
    jQuery('.cart-icon-btn').click(function(e){
        e.preventDefault();
        jQuery('body').toggleClass('noscroll');
        jQuery('.cart_drawer_wrapper').toggleClass('active');
    });
    jQuery('.cart_drawer_close').click(function(e){
        e.preventDefault();
        jQuery('body').removeClass('noscroll');
        jQuery('.cart_drawer_wrapper').removeClass('active');
    });
    jQuery('.cart_drawer_overlay').click(function(e){
        e.preventDefault();
        jQuery('body').removeClass('noscroll');
        jQuery('.cart_drawer_wrapper').removeClass('active');
    });
  //accordion js
    jQuery(".accordion .accordion_item > a").on("click", function(e) {
        e.preventDefault();
        if (jQuery(this).hasClass("active")) {
            jQuery(this).removeClass("active");
            jQuery(this)
                .siblings(".accordion_content")
                .slideUp(200);
        } else {
            jQuery(".accordion .accordion_item > a").removeClass("active");
            jQuery(this).addClass("active");
            jQuery(".accordion .accordion_content").slideUp(200);
            jQuery(this)
                .siblings(".accordion_content")
                .slideDown(200);
        }
    });
  //accordion js end
}); //ready end
