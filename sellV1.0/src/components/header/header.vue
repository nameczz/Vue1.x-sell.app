<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img width="64px" height="64px" :src="seller.avatar">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name"  @click="showDetail">{{ seller.name }}</span>
				</div>
				<div class="description" >
					{{ seller.description }}/{{ seller.deliveryTime }}
				</div>
				<div v-if='seller.supports' class="supports"  @click="showDetail">
					<icon :index='seller.supports[0].type'></icon>
					<span class="text">{{ seller.supports[0].description }}</span>
				</div>
			</div>
			<div v-if='seller.supports' class="supports-num" @click="showDetail">
				<span class="num">{{ seller.supports.length }}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="icon"></span>
			<span class="bulletin-text">{{ seller.bulletin }} </span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="bg-bottom">
			<img width="100%" height="100%" :src="seller.avatar" >
		</div>
		<div class="detail" v-show='detailShow' transition='fade'>
			<div class="detail-wrapper clearfix">
				<div class="detail-main">
					<h1 class="detail-title">{{ seller.name }}</h1>
<!-- 					starwrapper提供star组件的边距，保证star的灵活性
 -->				<div class="star-wrapper">
						<star :size="48" :score="seller.score"></star>
					</div>
					<line :text='"优惠信息"'></line>
					<ul class="supports" v-if="seller.supports">
						<li v-for="item in seller.supports" class="support-item">
							<icon :index='item.type'></icon>
							<span class="text" >{{ item.description }}</span>
						</li>
					</ul>
					<line :text='"商家公告"'></line>
					<div class="bulletin">
						<p class="text">{{ seller.bulletin }}</p>
					</div>
				</div>
			</div>
			<div class="detail-footer" @click="closeDetail">
				<i class="icon-close" ></i>
			</div>
		</div>
	</div>
</template>

<script>
 	import star from 'components/star/star.vue';
 	import line from 'components/line/line.vue';
 	import icon from 'components/icon/icon.vue';

	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data () {
			return {
				detailShow: false
			};
		},
		methods: {
			showDetail () {
				this.detailShow = true;
			},
			closeDetail () {
				this.detailShow = false;
			}
		},
		components: {
			'star': star,
			'line': line,
			'icon': icon
		}
	};

</script>

<style lang="stylus" rel='stylesheet/stylus'>
	@import "../../common/stylus/mixin.styl"

	.header
		color: #fff
		position: relative
		overflow: hidden
		background: rgba(7,17,27,0.5)
		.content-wrapper
			position: relative
			padding: 24px 12px 18px 24px
			font-size: 0	
			.avatar
				display: inline-block
				img
					border-radius: 2px				
			.content
				display: inline-block
				vertical-align: top
				margin-left:16px
				.title
					margin: 2px 0 8px 0
					.brand
						display: inline-block
						width: 30px
						height: 18px
						bg-image("brand")
						background-size: 30px 18px
						background-repeat: no-repeat
					.name
						margin-left: 6px
						vertical-align: top
						font-size: 16px
						line-height: 18px
						font-weight: blod
				.description
					font-size: 12px
					line-height: 12px
				.supports
					margin: 10px 0 2px 0
					.icon
						width: 12px
						height: 12px
						background-size: 12px 12px
					.text
						margin-left: 4px
						vertical-align: top
						font-size: 10px
						line-height: 12px
			.supports-num
				position: absolute
				right: 12px
				bottom: 13px
				padding: 0 8px
				height 24px
				line-height: 24px
				border-radius: 14px
				background: rgba(0,0,0,0.2)
				text-align: center
				.num
					vertical-align: top
					font-size: 10px
				.icon-keyboard_arrow_right
					margin-left: 2px
					font-size: 10px
					line-height: 24px
		.bulletin-wrapper
			position: relative
			height: 28px
			line-height: 28px
			padding: 0 22px 0 12px
			background: rgba(7,17,27,0.2)
			white-space: nowrap
			overflow: hidden
			text-overflow: ellipsis
			.icon
				display: inline-block
				width: 22px
				height: 12px
				bg-image('bulletin')
				background-size: 22px 12px
				background-repeat: no-repeat
			.bulletin-text
				font-size: 10px
				margin: 0 4px 0 4px
				vertical-align: top
			.icon-keyboard_arrow_right
				position: absolute
				right: 12px
				font-size: 10px
				line-height: 28px
		.bg-bottom
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%
			z-index: -1
			filter: blur(10px)
		.detail
			position: fixed
			top: 0
			left: 0
			width: 100%
			height: 100%
			z-index: 300
			overflow: auto
			transition: all 0.5s
			backdrop-filter: blur(10px)
			&.fade-transition
				opacity: 1
				background: rgba(7, 17, 27, 0.8)
			&.fade-enter,&.fade-leave
				opacity:0
				background: rgba(7, 17, 27, 0)
			.detail-wrapper
				min-height: 100%
				width: 100%
				.detail-main
					margin-top: 64px
					padding-bottom: 64px
					.detail-title
						font-size: 16px
						text-align: center
						line-height: 16px
						font-weight: 700
					.star-wrapper
						margin-top: 16px
						padding: 2px 0
						text-align: center
					.supports
						width: 80%
						margin: 0 auto
						.support-item
							margin-bottom: 12px
							padding: 0 12px
							font-size:0
							.icon
								margin-right: 6px
								width: 16px
								height: 16px
								background-size: 16px 16px
							.text
								vertical-align: top
								font-size: 12px
								line-height:12px
							&:last-child
								margin-bottom: 28px
					.bulletin
						width: 80%
						margin: 24px auto auto auto
						line-height: 24px
						.text
							padding: 0 12px
							font-size:12px	
			.detail-footer
				//position:relative
				margin: -64px auto 0 auto
				width: 32px
				height: 32px
				clear: both
				font-size: 32px
					
					
				
					
</style>