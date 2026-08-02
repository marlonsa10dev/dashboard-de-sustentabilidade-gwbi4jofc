migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('esg_audit_logs')

    const samples = [
      {
        user_id: 'system',
        user_name: 'Sistema',
        action: 'criar',
        entity: 'ação',
        entity_id: '',
        details: 'Ações iniciais cadastradas no sistema',
      },
      {
        user_id: 'system',
        user_name: 'Sistema',
        action: 'criar',
        entity: 'risco',
        entity_id: '',
        details: 'Matriz de riscos inicializada',
      },
      {
        user_id: 'system',
        user_name: 'Sistema',
        action: 'criar',
        entity: 'checklist',
        entity_id: '',
        details: 'Checklists por fase cadastrados',
      },
      {
        user_id: 'system',
        user_name: 'Sistema',
        action: 'criar',
        entity: 'fornecedor',
        entity_id: '',
        details: 'Fornecedores iniciais cadastrados',
      },
      {
        user_id: 'system',
        user_name: 'Sistema',
        action: 'criar',
        entity: 'política',
        entity_id: '',
        details: 'Políticas ESG curadoria inicial',
      },
    ]

    for (const s of samples) {
      try {
        app.findFirstRecordByData('esg_audit_logs', 'details', s.details)
      } catch (_) {
        const record = new Record(col)
        record.set('user_id', s.user_id)
        record.set('user_name', s.user_name)
        record.set('action', s.action)
        record.set('entity', s.entity)
        record.set('entity_id', s.entity_id)
        record.set('details', s.details)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('esg_audit_logs')
      app.truncateCollection(col)
    } catch (_) {}
  },
)
