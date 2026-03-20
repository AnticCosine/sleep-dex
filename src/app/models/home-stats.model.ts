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