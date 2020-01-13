var TB = (function(module) {
	var EventBindable = DKG_UI.EventBindable;
	var ModeSelector = DKG_UI.ModeSelector;

	var TaskControl = function(_taskInfo, _width) {
		var self = this;

		this.init = function() {
			this.taskInfo = _taskInfo;
			this.width = _width;
			this.height = Math.ceil(this.width * 7/10);
			this.createControlElement();
			EventBindable.mixin(this, this.controlElement);
		};

		this.createControlElement = function() {
			this.controlElement = $(this.toHTML());
			this.controlElement.css({width: this.width - 16, height: this.height - 16});

			ModeSelector.mixin(this.controlElement);

			this.controlElement.bind("dblclick", this.doubleClicked);
			this.controlElement.bind("dragstart", this.dragStart);

			this.controlElement.find(".title").bind("click", this.titleClicked);
			this.controlElement.find(".head").bind("mouseenter", this.mouseEnteredHead);
			this.controlElement.find(".head").bind("mouseleave", this.mouseLeftHead);
			this.controlElement.find(".buttons1 img, .buttons2 img").bind("click", this.buttonClicked);
		};

		this.getControlElement = function() {
			return this.controlElement;
		};

		this.dragStart = function(e) {
			e.originalEvent.dataTransfer.setData("text", self.taskInfo.taskId);
		};

		this.doubleClicked = function() {
			if (self.controlElement.getMode() != "editing") {
				self.trigger({type: "ToggleTaskStyle", task: self.taskInfo});
			}
		};

		this.mouseEnteredHead = function() {
			if (self.controlElement.getMode() != "editing") {
				self.controlElement.setMode("mouse-in-header");
			}
		};

		this.titleClicked = function() {
			self.trigger({type: "TitleClick", issueNumber: self.taskInfo.issueNumber});
		};

		this.mouseLeftHead = function() {
			if (self.controlElement.getMode() != "editing") {
				self.controlElement.resetMode();
			}
		};

		this.buttonClicked = function() {
			var action;

			action = $(this).attr("action");
			if (action === "edit") {
				self.controlElement.setMode("editing");
			}
			else if (action === "delete") {
				self.controlElement.setMode("mouse-in-header");
				self.trigger({type: "DeleteTask", taskId: self.taskInfo.taskId});
			}
			else if (action === "move-left") {
				self.trigger({type: "MoveTaskLeft", task: self.taskInfo});
			}
			else if (action === "move-right") {
				self.trigger({type: "MoveTaskRight", task: self.taskInfo});
			}
			else if (action === "update") {
				self.update();
			}
			else if (action === "cancel") {
				self.cancelEdit();
			}
		};

		this.update = function() {
			var updatedTask;

			updatedTask = {
				taskId: this.taskInfo.taskId,
				columnIndex: this.taskInfo.columnIndex,
				issueNumber: this.controlElement.find(".title-input").val(),
				description: this.controlElement.find(".desc-input").val(),
				assignedTo: this.controlElement.find(".assigned-to-input").val(),
				style: this.taskInfo.style
			};
			this.trigger({type: "UpdateTask", task: updatedTask});
		};

		this.cancelEdit = function() {
			this.controlElement.find(".title-input").val(this.taskInfo.issueNumber);
			this.controlElement.find(".desc-input").val(this.taskInfo.description);
			this.controlElement.find(".assigned-to-input").val(this.taskInfo.assignedTo);
			this.controlElement.setMode("mouse-in-header");
		};

		this.toHTML = function() {
			var template;
			var html;

			template  = "";
			template += "<div draggable='true' class='task-control :note-style:'>";
			template += "	<div class='head'>";
			template += "		<div mode='__default__,mouse-in-header' class='title'>:title:</div>";
			template += "		<input mode='editing' type='text' class='title-input' value=':title:' maxlength='10'>";
			template += "		<div mode='mouse-in-header' class='buttons1'>";
			template += "			<img src='images/edit.gif' action='edit'>";
			template += "			<img src='images/delete.gif' action='delete'>";
			template += "			<img src='images/left.gif' action='move-left'>";
			template += "			<img src='images/right.gif' action='move-right'>";
			template += "		</div>";
			template += "		<div mode='editing' class='buttons2'>";
			template += "			<img src='images/save.gif' action='update'>";
			template += "			<img src='images/cancel.gif' action='cancel'>";
			template += "		</div>";
			template += "	</div>";
			template += "	<div mode='__default__,mouse-in-header' class='desc'>:readonly-description:</div>";
			template += "	<div mode='editing' class='desc-container'>";
			template += "		<textarea class='desc-input' maxlength='200'>:description:</textarea>";
			template += "	</div>";
			template += "	<div mode='__default__,mouse-in-header' class='assigned-to'>:assigned-to:</div>";
			template += "	<input mode='editing' class='assigned-to-input' type='text' value=':assigned-to:' maxlength='20'>";
			template += "</div>";

			html = template
				.replace(/:note-style:/g, this.taskInfo.style)
				.replace(/:title:/g, this.taskInfo.issueNumber)
				.replace(/:readonly-description:/g, this.taskInfo.description.replace(/\n/g, "<br>"))
				.replace(/:description:/g, this.taskInfo.description)
				.replace(/:assigned-to:/g, this.taskInfo.assignedTo);

			return html;
		};

		this.init();
	};

	var MiniTaskControl = function(_taskInfo, _width) {
		var self = this;

		this.init = function() {
			this.taskInfo = _taskInfo;
			this.width = _width;
			this.height = 24;
			this.createControlElement();
			EventBindable.mixin(this, this.controlElement);
		};

		this.createControlElement = function() {
			this.controlElement = $(this.toHTML());
			this.controlElement.css({width: this.width - 16, height: this.height});

			ModeSelector.mixin(this.controlElement);

			this.controlElement.bind("dblclick", this.doubleClicked);
			this.controlElement.bind("dragstart", this.dragStart);

			this.controlElement.find(".title").bind("click", this.titleClicked);
			this.controlElement.find(".head").bind("mouseenter", this.mouseEnteredHead);
			this.controlElement.find(".head").bind("mouseleave", this.mouseLeftHead);
			this.controlElement.find(".buttons1 img, .buttons2 img").bind("click", this.buttonClicked);
		};

		this.getControlElement = function() {
			return this.controlElement;
		};

		this.dragStart = function(e) {
			e.originalEvent.dataTransfer.setData("text", self.taskInfo.taskId);
		};

		this.doubleClicked = function() {
			if (self.controlElement.getMode() != "editing") {
				self.trigger({type: "ToggleTaskStyle", task: self.taskInfo});
			}
		};

		this.mouseEnteredHead = function() {
			if (self.controlElement.getMode() != "editing") {
				self.controlElement.setMode("mouse-in-header");
			}
		};

		this.titleClicked = function() {
			self.trigger({type: "TitleClick", issueNumber: self.taskInfo.issueNumber});
		};

		this.mouseLeftHead = function() {
			if (self.controlElement.getMode() != "editing") {
				self.controlElement.resetMode();
			}
		};

		this.buttonClicked = function() {
			var action;

			action = $(this).attr("action");
			if (action === "edit") {
				self.controlElement.setMode("editing");
			}
			else if (action === "delete") {
				self.controlElement.setMode("mouse-in-header");
				self.trigger({type: "DeleteTask", taskId: self.taskInfo.taskId});
			}
			else if (action === "move-left") {
				self.trigger({type: "MoveTaskLeft", task: self.taskInfo});
			}
			else if (action === "move-right") {
				self.trigger({type: "MoveTaskRight", task: self.taskInfo});
			}
			else if (action === "update") {
				self.update();
			}
			else if (action === "cancel") {
				self.cancelEdit();
			}
		};

		this.update = function() {
			var updatedTask;

			updatedTask = {
				taskId: this.taskInfo.taskId,
				columnIndex: this.taskInfo.columnIndex,
				issueNumber: this.controlElement.find(".title-input").val(),
				description: this.taskInfo.description,
				assignedTo: this.taskInfo.assignedTo,
				style: this.taskInfo.style
			};
			this.trigger({type: "UpdateTask", task: updatedTask});
		};

		this.cancelEdit = function() {
			this.controlElement.find(".title-input").val(this.taskInfo.issueNumber);
			this.controlElement.setMode("mouse-in-header");
		};

		this.toHTML = function() {
			var template;
			var html;

			template  = "";
			template += "<div draggable='true' class='task-control :note-style:'>";
			template += "	<div class='head'>";
			template += "		<div mode='__default__,mouse-in-header' class='title'>:title:</div>";
			template += "		<input mode='editing' type='text' class='title-input' value=':title:' maxlength='10'>";
			template += "		<div mode='mouse-in-header' class='buttons1'>";
			template += "			<img src='images/edit.gif' action='edit'>";
			template += "			<img src='images/delete.gif' action='delete'>";
			template += "			<img src='images/left.gif' action='move-left'>";
			template += "			<img src='images/right.gif' action='move-right'>";
			template += "		</div>";
			template += "		<div mode='editing' class='buttons2'>";
			template += "			<img src='images/save.gif' action='update'>";
			template += "			<img src='images/cancel.gif' action='cancel'>";
			template += "		</div>";
			template += "	</div>";
			template += "</div>";

			html = template
				.replace(/:note-style:/g, this.taskInfo.style)
				.replace(/:title:/g, this.taskInfo.issueNumber)

			return html;
		};

		this.init();
	};

	module.TaskControl = TaskControl;
	module.MiniTaskControl = MiniTaskControl;

	return module;
}(TB || {}));
