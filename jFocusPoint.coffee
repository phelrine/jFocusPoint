presentation = null
iterator = null

$(document).ready ->
  $(".draggable").draggable().click(-> false)
  presentation = new Presentation
  iterator = presentation.iterator()

  $("body").append $("<a>").attr(href: "#").text("undo").click (event)->
    iterator.undo();
    event.stopPropagation()
  $("body").append $("<a>").attr(href: "#").text("next").click (event)->
    iterator.next();
    event.stopPropagation()

$(document).click (event)->
  iterator.next()

class Presentation
  constructor: ->
    @tasks =
      [new Task (-> $(".slide").children().hide()), (-> $(".slide").children().show())]
    @parseSlide(slide) for slide in $(".slide")

  parseSlide: (slide)->
    @tasks.push new SlideTask slide, this
    @tasks.push new HiddenTask hidden for hidden in $(".hidden", slide)
    false

  iterator: ->
    return new PresentationIterator(@tasks)


class PresentationIterator
  constructor: (@tasks) -> @index = 0

  next: ->
    return false unless @index < @tasks.length
    @tasks[@index].execute this
    @index += 1
    true

  undo: ->
    return false unless @index > 0
    @index -= 1
    @tasks[@index].undo this
    true


class Task
  constructor: (@execute, @undo)->


class SlideTask extends Task
  constructor: (slide, presentation)->
    super (it)->
        $(".slide").children().hide()
        $(slide).children().show()
        $(".hidden", slide).hide()
        false
      ,(it)=>
        tasks = []
        loop
          break if it.index == 0
          it.index -= 1
          tasks.unshift it.tasks[it.index]
          break if tasks[0].constructor.name == @constructor.name
        for task in tasks
          task.execute(it)
          it.index += 1
        false


class HiddenTask extends Task
  constructor: (hidden)-> super (-> $(hidden).show()), (-> $(hidden).hide())
