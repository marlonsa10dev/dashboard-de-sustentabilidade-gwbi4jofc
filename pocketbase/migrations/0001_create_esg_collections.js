migrate(
  (app) => {
    app.save(
      new Collection({
        name: 'esg_actions',
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
          { name: 'responsible', type: 'text' },
          {
            name: 'target_deadline',
            type: 'select',
            required: true,
            values: ['3', '6', '12'],
            maxSelect: 1,
          },
          {
            name: 'status',
            type: 'select',
            required: true,
            values: ['Planejada', 'Em andamento', 'Concluída', 'Atrasada'],
            maxSelect: 1,
          },
          { name: 'progress', type: 'number', required: true, min: 0, max: 100, onlyInt: true },
          { name: 'due_date', type: 'date' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_esg_actions_pillar ON esg_actions (pillar)',
          'CREATE INDEX idx_esg_actions_status ON esg_actions (status)',
          'CREATE INDEX idx_esg_actions_deadline ON esg_actions (target_deadline)',
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'esg_risks',
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
          { name: 'likelihood', type: 'number', required: true, min: 1, max: 5, onlyInt: true },
          { name: 'impact', type: 'number', required: true, min: 1, max: 5, onlyInt: true },
          { name: 'score', type: 'number', onlyInt: true },
          {
            name: 'level',
            type: 'select',
            values: ['Baixo', 'Médio', 'Alto', 'Crítico'],
            maxSelect: 1,
          },
          {
            name: 'status',
            type: 'select',
            required: true,
            values: ['Identificado', 'Em tratamento', 'Mitigado', 'Crítico'],
            maxSelect: 1,
          },
          { name: 'mitigation_plan', type: 'text' },
          { name: 'responsible', type: 'text' },
          { name: 'category', type: 'text' },
          { name: 'due_date', type: 'date' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_esg_risks_pillar ON esg_risks (pillar)',
          'CREATE INDEX idx_esg_risks_status ON esg_risks (status)',
          'CREATE INDEX idx_esg_risks_level ON esg_risks (level)',
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'esg_checklist_items',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'phase',
            type: 'select',
            required: true,
            values: [
              'Aquisição de Terreno',
              'Licenciamento',
              'Construção',
              'Manutenção',
              'Fornecedores',
            ],
            maxSelect: 1,
          },
          { name: 'description', type: 'text', required: true },
          {
            name: 'status',
            type: 'select',
            required: true,
            values: ['Conforme', 'Não conforme', 'Em análise'],
            maxSelect: 1,
          },
          { name: 'responsible', type: 'text' },
          { name: 'due_date', type: 'date' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_esg_checklist_phase ON esg_checklist_items (phase)',
          'CREATE INDEX idx_esg_checklist_status ON esg_checklist_items (status)',
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'esg_suppliers',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'category', type: 'text' },
          {
            name: 'risk_level',
            type: 'select',
            required: true,
            values: ['Baixo', 'Médio', 'Alto', 'Crítico'],
            maxSelect: 1,
          },
          {
            name: 'status',
            type: 'select',
            required: true,
            values: ['Ativo', 'Inativo', 'Em avaliação'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_esg_suppliers_risk ON esg_suppliers (risk_level)',
          'CREATE INDEX idx_esg_suppliers_status ON esg_suppliers (status)',
        ],
      }),
    )
  },
  (app) => {
    ;['esg_actions', 'esg_risks', 'esg_checklist_items', 'esg_suppliers'].forEach(function (name) {
      try {
        app.delete(app.findCollectionByNameOrId(name))
      } catch (_) {}
    })
  },
)
