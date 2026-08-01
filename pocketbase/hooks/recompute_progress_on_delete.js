onRecordAfterDeleteSuccess((e) => {
  var actionId = e.record.getString('action')
  if (!actionId) {
    e.next()
    return
  }

  try {
    var subtasks = $app.findRecordsByFilter('esg_action_subtasks', 'action = ?', '', 0, 0, actionId)
    if (subtasks.length === 0) {
      e.next()
      return
    }
    var completed = 0
    for (var i = 0; i < subtasks.length; i++) {
      if (subtasks[i].getString('status') === 'Concluída') {
        completed++
      }
    }
    var progress = Math.round((completed / subtasks.length) * 100)
    var action = $app.findRecordById('esg_actions', actionId)
    action.set('progress', progress)
    $app.save(action)
  } catch (err) {
    $app
      .logger()
      .error('failed to recompute progress on delete', 'actionId', actionId, 'error', String(err))
  }

  e.next()
}, 'esg_action_subtasks')
