var TB = (function(module) {
	var ObservableList = DKG_UI.ObservableList;
	var ListControl = DKG_UI.ListControl;
	var Controller = module.Controller;
	var TaskControl = module.TaskControl;
	var MiniTaskControl = module.MiniTaskControl;
	var ColumnModel = module.ColumnModel;
	var BoardControl = module.BoardControl;
	var BoardModel = module.BoardModel;

	var App = function(_width, _height, _serverUrl, _toggleStyleMap, _tag) {
		var self = this;

		this.init = function() {
			this.initModel(_width, _height);
			this.initController(_serverUrl, _toggleStyleMap, _tag);
			this.initView();
		};

		this.initModel = function(width, height) {
			var columnsData;

			columnsData = new ObservableList();
			columnsData.add(new ColumnModel("Back Log", -1, new ObservableList(), TaskControl));
			columnsData.add(new ColumnModel("Analysis", -1, new ObservableList(), TaskControl));
			// columnsData.add(new ColumnModel("Analysis: Done", -1, new ObservableList(), TaskControl));
			columnsData.add(new ColumnModel("Implement: In Progress", -1, new ObservableList(), TaskControl));
			columnsData.add(new ColumnModel("Implement: Done", -1, new ObservableList(), TaskControl));
			columnsData.add(new ColumnModel("Verify", -1, new ObservableList(), TaskControl));
			columnsData.add(new ColumnModel("Demo", -1, new ObservableList(), MiniTaskControl));

			this.model = new BoardModel(width, height, columnsData);
		};

		this.initController = function(serverUrl, toggleStyleMap, tag) {
			this.controller = new Controller(this.model, serverUrl, toggleStyleMap, tag);
		};

		this.initView = function() {
			this.view = {
				board: new BoardControl(this.model)
			};
			this.view.board.bind("TitleClick", this.titleClicked);
			this.view.board.bind("ToggleTaskStyle", this.toggleTaskStyle);
			this.view.board.bind("UpdateTask", this.updateTask);
			this.view.board.bind("MoveTaskLeft", this.moveTaskLeft);
			this.view.board.bind("MoveTaskRight", this.moveTaskRight);
			this.view.board.bind("DeleteTask", this.deleteTask);
			this.view.board.bind("TaskDroppedOnColumn", this.taskDroppedOnColumn);
		};

		this.newTask = function(style) {
			self.controller.newTask(style);
		};

		this.titleClicked = function(e) {
			if (window.taskTitleClicked != undefined) {
				window.taskTitleClicked(e.issueNumber);
			}
		};

		this.toggleTaskStyle = function(e) {
			self.controller.toggleTaskStyle(e.task);
		};

		this.updateTask = function(e) {
			self.controller.updateTask(e.task);
		};

		this.moveTaskLeft = function(e) {
			self.controller.moveTaskLeft(e.task);
		};

		this.moveTaskRight = function(e) {
			self.controller.moveTaskRight(e.task);
		};

		this.deleteTask = function(e) {
			self.controller.deleteTask(e.taskId);
		};

		this.taskDroppedOnColumn = function(e) {
			self.controller.moveTask(e.taskId, e.columnIndex);
		};

		this.init();
	};

	module.App = App;

	return module;
}(TB || {}));
