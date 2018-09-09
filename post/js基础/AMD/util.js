define(function() {
	var util = {
		getFormatDate: function(date, type) {
			if (type === 1) {
				return '2017-06-20'
			}
			if (type === 2) {
				return '2017年6月20日'
			}
		}
	}
	return util
})