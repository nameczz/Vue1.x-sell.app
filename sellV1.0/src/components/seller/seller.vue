<template>
	<div class="seller" v-el:seller>
		<!-- better-scroll需要2个层 -->
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{ seller.name }}</h1>
				<div class="desc border-1px">
					<star :size="36" :score="seller.score" class="star"></star>
					<span class="ratingCount">({{ seller.ratingCount }})</span>
					<span class="sellCount">月售{{ seller.sellCount }}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="number">{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="number">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="number">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite" @click="toggleFavorite">
					<span class="icon-favorite" :class="{'active':favorite}"></span>
					<span class="test">{{ favoriteTest }}</span>
				</div>
			</div>
			<division></division>
			<div class="bulletin">
				<div class="content">
					<h2>公告与活动</h2>
					<p class="text">{{ seller.bulletin }}</p>
				</div>
				<ul>
					<li v-for="support in seller.supports" class="support">
						<icon :index="support.type" class="icon"></icon>
						<span class="text">{{ support.description }}</span>
					</li>
				</ul>
			</div>
			<division></division>
			<div class="pics">
				<h2 class="title">商家实景</h2>
				<div class="pic-wrapper" v-el:pic-wrapper>
					<ul class="pic-list" v-el:pic-list>
						<li class="pic-item" v-for="pic in seller.pics">
							<img :src="pic" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<division></division>
			<div class="infos">
				<h2 class="title">商家信息</h2>
				<ul>
					<li v-for="info in seller.infos" class="info">
						{{ info }}
					</li>
				</ul>
			</div>
			<shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		</div>
	</div>
</template>

<script>
	import star from 'components/star/star';
	import division from 'components/division/division';
	import icon from 'components/icon/icon';
	import shopcart from 'components/shopcart/shopcart';
	import BScroll from 'better-scroll';
	import {saveToLocal, loadFromLocal} from 'common/js/store';

	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data () {
			return {
				favorite: (() => {
					return loadFromLocal(this.seller.id, 'favorite', false);
				})()
			};
		},
		computed: {
			favoriteTest () {
				return this.favorite ? '已收藏' : '收藏';
			}
		},
		watch: {
			'seller' () {
				this._initScroll();
				this._initPics();
			}
		},
		ready () {
			this._initScroll();
			this._initPics();
		},
		methods: {
			_initScroll () {
				if (!this.sellerScroll) {
					this.sellerScroll = new BScroll(this.$els.seller, {
						click: true
					});
				} else {
					this.sellerScroll.refresh();
				}
			},
			_initPics () {
				if (this.seller.pics) {
					let picWidth = 120;
					let	margin = 6;
					let width = (picWidth + margin) * this.seller.pics.length - margin;
					this.$els.picList.style.width = width + 'px';
					this.$nextTick(() => {
						if (!this.picScroll) {
							this.picScroll = new BScroll(this.$els.picWrapper, {
								scrollX: true,
								eventPassthrough: 'vertical'
							});
						} else {
							this.picScroll.refresh();
						}
					});
				}
			},
			toggleFavorite (event) {
				if (!event._constructed) {
					return;
				}
				this.favorite = !this.favorite;
				saveToLocal(this.seller.id, 'favorite', this.favorite);
			}
		},
		components: {
			'star': star,
			'division': division,
			'icon': icon,
			'shopcart': shopcart
		}
	};
</script>

<style lang="stylus" rel='stylesheet/stylus'>
	@import '../../common/stylus/mixin.styl'

	.seller
		position: absolute
		top: 174px
		left: 0
		bottom: 0
		width: 100%
		overflow: hidden
		.overview
			padding: 18px
			.title
				font-size: 14px
				color: rgb(7, 17, 27)
				line-height: 14px
				margin-bottom: 8px
			.desc
				padding-bottom: 18px
				font-size: 0
				border-1px(rgba(7, 17, 27, 0.1))
				.star
					display: inline-block
					margin-right: 8px
					vertical-align: top
				.ratingCount,.sellCount
					display: inline-block
					font-size: 10px
					color: rgb(77, 85, 93)
					line-height: 18px
					vertical-align: top
				.ratingCount
					display: inline-block
					margin-right:12px
			.remark
				display: flex
				padding-top: 18px
				.block
					flex: 1
					text-align: center
					border-right: 1px solid rgba(7, 17, 27, 0.1)
					&:last-child
						border-right: none
					h2
						margin-bottom: 4px
						font-size: 1px
						color: rgb(147, 153, 159)
						line-height: 10px
					.content
						font-size: 10px
						color: rgb(7, 17, 27)
						line-height: 24px
						.number
							font-size: 24px
			.favorite
				position: absolute
				width: 50px
				right: 11px 
				top: 18px
				text-align: center
				.icon-favorite
					display: block
					margin-bottom: 4px
					font-size: 24px
					line-height: 24px
					color: #d4d6d9
					&.active
						color: rgb(240, 20, 20)
				.text
					line-height: 10px
					font-size: 10px
		.bulletin
			padding: 0 18px
			.content
				padding: 18px 12px 16px 12px
				h2
					margin-bottom: 8px
					font-size: 14px
					color: rgb(7, 17, 27)
					line-height: 14px
				.text
					font-size: 12px
					color: rgb(240, 20, 20)
					line-height: 24px
			.support
				padding: 16px 12px
				border-top: 1px solid rgba(7, 17, 27, 0.1)
				.icon
					margin-right: 6px
					width: 16px
					height: 16px
					background-size: 16px 16px
					background-repeat: no-repeat
				.text
					display: inline-block
					font-size: 12px
					color: rgb(7, 17, 27)
					line-height: 16px
					vertical-align: top
		.pics
			padding: 18px
			.title
				margin-bottom: 12px
				font-size: 14px
				color: rgb(7, 17, 27)
				line-height: 14px
			.pic-wrapper
				width: 100%
				overflow:hidden
				white-space: nowrap
				.pic-list
					font-size: 0
					.pic-item
						display: inline-block
						margin-right: 6px
						width: 120px 
						height: 90px
						&:last-child
							margin-righ: 0
		.infos
			padding: 18px
			.title
				margin-bottom: 12px
				font-size: 14px
				color: rgb(7, 17, 27)
				line-height: 14px
			.info
				padding: 16px 12px
				font-size: 12px 
				color: rgb(7, 17, 27)
				line-height: 16px
				border-top: 1px solid rgba(7, 17, 27, 0.1)	

							
</style>