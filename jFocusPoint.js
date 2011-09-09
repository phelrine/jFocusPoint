var HiddenTask, Presentation, PresentationIterator, SlideTask, Task, iterator, presentation;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
presentation = null;
iterator = null;
$(document).ready(function() {
  $(".draggable").draggable().click(function() {
    return false;
  });
  presentation = new Presentation;
  iterator = presentation.iterator();
  $("body").append($("<a>").attr({
    href: "#"
  }).text("undo").click(function(event) {
    iterator.undo();
    return event.stopPropagation();
  }));
  return $("body").append($("<a>").attr({
    href: "#"
  }).text("next").click(function(event) {
    iterator.next();
    return event.stopPropagation();
  }));
});
$(document).click(function(event) {
  return iterator.next();
});
Presentation = (function() {
  function Presentation() {
    var slide, _i, _len, _ref;
    this.tasks = [
      new Task((function() {
        return $(".slide").children().hide();
      }), (function() {
        return $(".slide").children().show();
      }))
    ];
    _ref = $(".slide");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      slide = _ref[_i];
      this.parseSlide(slide);
    }
  }
  Presentation.prototype.parseSlide = function(slide) {
    var hidden, _i, _len, _ref;
    this.tasks.push(new SlideTask(slide, this));
    _ref = $(".hidden", slide);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hidden = _ref[_i];
      this.tasks.push(new HiddenTask(hidden));
    }
    return false;
  };
  Presentation.prototype.iterator = function() {
    return new PresentationIterator(this.tasks);
  };
  return Presentation;
})();
PresentationIterator = (function() {
  function PresentationIterator(tasks) {
    this.tasks = tasks;
    this.index = 0;
  }
  PresentationIterator.prototype.next = function() {
    if (!(this.index < this.tasks.length)) {
      return false;
    }
    this.tasks[this.index].execute(this);
    this.index += 1;
    return true;
  };
  PresentationIterator.prototype.undo = function() {
    if (!(this.index > 0)) {
      return false;
    }
    this.index -= 1;
    this.tasks[this.index].undo(this);
    return true;
  };
  return PresentationIterator;
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
    SlideTask.__super__.constructor.call(this, function(it) {
      $(".slide").children().hide();
      $(slide).children().show();
      $(".hidden", slide).hide();
      return false;
    }, __bind(function(it) {
      var task, tasks, _i, _len;
      tasks = [];
      while (true) {
        if (it.index === 0) {
          break;
        }
        it.index -= 1;
        tasks.unshift(it.tasks[it.index]);
        if (tasks[0].constructor.name === this.constructor.name) {
          break;
        }
      }
      for (_i = 0, _len = tasks.length; _i < _len; _i++) {
        task = tasks[_i];
        task.execute(it);
        it.index += 1;
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