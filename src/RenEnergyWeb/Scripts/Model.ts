export class EntityReference {
    Id: string;
    LogicalName: string;
    Name: string;
}

export enum ContactType {
    PrimaryContact = 315930000,
    CC = 315930001,
    BCC = 315930002
}

export class Investor {
    Id: string;
    Name: string;
    Quantity: number;
    QuantityOwnershipPercent: number;
    Amount: number;
    AmountOwnershipPercent: number;
    IsInternal: boolean;
}

export class Security {
    Id: string;
    Name: string;
    QuantityShare: number;
    QuantityOwnershipPercentShare: number;
    AmountShare: number;
    AmountOwnershipPercentShare: number;
    FullyDiluted: boolean;
}

export const enum FilterMode {
    none = 0,
    single = 1,
    multiple = 2,
}

export const enum SortType {
    CapTable = 0,
    ShareClass,
    ShareHolder,
    Report
}