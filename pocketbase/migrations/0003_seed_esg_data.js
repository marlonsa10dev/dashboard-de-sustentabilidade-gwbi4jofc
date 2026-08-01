migrate(
  (app) => {
    var actionsCol = app.findCollectionByNameOrId('esg_actions')
    var actions = [
      {
        title: 'Avaliação de impacto ambiental para nova torre',
        pillar: 'Ambiental',
        responsible: 'Ana Costa',
        target_deadline: '3',
        status: 'Em andamento',
        progress: 45,
        due_date: '2026-11-01',
      },
      {
        title: 'Gestão de resíduos na construção',
        pillar: 'Ambiental',
        responsible: 'Carlos Lima',
        target_deadline: '6',
        status: 'Em andamento',
        progress: 60,
        due_date: '2027-02-01',
      },
      {
        title: 'Monitoramento de fauna local',
        pillar: 'Ambiental',
        responsible: 'Beatriz Souza',
        target_deadline: '12',
        status: 'Planejada',
        progress: 10,
        due_date: '2027-08-01',
      },
      {
        title: 'Transição para energia renovável',
        pillar: 'Ambiental',
        responsible: 'Diego Ferreira',
        target_deadline: '12',
        status: 'Em andamento',
        progress: 25,
        due_date: '2027-08-01',
      },
      {
        title: 'Programa de relacionamento com comunidades',
        pillar: 'Social',
        responsible: 'Fernanda Alves',
        target_deadline: '6',
        status: 'Em andamento',
        progress: 55,
        due_date: '2027-02-01',
      },
      {
        title: 'Capacitação de mão de obra local',
        pillar: 'Social',
        responsible: 'Gabriel Rocha',
        target_deadline: '12',
        status: 'Em andamento',
        progress: 30,
        due_date: '2027-08-01',
      },
      {
        title: 'Plano de saúde e segurança ocupacional',
        pillar: 'Social',
        responsible: 'Helena Martins',
        target_deadline: '3',
        status: 'Concluída',
        progress: 100,
        due_date: '2026-11-01',
      },
      {
        title: 'Diversidade e inclusão corporativa',
        pillar: 'Social',
        responsible: 'Igor Barbosa',
        target_deadline: '6',
        status: 'Em andamento',
        progress: 50,
        due_date: '2027-02-01',
      },
      {
        title: 'Implementação de política anticorrupção',
        pillar: 'Governança',
        responsible: 'Juliana Ribeiro',
        target_deadline: '3',
        status: 'Concluída',
        progress: 100,
        due_date: '2026-11-01',
      },
      {
        title: 'Auditoria de conformidade ESG',
        pillar: 'Governança',
        responsible: 'Leandro Pinto',
        target_deadline: '6',
        status: 'Em andamento',
        progress: 70,
        due_date: '2027-02-01',
      },
      {
        title: 'Relatório de sustentabilidade GRI',
        pillar: 'Governança',
        responsible: 'Marina Cardoso',
        target_deadline: '12',
        status: 'Planejada',
        progress: 15,
        due_date: '2027-08-01',
      },
      {
        title: 'Gestão de riscos ESG integrada',
        pillar: 'Governança',
        responsible: 'Nelson Aragão',
        target_deadline: '3',
        status: 'Em andamento',
        progress: 80,
        due_date: '2026-11-01',
      },
    ]
    actions.forEach(function (a) {
      try {
        app.findFirstRecordByData('esg_actions', 'title', a.title)
      } catch (_) {
        var r = new Record(actionsCol)
        Object.keys(a).forEach(function (k) {
          r.set(k, a[k])
        })
        app.save(r)
      }
    })

    var risksCol = app.findCollectionByNameOrId('esg_risks')
    var risks = [
      {
        title: 'Contaminação do solo durante construção',
        pillar: 'Ambiental',
        likelihood: 4,
        impact: 5,
        score: 20,
        level: 'Crítico',
        status: 'Crítico',
        mitigation_plan:
          'Remediação imediata com empresa especializada e monitoramento contínuo do lençol freático.',
        responsible: 'Ana Costa',
        category: 'Ambiental',
        due_date: '2026-09-15',
      },
      {
        title: 'Atraso em licenciamento ambiental',
        pillar: 'Ambiental',
        likelihood: 3,
        impact: 4,
        score: 12,
        level: 'Alto',
        status: 'Em tratamento',
        mitigation_plan: 'Antecipar protocolos e manter diálogo constante com órgãos ambientais.',
        responsible: 'Beatriz Souza',
        category: 'Regulatório',
        due_date: '2026-10-30',
      },
      {
        title: 'Degradação de área protegida',
        pillar: 'Ambiental',
        likelihood: 5,
        impact: 5,
        score: 25,
        level: 'Crítico',
        status: 'Crítico',
        mitigation_plan: 'Realocação do projeto e compensação ambiental conforme legislação.',
        responsible: 'Diego Ferreira',
        category: 'Ambiental',
        due_date: '2026-09-01',
      },
      {
        title: 'Conflito com comunidades vizinhas',
        pillar: 'Social',
        likelihood: 3,
        impact: 4,
        score: 12,
        level: 'Alto',
        status: 'Em tratamento',
        mitigation_plan: 'Audiências públicas e canal de ouvidoria comunitária.',
        responsible: 'Fernanda Alves',
        category: 'Social',
        due_date: '2026-11-15',
      },
      {
        title: 'Acidente de trabalho na torre',
        pillar: 'Social',
        likelihood: 2,
        impact: 5,
        score: 10,
        level: 'Alto',
        status: 'Identificado',
        mitigation_plan: 'Treinamento obrigatório e auditoria de EPIs mensal.',
        responsible: 'Helena Martins',
        category: 'Segurança',
        due_date: '2026-10-01',
      },
      {
        title: 'Falta de mão de obra qualificada',
        pillar: 'Social',
        likelihood: 3,
        impact: 2,
        score: 6,
        level: 'Médio',
        status: 'Identificado',
        mitigation_plan: 'Parcerias com instituições de ensino técnico local.',
        responsible: 'Gabriel Rocha',
        category: 'Operacional',
        due_date: '2027-01-15',
      },
      {
        title: 'Não conformidade fiscal',
        pillar: 'Governança',
        likelihood: 2,
        impact: 3,
        score: 6,
        level: 'Médio',
        status: 'Identificado',
        mitigation_plan: 'Revisão trimestral de obrigações fiscais com consultoria externa.',
        responsible: 'Juliana Ribeiro',
        category: 'Fiscal',
        due_date: '2026-12-01',
      },
      {
        title: 'Vazamento de dados de clientes',
        pillar: 'Governança',
        likelihood: 1,
        impact: 4,
        score: 4,
        level: 'Baixo',
        status: 'Mitigado',
        mitigation_plan: 'Criptografia de ponta a ponta e auditoria de segurança semestral.',
        responsible: 'Leandro Pinto',
        category: 'TI',
        due_date: '2026-11-30',
      },
      {
        title: 'Mudanças regulatórias',
        pillar: 'Governança',
        likelihood: 4,
        impact: 3,
        score: 12,
        level: 'Alto',
        status: 'Em tratamento',
        mitigation_plan: 'Monitoramento legislativo e adaptação proativa de processos.',
        responsible: 'Marina Cardoso',
        category: 'Regulatório',
        due_date: '2027-03-01',
      },
      {
        title: 'Falha em fornecimento crítico',
        pillar: 'Governança',
        likelihood: 2,
        impact: 4,
        score: 8,
        level: 'Médio',
        status: 'Identificado',
        mitigation_plan: 'Multi-sourcing de fornecedores críticos e estoque de segurança.',
        responsible: 'Nelson Aragão',
        category: 'Operacional',
        due_date: '2026-12-15',
      },
    ]
    risks.forEach(function (rk) {
      try {
        app.findFirstRecordByData('esg_risks', 'title', rk.title)
      } catch (_) {
        var r = new Record(risksCol)
        Object.keys(rk).forEach(function (k) {
          r.set(k, rk[k])
        })
        app.save(r)
      }
    })

    var checklistCol = app.findCollectionByNameOrId('esg_checklist_items')
    var items = [
      {
        phase: 'Aquisição de Terreno',
        description: 'Verificação de título de propriedade',
        status: 'Conforme',
        responsible: 'Juliana Ribeiro',
        due_date: '2026-09-01',
      },
      {
        phase: 'Aquisição de Terreno',
        description: 'Análise de restrições ambientais do terreno',
        status: 'Conforme',
        responsible: 'Ana Costa',
        due_date: '2026-09-01',
      },
      {
        phase: 'Aquisição de Terreno',
        description: 'Due diligence legal do imóvel',
        status: 'Conforme',
        responsible: 'Juliana Ribeiro',
        due_date: '2026-09-01',
      },
      {
        phase: 'Licenciamento',
        description: 'Licença prévia do IBAMA',
        status: 'Conforme',
        responsible: 'Beatriz Souza',
        due_date: '2026-10-01',
      },
      {
        phase: 'Licenciamento',
        description: 'Licença de instalação municipal',
        status: 'Não conforme',
        responsible: 'Beatriz Souza',
        due_date: '2026-10-15',
      },
      {
        phase: 'Licenciamento',
        description: 'Estudo de impacto ambiental aprovado',
        status: 'Conforme',
        responsible: 'Ana Costa',
        due_date: '2026-10-01',
      },
      {
        phase: 'Construção',
        description: 'Plano de gerenciamento de resíduos',
        status: 'Conforme',
        responsible: 'Carlos Lima',
        due_date: '2026-11-01',
      },
      {
        phase: 'Construção',
        description: 'EPIs para todos os trabalhadores',
        status: 'Conforme',
        responsible: 'Helena Martins',
        due_date: '2026-11-01',
      },
      {
        phase: 'Construção',
        description: 'Certificação de materiais sustentáveis',
        status: 'Em análise',
        responsible: 'Carlos Lima',
        due_date: '2026-11-15',
      },
      {
        phase: 'Construção',
        description: 'Controle de ruído e poeira',
        status: 'Não conforme',
        responsible: 'Carlos Lima',
        due_date: '2026-11-15',
      },
      {
        phase: 'Manutenção',
        description: 'Inspeção periódica de torres',
        status: 'Conforme',
        responsible: 'Diego Ferreira',
        due_date: '2026-12-01',
      },
      {
        phase: 'Manutenção',
        description: 'Plano de manutenção preventiva',
        status: 'Conforme',
        responsible: 'Diego Ferreira',
        due_date: '2026-12-01',
      },
      {
        phase: 'Fornecedores',
        description: 'Avaliação ESG de fornecedores críticos',
        status: 'Conforme',
        responsible: 'Nelson Aragão',
        due_date: '2026-12-15',
      },
      {
        phase: 'Fornecedores',
        description: 'Contratos com cláusulas socioambientais',
        status: 'Conforme',
        responsible: 'Nelson Aragão',
        due_date: '2026-12-15',
      },
      {
        phase: 'Fornecedores',
        description: 'Auditoria de fornecedores',
        status: 'Em análise',
        responsible: 'Leandro Pinto',
        due_date: '2027-01-15',
      },
    ]
    items.forEach(function (it) {
      try {
        app.findFirstRecordByData('esg_checklist_items', 'description', it.description)
      } catch (_) {
        var r = new Record(checklistCol)
        Object.keys(it).forEach(function (k) {
          r.set(k, it[k])
        })
        app.save(r)
      }
    })

    var suppliersCol = app.findCollectionByNameOrId('esg_suppliers')
    var suppliers = [
      {
        name: 'Construtora Alfa Ltda',
        category: 'Construção',
        risk_level: 'Alto',
        status: 'Ativo',
      },
      {
        name: 'Tech Towers Engenharia',
        category: 'Engenharia',
        risk_level: 'Médio',
        status: 'Ativo',
      },
      { name: 'EcoMateriais SA', category: 'Materiais', risk_level: 'Baixo', status: 'Ativo' },
      {
        name: 'Transportes Rápidos',
        category: 'Logística',
        risk_level: 'Alto',
        status: 'Em avaliação',
      },
      { name: 'Energia Verde Soluções', category: 'Energia', risk_level: 'Baixo', status: 'Ativo' },
      { name: 'Segurança Plus', category: 'Segurança', risk_level: 'Médio', status: 'Ativo' },
      {
        name: 'Fornec Industrial',
        category: 'Equipamentos',
        risk_level: 'Crítico',
        status: 'Em avaliação',
      },
      { name: 'LimpaTudo Serviços', category: 'Limpeza', risk_level: 'Baixo', status: 'Ativo' },
    ]
    suppliers.forEach(function (s) {
      try {
        app.findFirstRecordByData('esg_suppliers', 'name', s.name)
      } catch (_) {
        var r = new Record(suppliersCol)
        Object.keys(s).forEach(function (k) {
          r.set(k, s[k])
        })
        app.save(r)
      }
    })
  },
  (app) => {
    ;['esg_actions', 'esg_risks', 'esg_checklist_items', 'esg_suppliers'].forEach(function (name) {
      try {
        app.truncateCollection(app.findCollectionByNameOrId(name))
      } catch (_) {}
    })
  },
)
