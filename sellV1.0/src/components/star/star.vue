<template>
	<div class="star-wrapper" :class="starType">
		<span v-for="itemclass in itemclasses" class="star-common" :class="itemclass" track-by="$index"></span>
	</div>
</template>

<script>
	const LENGTH = 5;
	const STAR_ON = 'on';
	const STAR_OFF = 'off';
	const STAR_HALF = 'half';

	export default {
		props: {
			size: {
				type: Number
			},
			score: {
				type: Number
			}
		},
		computed: {
			starType () {
				return 'star-' + this.size;
			},
			itemclasses () {
				let result = [];
				let score = Math.floor(this.score * 2) / 2;
				let hasDesmical = score % 1 !== 0;
				let interger = Math.floor(this.score);

				for (let i = 0; i < interger; i++) {
					result.push(STAR_ON);
				}

				if (hasDesmical) {
					result.push(STAR_HALF);
				}

				while (result.length < LENGTH) {
					result.push(STAR_OFF);
				}

				return result;
			}
		}
	};
</script>

<style lang="stylus" rel='stylesheet/stylus'>
	@import "../../common/stylus/mixin.styl"

	.star-wrapper
		font-size: 0
		.star-common
			display: inline-block
			background-repeat: no-repeat
		&.star-48
			.star-common
				width: 20px
				height: 20px
				margin-right: 22px
				background-size: 20px 20px
				&:last-child
					margin-right: 0
				&.on
					bg-image('star48_on')
				&.off
					bg-image('star48_off')
				&.half
					bg-image('star48_half')
		&.star-36
			.star-common
				width: 15px
				height: 15px
				margin-right: 6px
				background-size: 15px 15px
				&:last-child
					margin-right: 0
				&.on
					bg-image('star36_on')
				&.off
					bg-image('star36_off')
				&.half
					bg-image('star36_half')
		&.star-24
			.star-common
				width: 10px
				height: 10px
				margin-right: 3px
				background-size: 10px 10px
				&:last-child
					margin-right: 0
				&.on
					bg-image('star24_on')
				&.off
					bg-image('star24_off')
				&.half
					bg-image('star24_half')
</style>