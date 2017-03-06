<template>
	<span class="icon" :class="classMap[index]"></span>
</template>

<script type="text/ecmascript-6">
	export default{
		props: {
			index: {
				type: Number
			}
		},
		created () {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		}
	};
</script>

<style lang="stylus" rel='stylesheet/stylus'>
	@import "../../common/stylus/mixin.styl"

	.icon
		display:inline-block
		background-repeat: no-repeat
		vertical-align: top
		&.decrease
			bg-image('decrease_1')
		&.discount
			bg-image('discount_1')
		&.guarantee
			bg-image('guarantee_1')
		&.invoice
			bg-image('invoice_1')
		&.special
			bg-image('special_1')
</style>