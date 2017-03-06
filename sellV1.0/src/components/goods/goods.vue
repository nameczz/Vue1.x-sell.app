<template>
	<div class="goods">
		<div class="menu-wrapper" v-el:menu-wrapper>
			<ul >
				<li v-for="item in goods" class="menu-item" :class="{'current': currentIndex === $index}" @click="selectMenu($index,$event)">
					<p>{{ currentIndex }}</p>
					<span class="title border-1px">
						<icon v-show="item.type>0" :index="item.type"></icon>{{ item.name }}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" v-el:foods-wrapper>
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{ item.name }}</h1>
					<ul>
						<li @click="selectedFood(food, $event)" v-for="food in item.foods" class="food-item">
							<div class="icon">
								<img width="57" height="57" :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name">{{ food.name }}</h2>
								<p class="description">{{ food.description }}</p>
								<div class="extra">
									<span class="count">月售{{ food.sellCount }}份</span>
									<span>好评率{{ food.rating }}%</span>
								</div>
								<price :food="food"></price>
								<div class="cartControl-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods" v-ref:shopcart></shopcart>
	</div>
	<food :food="selectFood" v-ref:food></food>
</template>

<script>
	const ERROK = 0;

	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import shopcart from 'components/shopcart/shopcart';
	import icon from 'components/icon/icon';
	import BScroll from 'better-scroll';
	import price from 'components/price/price';
	import food from 'components/food/food';

	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data () {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0,
				selectFood: {}
			};
		},
		computed: {
			currentIndex () {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					var num = i;
					if (this.scrollY >= height1 && this.scrollY < height2 - 20) {
						return num;
					} else if (this.scrollY >= height2 - 20 && this.scrollY < height2) {
						return i + 1;
					} else if (!height2) {
						return this.listHeight.length;
					}
				}
				return 0;
			},
			selectFoods () {
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count) {
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		created () {
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERROK) {
					this.goods = response.data;
					this.$nextTick(() => {
						this._initScroll();
						this._calculateHeight();
					});
				};
			});
		},
		methods: {
			_initScroll () {
				this.menuScroll = new BScroll(this.$els.menuWrapper, {
					click: true
				});

				this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
					click: true,
					probeType: 3
				});

				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			_calculateHeight () {
				let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			selectMenu (index, event) {
				if (!event._constructed) {
					return;
				}
				let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				this.foodsScroll.scrollToElement(el, 800);
			},
			_drop (target) {
				this.$nextTick(() => {
					this.$refs.shopcart.drop(target);
				});
			},
			selectedFood (food, event) {
				if (!event._constructed) {
					return;
				}
				this.selectFood = food;
				this.$refs.food.show();
			}
		},
		components: {
			'icon': icon,
			'shopcart': shopcart,
			'cartcontrol': cartcontrol,
			'price': price,
			'food': food
		},
		events: {
			'cart.add' (target) {
				this._drop(target);
			}
		}
	};
</script>

<style lang="stylus" rel='stylesheet/stylus'>
	@import "../../common/stylus/mixin.styl"

	.goods
		display: flex
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px
			width: 80px
			background: #f3f5f7
			.menu-item
				display:table
				width: 56px
				height: 54px
				line-height: 14px
				font-size: 0
				padding: 0 12px
				&.current
					position: relative
					z-index: 12
					margin-top: -1px
					font-weight: 700
					background: #fff
					.title
						border-none()
				.title
					display: table-cell
					width:56px
					vertical-align: middle
					font-size:12px
					border-1px(rgba(7,17,27,0.1))
				.icon
					width: 12px
					height: 12px
					background-size: 12px 12px
		.foods-wrapper
			flex:1
			.title
				padding-left: 14px
				height: 26px
				background: #f3f5f7
				font-size: 12px
				color: rgb(147, 153, 159)
				line-height: 26px
				border-left: 2px solid #d9dde1
			.food-item
				display: flex
				padding: 18px
				font-size: 0
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border-none()
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex: 1
					margin-left: 10px
					vertical-align: top
					padding-top: 2px
					.name
						font-size:14px
						line-height: 14px
						color: rgb(7,17,27)
						margin-bottom: 8px
					.description,.extra
						font-size: 10px
						color: rgb(147,153,159)
						line-height: 10px
					.description
						margin-bottom: 8px
					.extra
						font-size: 10px
						color: rgb(147,153,159)
						line-height: 10px
						.count
							margin-right: 12px
					.cartControl-wrapper
						position: absolute
						right: 0
						bottom: 12px
</style> 