<template>
	<div class="shopcart">
		<div class="content">
			<div class="content-left" @click="showFold">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highLight':totalCount > 0}">
						<i class="icon-shopping_cart" :class="{'highLight':totalCount > 0}"></i>
					</div>
					<div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
				</div>
				<div class="price" :class="{'highLight':totalPrice > 0}">￥{{ totalPrice }}</div>
				<div class="delivery">
					另需配送费￥{{ deliveryPrice }}元
				</div>
			</div>
			<div class="content-right">
				<div class="pay" :class="payClass" @click="payMoney">
					{{ pay }}
				</div>
			</div>
		</div>
		<div class="ball-wrapper">
			<div v-for="ball in balls" transition="drop" v-show="ball.show" class="ball">
				<div class="inner inner-hook"></div>
			</div>
		</div>
		<div class="shop-list" v-show="listShow" transition="fold">
			<div class="list-header">
				<h1 class="cart">购物车</h1>
				<span class="empty" @click="emptyCart">清空</span>
			</div>
			<div class="list-content" v-el:list-content >
				<ul>
					<li v-for="food in selectFoods" class="food">
						<span class="name">{{ food.name }}</span>
						<div class="price">
							<span>{{ food.price * food.count }}</span>
						</div>
						<div class="cartcontrol-wrapper">
							<cartcontrol :food="food"></cartcontrol>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="list-mask" v-show="listShow" transition="mask" @click="hideFlod"></div>
	</div>
</template>

