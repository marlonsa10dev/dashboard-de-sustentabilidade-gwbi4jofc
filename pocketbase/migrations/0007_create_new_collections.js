migrate(
  (app) => {
    var suppliersColId = app.findCollectionByNameOrId('esg_suppliers').id

    app.save(
      new Collection({
        name: 'esg_supplier_requirements',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'supplier',
            type: 'relation',
            required: true,
            collectionId: suppliersColId,
            cascadeDelete: true,
            maxSelect: 1,
          },
          { name: 'name', type: 'text', required: true },
          {
            name: 'status',
            type: 'select',
            required: true,
            values: ['Conforme', 'Não conforme', 'Em análise'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_esg_supplier_req_supplier ON esg_supplier_requirements (supplier)',
          'CREATE INDEX idx_esg_supplier_req_status ON esg_supplier_requirements (status)',
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'esg_policies',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'title', type: 'text', required: true },
          {
            name: 'pillar',
            type: 'select',
            required: true,
            values: ['Ambiental', 'Social', 'Governança'],
            maxSelect: 1,
          },
          { name: 'description', type: 'text' },
          {
            name: 'applicability',
            type: 'select',
            required: true,
            values: ['Aplicável', 'Parcialmente aplicável', 'Não aplicável'],
            maxSelect: 1,
          },
          {
            name: 'document',
            type: 'file',
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_esg_policies_pillar ON esg_policies (pillar)',
          'CREATE INDEX idx_esg_policies_applicability ON esg_policies (applicability)',
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'esg_notifications',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'title', type: 'text', required: true },
          {
            name: 'type',
            type: 'select',
            required: true,
            values: [
              'Ação atrasada',
              'Prazo de mitigação',
              'Checklist vencido',
              'Avaliação de fornecedor',
            ],
            maxSelect: 1,
          },
          {
            name: 'module',
            type: 'select',
            required: true,
            values: ['Ações', 'Riscos', 'Checklists', 'Fornecedores'],
            maxSelect: 1,
          },
          { name: 'route', type: 'text' },
          { name: 'read', type: 'bool' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_esg_notifications_read ON esg_notifications (read)'],
      }),
    )
  },
  (app) => {
    ;['esg_supplier_requirements', 'esg_policies', 'esg_notifications'].forEach(function (name) {
      try {
        app.delete(app.findCollectionByNameOrId(name))
      } catch (_) {}
    })
  },
)
