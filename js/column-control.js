var TB = (function(module) {
	var Panel = DKG_UI.Panel;
	var ListControl = DKG_UI.ListControl;
	var EventBindable = DKG_UI.EventBindable;

	var ColumnControl = function(_columnInfo, _columnIndex, _width) {
		var self = this;

		this.init = function() {
			this.columnInfo = _columnInfo;
			this.columnIndex = _columnIndex;
			this.createControlElement(_width);
			EventBindable.mixin(this, this.panel.controlElement);
		};

		this.createControlElement = function(width) {
			var t;

			if (this.columnInfo.maxNumberOfTasks > 0) {
				t = this.columnInfo.title + " (" + this.columnInfo.maxNumberOfTasks + ")";
			}
			else {
				t = this.columnInfo.title;
			}
			this.panel = new Panel({icon: "", title: t});
			this.panel.controlElement.bind("dragover", this.dragOver);
			this.panel.controlElement.bind("dragenter", this.dragEnter);
			this.panel.controlElement.bind("drop", this.drop);
			this.taskList = new ListControl(this.columnInfo.tasks, this.columnInfo.taskControlClass, width);
			this.taskList.setOptions({emptyListMessage: ""});
			this.panel.append(this.taskList.getControlElement());
		};

		this.getControlElement = function() {
			return this.panel.getControlElement();
		};

		this.dragOver = function(e) {
			e.originalEvent.preventDefault();
			return false;
		};

		this.dragEnter = function(e) {
			e.originalEvent.preventDefault();
			return false;
		};

		this.drop = function(e) {
			e.originalEvent.preventDefault();
			self.trigger({type: "TaskDroppedOnColumn", taskId: e.originalEvent.dataTransfer.getData("text"), columnIndex: self.columnIndex});
			return false;
		};

		this.init();
	};

	var ColumnModel = function(_title, _maxNumberOfTasks, _tasks, _taskControlClass) {
		this.init = function() {
			this.title = _title;
			this.maxNumberOfTasks = _maxNumberOfTasks;
			this.tasks = _tasks;
			this.taskControlClass = _taskControlClass;
		};

		this.init();
	};

	module.ColumnControl = ColumnControl;
	module.ColumnModel = ColumnModel;

	return module;
}(TB || {}));