<script >
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import BScroll from 'better-scroll';

	export default{
		props: {
			selectFoods: {
				type: Array,
				default () {
					return [
						{
							price: 20,
							count: 1
						}
					];
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data () {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBalls: [],
				fold: true
			};
		},
		computed: {
			totalPrice () {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			totalCount () {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.count;
				});
				return total;
			},
			pay () {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}起送`;
				} else if (this.totalPrice < this.minPrice) {
					return `还差￥${this.minPrice - this.totalPrice}起送`;
				} else {
					return '去结算';
				}
			},
			payClass () {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			listShow () {
				if (!this.totalCount) {
					this.fold = true;
					return false;
				} else {
					this.$nextTick(() => {
						// 若不判断会一次增加多个count，点击事件添加了太多次
						if (!this.listScroll) {
							this.listScroll = new BScroll(this.$els.listContent, {
								click: true
							});
						} else {
							this.listScroll.refresh();
						}
					});
					return !this.fold;
				}
			}
		},
		methods: {
			drop (el) {
				for (var i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			showFold () {
				if (this.totalCount > 0) {
					this.fold = !this.fold;
				}
			},
			hideFlod () {
				this.fold = !this.fold;
			},
			initScroll () {
				this.listScroll = new BScroll(this.$els.listContent, {
					click: true
				});
			},
			emptyCart () {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			payMoney () {
				window.alert(`请支付${this.totalPrice}元`);
			}
		},
		transitions: {
			drop: {
				beforeEnter (el) {
					let len = this.balls.length;
					while (len--) {
						let ball = this.balls[len];
						if (ball.show) {
							let position = ball.el.getBoundingClientRect();
							let moveX = position.left - 32;
							let moveY = -(window.innerHeight - position.top - 22);
							el.style.display = '';
							el.style.transform = `translate3d(0,${moveY}px,0)`;
							el.style.webkitTransform = `translate3d(0,${moveY}px,0)`;
							let inner = el.getElementsByClassName('inner-hook')[0];
							inner.style.transform = `translate3d(${moveX}px,0,0)`;
							inner.style.webkitTransform = `translate3d(${moveX}px,0,0)`;
							console.log(inner.style.transform);
						}
					}
				},
				enter (el) {
					/* eslint-disable no-unused-vars*/
					let repanting = el.offsetHeight;
					this.$nextTick(() => {
						el.style.transform = 'translate3d(0, 0, 0)';
						el.style.webkitTransform = 'translate3d(0, 0, 0)';
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.transform = 'translate3d(0, 0, 0)';
						inner.style.webkitTransform = 'translate3d(0, 0, 0)';
					});
				},
				afterEnter (el) {
					let ball = this.dropBalls.shift();
					if (ball) {
						ball.show = false;
						el.style.display = 'none';
					}
				}
			}
		},
		components: {
			'cartcontrol': cartcontrol
		}
	};
</script>

<style lang="stylus" rel='stylesheet/stylus'>
	@import "../../common/stylus/mixin.styl"

	.shopcart
		position: fixed
		bottom: 0
		left: 0
		background: #000
		width: 100%
		height: 48px
		z-index: 100
		.content
			display: flex
			.content-left
				flex: 1
				font-size: 0
				background: #141d27
				.logo-wrapper
					display: inline-block
					position: relative
					top: -10px
					width: 58px
					height: 58px
					box-sizing: border-box
					margin: 0 18px
					padding: 6px 6px 8px 6px
					border-radius: 50%
					background: #141d27
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						background: #2b343c
						text-align: center
						&.highLight
							background: rgb(0,160,220)
						.icon-shopping_cart
							color: rgba(255, 255, 255, 0.4)
							font-size: 24px
							line-height: 44px
							&.highLight
								color: rgb(255,255,255)
					.num
						position: absolute
						top: 0
						right: 0
						width: 24px
						height: 16px
						line-height: 16px
						text-align: center
						border-radius: 16px
						box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
						font-size: 9px
						font-weight: 700
						color: rgb(255,255,255)
						background: rgb(240, 20, 20)
				.price
					display: inline-block
					vertical-align: top
					margin-top: 12px
					padding-right: 12px
					border-right: 1px solid rgba(255,255,255,0.1)
					font-size: 16px
					color: rgba(255, 255, 255, 0.4)
					font-weight: 700
					line-height: 24px
					&.highLight
						color: rgb(255,255,255)
				.delivery
					display: inline-block
					vertical-align: top
					margin: 12px 0 0 12px
					font-size: 10px
					color: rgba(255,255,255,0.4)
					font-weight: 700
					line-height: 24px				
			.content-right
				flex: 0 0 105px
				width: 105px
				.pay
					height: 48px
					line-height: 48px
					font-size: 12px
					color: rgba(255,255,255,0.4)
					font-weight: 700
					text-align: center
					&.not-enough
						background: #2b333b
					&.enough
						background: #00b43c
						color: rgb(255,255,255)
		.ball-wrapper
			.ball
				position: fixed
				bottom: 22px
				left: 32px
				z-index: 1000
				&.drop-transition
					transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
					.inner
						width: 16px
						height: 16px
						border-radius: 50%
						background: rgb(0, 160, 220)
						transition: all 0.4s linear
		.shop-list
			position: absolute
			left: 0
			top: 0
			width: 100%
			z-index: -1
			&.fold-transition
				transition: all 0.5s
				transform: translate3d(0, -100%, 0)
			&.fold-enter, &.fold-leave
				transform: translate3d(0, 0, 0)
			.list-header
				height: 40px
				line-height: 40px
				background: #f3f5f7
				padding: 0 18px
				border-bottom: 1px solid rgba(7, 17, 27, 0.1)
				.cart
					float: left
					font-size: 14px
					color: rgb(7, 17, 27)	
				.empty
					float:right
					font-size: 12px
					color: rgb(0, 160, 220)
			.list-content
				max-height: 217px
				background: #fff
				overflow: hidden
				padding: 0 18px
				.food
					position: relative
					padding: 12px 0
					font-size: 0
					// border-bottom: 1px solid rgba(7,17,27,0.1)
					border-1px(rgba(7,17,27,0.1))
					.name
						line-height: 24px
						font-size: 14px
						color: rgb(7, 17, 27)
					.price
						position: absolute
						right: 90px
						bottom: 12px
						font-size: 14px
						font-weight: 700
						color: rgb(240, 20, 20)
						line-height: 24px
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 6px
		.list-mask
			position: fixed
			top: 0
			left: 0
			width: 100%
			height: 100%			
			z-index: -2
			backdrop-filter: blur(10px)
			&.mask-transition
				transition: all 0.4s linear
				background: rgba(7,17,27,0.6)
				opacity: 1
			&.mask-enter,&.mask-leave
				background: rgba(7,17,27,0)
				opacity: 0
			
</style>