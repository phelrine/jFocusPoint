presentation = null

Array::last = -> @[@length]
Array::first = -> @[0]

$(document).ready ->
  $(".draggable").draggable().click(-> false)
  presentation = new Presentation
  $("body").append $("<a>").attr(href: "#").text("undo").click (event)->
    presentation.undo();
    event.stopPropagation()
  $("body").append $("<a>").attr(href: "#").text("next").click (event)->
    presentation.next();
    event.stopPropagation()

$(document).click (event)->
  presentation.next()

class Presentation
  constructor: ->
    @nextTasks =
      [new Task (-> $(".slide").children().hide()), (-> $(".slide").children().show())]
    @undoTasks = []
    @parseSlide(slide) for slide in $(".slide")
    @next()
    @next()

  parseSlide: (slide)->
    @nextTasks.push new SlideTask slide, this
    @nextTasks.push new HiddenTask hidden for hidden in $(".hidden", slide)
    false

  next: ->
    return false if @nextTasks.length == 0
    task = @nextTasks.shift()
    task.execute()
    @undoTasks.push task
    true

  undo: ->
    return false if @undoTasks.length == 0
    task = @undoTasks.pop()
    task.undo()
    @nextTasks.unshift(task)
    true

class Task
  constructor: (@execute, @undo)->

class SlideTask extends Task
  constructor: (slide, presentation)->
    super ->
        $(".slide").children().hide()
        $(slide).children().show()
        $(".hidden", slide).hide()
        false
      ,=>
        tasks = []
        loop
          break if presentation.undoTasks.length == 0
          tasks.unshift presentation.undoTasks.pop()
          break if tasks.first.constructor.name == @constructor.name
        for task in tasks
          task.execute()
          presentation.undoTasks.push task
        false

class HiddenTask extends Task
  constructor: (hidden)-> super (-> $(hidden).show()), (-> $(hidden).hide())
