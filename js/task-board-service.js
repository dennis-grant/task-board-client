var TB = (function(module) {
	var Service = function(_serverUrl, _tag, _processRequestResultFunc) {
		var self = this;

		var CMD_GET_LATEST_CHANGES	= "getLatestChanges";
		var CMD_NEW_TASK			= "newTask";
		var CMD_UPDATE_TASK			= "updateTask";
		var CMD_MOVE_TASK_LEFT		= "moveTaskLeft";
		var CMD_MOVE_TASK_RIGHT		= "moveTaskRight";
		var CMD_DELETE_TASK			= "deleteTask";

		this.init = function() {
			this.latestChangeIdReceived = 0;
			this.serverUrl = _serverUrl;
			this.tag = _tag;
			this.processRequestResultFunc = _processRequestResultFunc;
		};

		this.getLatestChanges = function() {
			this.execute(CMD_GET_LATEST_CHANGES, {});
		};

		this.newTask = function(style) {
			this.execute(CMD_NEW_TASK, {style: style});
		};

		this.updateTask = function(task) {
			this.execute(CMD_UPDATE_TASK, task);
		};

		this.moveTaskLeft = function(task) {
			this.execute(CMD_MOVE_TASK_LEFT, task);
		};

		this.moveTaskRight = function(task) {
			this.execute(CMD_MOVE_TASK_RIGHT, task);
		};

		this.deleteTask = function(taskId) {
			this.execute(CMD_DELETE_TASK, {taskId: taskId});
		};

		this.execute = function(cmd, params) {
			params.cmd = cmd;
			params.latestChangeIdReceived = this.latestChangeIdReceived;
			params.tag = this.tag;
			$.get(this.serverUrl, params, this.executeDone);
		};

		this.executeDone = function(responseText) {
			var result;

			result = eval( "(" + responseText + ")" );
			if (result.length > 0) {
				self.latestChangeIdReceived = result[result.length - 1].changeId;
			}
			self.processRequestResultFunc(result);
		};

		this.init();
	};

	module.Service = Service;

	return module;
}(TB || {}));
