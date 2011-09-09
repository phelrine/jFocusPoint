var HiddenTask, Presentation, SlideTask, Task, presentation;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
presentation = null;
Array.prototype.last = function() {
  return this[this.length];
};
Array.prototype.first = function() {
  return this[0];
};
$(document).ready(function() {
  $(".draggable").draggable().click(function() {
    return false;
  });
  presentation = new Presentation;
  $("body").append($("<a>").attr({
    href: "#"
  }).text("undo").click(function(event) {
    presentation.undo();
    return event.stopPropagation();
  }));
  return $("body").append($("<a>").attr({
    href: "#"
  }).text("next").click(function(event) {
    presentation.next();
    return event.stopPropagation();
  }));
});
$(document).click(function(event) {
  return presentation.next();
});
Presentation = (function() {
  function Presentation() {
    var slide, _i, _len, _ref;
    this.nextTasks = [
      new Task((function() {
        return $(".slide").children().hide();
      }), (function() {
        return $(".slide").children().show();
      }))
    ];
    this.undoTasks = [];
    _ref = $(".slide");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      slide = _ref[_i];
      this.parseSlide(slide);
    }
    this.next();
    this.next();
  }
  Presentation.prototype.parseSlide = function(slide) {
    var hidden, _i, _len, _ref;
    this.nextTasks.push(new SlideTask(slide, this));
    _ref = $(".hidden", slide);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hidden = _ref[_i];
      this.nextTasks.push(new HiddenTask(hidden));
    }
    return false;
  };
  Presentation.prototype.next = function() {
    var task;
    if (this.nextTasks.length === 0) {
      return false;
    }
    task = this.nextTasks.shift();
    task.execute();
    this.undoTasks.push(task);
    return true;
  };
  Presentation.prototype.undo = function() {
    var task;
    if (this.undoTasks.length === 0) {
      return false;
    }
    task = this.undoTasks.pop();
    task.undo();
    this.nextTasks.unshift(task);
    return true;
  };
  return Presentation;
})();
Task = (function() {
  function Task(execute, undo) {
    this.execute = execute;
    this.undo = undo;
  }
  return Task;
})();
SlideTask = (function() {
  __extends(SlideTask, Task);
  function SlideTask(slide, presentation) {
    SlideTask.__super__.constructor.call(this, function() {
      $(".slide").children().hide();
      $(slide).children().show();
      $(".hidden", slide).hide();
      return false;
    }, __bind(function() {
      var task, tasks, _i, _len;
      tasks = [];
      while (true) {
        if (presentation.undoTasks.length === 0) {
          break;
        }
        tasks.unshift(presentation.undoTasks.pop());
        if (tasks.first.constructor.name === this.constructor.name) {
          break;
        }
      }
      for (_i = 0, _len = tasks.length; _i < _len; _i++) {
        task = tasks[_i];
        task.execute();
        presentation.undoTasks.push(task);
      }
      return false;
    }, this));
  }
  return SlideTask;
})();
HiddenTask = (function() {
  __extends(HiddenTask, Task);
  function HiddenTask(hidden) {
    HiddenTask.__super__.constructor.call(this, (function() {
      return $(hidden).show();
    }), (function() {
      return $(hidden).hide();
    }));
  }
  return HiddenTask;
})();