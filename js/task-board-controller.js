var TB = (function(module) {
	var Service = module.Service;

	var Controller = function(_model, _serverUrl, _toggleStyleMap, _tag) {
		var self = this;

		var WAIT_BETWEEN_REFRESH = 3000;

		this.init = function() {
			this.model = _model;
			this.service = new Service(_serverUrl, _tag, this.applyChanges);
			this.toggleStyleMap = _toggleStyleMap;

			this.refresh();
			this.startAutoRefresh();
		};

		this.startAutoRefresh = function() {
			this.autoRefreshIntervalId = setInterval(this.refresh, WAIT_BETWEEN_REFRESH);
		};

		this.stopAutoRefresh = function() {
			clearInterval(this.autoRefreshIntervalId);
			this.autoRefreshIntervalId = undefined;
		};

		this.refresh = function() {
			self.service.getLatestChanges();
		};

		this.applyChanges = function(changes) {
			for (var i = 0; i < changes.length; i++) {
				if (changes[i].action == "add") {
					self.model.addTask(changes[i].task);
				}
				else if (changes[i].action == "update") {
					self.model.updateTask(changes[i].task);
				}
				else if (changes[i].action == "delete") {
					self.model.deleteTask(changes[i].task);
				}
			}
		};

		this.newTask = function(style) {
			this.service.newTask(style);
		};

		this.toggleTaskStyle = function(task) {
			task.style = this.toggleStyleMap[task.style];
			this.updateTask(task);
		};

		this.updateTask = function(task) {
			this.service.updateTask(task);
		};

		this.moveTaskLeft = function(task) {
			this.service.moveTaskLeft(task);
		};

		this.moveTaskRight = function(task) {
			this.service.moveTaskRight(task);
		};

		this.deleteTask = function(taskId) {
			this.service.deleteTask(taskId);
		};

		this.moveTask = function(taskId, toColumnIndex) {
			var task;

			task = this.model.getTask(taskId);
			if (task.columnIndex != toColumnIndex) {
				task.columnIndex = toColumnIndex;
				this.service.updateTask(task);
			}
		};

		this.init();
	};

	module.Controller = Controller;

	return module;
}(TB || {}));
