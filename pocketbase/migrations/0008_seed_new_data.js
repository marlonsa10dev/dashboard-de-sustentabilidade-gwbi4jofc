migrate(
  (app) => {
    var reqCol = app.findCollectionByNameOrId('esg_supplier_requirements')
    var suppliers = app.findRecordsByFilter('esg_suppliers', '', '', 100, 0)
    var defaultReqs = [
      {
        name: 'regularidade trabalhista',
        statuses: [
          'Conforme',
          'Em análise',
          'Conforme',
          'Não conforme',
          'Conforme',
          'Conforme',
          'Não conforme',
          'Conforme',
        ],
      },
      {
        name: 'anticorrupção',
        statuses: [
          'Em análise',
          'Conforme',
          'Conforme',
          'Em análise',
          'Conforme',
          'Conforme',
          'Não conforme',
          'Conforme',
        ],
      },
      {
        name: 'NR-35',
        statuses: [
          'Conforme',
          'Conforme',
          'Conforme',
          'Não conforme',
          'Conforme',
          'Em análise',
          'Não conforme',
          'Conforme',
        ],
      },
      {
        name: 'certificação ISO 14001',
        statuses: [
          'Em análise',
          'Não conforme',
          'Conforme',
          'Em análise',
          'Conforme',
          'Em análise',
          'Não conforme',
          'Conforme',
        ],
      },
    ]
    suppliers.forEach(function (supplier, idx) {
      defaultReqs.forEach(function (req) {
        var existing = app.findRecordsByFilter(
          'esg_supplier_requirements',
          'supplier = {:supplier} && name = {:name}',
          '',
          10,
          0,
          { supplier: supplier.id, name: req.name },
        )
        if (existing.length > 0) return
        var r = new Record(reqCol)
        r.set('supplier', supplier.id)
        r.set('name', req.name)
        r.set('status', req.statuses[idx])
        app.save(r)
      })
    })

    var polCol = app.findCollectionByNameOrId('esg_policies')
    var policies = [
      {
        title: 'Política Ambiental Corporativa',
        pillar: 'Ambiental',
        description: 'Diretrizes para gestão ambiental em operações de torres.',
        applicability: 'Aplicável',
      },
      {
        title: 'Política de Gestão de Resíduos',
        pillar: 'Ambiental',
        description: 'Procedimentos para segregação, destinação e reciclagem de resíduos.',
        applicability: 'Aplicável',
      },
      {
        title: 'Política de Saúde e Segurança Ocupacional',
        pillar: 'Social',
        description: 'Normas de segurança para trabalhadores em campo.',
        applicability: 'Aplicável',
      },
      {
        title: 'Política de Diversidade e Inclusão',
        pillar: 'Social',
        description: 'Promoção de ambiente inclusivo e diverso.',
        applicability: 'Parcialmente aplicável',
      },
      {
        title: 'Código de Conduta e Ética',
        pillar: 'Governança',
        description: 'Princípios éticos e de conduta para colaboradores e parceiros.',
        applicability: 'Aplicável',
      },
      {
        title: 'Política Anticorrupção',
        pillar: 'Governança',
        description: 'Mecanismos de prevenção e combate à corrupção.',
        applicability: 'Aplicável',
      },
      {
        title: 'Contribuição Político-Partidária',
        pillar: 'Governança',
        description: 'Diretrizes sobre doações e contribuições políticas.',
        applicability: 'Não aplicável',
      },
      {
        title: 'Política de Privacidade e Proteção de Dados',
        pillar: 'Governança',
        description: 'Conformidade com LGPD e proteção de dados pessoais.',
        applicability: 'Aplicável',
      },
    ]
    policies.forEach(function (p) {
      try {
        app.findFirstRecordByData('esg_policies', 'title', p.title)
      } catch (_) {
        var r = new Record(polCol)
        Object.keys(p).forEach(function (k) {
          r.set(k, p[k])
        })
        app.save(r)
      }
    })

    var notifCol = app.findCollectionByNameOrId('esg_notifications')
    var notifications = [
      {
        title: 'Ação "Transição para energia renovável" com progresso abaixo do esperado',
        type: 'Ação atrasada',
        module: 'Ações',
        route: '/acoes',
        read: false,
      },
      {
        title: 'Prazo de mitigação para risco "Contaminação do solo" se aproxima',
        type: 'Prazo de mitigação',
        module: 'Riscos',
        route: '/riscos',
        read: false,
      },
      {
        title: 'Prazo de mitigação para risco "Degradação de área protegida" urgente',
        type: 'Prazo de mitigação',
        module: 'Riscos',
        route: '/riscos',
        read: false,
      },
      {
        title: 'Checklist "Licença de instalação municipal" está não conforme',
        type: 'Checklist vencido',
        module: 'Checklists',
        route: '/checklists',
        read: false,
      },
      {
        title: 'Checklist "Controle de ruído e poeira" está não conforme',
        type: 'Checklist vencido',
        module: 'Checklists',
        route: '/checklists',
        read: true,
      },
      {
        title: 'Fornecedor "Fornec Industrial" em avaliação — risco crítico',
        type: 'Avaliação de fornecedor',
        module: 'Fornecedores',
        route: '/fornecedores',
        read: false,
      },
      {
        title: 'Fornecedor "Transportes Rápidos" em avaliação — risco alto',
        type: 'Avaliação de fornecedor',
        module: 'Fornecedores',
        route: '/fornecedores',
        read: true,
      },
      {
        title: 'Ação "Relatório de sustentabilidade GRI" com baixo progresso',
        type: 'Ação atrasada',
        module: 'Ações',
        route: '/acoes',
        read: true,
      },
    ]
    notifications.forEach(function (n) {
      try {
        app.findFirstRecordByData('esg_notifications', 'title', n.title)
      } catch (_) {
        var r = new Record(notifCol)
        r.set('title', n.title)
        r.set('type', n.type)
        r.set('module', n.module)
        r.set('route', n.route)
        r.set('read', n.read)
        app.save(r)
      }
    })
  },
  (app) => {
    ;['esg_supplier_requirements', 'esg_policies', 'esg_notifications'].forEach(function (name) {
      try {
        app.truncateCollection(app.findCollectionByNameOrId(name))
      } catch (_) {}
    })
  },
)
