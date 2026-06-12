/**
 * Player commands for the first-playable economy. Each is a turn-defining
 * choice along the quiet/loud, safe/risky axis described in the brief.
 */
export type ActionType = 'organize' | 'agitate' | 'fundraise' | 'lay_low' | 'outreach';

export interface Action {
  type: ActionType;
}

export const ACTIONS: Record<ActionType, Action> = {
  organize: { type: 'organize' },
  agitate: { type: 'agitate' },
  fundraise: { type: 'fundraise' },
  lay_low: { type: 'lay_low' },
  outreach: { type: 'outreach' },
};
