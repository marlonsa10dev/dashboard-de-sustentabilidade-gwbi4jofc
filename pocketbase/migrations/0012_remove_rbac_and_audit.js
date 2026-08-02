migrate(
  (app) => {
    try {
      const auditCol = app.findCollectionByNameOrId('esg_audit_logs')
      app.delete(auditCol)
    } catch (_) {}

    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    const profileField = usersCol.fields.getByName('profile')
    if (profileField) {
      usersCol.fields.removeById(profileField.id)
    }

    usersCol.createRule = ''
    usersCol.updateRule = 'id = @request.auth.id'
    usersCol.deleteRule = 'id = @request.auth.id'

    app.save(usersCol)
  },
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!usersCol.fields.getByName('profile')) {
      usersCol.fields.add(
        new SelectField({
          name: 'profile',
          values: ['Vendedor', 'Gestor', 'Diretoria', 'Administrador'],
          maxSelect: 1,
        }),
      )
    }

    usersCol.createRule = "@request.auth.id != '' && @request.auth.profile = 'Administrador'"
    usersCol.updateRule =
      "@request.auth.id != '' && (@request.auth.profile = 'Administrador' || id = @request.auth.id)"
    usersCol.deleteRule = "@request.auth.id != '' && @request.auth.profile = 'Administrador'"
    app.save(usersCol)

    try {
      app.findCollectionByNameOrId('esg_audit_logs')
    } catch (_) {
      app.save(
        new Collection({
          name: 'esg_audit_logs',
          type: 'base',
          listRule: "@request.auth.profile = 'Administrador'",
          viewRule: "@request.auth.profile = 'Administrador'",
          createRule: "@request.auth.id != ''",
          updateRule: "@request.auth.profile = 'Administrador'",
          deleteRule: "@request.auth.profile = 'Administrador'",
          fields: [
            { name: 'user_id', type: 'text', required: true },
            { name: 'user_name', type: 'text', required: true },
            { name: 'action', type: 'text', required: true },
            { name: 'entity', type: 'text', required: true },
            { name: 'entity_id', type: 'text' },
            { name: 'details', type: 'text' },
            { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
            { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
          ],
          indexes: [
            'CREATE INDEX idx_esg_audit_logs_user ON esg_audit_logs (user_id)',
            'CREATE INDEX idx_esg_audit_logs_entity ON esg_audit_logs (entity)',
            'CREATE INDEX idx_esg_audit_logs_action ON esg_audit_logs (action)',
          ],
        }),
      )
    }
  },
)
