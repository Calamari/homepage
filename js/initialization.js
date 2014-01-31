$(function() {
  'use strict';

  // It's an oversimplifaction
  var IS_TOUCH = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

  // That's so not object oriented. Kind of fun.
  var visualSitePanel = $('#visual-site'),
      panelIsVisible  = false,
      terminal;

  if (!IS_TOUCH) {
    terminal = new Terminal('#repl-text', {
      onStart: function() {
        this.evalInput('intro', true);
      }
    });
  } else {
    visualSitePanel
      .removeClass('slide-out')
      .removeClass('allow-wobble');
    $('html').addClass('is-touch');
  }

  function checkTerminalControl() {
    if (IS_TOUCH) { return; }

    if (panelIsVisible) {
      terminal.disable();
    } else {
      terminal.enable();
      terminal.focus();
    }
  }

  function openProjectsPanel() {
    if (IS_TOUCH) { return; }

    if (visualSitePanel.hasClass('slide-out')) {
      visualSitePanel.removeClass('slide-out');
      visualSitePanel.removeClass('allow-wobble');
      panelIsVisible = true;
      checkTerminalControl();
    }
  }
  function closeProjectsPanel() {
    if (IS_TOUCH) { return; }

    visualSitePanel.addClass('slide-out');
    setTimeout(function() {
      if (visualSitePanel.hasClass('slide-out')) {
        visualSitePanel.addClass('allow-wobble');
        panelIsVisible = false;
        checkTerminalControl();
      }
    }, 400);
  }

  visualSitePanel.on('click', openProjectsPanel);
  visualSitePanel.on('click', '.closer', function(event) {
    closeProjectsPanel();
    event.stopPropagation();
  });

  $('body').on('keyup', function(event) {
    if (event.which === 27) { // ESC
      closeProjectsPanel();
    }
  });

  // Tagging stuff of projects
  var tags        = {},
      allLi       = $('#visual-site .project .tags li'),
      allProjects = $('#visual-site .project');

  allLi.each(function(i,li) {
    li = $(li);
    var tag     = li.html(),
        project = li.closest('.project');

    if (!tags[tag]) {
      tags[tag] = {
        projects: []
      };
    }

    tags[tag].projects.push(project);
  });

  var tagChooser = $('#tag-chooser'),
      selectedLi;

  $.each(tags, function(tag, obj) {
    tagChooser.append('<li>' + tag + '</li>');
  });

  function checkProjectVisibility(project) {
    var visible = true;
    selectedLi.each(function(i, li) {
      var tag = li.innerHTML;
      var matches = $.grep(tags[tag].projects, function(projectElement) {
        return projectElement.is(project);
      });
      visible = visible && !!matches.length;
    });
    return visible;
  }

  function onSelectionChange() {
    selectedLi = tagChooser.find('li.selected');

    function hideElementsCompletely(hiddenProjects) {
      setTimeout(function() {
        $.each(hiddenProjects, function(i, project) {
          project = $(project);
          // if it is still invisible after 400 ms
          if (project.hasClass('hidden')) {
            project.addClass('gone');
          }
        });
      }, 400);
    }

    if (selectedLi.length) {
      var visibleProjects,
          hiddenProjects;

      visibleProjects = $.grep(allProjects, checkProjectVisibility);
      hiddenProjects = $.grep(allProjects, checkProjectVisibility, true);

      $(visibleProjects).removeClass('gone').removeClass('hidden');
      $(hiddenProjects).addClass('hidden');
      hideElementsCompletely(hiddenProjects);
    } else {
      allProjects.removeClass('hidden').removeClass('gone');
    }
  }

  tagChooser.on('click', 'li', function clickHandler(event) {
    $(event.currentTarget).toggleClass('selected');
    onSelectionChange();
  });
});
