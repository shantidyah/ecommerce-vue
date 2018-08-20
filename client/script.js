var app = new Vue({
    el: '#app',
    data: {
        count:0,
        seen:true,
        listproduct:[],
        islogin:false,
        type:'',
        brand:'',
        price:0,
        category:'',
        url:'',
        discount:0,
        img:'',
        search:'',
        isAdmin:false,
        email:'',
        password:'',
        name:'',
        address:'',
        city:'',
        status:'',
        statusPrice:'',
        report:[],
        cart:[],
        total:0,
        idPro:''
    },
    created(){
        this.getProduct()
        this.LocStorage()
    },
    watch: {
        discount: function(val) {
            if(val>100 || val<0){
                this.status = 'range discount 0-100'
            }
            else{
                this.status = ''
            }
        },
        price: function( val ) {
            if(val<=10000){
                this.statusPrice = 'price > 10000'
            }
            else{
                this.statusPrice = ''
            }
        }
    },
    filters: {
        date: function(value) {
            var gooddate = value.split('T')
            return gooddate[0]
        }
    },
    methods:{
        getProduct: function(){
            axios.get('http://localhost:3000/items')
            .then(products=>{
                // console.log(products.data);
                this.listproduct = products.data
            })
            .catch(err=>{
                console.log(err);
            })
        },
        selectedImage : function(e){
            this.img = e.target.files[0]
        },
        addProduct : function(){
            let formData = new FormData()
            formData.append('image',this.img)
      
            axios.post('http://localhost:3000/upload',formData)
            .then(result=>{
              console.log("success upload to bucket");
              if( !this.discount || this.discount>100 || this.discount<0 ){
                this.discount=0
              }
              axios.post('http://localhost:3000/items/add',{
                type : this.type,
                brand : this.brand,
                price : this.price,
                category : this.category,
                discount : this.discount,
                url : result.data.link,
              })
              .then(product=>{
                  this.type = ''
                  this.brand = ''
                  this.price = 0
                  this.category = ''
                  this.discount = 0
                  this.img = ''
                  swal("", "You success add product!", "success")
                  .then(value=>{
                    this.getProduct()                   
                  })
                  .catch(err=>{
                      console.log(err);
                  }) 
                console.log('success add to database');
              })
              .catch(err=>{
                console.log(err);
              }) 
            })
            .catch(err=>{
              console.log(err);
              
            })
        },
        Search : function(){
            axios.get(`http://localhost:3000/items/search?q=${this.search}`)
            .then(result=>{
                this.listproduct = result.data    
            })
            .catch(err =>{
              console.log(err);
              
            })
        },
        categories : function(cat){
            axios.get(`http://localhost:3000/items/category/${cat}`)
            .then( product =>{
                console.log(product.data);
                this.listproduct = product.data
            })
            .catch(err =>{
                console.log(err);   
            })
        },
        Login : function(){
            axios.post('http://localhost:3000/login',{
                email: this.email,
                password: this.password
            })
            .then( token =>{
                localStorage.setItem('token',token.data.token)
                this.email = ''
                this.password = ''
                swal("", "You success login!", "success")
                .then(value=>{
                    this.LocStorage()
                })
                .catch(err=>{
                console.log(err);
                })
                // router.push('/')
            })
            .catch( err =>{
                console.log(err);
            })
        },
        LocStorage: function(){
            var token = localStorage.getItem('token')
            if(!token){
              this.islogin = false
              this.isAdmin = false
            }
            else{
              axios.get('http://localhost:3000/verify',{
                headers:{token:token}
              })
              .then( result =>{
                if(result.data){
                  this.islogin = true
                }
                if(result.data.isAdmin){
                  this.isAdmin = true
                }
        
              })
              .catch( err =>{
                console.log('you must login');
              })
            }
        },
        Logout: function(){
            localStorage.clear()
            swal("", "You success logout!", "success")
            .then(value=>{
                this.LocStorage()
            })
            .catch(err=>{
              console.log(err);
            })
        },
        register: function(){
            axios.post('http://localhost:3000/register',{
                name: this.name,
                email: this.email,
                password: this.password,
                address: this.address,
                city: this.city
            })
            .then( token =>{
                localStorage.setItem('token',token.data.token)
                this.name = ''
                this.email = ''
                this.password = ''
                this.address = ''
                this.city = ''
                swal("", "You success register!", "success")
                .then(value=>{
                    this.LocStorage()                    
                })
                .catch(err=>{
                    console.log(err);
                })     
            })
            .catch( err =>{
                console.log(err);
            })
        },
        listReport: function(){
            axios.get('http://localhost:3000/transactions')
            .then( trans =>{
              console.log(trans.data);
              this.report = trans.data
            })
            .catch( err =>{
              console.log(err);
            })
        },
        addCart(payload){
            // console.log(payload);
            var status = false
            var count = this.cart
      
            if(payload.product.discount>0){
              payload.product.harga = payload.discount
              payload.product.total = payload.discount
            }
            else{
              payload.product.harga = payload.product.price
              payload.product.total = payload.product.price
            }
      
            for( var i = 0; i < count.length; i++){
              if( this.cart[i]._id ==  payload.product._id ){
                  payload.product.qty += 1
                  this.total += payload.product.total
                  this.cart.push(payload.product)
                  this.cart.splice(count.length-1,1)
                  this.count = this.cart.length
                  status = true    
              }
            }
            if(!status){
              payload.product.qty = 1
              this.total += payload.product.total
              this.cart.push(payload.product)
              this.count = this.cart.length     
            }
            
        },
        Checkout(){
            var token = localStorage.getItem('token')
            axios.get('http://localhost:3000/verify',{
                headers:{token:token}
            })
            .then(result =>{
                axios.post('http://localhost:3000/transactions/add',{
                email: result.data.email,
                total: this.total
                })
                .then(trans =>{
                this.count = 0
                this.cart = []
                this.total = 0
                swal("", "You success checkout!", "success")
                })
                .catch(err=>{
                    console.log(err);
                })
            })
            .catch( err=>{
                console.log(err);
            })
        },
        valueEdit(product){
            this.type = product.type
            this.brand = product.brand
            this.price = product.price
            this.category = product.category
            this.discount = product.discount
            this.url = product.url
            this.idPro = product._id
        },
        valAdd(){
          this.type = ''
          this.brand = ''
          this.price = 0
          this.category = ''
          this.discount = 0
          this.img = ''
        },
        Edit(){
            if(!this.discount || this.discount>100 || this.discount<0){
              this.discount=0
            }
            if(this.img){
              let formData = new FormData()
              formData.append('image',this.img)
              axios.post('http://localhost:3000/upload',formData)
              .then(result=>{
                console.log("success upload to bucket");
                this.url = result.data.link
              })
              .catch(err=>{
                console.log(err);
                
              })
            }
            axios.put(`http://localhost:3000/items/edit/${this.idPro}`,{
              type : this.type,
              brand : this.brand,
              price : this.price,
              category : this.category,
              discount : this.discount,
              url : this.url,
            })
            .then(product=>{
                this.type = ''
                this.brand = ''
                this.price = 0
                this.category = ''
                this.discount = 0
                this.img = ''
                swal("", "You success edit a product!", "success")
                .then(value=>{
                  this.getProduct()                   
                })
                .catch(err=>{
                    console.log(err);
                }) 
              console.log('success add to database');
            })
            .catch(err=>{
              console.log(err);
            }) 
        },
        Delete(id){
            axios.delete(`http://localhost:3000/items/delete/${id}`)
            .then( delpro =>{
                console.log(delpro);
                this.getProduct()                   
            })
            .catch( err =>{
                console.log(err);
            })
        },
        deleteItem(item){
            this.total -= Number(item.harga)
            var status = false
            for(var i = 0; i < this.cart.length; i++){
              if(this.cart[i]._id==item._id){
                if(this.cart[i].qty<=1){
                  this.cart.splice(i,1)
                  status = true;
                }
                else{
                  this.cart[i].qty -= 1
                  status = true;
                }
              }
            }
            if(!status){
              item.qty = 0
              // console.log(this.cart);
              
              this.cart.push(item)
            }
            else{
              // console.log(this.cart);
            }
        },
        addItem(item){
            this.total += Number(item.harga)
            for(var i = 0; i < this.cart.length; i++){
                if(this.cart[i]._id==item._id){
                    this.cart[i].qty += 1
                }
            }
        }
    }
  })
  