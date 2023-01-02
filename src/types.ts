interface NativeCurrency {
    name: string,
    symbol: string,
    decimals: number
}

export interface Chain {
    id: string,
    name: string,
    rpcUrls: string[],
    blockExplorerUrls: string[],
    nativeCurrency: NativeCurrency,
    icon: any,
    scanContractUrl: (_: string) => string,
    scanAddressUrl: (_: string) => string,
    scanAbiUrl: (_: string) => string
}

export interface Project {
    name: string,
    icon: any,
    governorAddress: string,
    arbitratorAddress: string,
    snapshotSlug: string,
    chain: Chain,
}

interface ISession {
    currentSessionNumber: number,
    disputeID: number
}

export class Session implements ISession {
    currentSessionNumber: number
    disputeID: number

    constructor(props: ISession) {
        this.currentSessionNumber = props.currentSessionNumber;
        this.disputeID = props.disputeID;
    }
}

interface IDispute {
    subcourtId: number,
    arbitrated: string,
    numberOfChoices: number,
    period: number,
    lastPeriodChange: number,
    drawsInRound: number,
    commitsInRound: number,
    ruled: boolean
}

export class Dispute implements IDispute {
    subcourtId: number
    arbitrated: string
    numberOfChoices: number
    period: number
    lastPeriodChange: number
    drawsInRound: number
    commitsInRound: number
    ruled: boolean

    constructor(props: IDispute) {
        this.subcourtId = props.subcourtId;
        this.arbitrated = props.arbitrated;
        this.numberOfChoices = props.numberOfChoices;
        this.period = props.period;
        this.lastPeriodChange = props.lastPeriodChange;
        this.drawsInRound = props.drawsInRound;
        this.commitsInRound = props.commitsInRound;
        this.ruled = props.ruled;
    }
}

interface IAppealPeriod {
    start: number,
    end: number
}

export class AppealPeriod implements IAppealPeriod {
    start: number
    end: number

    constructor(props: IAppealPeriod) {
        this.start = props.start;
        this.end = props.end;
    }
}

interface IRoundInfo {
    paidFees: number[],
    hasPaid: boolean[],
    feeRewards: number,
    successfullyPaid: number
}

export class RoundInfo implements IRoundInfo {
    paidFees: number[]
    hasPaid: boolean[]
    feeRewards: number
    successfullyPaid: number

    constructor(props: IRoundInfo) {
        this.paidFees = props.paidFees;
        this.hasPaid = props.hasPaid;
        this.feeRewards = props.feeRewards;
        this.successfullyPaid = props.successfullyPaid;
    }
}

export interface Transaction {
    data: string,
    address: string,
    value: any,
    title: string
}
