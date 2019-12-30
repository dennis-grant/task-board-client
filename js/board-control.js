var TB = (function(module) {
	var EventBindable = DKG_UI.EventBindable;
	var ColumnControl = module.ColumnControl;

	var BoardControl = function(_model) {
		this.init = function() {
			var tmpColumnControl;
			var columnWidth;

			this.model = _model;
			this.createControlElement();

			columnWidth = Math.floor(this.model.width / this.model.columnsData.length());
			for (var i = 0; i < this.model.columnsData.length(); i++) {
				tmpColumnControl = new ColumnControl(this.model.columnsData.get(i), i + 1, columnWidth - 2);
				tmpColumnControl.getControlElement().css({
					width: columnWidth - 2,
					height: this.model.height - 2,
					position: "absolute",
					left: i * columnWidth, 
					top: 0
				});
				this.controlElement.append(tmpColumnControl.getControlElement());
			}

			EventBindable.mixin(this, this.controlElement);
		};

		this.createControlElement = function() {
			this.controlElement = $(this.toHTML());
			this.controlElement.css({
				width: this.model.width,
				height: this.model.height
			});
		};

		this.getControlElement = function() {
			return this.controlElement;
		};

		this.toHTML = function() {
			return "<div class='board-control'></div>";
		};

		this.init();
	};

	var BoardModel = function(_width, _height, _columnsData) {
		this.init = function() {
			this.width = _width;
			this.height = _height;
			this.columnsData = _columnsData;
			this.initTasksMap();
		};

		this.initTasksMap = function() {
			var tmpList;

			this.tasksMap = new Object();
			for (var i = 0; i < this.columnsData.length(); i++) {
				tmpList = this.columnsData.get(i).tasks;
				for (var j = 0; j < tmpList.length(); j++) {
					this.tasksMap[this.getTaskKey(tmpList.get(j))] = tmpList.get(j);
				}
			}
		};

		this.getTask = function(taskId) {
			var task;

			task = this.tasksMap[this.getTaskKey({taskId: taskId})];
			if (task != undefined) {
				task = {
					taskId: taskId,
					issueNumber: task.issueNumber,
					description: task.description,
					assignedTo: task.assignedTo,
					columnIndex: task.columnIndex,
					style: task.style
				};
			}

			return task;
		};

		this.updateTask = function(task) {
			var columnData;
			var taskIndex;
			var existingTask;

			existingTask = this.getTask(task.taskId);
			if (existingTask == undefined) {
				return;
			}

			if (existingTask.columnIndex != task.columnIndex) {
				this.moveTask(task);
			}
			else {
				columnData = this.getColumnData(task.columnIndex);
				if (columnData != undefined) {
					taskIndex = this.findTask(columnData.tasks, task);
					if (taskIndex > -1) {
						columnData.tasks.replace(taskIndex, task);
						this.tasksMap[this.getTaskKey(task)] = task;
					}
				}
			}
		};

		this.moveTask = function(task) {
			this.deleteTask(this.tasksMap[this.getTaskKey(task)]);
			this.addTask(task);
		};

		this.deleteTask = function(task) {
			var columnData;
			var taskIndex;

			task = this.getTask(task.taskId);
			if (task == undefined) {
				return;
			}

			columnData = this.getColumnData(task.columnIndex);
			if (columnData != undefined) {
				taskIndex = this.findTask(columnData.tasks, task);
				if (taskIndex > -1) {
					columnData.tasks.remove(taskIndex);
					delete this.tasksMap[this.getTaskKey(task)];
				}
			}
		};

		this.addTask = function(task) {
			var columnData;

			columnData = this.getColumnData(task.columnIndex);
			if (columnData != undefined) {
				columnData.tasks.add(task);
				this.tasksMap[this.getTaskKey(task)] = task;
			}
		};

		this.getTaskKey = function(task) {
			return "task" + task.taskId;
		};

		this.getColumnData = function(columnIndex) {
			var columnData;

			columnData = undefined;
			if (columnIndex >= 1 && columnIndex <= this.columnsData.length()) {
				columnData = this.columnsData.get(columnIndex - 1);
			}

			return columnData;
		};

		this.findTask = function(taskList, task) {
			var index;

			index = -1;
			for (var i = 0; i < taskList.length(); i++) {
				if (taskList.get(i).taskId == task.taskId) {
					index = i;
					break;
				}
			}

			return index;
		};

		this.init();
	};

	module.BoardControl = BoardControl;
	module.BoardModel = BoardModel;

	return module;
}(TB || {}));
