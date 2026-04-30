export interface HomeStats {
    total: number,
    cooked: number,
    remaining: number,
    completionPercent: number,
    byType: TypeProgress[]
}

export interface TypeProgress {
    type: string,
    cooked: number,
    total: number,
    percent: number
}

export interface SleepTypeProgress {
    total: number,
    unlocked: number,
    remaining: number,
    completionPercent: number
}

export interface IslandSleepProgress {
  island: string;
  total: number;
  unlocked: number;
  percent: number;

  bySleepType: {
    sleepType: string;
    total: number;
    unlocked: number;
  }[];
}