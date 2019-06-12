<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span slot="bread">Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a @click="sortGoods"
              href="javascript:void(0)" class="price">
              Price
              <svg class="icon icon-arrow-short">
                <use xlink:href="#icon-arrow-short"></use>
              </svg>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" :class="{'filterby-show':filterBy}" id="filter">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd>
                  <a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur':priceChecked == 'all'}" >All</a>
                </dd>
                <dd v-for="(price,index) in priceFilter" :key="index" >
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked == index }">{{price.startPrice+" - "+price.endPrice}}</a>
                </dd>
              </dl>
            </div>


            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList" :key="index">
                    <div class="pic">
                      <a href="#">
                        <img :src="'/static/'+item.prodcutImg" alt="">
                        </a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;"  @click="addCart(item.productId)" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" class="load-more" infinite-scroll-distance="20">
                    <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
    import "../assets/css/base.css"
    import "../assets/css/product.css"
    import NavHeader from "../components/NavHeader"
    import NavFooter from "../components/NavFooter"
    import NavBread from "../components/NavBread"

    import axios from "axios"
    export default{
        data(){
            return {
                goodsList:[],
                priceFilter:[
                  {
                    startPrice:'0.00',
                    endPrice:"500.00"
                  },
                  {
                    startPrice:'500.00',
                    endPrice:"1000.00"
                  },
                  {
                    startPrice:'1000.00',
                    endPrice:"2000.00"
                  }
                ],
                priceChecked:"all",
                filterBy:false,
                overLayFlag:false,
                sortFlag:1,
                page:1,
                pageSize:8,
                busy:true,
                loading:false

            }
        },
        mounted(){
          this.getCoodsList()
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread
        },
        methods:{
          getCoodsList(flag){
            var params = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1,
              priceLevel:this.priceChecked
            }
            this.loading = true;
            axios.get("/goods",{
              params:params
            }).then((data) => {
              let res = data.data;
              this.loading = false;
              if(res.status == "0"){
                if(flag){
                  this.goodsList = this.goodsList.concat(res.result.list);
                  if(res.result.count = 0){
                    this.busy = true;
                  }else{
                    this.busy = false;
                  }
                }else{
                  this.goodsList = res.result.list;
                  this.busy = false;
                }
              }else{
                this.goodsList = [];
              }
            })
          },
          showFilterPop(){
            this.filterBy=true
            this.overLayFlag=true
          },
          closePop(){
            this.filterBy=false
            this.overLayFlag=false
          },
          setPriceFilter(index){
            this.priceChecked = index;
            this.page = 1;
            this.getCoodsList()
            this.closePop()
          },
          sortGoods() {
            this.sortFlag = !this.sortFlag
            this.page = 1;
            this.getCoodsList()
          },
          loadMore(){
            this.busy = true;
            setTimeout(() => {
              this.page ++;
              this.busy = false;
              this.getCoodsList(true)
            }, 1000);
          },
          addCart(productId){
            axios.post("/goods/addCart",{
              productId:productId
            }).then((res) => {
              console.log(res)
              if(res.data.status == 0){
                alert("加入成功")
              }else{
                alert("加入失败"+res.msg)
              }
            })
          }
        }
    }
</script>

<style>
.load-more{
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>

