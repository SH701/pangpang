export interface PersonaInput {
  name: string
  gender: 'MALE' | 'FEMALE' | 'NONE'
  age: number
  relationship: 'BOSS' | 'GIRLFRIEND\'S PARENTS' | 'CLERK'
  description:
    | 'APOLOGIZIONG FOR A MISTAKE AT WORK.'
    | 'THE FIRST TIME I VISITED MY GIRLFRIEND.'
    | 'COMPLAINING ABOUT INCORRECT FOOD ORDERS.'
  profileImageUrl: string
}

export interface Persona extends PersonaInput {
  personaId: number
  userId: number
}

export type Conversation = {
  conversationId: number
  userId: number
  aiPersona: {
    id: number
    personaId: number
    userId: number
    name: string
    gender: string
    age: number
    relationship: string
    description: string
    profileImageUrl: string
  }
  status: string
  situation: string
  createdAt:string
  feedback?: Feedback | null 
}
export type MyAI = {
  personaId: number
  userId: number
  name: string
  gender: 'MALE' | 'FEMALE' | 'NONE' 
  age: number
  aiRole: string
  userRole: string
  description: string
  profileImageUrl: string
}
export type Feedback = {
  feedbackId: number
  conversationId: number
  politenessScore: number
  naturalnessScore: number
  pronunciationScore: number
  summary: string
  goodPoints: string
  improvementPoints: string
  improvementExamples: string
  overallEvaluation: string
}