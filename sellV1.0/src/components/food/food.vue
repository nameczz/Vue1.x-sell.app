<template>
	<div v-show="showPage" class="food" transition="move" v-el:food>
		<div class="food-content">
			<div class="img-header">
				<img :src="food.image" >
				<i class="icon-arrow_lift" @click="hide"></i>
			</div>
			<div class="title-wrapper">
				<div class="title">{{ food.name }}</div>
				<div class="detail">
					<span class="sell">月售{{ food.sellCount }}份</span>
					<span class="rating">好评率{{ food.rating }}%</span>
				</div>
				<price :food='food'></price>
				<div class="cartcontrol-wrapper">
					<cartcontrol :food="food"></cartcontrol>
				</div>
				<div @click="addFirst" transition='fade' class="buy" v-show="!food.count || food.count===0">加入购物车</div>
			</div>
			<division></division>
			<div class="food-desc">
				<h1 class="desc">商品介绍</h1>
				<p class="info" v-if="food.info">
					{{ food.info }}
				</p>
				<p class="info" v-else="food.info">
					该商品无详情介绍
				</p>
			</div>
			<division></division>
			<div class="rating">
				<h1 class="title">商品评价</h1>
				<ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
				<div class="rating-wrapper">
					<ul v-if="food.ratings && food.ratings.length">
						<li v-for="rating in food.ratings" class="rating-item border-1px" v-show="needShow(rating.rateType, rating.text)">
							<div class="user">
								<span class="name">{{rating.username}}</span>
								<img class="avatar" width="12" height="12" :src="rating.avatar">
							</div>
							<div class="time">{{rating.rateTime | formatDate}}</div>
							<p class="text" >
								<span :class="{'icon-thumb_up':rating.rateType===1,'icon-thumb_down':rating.rateType===0}"></span>{{rating.text}}
							</p>
						</li>
					</ul>
					<div class="no-rating" v-else>暂无评价</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import price from 'components/price/price';
	import division from 'components/division/division';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import ratingselect from 'components/ratingselect/ratingselect';
	import BScroll from 'better-scroll';
	import Vue from 'vue';
	import {formatDate} from 'common/js/date';

	const ALL = 2;

	export default{
		props: {
			food: {
				type: Object
			}
		},
		data () {
			return {
				showPage: false,
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			};
		},
		filters: {
			formatDate (time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		},
		methods: {
			show () {
				this.showPage = true;
				this.selectType = ALL;
				this.onlyContent = true;

				this.$nextTick(() => {
					if (!this.foodScroll) {
						this.foodScroll = new BScroll(this.$els.food, {
							click: true
						});
					} else {
						this.foodScroll.refresh();
					}
				});
			},
			hide () {
				this.showPage = false;
			},
			addFirst (event) {
				console.log(1);
				if (!event._constructed) {
					return;
				}
				this.$dispatch('cart.add', event.target);
				Vue.set(this.food, 'count', 1);
			},
			needShow (type, text) {
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				} else {
					return type === this.selectType;
				}
			}
		},
		components: {
			'price': price,
			'division': division,
			'cartcontrol': cartcontrol,
			'ratingselect': ratingselect
		},
		events: {
			'ratingtype.select' (type) {
				this.selectType = type;
				this.$nextTick(() => {
					this.foodScroll.refresh();
				});
			},
			'content.toggle' (show) {
				this.onlyContent = show;
				this.$nextTick(() => {
					this.foodScroll.refresh();
				});
			}
		}
	};
</script>

<style lang="stylus" rel='stylesheet/stylus'>
	@import "../../common/stylus/mixin.styl"

	.food
		position: fixed
		left: 0
		top: 0
		bottom: 48px
		z-index: 20
		width: 100%
		background: #fff
		&.move-transition
			transition: all 0.5s linear
			transform: translate3d(0, 0, 0)
		&.move-enter,&.move-leave
			transform: translate3d(100%, 0, 0)
		.img-header
			position: relative
			width: 100%
			height: 0
			padding-top: 100%
			img
				position: absolute
				left: 0
				top: 0
				width: 100%
				height: 100%
			.icon-arrow_lift
				position: absolute
				left: 10px
				top: 10px
				color: #999
				font-size: 20px
				padding: 10px
		.title-wrapper
			position: relative
			padding: 18px
			.title
				margin-bottom: 8px
				font-size: 14px
				color: rgb(7, 17, 27)
				line-height: 14px
			.detail
				font-size: 0
				.sell,.rating
					display: inline-block
					margin-bottom: 18px
					font-size: 10px
					color: rgb(147, 153, 159)
					line-height: 10px
				.sell
					margin-right: 12px
			.cartcontrol-wrapper
				position: absolute
				bottom: 12px
				right: 12px
			.buy
				position: absolute
				bottom: 18px
				right: 18px
				width: 74px
				height: 24px
				border-radius: 12px
				font-size: 10px
				padding: 6px
				box-sizing: border-box
				color: rgb(255, 255, 255)
				line-height: 12px
				background: rgb(0, 160, 220)
				&.fade-transition
					transition: all .4s linear
					opacity: 1 
				&.fade-enter,&.fade-leave
					opacity: 0
		.food-desc
			padding: 18px
			.desc
				margin-bottom: 6px
			.info
				padding: 0 8px
				font-size: 12px 
				font-weight: 200
				color: rgb(77, 85, 93)
				line-height: 24px
		.rating
			padding-top: 18px
			.title
				line-height: 14px
				margin-left: 18px
				font-size: 14px
				color: rgb(7, 17, 27)
			.rating-wrapper
				padding: 0px 18px
				.rating-item
					position: relative
					padding: 16px 0
					border-1px(rgba(7, 17, 27, 0.1))
					.user
						position: absolute
						right: 0
						top: 16px
						font-size: 0
						line-height: 12px
						.name
							display: inline-block
							font-size: 10px
							color: rgb(147, 153, 159)
							margin-right: 6px
							vertical-align: top
						.avatar
							border-radius: 50%
				.time
					margin-bottom: 6px
					font-size: 10px 
					line-height: 12px 
					color: rgb(147, 153, 159)
				.text
					line-height: 16px
					font-size: 12px
					color: rgb(7, 17, 27)
					.icon-thumb_down,.icon-thumb_up
						margin-right: 4px
						line-height: 16px
						font-size: 12px
					.icon-thumb_up
						color: rgb(0, 160, 220)
					.icon-thumb_down
						color: rgb(147, 153, 159)
				.no-rating
					padding: 16px 0 
					font-size: 12px
					color: rgb(147, 153, 159)
					
</style>