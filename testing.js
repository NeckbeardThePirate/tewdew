document.addEventListener('alpine:init', () => {
	Alpine.data('myTitle', () => ({
		msg: 'Initial Message',

		changeMsg() {
			this.msg = 'Allo Govna'
		}
	}))
})