migrate(
  (app) => {
    var actionsCol = app.findCollectionByNameOrId('esg_actions')

    app.save(
      new Collection({
        name: 'esg_action_subtasks',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'title', type: 'text', required: true },
          {
            name: 'action',
            type: 'relation',
            required: true,
            collectionId: actionsCol.id,
            maxSelect: 1,
            cascadeDelete: true,
          },
          {
            name: 'status',
            type: 'select',
            required: true,
            values: ['Pendente', 'Em andamento', 'Concluída'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_esg_action_subtasks_action ON esg_action_subtasks (action)'],
      }),
    )
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('esg_action_subtasks'))
    } catch (_) {}
  },
)
