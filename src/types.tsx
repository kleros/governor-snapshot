interface NativeCurrency {
    name: string,
    symbol: string,
    decimals: number
}

interface IChain {
    id: string,
    name: string,
    rpcUrls: string[],
    blockExploreUrls: string[],
    nativeCurrency: NativeCurrency,
    icon: any,
    scanContractUrl: (_: string) => string,
    scanAddressUrl: (_: string) => string,
    scanAbiUrl: (_: string) => string
}

export class Chain implements IChain {
    id: string
    name: string
    rpcUrls: string[]
    blockExploreUrls: string[]
    nativeCurrency: NativeCurrency
    icon: any
    scanContractUrl: (_: string) => string
    scanAddressUrl: (_: string) => string
    scanAbiUrl: (_: string) => string

    constructor(props: IChain) {
        this.id = props.id
        this.name = props.name
        this.rpcUrls = props.rpcUrls
        this.blockExploreUrls = props.blockExploreUrls
        this.nativeCurrency = props.nativeCurrency
        this.icon = props.icon
        this.scanContractUrl = props.scanContractUrl
        this.scanAddressUrl = props.scanAddressUrl
        this.scanAbiUrl = props.scanAbiUrl
    }
}

interface IProject {
    name: string,
    icon: any,
    governorAddress: string,
    arbitratorAddress: string,
    snapshotSlug: string,
    chain: Chain,
}

export class Project implements IProject {
    name: string
    icon: any
    governorAddress: string
    arbitratorAddress: string
    snapshotSlug: string
    chain: Chain

    constructor(props: IProject) {
        this.name = props.name
        this.icon = props.icon
        this.governorAddress = props.governorAddress
        this.arbitratorAddress = props.arbitratorAddress
        this.snapshotSlug = props.snapshotSlug
        this.chain = props.chain
    }

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
