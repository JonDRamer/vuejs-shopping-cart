'use strict';

const loadNum = 10;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        results: [],
        cart: [],
        newSearch: 'Landscapes',
        lastSearch: '',
        loading: false
    },
    methods: {
        onSubmit: function() {
            this.items = [];
            this.loading = true;
            
            this.$http
                .get(`/search/${this.newSearch}`)
                .then((res) => {
                    this.results = res.data;
                    this.items = res.data.slice(0, loadNum);
                    this.lastSearch = this.newSearch;
                    this.loading = false;

                    this.items.forEach((item) => {
                        let randomNum = Math.random(100) * 100;
                        item.price = Number( randomNum.toFixed(2) );
                    });
                });
        },
        addItem: function(index) {
            let item = this.items[index];
            let found = false;

            this.cart.forEach(( cartItem ) => {
                if (cartItem.id === item.id) {
                    found = true;
                    cartItem.quantity++;
                }
            });

            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: 1
                });
            };

            this.total += item.price;
            
        },
        increment: function(item) {
            item.quantity++;
            this.total += item.price;            
        },
        decrement: function( item ) {
            item.quantity--;
            this.total -= item.price;
            if (item.quantity < 1) {
                this.cart.forEach(( cartItem, index ) => {
                    if ( cartItem.id === item.id ) {
                        this.cart.splice( index, 1 );
                    };
                });
            };
            
        }
    },
    filters: {
        currency: function(value) {           
            let formattedPrice = value.toFixed(2);
            return `$${formattedPrice}`;
        }
    },
    mounted: function() {
        this.onSubmit();    
    }
});

let productListBottom = document.getElementById('product-list-bottom');
let watcher = scrollMonitor.create( productListBottom ); 
watcher.enterViewport(function lazyLoad() {
    console.log('Entered viewport');
    
});
