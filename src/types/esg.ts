export type Pillar = 'Ambiental' | 'Social' | 'Governança'
export type TargetDeadline = '3' | '6' | '12'
export type ActionStatus = 'Planejada' | 'Em andamento' | 'Concluída' | 'Atrasada'
export type RiskLevel = 'Baixo' | 'Médio' | 'Alto' | 'Crítico'
export type RiskStatus = 'Identificado' | 'Em tratamento' | 'Mitigado' | 'Crítico'
export type ChecklistStatus = 'Conforme' | 'Não conforme' | 'Em análise'
export type Phase =
  | 'Aquisição de Terreno'
  | 'Licenciamento'
  | 'Construção'
  | 'Manutenção'
  | 'Fornecedores'
export type SupplierStatus = 'Ativo' | 'Inativo' | 'Em avaliação'
export type SubtaskStatus = 'Pendente' | 'Em andamento' | 'Concluída'

export interface ActionSubtask {
  id: string
  title: string
  action: string
  status: SubtaskStatus
  created: string
  updated: string
}

export interface EsgAction {
  id: string
  title: string
  pillar: Pillar
  responsible: string
  target_deadline: TargetDeadline
  status: ActionStatus
  progress: number
  due_date: string
  created: string
  updated: string
}

export interface RiskRecord {
  id: string
  title: string
  pillar: Pillar
  likelihood: number
  impact: number
  score: number
  level: RiskLevel
  status: RiskStatus
  mitigation_plan: string
  responsible: string
  category: string
  due_date: string
  created: string
  updated: string
}

export interface ChecklistItem {
  id: string
  phase: Phase
  description: string
  status: ChecklistStatus
  responsible: string
  due_date: string
  created: string
  updated: string
}

export interface Supplier {
  id: string
  name: string
  category: string
  risk_level: RiskLevel
  status: SupplierStatus
  created: string
  updated: string
}
